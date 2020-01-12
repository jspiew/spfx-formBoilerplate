/// <reference types="jest" />

import * as React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter()  });

import { GenericTextField, ITextFieldProps, ITextFieldState } from "../TextField";

// create test model and field implementation
interface ITestModel {
    textField: string;
}
class TestTextField  extends GenericTextField<ITestModel> {}

describe('TextField tests', () => {

    let reactComponent: ReactWrapper<ITextFieldProps<ITestModel>, ITextFieldState>;

    beforeEach(() => {

        reactComponent = mount(React.createElement(
            TestTextField,
            {
                ctx: null,
                fieldName: "textField"
            }
        ));
    });

    afterEach(() => {
        reactComponent.unmount();
    });

    it('should print a text field', () => {
        // find the element using css selector
        const element = reactComponent.find("input");
        expect(element.length).toBeGreaterThan(0);
    });
});