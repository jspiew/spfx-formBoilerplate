import {AppContextProvider} from "../../../models";
import {observable} from "mobx";
import {ITag} from "office-ui-fabric-react";
import { IListItemModel } from "./itemModels";
import { ListItemValidator } from "./validators";

export class IListItemContextProvider extends AppContextProvider<IListItemModel> {

  protected _getEmptyModel(): IListItemModel {
    return {
      multiChoiceColumn: [],
      multiTextColumn: null,
      singleChoiceColumn: null,
      textColumn: null,
      booleanColumn: null,
      numberColumn: null,
      dateColumn: null,
      managedMetadata: null,
      managedMetadataMulti: [],
      userField: null,
      userFieldMulti: [],
      lookupColumn: null,
      multiLookupColumn: []
    };
  }

  protected get listValidator() {
    return ListItemValidator;
  }
}

export default new IListItemContextProvider();
