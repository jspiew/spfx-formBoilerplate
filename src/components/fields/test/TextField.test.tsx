/// <reference types="jest" />

import * as React from 'react';
import { configure, ShallowWrapper, shallow } from 'enzyme';

// for some reason ES6 import messes with that module and tests fail to compile
// tslint:disable-next-line: no-var-requires
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter()  });
import { GenericTextField, ITextFieldProps, ITextFieldState } from "../TextField";
import { AppContextProvider } from '../../../models';

jest.mock('@pnp/spfx-controls-react/lib/RichText', () => 'RichText');

// create test model and field implementation
interface ITestModel {
    textField: string;
}
class TestTextField  extends GenericTextField<ITestModel> {}
// tslint:disable-next-line: max-classes-per-file
class TestCtxProvider extends AppContextProvider<ITestModel> {
    protected get listValidator(): import("../../../models").Validator<ITestModel> {
        return {
            textField: (model) => undefined as string
        };
    }    protected _getEmptyModel(): ITestModel {
        return {
            textField: ""
        };
    }

}

describe('TextField tests', () => {
    let reactComponent: ShallowWrapper<ITextFieldProps<ITestModel>, ITextFieldState>;

    beforeEach(() => {
        reactComponent = shallow(<TestTextField ctx={new TestCtxProvider()} fieldName="textField"/>);
    });

    it('should print a text field', () => {
        
        // find the element using css selector
        const element = reactComponent.find("input");
        expect(element.length).toBeGreaterThan(0);
    });
});