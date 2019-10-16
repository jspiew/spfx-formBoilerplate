import * as React from 'react';
import { TextField as FabricTextField, autobind } from "office-ui-fabric-react";
import styles from './TextField.module.scss';
import { observer } from "mobx-react";
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import 'react-quill/dist/quill.snow.css';
import { FieldWrapper } from '../genericFields/index';
import { IGenericFieldProps, IAppCtxDependentField } from '../../models/index';

export interface ITextFieldProps<T> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {
  multiline: boolean;
  richText?: boolean;
 }

export interface ITextFieldState { }

@observer
export class GenericTextField<T> extends React.Component<ITextFieldProps<T>, ITextFieldState> {
  constructor(props: ITextFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<ITextFieldProps<T>> {
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
         {this.props.multiline && this.props.richText ? this._renderQuill() : this._renderFabric()}
      </FieldWrapper>
    );
  }

  private _renderQuill(): React.ReactElement<ITextFieldProps<T>> {
    return (
      <RichText
        value={this.props.ctx.model[this.props.fieldName] as unknown as string}
        onChange={this._onRichChange}
        className={styles.richTextEditor}
      />
    );
  }

  private _renderFabric(): React.ReactElement<ITextFieldProps<T>> {
    return (
      <FabricTextField
        value={this.props.ctx.model[this.props.fieldName] as unknown as string}
        multiline={this.props.multiline}
        rows={6} // only works if multiline is set
        onChange={this._onChange}
      />
    );
  }

  private _onChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue:string) => {
    const newModelValue: Partial<T> = { };
    newModelValue[this.props.fieldName] = newValue as any;
    this.props.ctx.updateModel(newModelValue);
  }

  @autobind
  private _onRichChange(content: string) {
    this._onChange(null,content);
    return content;
  }
}
