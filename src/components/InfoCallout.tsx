import * as React from 'react';
import {Icon, Callout, autobind} from "office-ui-fabric-react";
import styles from "./InfoCallout.module.scss";

export interface IInfoCalloutProps {
}

export interface IInfoCalloutState {
  isCalloutOpen: boolean;
}

export default class InfoCallout extends React.Component<IInfoCalloutProps, IInfoCalloutState> {

  private mainContainer = React.createRef<HTMLDivElement>();

  private _delayedCalloutId: number;

  constructor(props: IInfoCalloutProps) {
    super(props);

    this.state = {
      isCalloutOpen: false
    };
  }

  public render(): React.ReactElement<IInfoCalloutProps> {
    return (
      <span
        ref={this.mainContainer}
        className={styles.mainContainer}
        onClick={this.showCallout}
        onMouseEnter={this.showCallout}
        onMouseLeave={this._onMouseLeave}
      >
        <Icon
          iconName="Info"
        />
        <Callout
          role="alertdialog"
          hidden={!this.state.isCalloutOpen}
          onDismiss={this.hideCallout}
          onMouseEnter={this._onCalloutMouseEnter}
          onMouseLeave={this.hideCallout}
          target={this.mainContainer.current}
        >
          <div className={styles.infoCalloutContainer}>
            {this.props.children}
          </div>
        </Callout>
      </span>
    );
  }

  private _onCalloutMouseEnter = () => {
    clearTimeout(this._delayedCalloutId);
  }

  private _onMouseLeave = () => {
    this._delayedCalloutId = window.setTimeout(this.hideCallout, 300);
  }

  private hideCallout = () => {
    this.setState({
      isCalloutOpen: false
    });
  }

  private showCallout = () => {
    clearTimeout(this._delayedCalloutId);
    this.setState({
      isCalloutOpen: true
    });
  }
}
