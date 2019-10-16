import * as React from 'react';
import {Checkbox,IChoiceGroupOption,ICheckboxProps} from "office-ui-fabric-react";
import styles from './CheckboxGroup.module.scss';
import InfoCallout from '../InfoCallout';

export interface ICheckboxGroupProps {
  options: IChoiceGroupOption[];
  selectedKeys: string[];
  onChanged: (newSelectedKeys: string[]) => void;
  tooltips?: {[k:string]: JSX.Element};
}

export interface ICheckboxGroupState {}

export class CheckboxGroup extends React.Component<ICheckboxGroupProps, ICheckboxGroupState> {
  constructor(props: ICheckboxGroupProps) {
    super(props);

    this.state = {

    };
  }

  public render(): React.ReactElement<ICheckboxGroupProps> {
    return (
      <div>
          {this.props.options.map((o) =>
            <Checkbox
              className={styles.checkbox}
              key={o.text}
              label={o.text}
              onRenderLabel={this._onRenderLabel}
              checked={this.props.selectedKeys && this.props.selectedKeys.indexOf(o.key) >= 0}
// tslint:disable-next-line: jsx-no-lambda
              onChange={(ev,checked) => {this._onChange(ev,checked,o);}}
            />
          )}
      </div>
    );
  }

  private _onRenderLabel = (props: ICheckboxProps, defaultRenderer: (ICheckboxProps) => JSX.Element) => {
    if (this.props.tooltips && this.props.tooltips[props.label]) {
      return (<span>{defaultRenderer(props)}<InfoCallout>{this.props.tooltips[props.label]}</InfoCallout></span>);
    } else {
      return defaultRenderer(props);
    }
  }

  private _onChange = (ev:React.FormEvent<HTMLInputElement|HTMLElement>, checked:boolean, o:IChoiceGroupOption) => {
    const indexOfKey = this.props.selectedKeys ? this.props.selectedKeys.indexOf(o.key) : -1;
    if (checked && indexOfKey < 0) {
      const newValue = [...this.props.selectedKeys || []];
      newValue.push(o.key);
      this.props.onChanged(newValue);
    } else if (!checked && indexOfKey >= 0) {
      const newValue = [...this.props.selectedKeys || []];
      newValue.splice(indexOfKey, 1);
      this.props.onChanged(newValue);
    }
  }
}
