import * as React from 'react';
import { DatePicker, Dropdown, IDropdownOption, DirectionalHint } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import 'react-quill/dist/quill.snow.css';
import { FieldWrapper } from '../genericFields/index';
import * as moment from "moment";
import "moment-timezone";
import styles from "./DateField.module.scss";
import { AppContextProvider, IGenericFieldProps, IAppCtxDependentField } from '../../models/index';
import { getUTC } from '../../utils/index';

export interface IDateTimeFieldProps<T extends object> extends IGenericFieldProps<T>, IAppCtxDependentField<T> {
  // includeTime?: boolean;
 }

export interface IDateTimeFieldState { }

@observer
export class GenericDateTimeField<T extends object> extends React.Component<IDateTimeFieldProps<T>, IDateTimeFieldState> {

  public static HourOptions: IDropdownOption[] = [
    { key: 0, text: "12:00 AM" },
    { key: 1, text: "01:00 AM" },
    { key: 2, text: "02:00 AM" },
    { key: 3, text: "03:00 AM" },
    { key: 4, text: "04:00 AM" },
    { key: 5, text: "05:00 AM" },
    { key: 6, text: "06:00 AM" },
    { key: 7, text: "07:00 AM" },
    { key: 8, text: "08:00 AM" },
    { key: 9, text: "09:00 AM" },
    { key: 10, text: "10:00 AM" },
    { key: 11, text: "11:00 AM" },
    { key: 12, text: "12:00 PM" },
    { key: 13, text: "01:00 PM" },
    { key: 14, text: "02:00 PM" },
    { key: 15, text: "03:00 PM" },
    { key: 16, text: "04:00 PM" },
    { key: 17, text: "05:00 PM" },
    { key: 18, text: "06:00 PM" },
    { key: 19, text: "07:00 PM" },
    { key: 20, text: "08:00 PM" },
    { key: 21, text: "09:00 PM" },
    { key: 22, text: "10:00 PM" },
    { key: 23, text: "11:00 PM" }
  ];
  public static MinuteOptions: IDropdownOption[] = [
    { key: 0, text: "00" },
    { key: 1, text: "01" },
    { key: 2, text: "02" },
    { key: 3, text: "03" },
    { key: 4, text: "04" },
    { key: 5, text: "05" },
    { key: 6, text: "06" },
    { key: 7, text: "07" },
    { key: 8, text: "08" },
    { key: 9, text: "09" },
    { key: 10, text: "10" },
    { key: 11, text: "11" },
    { key: 12, text: "12" },
    { key: 13, text: "13" },
    { key: 14, text: "14" },
    { key: 15, text: "15" },
    { key: 16, text: "16" },
    { key: 17, text: "17" },
    { key: 18, text: "18" },
    { key: 19, text: "19" },
    { key: 20, text: "20" },
    { key: 21, text: "21" },
    { key: 22, text: "22" },
    { key: 23, text: "23" },
    { key: 24, text: "24" },
    { key: 25, text: "25" },
    { key: 26, text: "26" },
    { key: 27, text: "27" },
    { key: 28, text: "28" },
    { key: 29, text: "29" },
    { key: 30, text: "30" },
    { key: 31, text: "31" },
    { key: 32, text: "32" },
    { key: 33, text: "33" },
    { key: 34, text: "34" },
    { key: 35, text: "35" },
    { key: 36, text: "36" },
    { key: 37, text: "37" },
    { key: 38, text: "38" },
    { key: 39, text: "39" },
    { key: 40, text: "40" },
    { key: 41, text: "41" },
    { key: 42, text: "42" },
    { key: 43, text: "43" },
    { key: 44, text: "44" },
    { key: 45, text: "45" },
    { key: 46, text: "46" },
    { key: 47, text: "47" },
    { key: 48, text: "48" },
    { key: 49, text: "49" },
    { key: 50, text: "50" },
    { key: 51, text: "51" },
    { key: 52, text: "52" },
    { key: 53, text: "53" },
    { key: 54, text: "54" },
    { key: 55, text: "55" },
    { key: 56, text: "56" },
    { key: 57, text: "57" },
    { key: 58, text: "58" },
    { key: 59, text: "59" }
  ];

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
          <DatePicker
            className={styles.datePicker}
            value={value}
            onSelectDate={this._onChange}
            formatDate={GenericDateTimeField.dateFormatter}
          />
          {/* <Dropdown
            options={DateTimeField.HourOptions}
            selectedKey={value.getHours()}
            className={styles.timePicker}
          />
          <Dropdown
            options={DateTimeField.MinuteOptions}
            selectedKey={value.getMinutes()}
            calloutProps={{
              directionalHint: DirectionalHint.leftCenter,
              style: {minWidth:"80px"}
            }}
            className={styles.timePicker}
          /> */}
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
