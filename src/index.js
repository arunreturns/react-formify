import React from "react";
import {render} from "react-dom";

import FormBuilder from "./components/FormBuilder";
import FormField from "./components/FormField";
import DynamicDropDown from "./components/DynamicDropDown";

import FormInputs from "./json/FormInputs.json";
import DropDown from './json/DropDown.json';
import './styles.css';

const styles = {
  "textAlign": "center",
  "display": "none"
};

const WrapperComp = (props) => <div key={props.sectionName + "-" + props.sectionIndex} className={`supernova section-${props.sectionIndex} ${props.sectionName}`}>{props.children}</div>

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      formObject: {},
      errorObject: {},
      selected: {},
      formErrors: []
    };
    this.handleSetFormObject = this.handleSetFormObject.bind(this);
    this.handleSetErrorObject = this.handleSetErrorObject.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSetFormErrors = this.handleSetFormErrors.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormReset = this.handleFormReset.bind(this);
  }

  handleSetFormObject(type, value){
    let formObject = this.state.formObject;
    formObject[type] = value;
    this.setState({formObject});
  }

  handleValueChange(type, value){
    let formObject = this.state.formObject;
    formObject[type] = value;
    this.setState({ formObject });
  }
  handleSetErrorObject(type, errorType, errorMsg){
    let errorObject = this.state.errorObject;
    errorObject[type] = {
      [errorType]: errorMsg
    };
    this.setState({ errorObject });
  }
  handleFormSubmit(){

  }
  handleFormReset(){
    this.setState({ formObject: {} })
  }
  handleSetFormErrors(formErrors){ 
    console.log("handleSetFormErrors", formErrors)
    this.setState({ formErrors })
  }
  render(){
    let commonProps = {
      setError: this.setError,
      handleValueChange: this.handleValueChange
    }
    return (
      <div>
        <pre>{JSON.stringify(this.state.formObject, null, 2)}</pre>
        <pre>{JSON.stringify(this.state.errorObject, null, 2)}</pre>
        <div style={styles}>
          <DynamicDropDown options={DropDown} selected={this.state.selected} handleValueChange={this.handleValueChange} />
        </div>
        <div>
          <FormBuilder errorObject={this.state.errorObject}
            formObject={this.state.formObject} formLabel={"Test Form"}
            handleSetFormObject={this.handleSetFormObject}
            handleSetErrorObject={this.handleSetErrorObject}
            formData={FormInputs} sectionWrapper={WrapperComp}
            handleFormSubmit={this.handleFormSubmit}
            handleFormReset={this.handleFormReset}
            handleSetFormErrors={this.handleSetFormErrors}
            formErrors={this.state.formErrors} />
        </div>
        <div style={styles}>
          <FormField type="select" options={["A", "B", "C"]}
            formModel={this.state.formObject.selectOption} errorModel={this.state.errorObject.selectOption}
            label={"Select Value"} name={"selectOption"}
            {...commonProps}
            />
          <FormField isMandatory={true}
            type="checkbox"
            formModel={this.state.formObject.checkboxOptn}
            errorModel={this.state.errorObject.checkboxOptn}
            options={["A", "B", "C"]}
            name="checkboxOptn"
            label={"Select Checkbox"}
            {...commonProps}
          />
          <FormField
            type="radio"
            formModel={this.state.formObject.radioOptn}
            errorModel={this.state.errorObject.radioOptn}
            options={["A", "B", "C"]}
            name="radioOptn"
            label={"Select Radio"}
            {...commonProps}
          />
          <FormField type="date" config={{
            min: "06/31/2018"
          }} name="dateField"
            label={"Enter Date"} {...commonProps}
            formModel={this.state.formObject.dateField}
            errorModel={this.state.errorObject.dateField}
            />
          <FormField type="input" config={{ type: "number" }} name="inputNum"
            formModel={this.state.formObject.inputNum}
            errorModel={this.state.errorObject.inputNum}
            label={"Enter Number"} {...commonProps} />
          <FormField type="input" config={{ type: "text", regex: 'ALPHA_NUMERIC' }}
            name="inputAlpNum"
            formModel={this.state.formObject.inputAlpNum}
            errorModel={this.state.errorObject.inputAlpNum}
            label={"Enter Alpha Numeric"} {...commonProps} />
          <FormField type="input" config={{ type: "tel", "maxLength": 10 }}
            name="inputTel"
            formModel={this.state.formObject.inputTel}
            errorModel={this.state.errorObject.inputTel}
            label={"Enter Tel"} {...commonProps} />
          <FormField type="input" config={{ type: "email" }}
            name="inputMail"
            formModel={this.state.formObject.inputMail}
            errorModel={this.state.errorObject.inputMail}
            label={"Enter Email"} {...commonProps} />
          <FormField type="textarea" config={{ rows: 5 }} name="textAreaInput"
            formModel={this.state.formObject.textAreaInput}
            errorModel={this.state.errorObject.textAreaInput}
            label={"Enter Textarea"} {...commonProps} />
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById("root"));
