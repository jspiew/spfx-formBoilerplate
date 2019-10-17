import * as React from "react";
import {AppContextProvider} from "../models";
import DevTools from "mobx-react-devtools";
import { DefaultButton, Panel, PanelType } from "office-ui-fabric-react";

export function DebugPanel(props:{ctx: AppContextProvider<any>}) {
  const [visible, setVisibility] = React.useState(false);
  const show = () => {setVisibility(true);};
  const hide = () => {setVisibility(false);};

  return (
    <>
      <DevTools position="topRight" />
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
        <pre>
          <code>
            {JSON.stringify(props.ctx.model, null, 4)}
          </code>
        </pre>
        <pre>
          <code>
            {JSON.stringify(props.ctx.validationResult, null, 4)}
          </code>
        </pre>
      </Panel>
    </>
  );
}
