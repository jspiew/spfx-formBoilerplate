import * as React from "react";
import {css} from "office-ui-fabric-react";
import styles from './ErrorLabel.module.scss';

export interface IErrorLabelProps {
  errorMessages: string[];
}

export interface IErrorLabelState {}

export class ErrorLabel extends React.Component<IErrorLabelProps, IErrorLabelState> {
  public render(): React.ReactElement<IErrorLabelProps> {
    const filteredMessages = this.props.errorMessages.filter((msg) => msg !== null && msg !== undefined && msg !== "");
    let m = '';
    if(filteredMessages.length > 0) {
      m = filteredMessages.reduce((prev, next, index) => {
        return `${prev} ${index === filteredMessages.length ? '' : next}`;
      });
    }
    return (
    <div className={css(styles.errorLabel, filteredMessages.length > 0 ? styles.visible : null)}>
      {m || "Ok"}
    </div>
    );
  }
}
