import * as React from 'react';
import styles from './HelloForm.module.scss';
import { IHelloFormProps } from './IHelloFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { observer } from 'mobx-react';
import { isDbg } from '../../../utils';
import { genericListItemSvc } from '../modelImplenetation/listConfig';
import { Shimmer, Spinner, SpinnerSize, Separator, DefaultButton, Panel, PanelType, autobind, IButtonProps } from 'office-ui-fabric-react';
import * as Fields from "../modelImplenetation/Fields";
import ctx from "../modelImplenetation/AppContextProvider";
import { SimpleChoice } from '../../../models';
import { ValidationSummary } from '../modelImplenetation/HelperComponents';
import { DebugPanel } from '../../../components';

type FormState = "editing" | "saving" | "success" | "error" | "showValidation";

export interface IListItemFormState {
  isLoading: boolean;
  showDebugPanel: boolean;
  formState: FormState;
}

@observer
export default class HelloForm extends React.Component<IHelloFormProps, IListItemFormState> {

  constructor(props: IHelloFormProps) {
    super(props);
    this.state = {
      isLoading: true,
      showDebugPanel: isDbg,
      formState: "editing"

    };
  }

  public componentDidMount() {
    let id: number;
    // so yeah, this whole query string logic should be moved to parent component (in this case the webpart root file). Mea culpa
    if (window.location.search.indexOf('id=') >= 0) {
      id = parseInt(window.location.search.substr(window.location.search.indexOf('id=') + 3), 10);
    } else if (this.props.selectedItemId >= 0) {
      id = this.props.selectedItemId;
    }

    if (id) {
      genericListItemSvc.getItem(id).then((v) => {
        ctx.updateModel(v.item);
        ctx.spProps = v.spProps;
        ctx.attachments = v.spProps.attachments.map((a) => ({ name: a, content: null }));

        this.setState({
          isLoading: false
        });
      });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  public componentDidUpdate(prevProps: IHelloFormProps) {
    let queryStringId: number;
    if (window.location.search.indexOf('id=') >= 0) {
      queryStringId = parseInt(window.location.search.substr(window.location.search.indexOf('id=') + 3), 10);
    }
    if (this.props.selectedItemId && prevProps.selectedItemId !== this.props.selectedItemId) {
      this.setState({
        isLoading: true
      });
      genericListItemSvc.getItem(this.props.selectedItemId).then((v) => {
        ctx.updateModel(v.item);
        ctx.spProps = v.spProps;
        ctx.attachments = v.spProps.attachments.map((a) => ({ name: a, content: null }));

        // document.title = `List title - ${v.item.title}`;

        this.setState({
          isLoading: false
        });
      });
    } else if (!this.props.selectedItemId && !queryStringId && ctx.spProps) {
      ctx.resetContext();
    }
  }

  public render(): React.ReactElement<IHelloFormProps> {
    if (this.state.isLoading) {
      return (
        <div>
          <Shimmer className={styles.shimmer} />
          <Shimmer width="75%" className={styles.shimmer} />
          <Shimmer width="50%" className={styles.shimmer} />
          <Spinner size={SpinnerSize.large} label="Loading" />;
        </div>
      );
    }

    let text = '';
    let className = '';
    switch (this.state.formState) {
      case "editing": text = "Submit"; className = undefined; break;
      case "error": text = "Error"; className = styles.buttonError; break;
      case "saving": text = "Saving"; className = undefined; break;
      case "success": text = "Success"; className = styles.buttonSuccess; break;
    }

    return (
      <div className={styles.helloFormContainer}>
        {!ctx.spProps && <h2>New submission</h2>}
        <Fields.TextField ctx={ctx} fieldName="textColumn" multiline={false} />
        <Separator />
        <Fields.TextField ctx={ctx} fieldName="multiTextColumn" multiline={true} richText={true} />
        <Separator />
        <Fields.SingleChoiceField ctx={ctx} fieldName="singleChoiceColumn" choices={SimpleChoice} />
        <Separator />
        <Fields.MultiChoiceField ctx={ctx} fieldName="multiChoiceColumn" choices={SimpleChoice} />
        <Separator />
        <Fields.BooleanField ctx={ctx} fieldName="booleanColumn" />
        <Separator />
        <Fields.NumberField ctx={ctx} fieldName="numberColumn" />
        <Separator />
        <Fields.DateTimeField ctx={ctx} fieldName="dateColumn" />
        <Separator />
        <Fields.ManagedMetadataField ctx={ctx} fieldName="managedMetadata" spfxContext={this.props.context} />
        <Separator />
        <Fields.ManagedMetadataField ctx={ctx} fieldName="managedMetadataMulti" multiSelect={true} spfxContext={this.props.context} />
        <Separator />
        <Fields.UserField ctx={ctx} fieldName="userField" allowMulti={false} spfxContext={this.props.context} />
        <Separator />
        <Fields.UserField ctx={ctx} fieldName="userFieldMulti" allowMulti={true} spfxContext={this.props.context} />
        <Separator />
        <Fields.LookupField ctx={ctx} fieldName="lookupColumn" spfxContext={this.props.context} />
        <Separator />
        <Fields.LookupField ctx={ctx} fieldName="multiLookupColumn" spfxContext={this.props.context} />

        {this.state.formState === "showValidation" && <ValidationSummary ctx={ctx} validationMessages={ctx.validationResult} />}

        <DefaultButton
          text={text}
          disabled={this.state.formState === "saving"}
          className={className}
          onClick={this._onClick}
          onRenderText={this._onTextRender}
        />

        {isDbg && <DebugPanel ctx={ctx} />}
      </div>
    );
  }

  @autobind
  private _onTextRender(props: IButtonProps, renderer: (props?: IButtonProps) => JSX.Element) {
    if (this.state.formState === "saving") {
      return <span><span><Spinner size={SpinnerSize.xSmall} /></span>{renderer(props)}</span>;
    } else {
      return renderer(props);
    }
  }

  @autobind
  private setStateSuccess() {
    return new Promise((resolve) => {
      this.setState({
        formState: "success"
      });
      setTimeout(() => {
        this.setState({
          formState: "editing"
        });
        resolve();
      }, 2000);
    });
  }

  @autobind
  private _onClick() {

    if (!ctx.modelValid) {
      this.setState({
        formState: "showValidation"
      });
      return;
    }

    this.setState({
      formState: "saving"
    });

    if (ctx.spProps && ctx.spProps.spItemId) {
      genericListItemSvc.updateItem(ctx.spProps.spItemId, ctx.model, ctx.attachmentsToAdd, ctx.attachmentsToRemove).then(() => {
        ctx.attachments = [...ctx.attachments, ...ctx.attachmentsToAdd];
        ctx.attachmentsToRemove = [];
        ctx.attachmentsToAdd = [];
        this.setStateSuccess();
      });
    } else {
      genericListItemSvc.createItem(ctx.model, ctx.attachmentsToAdd).then((r) => {
        ctx.attachmentsToAdd = [];
        this.setStateSuccess();
        ctx.spProps = {
          spItemId: r.data.Id,
          attachments: [],
          spCreated: null,
          spCreatedById: null,
          spModified: null,
          spModifiedById: null
        };
      });
    }
  }
}
