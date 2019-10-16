import * as React from 'react';
import styles from './ValidationSummary.module.scss';
import {ValidationResult, IAppCtxDependentField} from "../models";
import {navigate} from "./NavNode";
import {observer} from "mobx-react";

export interface IValidationSummaryProps<T> extends IAppCtxDependentField<T> {
  validationMessages: ValidationResult<T>;
}

export interface IValidationSummaryState {}

@observer
export default class GenericValidationSummary<T> extends React.Component<IValidationSummaryProps<T>, IValidationSummaryState> {
  public render(): React.ReactElement<IValidationSummaryProps<T>> {
    return (
      <ul className={styles.validationSummary}>
        {Object.keys(this.props.validationMessages).filter((k) => !!this.props.validationMessages[k]).map((k: string) => {
          const nav = () => {navigate(k);};
          return (
          <li
            key={k}
            onClick={nav}
          >
            {this.props.ctx.fieldInfo[k].Title}: {this.props.validationMessages[k]}
          </li>);
        })
        }
      </ul>
    );
  }
}
