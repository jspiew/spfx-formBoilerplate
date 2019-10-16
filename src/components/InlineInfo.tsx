import * as React from 'react';
import styles from './InlineInfo.module.scss';
import {css, autobind} from "office-ui-fabric-react";

export interface IInlineInfoProps {}

export interface IInlineInfoState {
  expanded: boolean;
}

export default class InlineInfo extends React.Component<IInlineInfoProps, IInlineInfoState> {
  constructor(props: IInlineInfoProps) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  public render(): React.ReactElement<IInlineInfoProps> {
    return (
      <div>
        <div
          className={css(styles.mainDiv, this.state.expanded ? styles.expanded: null)}
        >
          {this.props.children}
        </div>
        <a onClick={this._toggle}>Show more</a>
      </div>
    );
  }

  private _toggle = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  }
}
