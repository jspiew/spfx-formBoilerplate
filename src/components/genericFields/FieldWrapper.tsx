import * as React from 'react';
import {FieldHeader} from "./FieldHeader";
import { ErrorLabel } from '../ErrorLabel';
import {observer} from "mobx-react";
import { IAppCtxDependentField, IGenericFieldProps } from '../../models/index';

export interface IFieldWrapperProps<T> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {

}

export interface IFieldWrapperState {}

@observer
export class FieldWrapper<T = any> extends React.Component<IFieldWrapperProps<T>, IFieldWrapperState> {
  public render(): React.ReactElement<IFieldWrapperProps<T>> {
    return (
      <>
        <FieldHeader ctx={this.props.ctx} fieldName={this.props.fieldName}/>
        {this.props.children}
        <ErrorLabel errorMessages={[this.props.ctx.validationResult[this.props.fieldName]]} />
      </>
    );
  }
}
