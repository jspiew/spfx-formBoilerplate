import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import { FieldWrapper } from "../genericFields";
import { AppContextProvider, IGenericFieldProps, IAppCtxDependentField } from '../../models/index';
import { BooleanChoiceOptions, boolToString } from '../../utils/index';
// import styles from './BooleanField.module.scss';

export interface IBooleanFieldProps<T> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {

 }

export interface IBooleanFieldState { }

@observer
export class GenericBooleanField<T> extends React.Component<IBooleanFieldProps<T>, IBooleanFieldState> {
  constructor(props: IBooleanFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<IBooleanFieldProps<T>> {
    return (
        <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
          <ChoiceGroup
            options={BooleanChoiceOptions}
            selectedKey={boolToString(this.props.ctx.model[this.props.fieldName] as unknown as boolean)}
            onChange={this._onChange}
          />
        </FieldWrapper>
    );
  }

  private _onChange = (ev:React.FormEvent<HTMLInputElement>, option:IChoiceGroupOption) => {
    const newModelValue = {};
    newModelValue[this.props.fieldName as any] = option.key === "true";
    this.props.ctx.updateModel(newModelValue);
  }
}
