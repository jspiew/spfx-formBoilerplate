import { GenericTextField, GenericSingleChoiceField, GenericMultiChoiceField, GenericBooleanField, GenericNumberField, GenericDateTimeField, GenericManagedMetadataField, GenericUserField, GenericLookupField } from "../../../components/index";
import { IListItemModel } from "./itemModels";

export class TextField extends GenericTextField<IListItemModel> {}
// tslint:disable-next-line: max-classes-per-file
export class SingleChoiceField extends GenericSingleChoiceField<IListItemModel> {}
// tslint:disable-next-line: max-classes-per-file
export class MultiChoiceField extends GenericMultiChoiceField<IListItemModel> {}
// tslint:disable-next-line: max-classes-per-file
export class BooleanField extends GenericBooleanField<IListItemModel> {}
// tslint:disable-next-line: max-classes-per-file
export class NumberField extends GenericNumberField<IListItemModel> {}
// tslint:disable-next-line: max-classes-per-file
export class DateTimeField extends GenericDateTimeField<IListItemModel> {}
// tslint:disable-next-line: max-classes-per-file
export class ManagedMetadataField extends GenericManagedMetadataField<IListItemModel> {}
// tslint:disable-next-line: max-classes-per-file
export class UserField extends GenericUserField<IListItemModel> {}
// tslint:disable-next-line: max-classes-per-file
export class LookupField extends GenericLookupField<IListItemModel> {}
