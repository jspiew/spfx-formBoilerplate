import { AppContextProvider } from "./index";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IGenericFieldProps<T extends object> {
  fieldName: keyof T;
}

export interface IAppCtxDependentField<T extends object> {
  ctx: AppContextProvider<T>;
}

export interface ISpfxCtxDependentField {
  spfxContext: WebPartContext;
}
