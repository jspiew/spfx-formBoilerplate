import * as React from 'react';
// import styles from './TextField.module.scss';
import { observer } from "mobx-react";
import { FieldWrapper } from '../genericFields/index';
import { ListItemPicker } from '@pnp/spfx-controls-react/lib/listItemPicker';

import { AppContextProvider, ILookupFieldInfo, ILookupItem, IGenericFieldProps, ISpfxCtxDependentField, IAppCtxDependentField } from '../../models/index';
import { isNullOrEmpty } from '../../utils/index';

export interface ILookupFieldProps<T> extends IGenericFieldProps<T>, IAppCtxDependentField<T>, ISpfxCtxDependentField {

}

export interface ILookupFieldState { }

@observer
export class GenericLookupField<T> extends React.Component<ILookupFieldProps<T>, ILookupFieldState> {
  constructor(props: ILookupFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  private get _fieldInfo() {
    return this.props.ctx.fieldInfo[this.props.fieldName] as ILookupFieldInfo;
  }

  public render(): React.ReactElement<ILookupFieldProps<T>> {
    const value = this.props.ctx.model[this.props.fieldName];
    const listId = this._fieldInfo.LookupList.substr(1, this._fieldInfo.LookupList.length - 2);
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <ListItemPicker
          listId={listId}
          columnInternalName={this._fieldInfo.LookupField}
          itemLimit={this._fieldInfo.AllowMultipleValues ? 30: 1}
          onSelectedItem={this._onChange}
          defaultSelectedItems={this._initialValues()}
          context={this.props.spfxContext}
        />
      </FieldWrapper>
    );
  }

  private _onChange = (item: ILookupItem[]) => {
    const newModelValue: Partial<T> = { };
    if(this._fieldInfo.AllowMultipleValues) {
      this.props.ctx.model[this.props.fieldName as any] = item;
    } else {
      this.props.ctx.model[this.props.fieldName as any] = item[0]; // if there are not items selected, empty array is returned so this will aisgn null to the value of the model
    }
    this.props.ctx.updateModel(newModelValue);
  }

  private _initialValues = () => {
    if (this._fieldInfo.AllowMultipleValues) {
      return (this.props.ctx.model[this.props.fieldName as any] as ILookupItem[]) || [];
    } else if (isNullOrEmpty(this.props.ctx.model[this.props.fieldName])) {
      return [];
    } else {
      return [this.props.ctx.model[this.props.fieldName as any]] as ILookupItem[];
    }
  }
}
