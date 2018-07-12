import React from "react";

const REGEX_MAP = {
  NUMBER: new RegExp(/^[0-9]+$/g),
  ALPHA: new RegExp(/^[A-Za-z]+$/i),
  ALPHA_NUMERIC: new RegExp(/^[a-zA-Z0-9]+$/gi),
  ALPHA_NUMERIC_SPL: new RegExp(/^[a-z\d\-_.,&\s]+$/gi),
  ALPHA_SPL: new RegExp(/^[A-Za-z-_.,\s]+$/gi),
  EMAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
  TEL: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
}

class FormField extends React.Component {
  renderErrors(type){
    if (!this.props.errorModel || Object.keys(this.props.errorModel).length === 0 ) return;
    return <div key={`${type}-section-errors`} className={`${type}-section-errors`}>
      {Object.keys(this.props.errorModel).map((errKey, idx) => {
        return <label className="error-label" key={idx + errKey}>{this.props.errorModel[errKey]}</label>
      })}
    </div>
  }
  processOptions() {
    return this.props.options.map(option => {
      if (typeof option !== "object") {
        return {
          value: option,
          label: option
        };
      }
      return option;
    });
  }
  renderSelect() {
    let options = this.processOptions();
    let selectOptions = options.map(option => (
      <option key={option.value} value={option.value} disabled={option.disabled}>
        {option.label}
      </option>
    ));
    let mandatoryInd = this.props.isMandatory ? <sup>&nbsp;*</sup> : false;
    return (
      <div className="select-section">
        <div key="select-section-inputs" className="select-section-inputs">
          <label className="select-label" htmlFor={this.props.name}>
            {this.props.label}
            {mandatoryInd}
          </label>
          <select className="select-option" onChange={(event) => this.props.handleValueChange(this.props.name, event.target.value)}
            value={this.props.formModel} selected={this.props.formModel}>{selectOptions}</select>
        </div>
        {this.renderErrors('select')}
      </div>
    );
  }

  handleCheckboxOrRadioChange(type, event){
    let value = event.target.value;
    if ( type === 'checkbox' ){
      let formModel = this.props.formModel || [];
      formModel = Array.isArray(formModel) ? formModel : [formModel];
      if (event.target.checked)
        formModel.push(value);
      else
        formModel.splice(formModel.indexOf(value), 1)
      value = formModel;

      value.sort();
    }
    this.props.handleValueChange(this.props.name, value);
  }

  renderCheckboxOrRadio(type) {
    let options = this.processOptions(this.props.options);
    let checkboxOptions = options.map(option => {
      let checked;
      if ( type === 'checkbox' )
        checked = this.props.formModel ? this.props.formModel.indexOf(option.value) >= 0 ? true : false : false;
      else
        checked = this.props.formModel === option.value;
      return <span className={`${type}-option`} key={this.props.name + "_" + option.value}>
        <label htmlFor={this.props.name + "_" + option.value}>
          {option.label}
        </label>
        <input disabled={option.disabled}
          name={this.props.name} value={option.value}
          type={type} onClick={this.handleCheckboxOrRadioChange.bind(this, type)}
          id={this.props.name + "_" + option.value} checked={checked}
        />
      </span>
    });
    let mandatoryInd = this.props.isMandatory ? <sup>&nbsp;*</sup> : false;
    return (
      <div className={`${type}-section`}>
        <div className={`${type}-section-inputs`}>
          <label className={`${type}-label`} htmlFor={this.props.name}>
            {this.props.label}
            {mandatoryInd}
          </label>
          {checkboxOptions}
        </div>
        {this.renderErrors(type)}
      </div>
      
    );
  }

  dateValidations(){

  }

  numberValidations(field, value){
    if ( field.type !== 'number' ) return true;
    if ( parseInt(value, 0) < parseInt(field.min, 0) )
      return {
        type: "MINLENGTH",
        msg: `${this.props.name} should be more than ${field.min}`
      };
    else if (parseInt(value, 0) > parseInt(field.max, 0))
      return {
        type: "MAXLENGTH",
        msg: `${this.props.name} should be less than ${field.max}`
      };
    return true;
  }

  stringValidations(field, value) {
    if (field.type !== 'text') return true;
    if (value.length < parseInt(field.min, 0))
      return {
        type: "MINLENGTH",
        msg: `${this.props.name} should be more than ${field.min}`
      };
    else if (value.length > parseInt(field.max, 0))
      return {
        type: "MAXLENGTH",
        msg: `${this.props.name} should be less than ${field.max}`
      };
    return true;
  }

  validateInput(field, event){
    let { value } = event.target;
    let fieldType = field ? (field.regex ? field.regex : field.type) : "";
    fieldType = fieldType ? fieldType.toUpperCase() : "";
    const validationRegex = REGEX_MAP[fieldType] || new RegExp();
    let regexResult = validationRegex.test(value);
    let regexValue = value.replace(validationRegex);
    if (regexResult === false){
      this.props.handleSetErrorObject(this.props.name, "REGEX", `${this.props.name} is incorrect`)
    } else {
      this.props.handleSetErrorObject(this.props.name, "REGEX")
    }
    let numberValidationMsg = this.numberValidations(field, value);
    if (numberValidationMsg !== true){
      this.props.handleSetErrorObject(this.props.name, numberValidationMsg.type, numberValidationMsg.msg);
    }
    let stringValidationMsg = this.stringValidations(field, value);
    if (stringValidationMsg !== true) {
      this.props.handleSetErrorObject(this.props.name, stringValidationMsg.type, stringValidationMsg.msg);
    }
    this.props.handleValueChange(this.props.name, value)
  }

  handleInputChange(field, event){
    this.validateInput(field, event);
  }

  renderInput() {
    let field = this.props.config || {};
    field.type = field.type ? field.type : "text"
    let mandatoryInd = this.props.isMandatory ? <sup>&nbsp;*</sup> : false;
    return (
      <div className="input-section">
        <div className="input-section-inputs">
          <label className="input-label" htmlFor={this.props.name}>
            {this.props.label}
            {mandatoryInd}
          </label>
          <input className={`input-value input-label-${field.type}`} name={this.props.name}
            id={this.props.name} {...field}
            onChange={this.handleInputChange.bind(this, field)}
            value={this.props.formModel} />
        </div>
        {this.renderErrors("input")}
      </div>
    );
  }

  renderTextArea() {
    let field = this.props.config || {};
    let mandatoryInd = this.props.isMandatory ? <sup>&nbsp;*</sup> : false;
    return (
      <div className="textarea-section">
        <label htmlFor={this.props.name}>
          {this.props.label}
          {mandatoryInd}
        </label>
        <textarea
          name={this.props.name}
          {...field} id={this.props.name}
          value={this.props.formModel}
          onChange={this.handleInputChange.bind(this, field)}
        />
      </div>
    );
  }

  renderDateField(){
    let field = this.props.config || {};
    let mandatoryInd = this.props.isMandatory ? <sup>&nbsp;*</sup> : false;
    return (
      <div className="textarea-section">
        <label htmlFor={this.props.name}>
          {this.props.label}
          {mandatoryInd}
        </label>
        <input type={"date"} min={field.min} max={field.max}
          onChange={this.handleInputChange.bind(this, field)}
          value={this.props.formModel}
        />
      </div>
    );
  }

  render() {
    switch (this.props.type) {
      case "checkbox":
        return this.renderCheckboxOrRadio("checkbox");
      case "radio":
        return this.renderCheckboxOrRadio("radio");
      case "select":
        return this.renderSelect();
      case "input":
        return this.renderInput();
      case "textarea":
        return this.renderTextArea();
      case "date":
        return this.renderDateField();
      default:
        return;
    }
  }
}

export default FormField;
