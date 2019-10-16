import * as React from "react";
import { NavAnchor } from "../NavNode";
import InfoCallout from "../InfoCallout";
import { IAppCtxDependentField, IGenericFieldProps } from "../../models/index";

export interface IFieldHeaderProps<T extends object> extends IGenericFieldProps<T>,IAppCtxDependentField<T> {
}

export class FieldHeader<T extends object> extends React.Component<IFieldHeaderProps<T>,{}> {

  public render() : React.ReactElement<IFieldHeaderProps<T>> {
    const fieldInfo = this.props.ctx.fieldInfo[this.props.fieldName];
    return (
    <>
      <NavAnchor field={this.props.fieldName} />
      <h3>
        {fieldInfo.Title}
        {fieldInfo.Description ?
        (
          <InfoCallout>
            {fieldInfo.Description}
          </InfoCallout>
        ) : <></>}
      </h3>
    </>
    );
  }
}
