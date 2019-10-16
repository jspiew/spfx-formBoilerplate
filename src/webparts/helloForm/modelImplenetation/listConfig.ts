import { SpSvc } from "../../../services/spSvc";
import { IListItemModel } from "./itemModels";
// TODO get this and the parsers out of the generic svc file
export const genericListItemSvc = new SpSvc<IListItemModel>("Generic Custom List",
{
  dateColumn: {
    spStaticName: "DateTimeColumn"
  },
  multiChoiceColumn: {
    spStaticName: "MultiChoiceColumn"
  },
  multiTextColumn: {
    spStaticName: "MultiTextColumn"
  },
  numberColumn: {
    spStaticName: "NumberColumn"
  },
  singleChoiceColumn: {
    spStaticName: "ChoiceColumn"
  },
  textColumn: {
    spStaticName: "TextColumn"
  },
  booleanColumn: {
    spStaticName: "BooleanColumn"
  },
  managedMetadata: {
    spStaticName: "TenantMetadata"
  },
  managedMetadataMulti: {
    spStaticName: "SiteMetadata"
  },
  userField: {
    spStaticName: "UserField"
  },
  userFieldMulti: {
    spStaticName: "UserFieldMulti"
  },
  multiLookupColumn: {
    spStaticName: "MultiLookup"
  },
  lookupColumn: {
    spStaticName: "Lookup"
  }

});
