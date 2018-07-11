import React from 'react';
import FormField from '../components/FormField'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() });

let formObj = {};
let errorObj = {};
function handleValueChange(name, value) {
  // console.log("[TEST]", name, value);
  formObj[name] = value;
}
function handleSetErrorObject(name, value) {
  // console.log("[TEST]", name, value);
  errorObj[name] = value;
}

let formFieldProps = {
  handleValueChange,
  handleSetErrorObject
}

describe('Select Tests', () => {
  it("Should render a FormField Select", () => {
    const component = shallow(
      <FormField type="select" options={["A", "B"]} label={"Label Text"} name={"selectOption"} {...formFieldProps} isMandatory={true} />,
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let labelField = component.find("label");
    expect(labelField.text()).toContain("Label Text");
    let selectField = component.find("select");
    let optionFields = selectField.find("option");
    expect(optionFields.length).toBe(2);
    expect(optionFields.at(0).text()).toBe("A");
    expect(optionFields.at(1).text()).toBe("B");
    selectField.simulate('change', { target: { value: 'B' } });
    expect(formObj.selectOption).toBe("B");
    selectField.simulate('change', { target: { value: 'A' } });
    expect(formObj.selectOption).toBe("A");
  });

  it("Should render a FormField Select with Custom Options", () => {
    const options = [{ label: "Option 1", value: "A" }, { label: "Option 2", value: "B" }];
    const component = shallow(
      <FormField type="select" options={options} label={"Label Text Custom"} name={"selectOptions"} {...formFieldProps} />,
    );
    let labelField = component.find("label");
    expect(labelField.text()).toBe("Label Text Custom");
    let selectField = component.find("select");
    let optionFields = selectField.find("option");
    expect(optionFields.length).toBe(2);
    expect(optionFields.at(0).text()).toBe("Option 1");
    expect(optionFields.at(1).text()).toBe("Option 2");
    selectField.simulate('change', { target: { value: 'B' } });
    expect(formObj.selectOptions).toBe("B");
    selectField.simulate('change', { target: { value: 'A' } });
    expect(formObj.selectOptions).toBe("A");
  });
})

describe('Checkbox Tests', () => {
  it("Should render a FormField Checkbox", () => {
    const component = shallow(
      <FormField
        type="checkbox" formModel={formObj.checkboxOptn}
        options={["A", "B", "C"]}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps} 
      />
    );
    let inputField = component.find("input");
    expect(inputField.length).toBe(3);
    inputField.map(fld => expect(fld.props().type === 'checkbox'))
    inputField.at(0).simulate('click', { target: { value: 'A', checked: true } });
    inputField.at(0).simulate('click', { target: { value: 'A', checked: true } });
    console.log(formObj.checkboxOptn);
    expect(formObj.checkboxOptn).toContain("A");
    inputField.at(0).simulate('click', { target: { value: 'B', checked: true } });
    expect(formObj.checkboxOptn).toContain("B");
    inputField.at(0).simulate('click', { target: { value: 'B', checked: false } });
    expect(formObj.checkboxOptn).not.toContain("B");
  });

  it("Should render a FormField Checkbox with Custom Options", () => {
    const options = [{ label: "Option 1", value: "A" }, { label: "Option 2", value: "B" }];
    const component = shallow(
      <FormField isMandatory={true}
        type="checkbox"
        options={options}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps} 
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    expect(inputField.length).toBe(2);
    inputField.map((fld, idx) => {
      expect(fld.props().value).toBe(options[idx].value)
      expect(fld.props().type === 'checkbox')
    })
    inputField.at(0).simulate('click', { target: { value: 'A', checked: true } });
    expect(formObj.checkboxOptn).toContain("A");
    inputField.at(0).simulate('click', { target: { value: 'B', checked: true } });
    expect(formObj.checkboxOptn).toContain("B");
    inputField.at(0).simulate('click', { target: { value: 'B', checked: false } });
    expect(formObj.checkboxOptn).not.toContain("B");
  });
})

describe('Radio Tests', () => {
  it("Should render a FormField Radio", () => {
    const component = shallow(
      <FormField
        type="radio"
        options={["A", "B", "C"]}
        name="radioOptn"
        label={"Select Radio"} {...formFieldProps} 
      />
    );
    let inputField = component.find("input");
    expect(inputField.length).toBe(3);
    inputField.map(fld => expect(fld.props().type === 'checkbox'))
    inputField.at(0).simulate('click', { target: { value: 'A' } });
    expect(formObj.radioOptn).toBe("A");
    inputField.at(0).simulate('click', { target: { value: 'B' } });
    expect(formObj.radioOptn).toBe("B");
  });

  it("Should render a FormField Radio with Custom Options", () => {
    const options = [{ label: "Option 1", value: "A" }, { label: "Option 2", value: "B" }];
    const component = shallow(
      <FormField
        type="radio" isMandatory={true}
        options={options}
        name="radioOptn"
        label={"Select Radio"} {...formFieldProps} 
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    expect(inputField.length).toBe(2);
    inputField.map((fld, idx) => {
      expect(fld.props().name).toBe("radioOptn")
      expect(fld.props().type === 'checkbox')
    })
    inputField.at(0).simulate('click', { target: { value: 'A' } });
    expect(formObj.radioOptn).toBe("A");
    inputField.at(0).simulate('click', { target: { value: 'B' } });
    expect(formObj.radioOptn).toBe("B");
  });
})

describe('Input Tests', () => {
  it("Should render a Input Number", () => {
    let component = shallow(
      <FormField config={{ type: "number" }} name="inputNum"
        type="input" formModel={formObj.inputNum}
        label={"Select Input"} {...formFieldProps} 
      />
    );
    let inputField = component.find("input");
    let spanField = component.find("sup");
    expect(spanField.length).toBe(0);
    inputField.simulate('change', { target: { value: "A" } });
    expect(inputField.props().type).toBe("number");
    expect(formObj.inputNum).toBe("A");
  });

  it("Should render a Input with text config", () => {
    const config = { type: "text" };
    const component = shallow(
      <FormField config={config} name="inputText"
        type="input" isMandatory={true} formModel={formObj.inputText}
        label={"Select Text Input"} {...formFieldProps} 
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    inputField.simulate('change', { target: { value: '12' } });
    expect(inputField.props().type).toBe("text");
    expect(formObj.inputText).toBe("12");
  });
});

describe('Date Tests', () => {
  it("Should render a Date", () => {
    const component = shallow(
      <FormField name="dateInput"
        type="date" isMandatory={true}
        label={"Select Input"} {...formFieldProps} 
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    inputField.simulate('change', { target: { value: '28/03/2018' } });
    expect(formObj.dateInput).toBe("28/03/2018");
  });

  it("Should render a Date with min-max config", () => {
    let config = { min: "25/03/2018", cols: "31/03/2018" };
    const component = shallow(
      <FormField name="dateInput" config={config}
        type="date" isMandatory={true} value={formObj.dateInput}
        label={"Select Input"} {...formFieldProps} 
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    inputField.simulate('change', { target: { value: '28/03/2018' } }); 
    expect(formObj.dateInput).toBe("28/03/2018");
  });
})

describe('Text Area Tests', () => {
  it("Should render a Textarea", () => {
    const component = shallow(
      <FormField name="textAreaInput"
        formModel={formObj.textAreaInput}
        type="textarea" isMandatory={true}
        label={"Select Input"} {...formFieldProps} 
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("textarea");
    inputField.simulate('change', { target: { value: 'Hello' } });
    expect(formObj.textAreaInput).toBe("Hello");
  });

  it("Should render a Textarea with a proper config", () => {
    let config = { rows: 10, cols: 5 };
    const component = shallow(
      <FormField name="textAreaInput"
        config={config}
        formModel={formObj.textAreaInput}
        type="textarea" isMandatory={true}
        label={"Select Input"} {...formFieldProps} 
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("textarea");
    expect(inputField.props().rows).toBe(config.rows);
    expect(inputField.props().cols).toBe(config.cols);
    inputField.simulate('change', { target: { value: 'Hello' } });
    expect(formObj.textAreaInput).toBe("Hello");
  });
})

describe('Error Cases', () => {
  it('should gracefully handle a no props render', () => {
    const component = shallow(
      <FormField />,
    );
  })

  it("Should render a Input without a config", () => {
    const component = shallow(
      <FormField name="inputNum"
        type="input" isMandatory={true}
        label={"Select Input"} {...formFieldProps} 
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    expect(inputField.props().type).toBe('text');
    inputField.simulate('change', { target: { value: '12' } });
    expect(formObj.inputNum).toBe("12");
  });

  it("Should render a FormField Checkbox with an incorrect type of value", () => {
    formObj.checkboxOptn = "A";
    const component = shallow(
      <FormField
        type="checkbox" formModel={formObj.checkboxOptn}
        options={["A", "B", "C"]}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps} 
      />
    );
    let inputField = component.find("input");
    expect(inputField.length).toBe(3);
    inputField.map(fld => expect(fld.props().type === 'checkbox'))
    inputField.at(0).simulate('click', { target: { value: 'A', checked: true } });
    expect(formObj.checkboxOptn).toContain("A");
    inputField.at(0).simulate('click', { target: { value: 'B', checked: true } });
    expect(formObj.checkboxOptn).toContain("B");
    inputField.at(0).simulate('click', { target: { value: 'B', checked: false } });
    expect(formObj.checkboxOptn).not.toContain("B");
  });
})