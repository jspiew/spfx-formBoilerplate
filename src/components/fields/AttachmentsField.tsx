import * as React from 'react';
import Dropzone, {FileWithPreview, DropFilesEventHandler} from 'react-dropzone';
import {Icon} from "office-ui-fabric-react";
import styles from './Attachments.module.scss';
import { observer } from "mobx-react";
import { AppContextProvider } from '../../models/index';

export interface IAttachmentsFieldProps<T> {
  title?: string;
  listUrl: string;
  ctx: AppContextProvider<T>;
}

export interface IAttachmentsFieldState {
  filesToUpload: FileWithPreview[];
}

@observer
export default class GenericAttachmentsField<T> extends React.Component<IAttachmentsFieldProps<T>, IAttachmentsFieldState> {
  constructor(props: IAttachmentsFieldProps<T>) {
    super(props);
    this._onDrop.bind(this);

    this.state = {
      filesToUpload: []
    };
  }

  public render(): React.ReactElement<IAttachmentsFieldProps<T>> {
    const attachmentsToAdd = this.props.ctx.attachmentsToAdd;
    const attachments = this.props.ctx.attachments;
    return (
      <div>
        <h3>{this.props.title || "Attachments"}</h3>
        <Dropzone
          multiple={true}
          onDrop={this._onDrop}
          className={styles.dropzone}
          activeClassName={styles.active}
        >
          {(args) => (
              <p>Drag and drop some files here, or click to select files</p>
          )}
        </Dropzone>
        <ul>
          {this.props.ctx.spProps !== null && attachments.map((a) =>
            <li key={a.name}>
              <span
                className={styles.deleteIcon}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={(ev) => {
                  this._removeExistingAttachment(a.name);
                  ev.bubbles = false;
                  ev.stopPropagation();
                  return false;
                }}
              >
                [x]
              </span>
              <a target="_blank" href={`${this.props.listUrl}/Attachments/${this.props.ctx.spProps.spItemId}/${a.name}`}>{a.name}</a>
            </li>)}
          {attachmentsToAdd.map((a) =>
            <li key={a.name}>
              <span
                className={styles.deleteIcon}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={(ev) => {
                  this._removeNewAttachment(a.name);
                  ev.bubbles = false;
                  ev.stopPropagation();
                  return false;
                }}
              >
                [x]
              </span>
              {a.name}
            </li>)}
        </ul>
      </div>
    );
  }
  private _onDrop: DropFilesEventHandler = (acc,rej,ev) => {

    acc.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.warn('file reading has failed');
      reader.onload = () => {
        this.props.ctx.attachmentsToAdd.push({name:file.name, content: reader.result});
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private _removeExistingAttachment = (name: string) => {
    this.props.ctx.attachments = this.props.ctx.attachments.filter((f) => f.name !== name);
    this.props.ctx.attachmentsToRemove.push({name,content:""});
  }

  private _removeNewAttachment = (name:string) => {
    this.props.ctx.attachmentsToAdd = this.props.ctx.attachmentsToAdd.filter((f) => f.name !== name);
  }
}
