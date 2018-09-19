import React from 'react';
import FormField from '../components/FormField'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() });

let formObj = {};
let errorObj = {};
const handleValueChange = (name, value) => {
  formObj[name] = value;
}
const handleSetErrorObject = (name, value, msg) => {
  errorObj[name] = {
    [value]: msg
  };
}

let formFieldProps = {
  handleValueChange,
  handleSetErrorObject
}

describe('[FORMFIELD]-[SELECT]', () => {
  it("[RENDER] : Should render a FormField Select", () => {
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

  it("[RENDER] : Should render a FormField Select with Custom Options", () => {
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

describe('[FORMFIELD]-[SELECT]', () => {
  it("[STYLES] : Should have a select-section", () => {
    const component = shallow(
      <FormField type="select" options={["A", "B"]} label={"Label Text"} name={"selectOption"} {...formFieldProps} isMandatory={true} />,
    );
    expect(component.find('.select-section').length).toBe(1);
    expect(component.find('.select-section-inputs').length).toBe(1);
  });

  it("[STYLES] : Should render the proper select-section-inputs", () => {
    const component = shallow(
      <FormField type="select" options={["A", "B"]} label={"Label Text"} formModel={formObj.selectOption} name={"selectOption"} {...formFieldProps} isMandatory={true} />,
    );
    const selectSectionInputs = component.find('.select-section-inputs');
    expect(selectSectionInputs.find('.select-option').length).toBe(1);
    expect(selectSectionInputs.find('.select-option-opt').length).toBe(2);
    expect(selectSectionInputs.find('.select-label').length).toBe(1);
  });
})

describe('Checkbox Tests', () => {
  it("Should render a FormField Checkbox", () => {
    let options = ["A", "B", "C"];
    const component = shallow(
      <FormField
        type="checkbox" formModel={formObj.checkboxOptn}
        options={options}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps}
      />
    );
    
    let inputField = component.find("input");
    // Render number of options
    expect(inputField.length).toBe(3);
    inputField.forEach((fld, idx) => {
      expect(fld.props().type === 'checkbox')
      expect(fld.props().value === options[idx])
    })
    inputField.at(0).simulate('click', { target: { value: 'A', checked: true } });
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
    inputField.forEach((fld, idx) => {
      expect(fld.props().value).toBe(options[idx].value)
      expect(fld.props().type).toBe('checkbox')
    })
    inputField.at(0).simulate('click', { target: { value: 'A', checked: true } });
    expect(formObj.checkboxOptn).toContain("A");
    inputField.at(0).simulate('click', { target: { value: 'B', checked: true } });
    expect(formObj.checkboxOptn).toContain("B");
    inputField.at(0).simulate('click', { target: { value: 'B', checked: false } });
    expect(formObj.checkboxOptn).not.toContain("B");
  });
})

describe('Checkbox Classes Test', () => {
  it('should have a checkbox-section', () => {
    let options = ["A", "B", "C"];
    const component = shallow(
      <FormField
        type="checkbox" formModel={formObj.checkboxOptn}
        options={options}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps}
      />
    );

    let inputField = component.find("input");
    // Render number of options
    expect(inputField.length).toBe(3);
    inputField.forEach((fld, idx) => {
      expect(fld.props().type === 'checkbox')
      expect(fld.props().value === options[idx])
    })
    expect(component.find(".checkbox-section-inputs").length).toBe(1);
  })

  it('should have a checkbox-section having 3 checkbox-options', () => {
    let options = ["A", "B", "C"];
    const component = shallow(
      <FormField
        type="checkbox" formModel={formObj.checkboxOptn}
        options={options}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps}
      />
    );
    expect(component.find(".checkbox-section-inputs").length).toBe(1);
    expect(component.find(".checkbox-option").length).toBe(3);
  })

  it('checkbox-options should be uniquely identifiable', () => {
    let options = ["A", "B", "C"];
    const component = shallow(
      <FormField
        type="checkbox" formModel={formObj.checkboxOptn}
        options={options}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps}
      />
    );
    expect(component.find(".checkbox-section-inputs").length).toBe(1);
    const checkboxOptions = component.find(".checkbox-option");
    expect(checkboxOptions.length).toBe(3);
    checkboxOptions.map((checkboxOption, i) => expect(checkboxOption.props().className).toBe(`checkbox-option checkbox-option-${i}`))
  })
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
    inputField.forEach(fld => expect(fld.props().type).toBe('radio'))
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
    inputField.forEach((fld, idx) => {
      expect(fld.props().name).toBe("radioOptn")
      expect(fld.props().type).toBe('radio')
    })
    inputField.at(0).simulate('click', { target: { value: 'A' } });
    expect(formObj.radioOptn).toBe("A");
    inputField.at(0).simulate('click', { target: { value: 'B' } });
    expect(formObj.radioOptn).toBe("B");
  });
})

describe('Radio Classes Test', () => {
  it('should have a radio-section', () => {
    let options = ["A", "B", "C"];
    const component = shallow(
      <FormField
        type="radio" formModel={formObj.radioOptn}
        options={options}
        name="radioOptn"
        label={"Select Radio"} {...formFieldProps}
      />
    );

    let inputField = component.find("input");
    // Render number of options
    expect(inputField.length).toBe(3);
    inputField.forEach((fld, idx) => {
      expect(fld.props().type === 'radio')
      expect(fld.props().value === options[idx])
    })
    expect(component.find(".radio-section-inputs").length).toBe(1);
  })

  it('should have a radio-section having 3 radio-options', () => {
    let options = ["A", "B", "C"];
    const component = shallow(
      <FormField
        type="radio" formModel={formObj.radioOptn}
        options={options}
        name="radioOptn"
        label={"Select Radio"} {...formFieldProps}
      />
    );
    expect(component.find(".radio-section-inputs").length).toBe(1);
    expect(component.find(".radio-option").length).toBe(3);
  })

  it('radio-options should be uniquely identifiable', () => {
    let options = ["A", "B", "C"];
    const component = shallow(
      <FormField
        type="radio" formModel={formObj.radioOptn}
        options={options}
        name="radioOptn"
        label={"Select Radio"} {...formFieldProps}
      />
    );
    expect(component.find(".radio-section-inputs").length).toBe(1);
    const radioOptions = component.find(".radio-option");
    expect(radioOptions.length).toBe(3);
    radioOptions.map((radioOption, i) => expect(radioOption.props().className).toBe(`radio-option radio-option-${i}`))
  })
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

  it("Should render a Input Number with min max config - min validation", () => {
    let component = shallow(
      <FormField config={{ type: "number", min: 10, max: 100 }} name="inputNum"
        type="input" formModel={formObj.inputNum}
        label={"Select Input"} {...formFieldProps}
      />
    );
    let inputField = component.find("input");
    let spanField = component.find("sup");
    expect(spanField.length).toBe(0);
    inputField.simulate('change', { target: { value: 9 } });
    expect(inputField.props().type).toBe("number");
    expect(formObj.inputNum).toBe(9);
    expect(errorObj["inputNum"].MINLENGTH).toBe("inputNum should be more than 10")
  });

  it("Should render a Input Number with min max config - max validation", () => {
    let component = shallow(
      <FormField config={{ type: "number", min: 10, max: 100 }} name="inputNum"
        type="input" formModel={formObj.inputNum}
        label={"Select Input"} {...formFieldProps}
      />
    );
    let inputField = component.find("input");
    let spanField = component.find("sup");
    expect(spanField.length).toBe(0);
    inputField.simulate('change', { target: { value: 101 } });
    expect(inputField.props().type).toBe("number");
    expect(formObj.inputNum).toBe(101);
    expect(errorObj["inputNum"].MAXLENGTH).toBe("inputNum should be less than 100")
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

  it("Should render a Input with text config and use a Regex", () => {
    const config = { type: "text", regex: "ALPHA" };
    const component = shallow(
      <FormField config={config} name="inputText"
        type="input" isMandatory={true} formModel={formObj.inputText}
        label={"Select Text Input"} {...formFieldProps}
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    expect(inputField.props().type).toBe("text");


    inputField.simulate('change', { target: { value: "+" } });
    expect(errorObj["inputText"].REGEX).toBe("inputText is incorrect")
    expect(formObj.inputText).toBe("+");

    inputField.simulate('change', { target: { value: "ABCE" } });
    expect(errorObj["inputText"].REGEX).toBe(undefined)
    expect(formObj.inputText).toBe("ABCE");
  });

  it("Should render a Input with text config with min config", () => {
    const config = { type: "text", min: 15 };
    const component = shallow(
      <FormField config={config} name="inputText"
        type="input" isMandatory={true} formModel={formObj.inputText}
        label={"Select Text Input"} {...formFieldProps}
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    inputField.simulate('change', { target: { value: 'AAAAAAAAAAAAAA' } });
    expect(inputField.props().type).toBe("text");
    expect(formObj.inputText).toBe("AAAAAAAAAAAAAA");
    expect(errorObj["inputText"].MINLENGTH).toBe("inputText should be more than 15")
  });

  it("Should render a Input with text config with max config", () => {
    const config = { type: "text", max: 15 };
    const component = shallow(
      <FormField config={config} name="inputText"
        type="input" isMandatory={true} formModel={formObj.inputText}
        label={"Select Text Input"} {...formFieldProps}
      />
    );
    let spanField = component.find("sup");
    expect(spanField.length).toBe(1);
    let inputField = component.find("input");
    inputField.simulate('change', { target: { value: 'AAAAAAAAAAAAAAAA' } });
    expect(inputField.props().type).toBe("text");
    expect(formObj.inputText).toBe("AAAAAAAAAAAAAAAA");
    expect(errorObj["inputText"].MAXLENGTH).toBe("inputText should be less than 15")
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
    shallow(
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

  it("Should render a FormField with an empty errorModel", () => {
    formObj.checkboxOptn = "A";
    const component = shallow(
      <FormField
        type="checkbox" formModel={formObj.checkboxOptn}
        options={["A", "B", "C"]}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps}
        errorModel={[]}
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

describe('Error Handling', () => {
  it('should display the error fields properly', () => {
    const component = shallow(
      <FormField
        type="checkbox" formModel={formObj.checkboxOptn}
        options={["A", "B", "C"]}
        name="checkboxOptn"
        label={"Select Checkbox"} {...formFieldProps}
        errorModel={{
          'REGEX': 'Some Validation Message',
          'ERR': "Some Test Error"
        }}
      />
    );
    let errorSection = component.find('.checkbox-section-errors');
    expect(errorSection.find('.error-label').at(0).text()).toBe("Some Validation Message");
    expect(errorSection.find('.error-label').at(1).text()).toBe("Some Test Error");
  })
})