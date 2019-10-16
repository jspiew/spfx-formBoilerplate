
import { validateRequired } from "../../../utils/index";
import { Validator } from "../../../models/index";
import { IListItemModel } from "./itemModels";

export const ListItemValidator: Validator<IListItemModel>  = {
  textColumn: (model) => validateRequired(model.textColumn),

  // example of custom validation logic for date column
  // dateColumn: (model) => {
  //   const req = validateRequired(model.dateColumn);
  //   if (req) { return req; } else if (model.dateColumn > new Date("2016-08-15")) { return "Invalid date, should be earlier than XYZ"; }
  // },
  // lookupColumn: (model) => validateRequired(model.lookupColumn),

  // example of custom validation logic for multichoice, where validation depends on other columns from the model
  // multiChoiceColumn: (model) => {
  //   if (model.numberColumn >= 125) { return validateRequired(model.multiChoiceColumn); }
  // },
  dateColumn: (model) => validateRequired(model.dateColumn),
  multiChoiceColumn: (model) => validateRequired(model.multiChoiceColumn),
  // multiLookupColumn: (model) => validateRequired(model.multiLookupColumn),
  multiTextColumn: (model) => validateRequired(model.multiTextColumn),
  // multiUserColumn: (model) => validateRequired(model.multiUserColumn),
  numberColumn: (model) => validateRequired(model.numberColumn),
  singleChoiceColumn: (model) => validateRequired(model.singleChoiceColumn),
  booleanColumn: (model) => validateRequired(model.booleanColumn),
  managedMetadata: (model) => validateRequired(model.managedMetadata),
  managedMetadataMulti: (model) => validateRequired(model.managedMetadataMulti),
  userField: (model) => validateRequired(model.userField),
  userFieldMulti: (model) => validateRequired(model.userFieldMulti),
  lookupColumn: (model) => validateRequired(model.lookupColumn),
  multiLookupColumn: (model) => validateRequired(model.multiLookupColumn),
};
