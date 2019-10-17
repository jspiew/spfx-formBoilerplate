import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartPropertiesMetadata
} from '@microsoft/sp-webpart-base';

import * as strings from 'HelloFormWebPartStrings';
import HelloForm from './components/HelloForm';
import { IHelloFormProps } from './components/IHelloFormProps';
import { DynamicProperty } from '@microsoft/sp-component-base';
import ctx from "./modelImplenetation/AppContextProvider";
import { genericListItemSvc } from './modelImplenetation/listConfig';
import { sp } from '@pnp/sp';

export interface IHelloFormWebPartProps {
  selectedItemId: DynamicProperty<number>;
}

export default class HelloFormWebPart extends BaseClientSideWebPart<IHelloFormWebPartProps> {

  public async onInit() {
    sp.setup({
      spfxContext: this.context
    });
    const initResult = await genericListItemSvc.Init();
    ctx.fieldInfo = initResult.fieldInfo;
  }

  public render(): void {
    let id: number;

    if (window.location.search.indexOf('id=') >= 0) {
      id = parseInt(window.location.search.substr(window.location.search.indexOf('id=') + 3), 10);
    } else {
      id = this.properties.selectedItemId.tryGetValue();
    }

    const element: React.ReactElement<IHelloFormProps > = React.createElement(
      HelloForm,
      {
        selectedItemId: id,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      // Specify the web part properties data type to allow the address
      // information to be serialized by the SharePoint Framework.
      selectedItemId: {
        dynamicPropertyType: 'number'
      }
    };
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
