declare interface IHelloFormWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'HelloFormWebPartStrings' {
  const strings: IHelloFormWebPartStrings;
  export = strings;
}
