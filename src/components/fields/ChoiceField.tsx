import * as React from "react";
import { ChoiceGroup, IChoiceGroupOption } from "office-ui-fabric-react";
import {observer} from "mobx-react";
import { FieldWrapper } from "../genericFields/index";
import { AppContextProvider, IGenericFieldProps, IAppCtxDependentField } from "../../models/index";
import { getChoiceOptionsFromEnum } from "../../utils/index";

export interface ISingleChoiceFieldProps<T extends object> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {
    choices: any; // have to find a way to put enum here
 }

export interface ISingleChoiceFieldState {

}

@observer
export class GenericSingleChoiceField<T extends object> extends React.Component<ISingleChoiceFieldProps<T>, ISingleChoiceFieldState> {
  constructor(props: ISingleChoiceFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<ISingleChoiceFieldProps<T>> {
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <ChoiceGroup
          options={getChoiceOptionsFromEnum(this.props.choices)}
          selectedKey={this.props.ctx.model[this.props.fieldName as any] as string}
          onChange={this._onChange}
        />
      </FieldWrapper>
    );
  }

  private _onChange = (ev:React.FormEvent<HTMLInputElement>, option:IChoiceGroupOption) => {
    const newModelValue: Partial<T> = {};
    newModelValue[this.props.fieldName as any] = option.key;
    this.props.ctx.updateModel(newModelValue);
  }

}
