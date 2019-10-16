import * as React from 'react';
import { TagPicker, ITag } from "office-ui-fabric-react";
// import styles from './TextField.module.scss';
import { observer } from "mobx-react";
import { FieldWrapper } from '../genericFields/index';
import {findIndex} from "@microsoft/sp-lodash-subset";
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import {WebPartContext} from "@microsoft/sp-webpart-base";
import { IGenericFieldProps, ISpfxCtxDependentField, IManagedMetadataFieldInfo, IAppCtxDependentField } from '../../models/index';
import { isNullOrEmpty } from '../../utils/index';

export interface IManagedMetadataFieldProps<T> extends IGenericFieldProps<T>, IAppCtxDependentField<T>, ISpfxCtxDependentField {
  multiSelect?: boolean;
}

export interface IManagedMetadataFieldState { }

@observer
export class GenericManagedMetadataField<T> extends React.Component<IManagedMetadataFieldProps<T>, IManagedMetadataFieldState> {
  constructor(props: IManagedMetadataFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<IManagedMetadataFieldProps<T>> {
    const ctx = this.props.ctx;
    const value = ctx.model[this.props.fieldName];
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <TaxonomyPicker
          allowMultipleSelections={this.props.multiSelect}
          termsetNameOrID={(ctx.fieldInfo[this.props.fieldName] as IManagedMetadataFieldInfo).TermSetId}
          context={this.props.spfxContext}
          label=""
          panelTitle=""
          initialValues={this._initialValues()}
          onChange={this._onChange}
          isTermSetSelectable={false}

        />
      </FieldWrapper>
    );
  }

  private _onChange = (tags: IPickerTerms) => {
    const newModelValue: Partial<T> = { };
    if(this.props.multiSelect) {
      newModelValue[this.props.fieldName as any] = tags;
    } else {
      newModelValue[this.props.fieldName as any] = tags[0];
    }
    this.props.ctx.updateModel(newModelValue);
  }

  private _initialValues = () => {
    if (this.props.multiSelect) {
      return (this.props.ctx.model[this.props.fieldName as any] as IPickerTerms) || [];
    } else if (isNullOrEmpty(this.props.ctx.model[this.props.fieldName as any])) {
      return [];
    } else {
      return [this.props.ctx.model[this.props.fieldName as any]] as IPickerTerms;
    }
  }
}
