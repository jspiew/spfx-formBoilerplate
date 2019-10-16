import { SimpleChoice, IUser} from "../../../models/index";
import {IPersonaProps} from "office-ui-fabric-react";
import { ILookupItem } from "../../../models/helpers";
import { IPickerTerms, IPickerTerm } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";

export interface IListItemModel {
    textColumn: string;
    multiTextColumn: string;
    singleChoiceColumn: SimpleChoice;
    multiChoiceColumn: SimpleChoice[];
    booleanColumn: boolean;
    numberColumn: number;
    managedMetadata: IPickerTerm;
    managedMetadataMulti: IPickerTerms;
    userField: IPersonaProps;
    userFieldMulti: IPersonaProps[];
    dateColumn: Date;
    lookupColumn: ILookupItem;
    multiLookupColumn: ILookupItem[];
}
