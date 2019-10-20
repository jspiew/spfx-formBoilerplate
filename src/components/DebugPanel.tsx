import * as React from "react";
import {AppContextProvider, IAppCtxDependentField} from "../models";
import { DefaultButton, Panel, PanelType } from "office-ui-fabric-react";
import JSONTree from 'react-json-tree';
import styles from "./DebugPanel.module.scss";
import {observer, Observer} from "mobx-react";

export const DebugPanel = observer((props: { ctx: AppContextProvider<any> }) => {
  const [visible, setVisibility] = React.useState(false);
  const show = () => { setVisibility(true); };
  const hide = () => { setVisibility(false); };

  // the below is to force JSONTree rerender
  const changedModel = {...props.ctx.model};
  const changedValidation = { ...props.ctx.validationResult };

  return (
    <>
      <DefaultButton
        text="Dbg"
        onClick={show}
        style={{ position: "fixed", right: "15px", bottom: "15px", }}
      />}
      <Panel
        type={PanelType.medium}
        isOpen={visible}
        onDismissed={hide}
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
});
