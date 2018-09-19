import React from 'react';
import FormBuilder from '../components/FormBuilder'
import { mount, shallow, render, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FormInputs from "../json/FormInputs.json";

configure({ adapter: new Adapter() });

class App extends React.Component {
  state = {
    formObject: {},
    errorObject: {},
    selected: {},
    formErrors: []
  }
  constructor() {
    super();
    this.handleSetFormObject = this.handleSetFormObject.bind(this);
    this.handleSetErrorObject = this.handleSetErrorObject.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSetFormErrors = this.handleSetFormErrors.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormReset = this.handleFormReset.bind(this);
  }

  handleSetFormObject(type, value) {
    let formObject = this.state.formObject;
    formObject[type] = value;
    this.setState({ formObject });
  }

  handleValueChange(type, value) {
    let formObject = this.state.formObject;
    formObject[type] = value;
    this.setState({ formObject });
  }
  handleSetErrorObject(type, errorType, errorMsg) {
    let errorObject = this.state.errorObject;
    errorObject[type] = {
      [errorType]: errorMsg
    };
    this.setState({ errorObject });
  }
  handleFormSubmit() {

  }
  handleFormReset() {
    this.setState({ formObject: {}, errorObject: {}, formErrors: [] })
  }
  handleSetFormErrors(formErrors) {
    this.setState({ formErrors })
  }
  render() {
    return (
      <div>
        <FormBuilder errorObject={this.state.errorObject}
          formObject={this.state.formObject} formLabel={"Test Form"}
          handleSetFormObject={this.handleSetFormObject}
          handleSetErrorObject={this.handleSetErrorObject}
          formData={FormInputs} initDefaults={this.props.initDefaults}
          handleFormSubmit={this.handleFormSubmit}
          handleFormReset={this.handleFormReset}
          handleSetFormErrors={this.handleSetFormErrors}
          formErrors={this.state.formErrors} />
      </div>
    )
  }
}


describe('Render Tests - JSON 1', () => {
  let testComponent1;
  beforeEach(() =>{
    testComponent1 = mount(<App />);
    // console.log("[BEFORE-EACH] TEST1", testComponent1.state());
  });
  it("Field 1 to be set, Should Enable Field 2, Field 2 value should be Level B", () => {
    let inputLevel1 = testComponent1.find("input#Level_Level_1");
    inputLevel1.simulate('click', { target: { value: 'Level 1', checked: true } });
    expect(testComponent1.state().formObject.Level).toEqual(["Level 1"]);
    const field2 = testComponent1.find(".Row.Field1");
    expect(field2.find('select').props().value).toBe("Level B");
  })

  it("Field 1 - Level 2 should disable Option A and H, Option E to be disabled", () => {
    let inputLevel1 = testComponent1.find("input#Level_Level_1");
    inputLevel1.simulate('click', { target: { value: 'Level 1', checked: true } });
    expect(testComponent1.state().formObject.Level).toEqual(["Level 1"]);
    expect(testComponent1.find(".select-option-opt").length).toBe(10);

    let inputLevel2 = testComponent1.find("input#Level_Level_2");
    inputLevel2.simulate('click', { target: { value: 'Level 2', checked: true } });
    expect(testComponent1.state().formObject.Level).toEqual(["Level 1", "Level 2"]);

    const field2 = testComponent1.find(".Row.Field1");
    expect(field2.find(".select-option-opt").length).toBe(8);
    expect(field2.find(".select-option-opt").at(4).props().disabled).toBe(true);
  })

  it("Field 1 Change - Disabled Option to be cleared", () => {
    let inputLevel1 = testComponent1.find("input#Level_Level_1");
    inputLevel1.simulate('click', { target: { value: 'Level 1', checked: true } });
    expect(testComponent1.state().formObject.Level).toEqual(["Level 1"]);
    expect(testComponent1.find(".select-option-opt").length).toBe(10);
    
    let field2 = testComponent1.find(".Row.Field1");
    const selectField = field2.find("#Option_X");
    selectField.simulate('change', { target: { value: 'Level E' } });
    expect(testComponent1.state().formObject["Option X"]).toEqual("Level E");

    let inputLevel2 = testComponent1.find("input#Level_Level_2");
    inputLevel2.simulate('click', { target: { value: 'Level 2', checked: true } });
    expect(testComponent1.state().formObject.Level).toEqual(["Level 1", "Level 2"]);
    

    field2 = testComponent1.find(".Row.Field1");
    expect(testComponent1.state().formObject["Option X"]).toEqual(undefined);
    expect(field2.find(".select-option-opt").length).toBe(8);
    expect(field2.find(".select-option-opt").at(4).props().disabled).toBe(true);
  })

  it("Field 1 Change - Clear Hidden Field", () => {
    let inputLevel1 = testComponent1.find("input#Level_Level_1");
    inputLevel1.simulate('click', { target: { value: 'Level 1', checked: true } });
    expect(testComponent1.state().formObject.Level).toEqual(["Level 1"]);
    expect(testComponent1.find(".select-option-opt").length).toBe(10);

    let field2 = testComponent1.find(".Row.Field1");
    const selectField = field2.find("#Option_X");
    
    selectField.simulate('change', { target: { value: 'Level E' } });
    expect(testComponent1.state().formObject["Option X"]).toEqual("Level E");

    let inputLevel2 = testComponent1.find("input#Level_Level_2");
    inputLevel2.simulate('click', { target: { value: 'Level 1' } });
    expect(testComponent1.state().formObject.Level).toEqual([]);

    field2 = testComponent1.find(".Row.Field1");
    expect(testComponent1.state().formObject["Option X"]).toEqual(undefined);
    expect(field2.find(".select-option-opt").length).toBe(0);
  })
})

describe('Render Tests - JSON 1 - With Defaults', () => {
  let testComponent2
  beforeEach(() => {
    testComponent2 = mount(<App initDefaults={true} />);
    // console.log("[BEFORE EACH] TEST2", testComponent2.state());
  });
  it("Check initiailized defaults", () => {
    expect(testComponent2.state().formObject.Level).toEqual(["Level 1"]);
    expect(testComponent2.state().formObject["Option X"]).toEqual("Level B");
    expect(testComponent2.state().formObject.Connect).toEqual("No");
    expect(testComponent2.state().formObject.MAN).toEqual("Yes");
  })
  it("Should reset the form properly", () => {
    let resetBtn = testComponent2.find('.form-reset-button');
    resetBtn.simulate('click');
    expect(Object.keys(testComponent2.state().formObject).length).toBe(0);
    expect(testComponent2.state().formErrors.length).toBe(0);
  })
  it("Should submit the form properly", () => {
    let submitBtn = testComponent2.find('.form-submit-button');
    submitBtn.simulate('click');
    expect(testComponent2.state().formErrors.length).toBe(5);
  })
})

describe('Render Tests - JSON 1 - Submit Validations', () => {
  let testComponent3
  beforeEach(() => {
    testComponent3 = mount(<App />);
    // console.log("[BEFORE EACH] TEST2", testComponent2.state());
  });
  it("Should reset the form properly", () => {
    let resetBtn = testComponent3.find('.form-reset-button');
    resetBtn.simulate('click');
    expect(Object.keys(testComponent3.state().formObject).length).toBe(0);
    expect(testComponent3.state().formErrors.length).toBe(0);
  })
  it("Should submit the form properly for validation", () => {
    let inputLevel1 = testComponent3.find("input#Level_Level_1");
    inputLevel1.simulate('click', { target: { value: 'Level 1', checked: true } });
    expect(testComponent3.state().formObject.Level).toEqual(["Level 1"]);
    
    let mwanField = testComponent3.find(".Row.Field3");
    mwanField.find("#MAN_Yes").simulate('click', { target : { value: "Yes", checked: true } })
    expect(testComponent3.state().formObject.MAN).toEqual("Yes");

    let submitBtn = testComponent3.find('.form-submit-button');
    submitBtn.simulate('click');
    expect(testComponent3.state().formErrors.length).toBe(5);
    expect(testComponent3.state().formErrors[2].errorMsg).toBe("Missing required value R Option,S Option for MAN Option")
  })
})