import React from 'react';
import FormBuilder from '../components/FormBuilder'
import { mount, shallow, render, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FormInputs from "../json/FormInputs.json";

configure({ adapter: new Adapter() });

let formObject = {};
let errorObject = {};

let handleSetFormObject = (type, value) => {
  formObject[type] = value;
}
let handleSetErrorObject = (type, value) => {
  errorObject[type] = value;
}
describe('Render Tests', () => {
  it("Should render a FormBuilder Component", () => {
    const component = render(
      <FormBuilder formObject={{}} errorObject={errorObject} formLabel={"Test Form"}
        handleSetFormObject={handleSetFormObject} handleSetErrorObject={handleSetErrorObject}
        formData={FormInputs} />
    );
    let fldComp = component.find('div.Row.Field0')
    // console.log(fldComp.html())
  })
})