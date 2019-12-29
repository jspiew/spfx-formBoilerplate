import * as React from 'react';
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react';
import { observer } from "mobx-react";
import 'react-quill/dist/quill.snow.css';
import { FieldWrapper } from '../genericFields/index';
import * as moment from "moment";
import "moment-timezone";
import styles from "./DateField.module.scss";
import { IGenericFieldProps, IAppCtxDependentField } from '../../models/index';
import { getUTC } from '../../utils/index';

export interface IDateTimeFieldProps<T extends object> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {
    includeTime?: boolean;
 }

export interface IDateTimeFieldState { }

@observer
export class GenericDateTimeField<T extends object> extends React.Component<IDateTimeFieldProps<T>, IDateTimeFieldState> {

  public static dateFormatter(date: Date) {
    return moment(date).format("DD-MMM-YYYY");
  }

  constructor(props: IDateTimeFieldProps<T>) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<IDateTimeFieldProps<T>> {
    const value = this.props.ctx.model[this.props.fieldName as any] as Date;
    return (
      <FieldWrapper ctx={this.props.ctx} fieldName={this.props.fieldName}>
        <div className={styles.datePickerContainer}>
          <DateTimePicker
            dateConvention={this.props.includeTime? DateConvention.DateTime : DateConvention.Date}
            timeConvention={TimeConvention.Hours24}
            value={value}
            onChange={this._onChange}
            formatDate={GenericDateTimeField.dateFormatter}
          />
        </div>
      </FieldWrapper>
    );
  }

  private _onChange = (newValue: Date) => {
    const newModelValue: Partial<T> = {};

    const localOffset = new Date().getTimezoneOffset();

    // fix for local offset used by fabric DatePicker, we want the UTC date to be at 12:00AM,
    // not the local date to be at 12:00am. +360 is because when in SharePoint, you select Date only
    // the time seems to be arbitrarly set to 6AM. Don't ask me why. It may also be that I'm wrong about it
    // and it should be set to 12AM, I've been dealing with the timezone issues for the past day
    // and am slowly losing my mind.
    const utcValue = moment(newValue).add(-localOffset + 360, "minutes");
    // at this point the date has correct value (in UTC) but incorrect timezone, hence the getUTC at the bottom, which changes the timezone
    newModelValue[this.props.fieldName as any] = getUTC(utcValue);

    this.props.ctx.updateModel(newModelValue);
  }
}
