import * as React from "react";
import {AppContextProvider, IAppCtxDependentField} from "../models";
import { DefaultButton, Panel, PanelType } from "office-ui-fabric-react";
import JSONTree from 'react-json-tree';
import styles from "./DebugPanel.module.scss";
import {observer, Observer} from "mobx-react";

interface IDebugPanelProps<T extends object> extends IAppCtxDependentField<T> {

}

interface IDebugPanelState {
  visible: boolean;
}

@observer
export class DebugPanel<T extends object> extends React.Component<IDebugPanelProps<T>,IDebugPanelState> {

  constructor(props: IDebugPanelProps<T>) {
    super(props);
    this.state = {
      visible: false
    };
  }

  public render() : React.ReactElement<IDebugPanelProps<T>> {
    // that's a nasty workaround to JSONtree not rerendering with ctx changes.
    const changedModel = {...this.props.ctx.model};
    const changedValidation = { ...this.props.ctx.validationResult };

    return (
    <>
      <DefaultButton
        text="Debug"
        onClick={this.show}
        style={{ position: "fixed", right: "15px", bottom: "15px", }}
      />
      <Panel
        type={PanelType.medium}
        isOpen={this.state.visible}
        onDismissed={this.hide}
        isBlocking={false}
      >
        <div className={styles.dbgPanelBody}>
          <h2>Model values</h2>
          <JSONTree data={changedModel} />
          <h2>Validation result</h2>
          <JSONTree data={changedValidation} />
        </div>
      </Panel>
    </>
    );
  }

  private show = () => {
    this.setState({
      visible: true
    });
  }

  private hide = () => {
    this.setState({
      visible: false
    });
  }
}
