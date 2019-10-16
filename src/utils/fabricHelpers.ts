import {IChoiceGroupOption} from "office-ui-fabric-react/lib/ChoiceGroup";

export function getChoiceOptionsFromEnum(e: any) {
  return Object.keys(e).map<IChoiceGroupOption>((k) => {
    return {
      text: e[k],
      key: e[k],
    };
  });
}

export let BooleanChoiceOptions: IChoiceGroupOption[] = [
  {
    text: "Yes",
    key: "true"
  },
  {
    text: "No",
    key: "false"
  }
];
