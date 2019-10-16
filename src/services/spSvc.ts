import { sp, ItemAddResult, AttachmentFileInfo, SiteUserProps} from "@pnp/sp";
import { ISpItem, spHash, IAttachmentResponse, ISpFieldInfo, PropertyConfiguration, IPropertyConfiguration, FieldInfoConf, ISpTerm, IManagedMetadataFieldInfo, ILookupItem, ILookupFieldInfo } from "../models/index";
import * as moment from "moment";
import "moment-timezone";
import { getUTC } from "../utils/index";
import { IPersonaProps} from "office-ui-fabric-react";
import { IPickerTerms, IPickerTerm } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";

export class SpSvc<T> {

  public static Timezone: string;

  private _listTitle:string;
  private _propertyConfiguration: PropertyConfiguration<T>;

  private _fieldInfoSupportingVar: FieldInfoConf<T>;
  private get _fieldInfo(): FieldInfoConf<T> {
    if (this._fieldInfoSupportingVar === undefined) { throw new Error("SP service has not been initiated."); }
    return this._fieldInfoSupportingVar;
  }
  private set _fieldInfo(info: FieldInfoConf<T>) {
    this._fieldInfoSupportingVar = info;
  }

  private _hiddenMMFieldInfo: FieldInfoConf<any>;

  constructor(listTitle: string, propertyConf: PropertyConfiguration<T>) {
    this._listTitle = listTitle;
    this._propertyConfiguration = propertyConf;
  }

  public async updateItem(itemId: number, delta:Partial<T>, attachmentsToAdd: AttachmentFileInfo[], attachmentsToRemove: AttachmentFileInfo[]) {
    const item = sp.web.lists.getByTitle(this._listTitle).items.getById(itemId);

    // I'm not sure if doing it in synchronous way is necessary here, perhaps we could update the item and modify attachments all at the same time? Gotta check how it behaves, for now I'm taking the safer approach
    await item.update(await this._modelParser(delta));
    await Promise.all(attachmentsToRemove.map((a) => item.attachmentFiles.getByName(a.name).recycle()));
    await item.attachmentFiles.addMultiple(attachmentsToAdd);
  }

  public async createItem(item: T, attachments: AttachmentFileInfo[]): Promise<ItemAddResult> {
    if (attachments) {
      const result = await sp.web.lists.getByTitle(this._listTitle).items.add(await this._modelParser(item));
      await result.item.attachmentFiles.addMultiple(attachments);
      return result;
    }

    return sp.web.lists.getByTitle(this._listTitle).items.add(await this._modelParser(item));
  }

  public async getItem(itemId: number) {
    const itemEndPoint = sp.web.lists.getByTitle(this._listTitle).items.getById(itemId);
    const item = await itemEndPoint.get();

    const itemResultPromise = this._listItemSpParser(item);

    const attachments = await itemEndPoint.attachmentFiles.get<IAttachmentResponse[]>();
    const parsedItem = await itemResultPromise;

    parsedItem.spProps.attachments = attachments.map((r) => r.FileName);
    return parsedItem;
  }

  public async getResolvedUser(userId: number): Promise<SiteUserProps> {
    return sp.web.siteUsers.getById(userId).get();
  }

  public async getResolvedUsers(userId: number[]): Promise<SiteUserProps[]> {
    const batch = sp.createBatch();
    const promises: Array<Promise<SiteUserProps>> = [];
    userId.forEach((id) => {
      promises.push(sp.web.siteUsers.getById(id).inBatch(batch).get());
    });
    await batch.execute();

    return await Promise.all(promises);
  }

  public async ensureUser(userLogin: string) {
    return sp.web.usingCaching({
      key: "Ensured_" + userLogin,
      storeName: "session",
      expiration: moment().add(30, "minutes").toDate()
    }).ensureUser(userLogin);
  }

  public async Init() {
    const info = await sp.web.lists.getByTitle(this._listTitle).fields.select("Title", "StaticName", "Description", "TypeAsString", "TermSetId", "EntityPropertyName", "AllowMultipleValues", "LookupList", "LookupField").filter('FromBaseType ne true').get<ISpFieldInfo[]>();

    const timezone = await sp.web.regionalSettings.timeZone.get<{Description: string}>();

    // TODO should this be somewhere else? some other global config? THe timezone is common for entire site, so it's definitely not a per webpart conf
    SpSvc.Timezone = timezone.Description;

    const ret: FieldInfoConf<T> = {} as any;
    const hiddenMMFieldInfoPromises: Array<Promise<ISpFieldInfo>> = [];

    Object.keys(this._propertyConfiguration).forEach((k) => {
      const fieldInfo = info.filter( (i)=> i.StaticName === this._propertyConfiguration[k].spStaticName)[0];
      if(!fieldInfo) {
        throw new Error(`Incorrect column configuration, did not find a column with static name ${this._propertyConfiguration[k].spStaticName}`);
      }
      ret[k] = fieldInfo;

      if(fieldInfo.TypeAsString === "TaxonomyFieldType" || fieldInfo.TypeAsString=== "TaxonomyFieldTypeMulti") {
        // plese refer to
        // https://blog.hubfly.com/update-managed-metadata-field-through-rest-api-in-sharepoint-framework
        // if you're wondering what is going on in the next lines
        // tl;dr: SharePoint happens

        sp.web.lists.getByTitle(this._listTitle).fields.getByTitle(`${fieldInfo.StaticName}_0`).select("Title", "StaticName", "Description", "TypeAsString", "SelectionGroup", "SelectionMode").get<ISpFieldInfo>().then((fi) => {
          (ret[k] as IManagedMetadataFieldInfo).HiddenMMFieldInfo = fi;
        });
      }
    });

    this._fieldInfo = ret;

    // I prefer my good old "for i" loop
    // tslint:disable-next-line: prefer-for-of
    for (let i =0; i< hiddenMMFieldInfoPromises.length; i++) {
        const result = await hiddenMMFieldInfoPromises[i];
        this._hiddenMMFieldInfo[result.StaticName] = result;
    }
    return {fieldInfo: ret};
  }

  private async _getLookupValues(ids: number[], lookupList: string, lookupField: string) {
    const batch = sp.createBatch();
    const ret: ILookupItem[] = [];
    ids.forEach((id) => {
      sp.web.lists.getById(lookupList).items.getById(id).inBatch(batch).select("Id",lookupField).get().then((item)=> {
        ret.push({
          key: item.Id,
          name: item[lookupField]
        });
      });
    });

    await batch.execute();
    return ret;
  }

  private async _modelParser(model: Partial<T>): Promise<spHash> {
    const getMultiChoice = (ar: string[]) => {
      if (Array.isArray(ar) && ar.length > 0) {
        return { __metadata: { type: "Collection(Edm.String)" }, results: ar };
      } else {
        return { __metadata: { type: "Collection(Edm.String)" }, results: [] };
      }
    };

    const getMultiUser = (ar: number[]) => {
      if (Array.isArray(ar) && ar.length > 0) {
        return {  results: ar };
      } else {
        return { results: [] };
      }
    };

    const getMultiLookup = (ar: number[]) => {
      if (Array.isArray(ar) && ar.length > 0) {
        return { results: ar };
      } else {
        return { results: [] };
      }
    };

    const getMultiManagedMetadata = (ar: IPickerTerms) => {
      if(Array.isArray(ar) && length > 0) {
        return ar.map((tag) => `-1;#${tag.name}|${tag.key};`).join("#");
      } else {
        return null;
      }
    };

    const promisesToAwait: Array<Promise<any>> = [];

    const ret: spHash = {};

    Object.keys(model).forEach((k) => {
      let value: any;
      const fieldInfo = this._fieldInfo[k] as ISpFieldInfo;

      switch (fieldInfo.TypeAsString) {
        case "MultiChoice":
          value = getMultiChoice(model[k]);
          ret[fieldInfo.StaticName] = value;
          break;
        case "DateTime":
          value = moment(model[k] as Date).utc().toISOString();
          ret[fieldInfo.StaticName] = value;
          break;
        case "TaxonomyFieldType":
          value = {
            Label: (model[k] as IPickerTerm).name,
            TermGuid: (model[k] as IPickerTerm).key,
            WssId: -1 // which makes sure to create an entry in TaxonomyHiddenList if not added.
          };
          ret[fieldInfo.StaticName] = value;
          break;
        case "Lookup":
          ret[fieldInfo.StaticName+"Id"] = (model[k] as ILookupItem).key;
          break;
        case "LookupMulti":
          ret[fieldInfo.StaticName + "Id"] = getMultiLookup((model[k] as ILookupItem[]).map((i) => i.key));
          break;
        case "TaxonomyFieldTypeMulti":
          value = getMultiManagedMetadata(model[k]);
          ret[(fieldInfo as IManagedMetadataFieldInfo).HiddenMMFieldInfo.StaticName] = value;
          break;
        case "User":
          // TODO This definitely needs to be improved, those requests should be batched and also cached locally, they're not volatile
          promisesToAwait.push(this.ensureUser((model[k] as IPersonaProps).id).then((v) => {ret[fieldInfo.StaticName+"Id"] = v.data.Id;}
          ));
          break;
        case "UserMulti":
          // TODO This definitely needs to be improved, those requests should be batched and also cached locally, they're not volatile
          promisesToAwait.push(Promise.all((model[k] as IPersonaProps[]).map((p) => this.ensureUser(p.id))).then((v) => {
            ret[fieldInfo.StaticName + "Id"] = getMultiUser(v.map((r) => r.data.Id));
          }));
          break;
        default:
          value = model[k];
          ret[fieldInfo.StaticName] = value;
      }

    });

    await Promise.all(promisesToAwait);

    return ret;
  }

  // this function is responsible for parsing the response from SP
  private async _listItemSpParser(spItem: spHash) : Promise<{item: T, spProps: ISpItem}> {
    const modelFields = Object.keys(this._propertyConfiguration);
    const item: T = {} as any;
    const promisesToAwait: Array<Promise<any>> = [];

    modelFields.forEach((field) => {
      const propConf : IPropertyConfiguration<any> = this._propertyConfiguration[field];
      const fieldInfo = this._fieldInfo[field] as ISpFieldInfo;
      const spValue = fieldInfo.TypeAsString.indexOf("User") >= 0 || fieldInfo.TypeAsString.indexOf("Lookup") >= 0 ? spItem[`${propConf.spStaticName}Id`] : spItem[propConf.spStaticName];

      if ( spValue !== undefined)  {

        let value: any;

        if (propConf.parsers) {
          value = propConf.parsers.parseToModel(spValue);
        } else {
          switch (fieldInfo.TypeAsString) {
            case "DateTime": value = getUTC(spValue); break;
            case "TaxonomyFieldType":
              const termValue: IPickerTerm = {
                key: (spValue as ISpTerm).TermGuid,
                name: (spValue as ISpTerm).Label,
                path:"",
                termSet:""
              };
              value = termValue;
              break;
            case "TaxonomyFieldTypeMulti":
              value = (spValue as ISpTerm[]).map<IPickerTerm>((v) => ({
                key: v.TermGuid, name: v.Label, path: "",
                termSet: ""}));
              break;
            case "Lookup":
              const lookupId = spItem[`${propConf.spStaticName}Id`] as number;
              const lookupItemValue: ILookupItem = { key: lookupId, name: '' };
              const lookupInfo = fieldInfo as ILookupFieldInfo;
              if (lookupId) {
                promisesToAwait.push(this._getLookupValues([lookupId],lookupInfo.LookupList,lookupInfo.LookupField).then((values) => {
                  item[field] = values[0];
                }));
              }

              value = lookupItemValue;
              break;
            case "LookupMulti":
              const multilookupIds = spItem[`${propConf.spStaticName}Id`] as number[];
              const multiLookupItemValue: ILookupItem[] = multilookupIds.map<ILookupItem>((id) => ({ key: id, name: '' }));

              const multiLookupInfo = fieldInfo as ILookupFieldInfo;
              promisesToAwait.push(this._getLookupValues(multilookupIds, multiLookupInfo.LookupList, multiLookupInfo.LookupField).then((values) => {
                  item[field] = values;
              }));

              value = multiLookupItemValue;
              break;
            case "User":
              const userId = spItem[`${propConf.spStaticName}Id`] as number;
              promisesToAwait.push(this.getResolvedUser(userId).then((user) => {
                item[field] = this._parseUserResultToPersona(user);}));
              break;
            case "UserMulti":
              const multiUserId = spItem[`${propConf.spStaticName}Id`] as number[];
              promisesToAwait.push(this.getResolvedUsers(multiUserId).then((users) => {
                item[field] = users.map<IPersonaProps>(this._parseUserResultToPersona);
              }));
              break;
            default: value = spValue;
          }
        }

        item[field] = value;
      }
    });

    // wait for references to be resolved
    await Promise.all(promisesToAwait);

    const spProps: ISpItem = {
      spItemId: spItem.ID,
      attachments: spItem.Attachments,
      spCreated: spItem.Created,
      spCreatedById: spItem.AuthorId,
      spModified: spItem.Modified,
      spModifiedById: spItem.EditorId

    };
    return { item, spProps };
  }

  private _parseUserResultToPersona = (user: SiteUserProps) : IPersonaProps => {
    return {
      text: user.Title,
      secondaryText: user.Email,
      id: user.LoginName
    };
  }
}
