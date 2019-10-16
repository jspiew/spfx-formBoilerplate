import { AppContextProvider } from "./index";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IGenericFieldProps<T> {
  fieldName: keyof T;
}

export interface IAppCtxDependentField<T> {
  ctx: AppContextProvider<T>;
}

export interface ISpfxCtxDependentField {
  spfxContext: WebPartContext;
}
