import { TypedHash } from "@pnp/common";

export type ValidationResult<T> = {
    [k in keyof T]?: string
};

export type Description<T> = {
  [k in keyof T]: string
};

export type Validator<T> = {
  [k in keyof T]: (model: T) => string
};

export interface ISpItem {
  spItemId: number;
  spCreatedById: number;
  spCreated: string;
  spModified: string;
  spModifiedById: number;
  attachments: string[];
}

export function pluck<T, K extends keyof T>(o: T, names: K[]): Array<T[K]> {
  return names.map((n) => o[n]);
}

export interface IUser {
  displayName: string;
  email: string;
  id?: number;
}

export interface ILookupItem<T = string> {
  name: T;
  key: number;
}

export type spHash = TypedHash<any>;

export interface IAttachmentResponse {
  FileName: string;
  ServerRelativePath: { DecodedUrl: "string" };
}

export interface ISpFieldInfo {
  "Title": string;
  "StaticName": string;
  "Description": string;
  "TypeAsString": "Note" | "Text" | "Number" | "Choice" | "MultiChoice" | "Boolean" | "DateTime" | "TaxonomyFieldType" | "Lookup" | "LookupMulti" |"TaxonomyFieldTypeMulti" | "User" | "UserMulti";
}

export type MetadataType = "SiteMetadata" | "TenantMetadata";

export interface IManagedMetadataFieldInfo extends ISpFieldInfo {
  "TermSetId": string;
  "EntityPropertyName": MetadataType;
  "HiddenMMFieldInfo": ISpFieldInfo;
  "AllowMultipleValues": boolean;
}

export interface ILookupFieldInfo extends ISpFieldInfo {
  "AllowMultipleValues": boolean;
  "LookupList": string;
  "LookupField": string;
}

export interface IUserFieldInfo extends ISpFieldInfo {
  "AllowMultipleValues": boolean;
}

export enum GroupSelectionMode {
  UserOnly = 0,
  UserAndSpGroup = 1
}

export interface IUserFieldInfo extends ISpFieldInfo {
  SelectionGroup: number;
  SelectionMode: GroupSelectionMode;
}

export interface ISpTerm {
  Label: string;
  TermGuid: string;
}

export type FieldInfoConf<T> = {
  [k in keyof T]: ISpFieldInfo;
};

export interface IPropertyConfiguration<T> {
  spStaticName: string;
  parsers?:
  {
    parseToModel: (value: any) => keyof T,
    parseToSpField: (modelValue: T) => any
  };
}

export type PropertyConfiguration<T> = {
  [k in keyof T]: IPropertyConfiguration<k>
};

export interface ILookupValue {
  id: number;
  value: string;
}
