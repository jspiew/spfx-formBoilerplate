import * as React from 'react';
import { autobind } from "office-ui-fabric-react";
import {CheckboxGroup, FieldWrapper} from "../genericFields";
import { observer } from "mobx-react";
import { IGenericFieldProps, IAppCtxDependentField } from '../../models/index';
import { getChoiceOptionsFromEnum } from '../../utils/index';
// import styles from './MultiChoiceField.module.scss';

export interface IMultiChoiceFieldProps<T> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {
    choices: any;
 }

export interface IMultiChoiceFieldState { }

@observer
export class GenericMultiChoiceField<T> extends React.Component<IMultiChoiceFieldProps<T>, IMultiChoiceFieldState> {
  constructor(props: IMultiChoiceFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<IMultiChoiceFieldProps<T>> {
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <CheckboxGroup
          options={getChoiceOptionsFromEnum(this.props.choices)}
          onChanged={this._onChanged}
          selectedKeys={this.props.ctx.model[this.props.fieldName as any] as []}
        />
      </FieldWrapper>
    );
  }

  @autobind
  private _onChanged(newValues: string[]) {
    const newModelValue = {};
    newModelValue[this.props.fieldName as any] = newValues;
    this.props.ctx.updateModel(newModelValue);
  }
}
