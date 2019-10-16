import * as React from 'react';
import { ValidationResult, ISpItem } from './';
import {observable, runInAction} from "mobx";
import {AttachmentFileInfo} from "@pnp/sp";
import { FieldInfoConf, Validator } from './helpers';
import {ITag} from "office-ui-fabric-react";

export interface IFormContext<T extends object> {
  model: T;
  validationResult: ValidationResult<T>;
  modelValid: boolean;
  spProps: ISpItem;
  attachments: AttachmentFileInfo[];
  attachmentsToAdd: AttachmentFileInfo[];
  attachmentsToRemove: AttachmentFileInfo[];
  updateModel: (newValue: Partial<T>) => void;
  resetContext: () => void;
}

export abstract class AppContextProvider<T extends object> implements IFormContext<T> {
  public get model() : T {
    return this._model;
  }
  public get validationResult(): ValidationResult<T> {
    return this._validationResult;
  }
  public get modelValid(): boolean {
    return this._modelValid;
  }
  public get spProps() {
    return this._spProps;
  }

  public set spProps(props) {
    this._spProps = props;
  }

  protected abstract get listValidator(): Validator<T>

  public fieldInfo: FieldInfoConf<T>;
  public timezone: string;

  @observable
  public totalScore: number = 0;

  @observable
  public attachments: AttachmentFileInfo[] = [];

  @observable
  public attachmentsToAdd: AttachmentFileInfo[] = [];

  @observable
  public attachmentsToRemove: AttachmentFileInfo[] = [];

  @observable
  private _model : T;

  @observable
  private _validationResult: ValidationResult<T>;

  @observable
  private _modelValid: boolean;

  @observable
  private _spProps: ISpItem;

  constructor() {
    this.resetContext();
  }

  public resetContext() {
    this._model = this._getEmptyModel();

    this._modelValid = false;
    this._validationResult = {};
    this._spProps = null;

    this.updateModel({}); // init validation
  }

  public updateModel(newValue: Partial<T>) {
    runInAction("Model Update",() => {
      Object.keys(newValue).forEach((k) => {
        this._model[k] = newValue[k];
      });
    });

    const validationResult = this._getNewValidationResults();

    runInAction("Update Validation Results", () => {
        this._modelValid = validationResult.modelValid;
        Object.keys(this._model).forEach((k) => {
        this._validationResult[k] = validationResult.newValidation[k];
      });
    });
  }

  protected abstract _getEmptyModel(): T;

  private _getNewValidationResults() {

    const newValidation: ValidationResult<T> = {};
    Object.keys(this._model).forEach((k) => {
      const validator = this.listValidator[k];
      if(validator) {
        newValidation[k] = this.listValidator[k](this._model);
      }
    });
    const modelValid = !(Object.keys(newValidation).map((k) => newValidation[k]) as string[]).some((message) => {
      return (message !== null && message !== undefined);
    });
    return { newValidation, modelValid };
  }

}
