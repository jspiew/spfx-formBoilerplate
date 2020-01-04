import * as React from 'react';
import { TextField as FabricTextField, autobind } from "office-ui-fabric-react";
import styles from './TextField.module.scss';
import { observer } from "mobx-react";
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import 'react-quill/dist/quill.snow.css';
import { FieldWrapper } from '../genericFields/index';
import { IGenericFieldProps, IAppCtxDependentField, ISpFieldInfo, ITextFieldInfo } from '../../models/index';

export interface ITextFieldProps<T extends object> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {
 }

export interface ITextFieldState { }

@observer
export class GenericTextField<T extends object> extends React.Component<ITextFieldProps<T>, ITextFieldState> {
  private get _fieldInfo() {
    return this.props.ctx.fieldInfo[this.props.fieldName] as ITextFieldInfo;
  }

  constructor(props: ITextFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<ITextFieldProps<T>> {
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        {this._fieldInfo.TypeAsString === "Note" && this._fieldInfo.RichText ? this._renderRichText() : this._renderFabric()}
      </FieldWrapper>
    );
  }

  private _renderRichText(): React.ReactElement<ITextFieldProps<T>> {
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
        multiline={this._fieldInfo.TypeAsString==="Note"}
        rows={this._fieldInfo.NumberOfLines} // only works if multiline is set
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
