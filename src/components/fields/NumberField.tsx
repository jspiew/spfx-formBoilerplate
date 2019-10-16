import * as React from 'react';
import { TextField } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import * as numeral from "numeral";
import 'react-quill/dist/quill.snow.css';
import { FieldWrapper } from '../genericFields/index';
import { IGenericFieldProps, IAppCtxDependentField } from '../../models/index';
import { isNullOrEmpty } from '../../utils/index';

export interface INumberFieldProps<T extends object> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {
 }

export interface INumberFieldState { }

@observer
export class GenericNumberField<T extends object> extends React.Component<INumberFieldProps<T>, INumberFieldState> {
  constructor(props: INumberFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<INumberFieldProps<T>> {
    const value = this.props.ctx.model[this.props.fieldName as any] as number;
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <TextField
          value={isNullOrEmpty(value) ? '' : value.toString()}
          onChange={this._onChange}
        />
      </FieldWrapper>
    );
  }

  private _onChange = (event: React.FormEvent, newValue: string) => {
    const acceptedCharacters = ['.'];
    const newModelValue: Partial<T> = {};
    const parsedNewValue = numeral(newValue).value();
    const valueDidChange = parsedNewValue !== this.props.ctx.model[this.props.fieldName as any];

    newModelValue[this.props.fieldName as any] = parsedNewValue;
    if (valueDidChange && !isNaN(parsedNewValue)) {
      this.props.ctx.updateModel(newModelValue);
    } else if (acceptedCharacters.indexOf(newValue[newValue.length-1]) >= 0 ) {
      // accept decimal and thousand separators
      return;
    } else {
    // Since the mobx won't trigger rerender if there's the same model value we need the following lines
    // The comment below is from the official Fabric docs:
    //
    // "This block should NOT be necessary, but there's currently a bug (#1350) where a controlled
    // TextField will continue to accept input even if its `value` prop isn't updated.
    // (The correct behavior is that the displayed value should *always* match the `value` prop.
    // If the `value` prop isn't updated in response to user input, the input should be ignored.)
    // Because this is a large behavior change, the bug won't be fixed until Fabric 7.
    // As a workaround, force re-rendering with the existing value.""
      this.forceUpdate();
    }
  }
}
