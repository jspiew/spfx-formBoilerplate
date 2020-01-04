import * as React from "react";
import { ChoiceGroup, IChoiceGroupOption } from "office-ui-fabric-react";
import {observer} from "mobx-react";
import { FieldWrapper, CheckboxGroup } from "../genericFields/index";
import { AppContextProvider, IGenericFieldProps, IAppCtxDependentField, IChoiceFieldInfo } from "../../models/index";
import { getChoiceOptionsFromEnum } from "../../utils/index";

export interface IChoiceFieldProps<T extends object> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {
 }

export interface IChoiceFieldState {

}

@observer
export class GenericChoiceField<T extends object> extends React.Component<IChoiceFieldProps<T>, IChoiceFieldState> {

  private get _fieldInfo() {
    return this.props.ctx.fieldInfo[this.props.fieldName] as IChoiceFieldInfo;
  }

  private _choices = this._fieldInfo.Choices.map<IChoiceGroupOption>((c) => ({ key: c, text: c }));

  constructor(props: IChoiceFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<IChoiceFieldProps<T>> {
    return this._fieldInfo.TypeAsString === "MultiChoice" ? this.renderMulti() : this.renderSingle();
  }

  public renderSingle(): React.ReactElement<IChoiceFieldProps<T>> {
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <ChoiceGroup
          options={this._choices}
          selectedKey={this.props.ctx.model[this.props.fieldName as any] as string}
          onChange={this._onChange}
        />
      </FieldWrapper>
    );
  }

  public renderMulti(): React.ReactElement<IChoiceFieldProps<T>> {
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <CheckboxGroup
          options={this._choices}
          onChanged={this._onMultiChanged}
          selectedKeys={this.props.ctx.model[this.props.fieldName as any] as []}
        />
      </FieldWrapper>
    );
  }

  private _onChange = (ev:React.FormEvent<HTMLInputElement>, option:IChoiceGroupOption) => {
    const newModelValue: Partial<T> = {};
    newModelValue[this.props.fieldName as any] = option.key;
    this.props.ctx.updateModel(newModelValue);
  }

  private _onMultiChanged = (newValues: string[]) => {
    const newModelValue = {};
    newModelValue[this.props.fieldName as any] = newValues;
    this.props.ctx.updateModel(newModelValue);
  }

}
