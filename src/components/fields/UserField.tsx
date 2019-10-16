import * as React from 'react';
import { IPersonaProps } from "office-ui-fabric-react";
// import styles from './TextField.module.scss';
import { observer } from "mobx-react";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import 'react-quill/dist/quill.snow.css';
import { FieldWrapper } from '../genericFields/index';
import { IGenericFieldProps, ISpfxCtxDependentField, IAppCtxDependentField } from '../../models/index';

export interface IUserFieldProps<T> extends IGenericFieldProps<T>, IAppCtxDependentField<T>, ISpfxCtxDependentField {
  allowMulti: boolean;
 }

export interface IUserFieldState { }

@observer
export class GenericUserField<T> extends React.Component<IUserFieldProps<T>, IUserFieldState> {
  constructor(props: IUserFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<IUserFieldProps<T>> {
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <PeoplePicker
          context={this.props.spfxContext}
          personSelectionLimit={this.props.allowMulti ? 15 : 1}
          // groupName={"Team Site Owners"} // Leave this blank in case you want to filter from all users
          defaultSelectedUsers={this._getDefaultValue()}
          selectedItems={this._onChange as any} // there is a type mismatch between persona props for the people picker and the one we use here due to different versions of office ui fabric used
          principalTypes={[PrincipalType.User, PrincipalType.SecurityGroup]}
        />
      </FieldWrapper>
    );
  }

  private _onChange = (items: IPersonaProps[]) => {
    const newModelValue: Partial<T> = { };
    if (this.props.allowMulti) {
      newModelValue[this.props.fieldName] = items as any;
    } else  {
      newModelValue[this.props.fieldName] = items && items.length > 0 ? items[0] : null as any;
    }

    this.props.ctx.updateModel(newModelValue);
  }

  private _getDefaultValue() {
    const value = this.props.ctx.model[this.props.fieldName];
    const ret = this.props.allowMulti ? (value as unknown as IPersonaProps[]).map<string>((pp) => {
      return pp.secondaryText || pp.text;
    }) : [value ? (value as IPersonaProps).secondaryText || (value as IPersonaProps).text : null];
    return ret;

  }

}
