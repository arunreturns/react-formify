import React from "react";
import FormField from "./FormField";
import PropTypes from 'prop-types';
/** 
 * Converts the array fields into a map for better access
 */
function mapifyArray(arr) {
  let m = {};
  arr.map(a => m[a.fldName] = a);
  return m;
}
/**
 * Form Builder component. Reads a JSON with a pre-defined structure and creates fields
 * based on the configuration.
 */
class FormBuilder extends React.Component {
  componentWillMount() {
    // Set the default values
    if (!this.props.initDefaults) return;
    let fieldsList = this.props.formData.Fields || [];
    fieldsList.forEach(field => {
      if (field.defaultValue) {
        /* Set the defaultValue and also trigger subsequent child updates as
           well, that way once the component is loaded all the required fields
           are updated with the proper values 
           */
        this.props.handleSetFormObject(field.fldName, field.defaultValue);
        this.handleChildUpdates(field, field.defaultValue);
      }
    })
  }

  validateField(field, formObject, mandatoryToggle) {
    let fldValue = formObject[field.fldName];
    let isMandatory = mandatoryToggle ? mandatoryToggle : field.isMandatory;
    switch (field.fldType) {
      case "Input":
        if (isMandatory && (typeof fldValue === "undefined" || fldValue === ""))
          return `Please enter a value for ${field.fldName}`;
        else if (parseInt(fldValue, 0) === 0)
          return `Please enter a non-zero value for ${field.fldName}`;
        else if (parseInt(fldValue, 0) < field.fldMin)
          return `Please enter at-least ${field.fldMin} for ${field.fldName}`;
        else if (parseInt(fldValue, 0) > field.fldMax)
          return `Please enter atmost ${field.fldMax} for ${field.fldName}`;
        else
          return;
      case "Select":
      case "Radio":
        if (isMandatory && (typeof fldValue === "undefined" || fldValue === ""))
          return `Please select a value for ${field.fldName}`;
        else
          return;
      case "Checkbox":
        if (isMandatory && (typeof fldValue === "undefined" || fldValue === "" || fldValue.length === 0))
          return `Please select a value for ${field.fldName}`;
        else
          return;
      default:
        return;
    }
  }

  validateFormValue(childFldName, childFldValue, isArray) {
    let formValue = this.props.formObject[childFldName];
    if (typeof childFldValue === 'undefined') {
      if (!formValue) {
        return {
          status: false,
          errorMsg: `Enter value for ${childFldName}`,
          missingField: childFldName,
          missingValue: childFldValue
        };
      }
      return { status: true };
    }
    formValue = Array.isArray(formValue) ? formValue : [formValue];
    if (isArray ? formValue.some(r => childFldValue.indexOf(r) === -1) : formValue.indexOf(childFldValue) === -1 ) {
      return {
        status: false,
        errorMsg: `Missing required value ${childFldValue} for ${childFldName}`,
        missingField: childFldName,
        missingValue: childFldValue
      };
    }
    return { status: true };
  }

  validateChildField({ fldName, fldValue, valMode }) {
    if (Array.isArray(fldName)) {
      let validationStatus;
      switch (valMode) {
        case 'OR':
          for (let i = 0; i < fldName.length; i++) {
            // Single success scenario is good enough  
            validationStatus = this.validateFormValue(fldName[i], fldValue, Array.isArray(fldValue));
            if (validationStatus.status)
              return true;
          }
          return {
            status: false,
            errorMsg: `Enter value for ${fldName.join(" OR ")}`
          };
        case 'AND':
          for (let i = 0; i < fldName.length; i++) {
            // Single success scenario is not good enough, all must be good
            // If one fails, stop the execution and break;
            validationStatus = this.validateFormValue(fldName[i], fldValue, Array.isArray(fldValue));
            if (!validationStatus.status)
              return {
                status: false,
                errorMsg: `Missing values for ${fldName.join(" AND ")}`
              };
          }
          return true;
        default:
          break;
      }
    } else {
      // Basic field validations
      let validationStatus = this.validateFormValue(fldName, fldValue, Array.isArray(fldValue));
      if (!validationStatus.status)
        return validationStatus;
    }
    return true;
  }

  validateForm() {
    let validators = this.props.formData.Validators;
    let fieldMap = mapifyArray(this.props.formData.Fields);
    let errors = [];
    // Basic field isMandatory validation
    const Fields = this.props.formData.Fields;
    for (let x = 0; x < Fields.length; x++){
      let basicErr = this.validateField(Fields[x], this.props.formObject);
      if (basicErr) {
        let fldName = Fields[x].fldName.replace(/ /g, "_").toUpperCase();
        errors.push({
          errorType: `MANDATORY_FIELD_${fldName}`,
          errorMsg: basicErr
        })
      }
    }
    for (let i = 0; i < validators.length; i++) {
      let validator = validators[i];
      switch (validator.type) {
        case "ALL":
          for (let k = 0; k < validator.requiredFlds.length; k++) {
            let requiredErr = this.validateField(fieldMap[validator.requiredFlds[k]], this.props.formObject, true);
            if (requiredErr) {
              errors.push({
                errorType: `ALL_REQUIRED_FIELD_${k}`,
                errorMsg: requiredErr
              })
            }
          }
          break;
        case "CO-MANDATORY":
          for (let l = 0; l < validator.parentFields.length; l++) {
            let parentField = validator.parentFields[l];
            let { fldName, fldValue } = parentField;
            let parentFormValue = this.props.formObject[fldName] || "";
            if (parentFormValue && (parentFormValue.indexOf(fldValue) >= 0 || parentFormValue === fldValue)) {
              // Do validation on child fields only if the value matches the target value
              for (let m = 0; m < validator.childFields[l].length; m++) {
                let childField = validator.childFields[l][m];
                let validationStatus = this.validateChildField(childField);
                if (validationStatus !== true)
                  errors.push({
                    errorType: `COMANDATORY_REQUIRED_${l}_${m}`,
                    errorMsg: validationStatus.errorMsg
                  })
              }
            }
          }
          break;
        default:
          break;
      }
    }
    // Map errors to ErrorMessages from JSON
    errors.forEach(error => {
      let { errorType, errorMsg } = error;
      let ErrorMessages = this.props.formData.ErrorMessages || {};
      error.errorMsg = ErrorMessages[errorType] ? ErrorMessages[errorType] : errorMsg
    })
    console.warn("Errors: ", errors);
    if (errors.length > 0) {
      this.props.handleSetFormErrors(errors);
    } else {
      this.props.handleSetFormErrors();
      this.props.handleFormSubmit(this.props.formObject)
    }
  }

  checkOptionAvailability(val, field) {
    let { fldOptions, hiddenOptions, disabledOptions } = field;
    // Remove the hidden values
    fldOptions = this.processOptions(hiddenOptions, fldOptions, "FILTER");
    if (fldOptions.indexOf(val) >= 0) return val;
    // Remove the disabled values
    fldOptions = this.processOptions(disabledOptions, fldOptions, "DISABLE");
    if (fldOptions.indexOf(val) >= 0) return val;
    return;
  }

  handleChildUpdates(field, val) {
    // No child to update. Return
    if (!field.triggerChildUpdates || field.triggerChildUpdates.length === 0) return;
    // Convert the list of field to map for better access
    let attrMap = mapifyArray(this.props.formData.Fields);
    field.triggerChildUpdates.forEach(childToUpdate => {
      // Prevent infinite loop
      if (childToUpdate === field.fldName) {
        console.warn(`WARNING: ${field.fldName} is added a child for itself`);
        return;
      }
      // Create a local entity of the childField for no consequence mutation
      let childField = JSON.parse(JSON.stringify(attrMap[childToUpdate]));
      if (this.fldShownCheck(childField) === false || this.fldHiddenCheck(childField) === true) {
        // If the field is hidden, clear the field.
        if (this.props.formObject[childToUpdate]) {
          this.handleValueChange(childField, childField.fldName);
        }
        return false;
      }
      if (childField.triggerChildUpdates && childField.triggerChildUpdates.indexOf(field.fldName) !== -1) {
        /*
            Some fields may have cross dependencies, For ex: Field A might trigger update
            in Field B and Field B might trigger update on Field A, cyclic dependency
            So in such cases stop the child updates only for the cyclic dependency but
            let the other updates flow through.
         */
        let infLoopFldIndex = childField.triggerChildUpdates.indexOf(field.fldName);
        childField.triggerChildUpdates.splice(infLoopFldIndex, 1);
      }
      let type = childField.fldName;
      if (!childField.updateFromParent || Object.keys(childField.updateFromParent).length === 0) {
        console.info(`${childField.fldName} was declared as child of ${field.fldName}. But updateFromParent is not defined`);
        return;
      }
      // Arrays wont make sense in JSON. So convert them to string
      let compareVal = Array.isArray(val) ? val.join(", ") : val;
      const childUpdates = childField.updateFromParent[field.fldName];
      let value, updVal;
      for (let updateKey in childUpdates) {
        const rangeChar = updateKey.slice(-1);
        let valKey = updateKey.slice(0, updateKey.length - 1);
        switch (rangeChar) {
          case ">":// Greater range
            if (Array.isArray(val)) compareVal = val[val.length - 1];
            if (field.fldOptions.indexOf(compareVal) > field.fldOptions.indexOf(valKey)) {
              value = childField.updateFromParent[field.fldName][updateKey];
            }
            break;
          case "<":// Lesser range
            if (Array.isArray(val)) compareVal = val[val.length - 1];
            if (field.fldOptions.indexOf(compareVal) < field.fldOptions.indexOf(valKey)) {
              value = childField.updateFromParent[field.fldName][updateKey];
            }
            break;
          default:
            compareVal = Array.isArray(val) ? val.join(", ") : val;
            value = childField.updateFromParent[field.fldName][compareVal];
            break;
        }
        /* 
          In some cases, the value maybe cleared in subsequent combinations,
          not all combinations match the update value, so use the latest one
          which has a proper update cycle.
        */
        updVal = updVal ? updVal : value;
      }
      updVal = this.checkOptionAvailability(updVal, childField);
      // If the updVal is undefined, then use the previous value from formObject
      // so that the fields are properly retained.
      if (updVal === undefined || typeof updVal === 'undefined')
        updVal = this.props.formObject[childField.fldName];
      this.handleValueChange(childField, type, updVal);
    });
  }
  handleSetErrorObject(field, type, errorType, errorMsg) {
    // Use custom error messages if defined in JSON
    if (typeof errorMsg !== 'undefined' && this.props.formData.ErrorMessages) {
      let ErrorMessages = this.props.formData.ErrorMessages || {};
      errorMsg = ErrorMessages[type] ? (ErrorMessages[type][errorType] || errorMsg) : errorMsg;
    }
    this.props.handleSetErrorObject(type, errorType, errorMsg);
  }
  handleValueChange(field, type, value) {
    this.props.handleSetFormObject(type, value);
    this.handleChildUpdates(field, value);
  }

  disableOption(options, disabledParent, disabledValue) {
    return options.map(opt => {
      let option;
      if (typeof opt !== 'object')
        option = { label: opt, value: opt };
      if (disabledParent[disabledValue].indexOf(opt) !== -1) {
        option.disabled = true
      }
      return option;
    });
  }

  processOptions(transformOptions, fldOptions, transformType){
    let options = fldOptions;
    if (typeof fldOptions === 'undefined') return [];
    for (let transformKey in transformOptions) {
      let transformParent = transformOptions[transformKey];
      for (let transformValue in transformParent) {
        let formValue = this.props.formObject[transformKey];
        formValue = Array.isArray(formValue) ? formValue : [formValue];
        formValue.forEach(val => {
          if (val === transformValue) {
            if (transformType === 'FILTER'){
              options = options.filter(opt => transformParent[transformValue].indexOf(opt) === -1)
            }
            if (transformType === 'DISABLE') {
              options = this.disableOption(options, transformParent, transformValue);
            }
          }
        })
      }
    }
    return options;
  }

  createField(field, index) {
    let { fldOptions, hiddenOptions, disabledOptions } = field;
    if (field.fldType !== "Input") {
      fldOptions = this.processOptions(hiddenOptions, fldOptions, "FILTER");
      fldOptions = this.processOptions(disabledOptions, fldOptions, "DISABLE");
    }
    let formFieldProps = {
      handleSetErrorObject: this.handleSetErrorObject.bind(this, field),
      handleValueChange: this.handleValueChange.bind(this, field),
      label: field.fldName,
      formModel: this.props.formObject[field.fldName],
      errorModel: this.props.errorObject[field.fldName],
      name: field.fldName,
      isMandatory: field.isMandatory
    }
    switch (field.fldType) {
      case "Input":
        // Create and return input
        return <FormField config={field.fldOptions} type="input" {...formFieldProps} />
      case "Select":
        // Create and return a select field
        return <FormField options={fldOptions} type="select" {...formFieldProps} />
      case "Checkbox":
        // Create and return Checkbox
        return <FormField options={fldOptions} type="checkbox" {...formFieldProps} />
      case "Radio":
        // Create and return Radio
        return <FormField options={fldOptions} type="radio" {...formFieldProps} />
      default:
        return <div>Not parsable</div>;
    }
  }

  fldHiddenCheck(field) {
    // Default hidden fields
    if (field.fldHidden === true) return true;
    // Specific configuration
    if (typeof field.fldHidden === "object" && Object.keys(field.fldHidden).length > 0) {
      for (let hiddenKey in field.fldHidden) {
        let formValue = this.props.formObject[hiddenKey];
        let hiddenConf = field.fldHidden[hiddenKey];
        if (hiddenConf.indexOf(formValue) !== -1)
          return true;
        if (Array.isArray(formValue)) {
          for (let i = 0; i < formValue.length; i++) {
            if (hiddenConf.indexOf(formValue[i]) !== -1) return true;
          }
          if (formValue.length === 0 && hiddenConf.indexOf("") !== -1)
            return true;
        }
        else if (typeof formValue === "undefined") return true;
      }
    }
    return false;
  }

  fldShownCheck(field) {
    // Specific configuration
    if (!field.fldShown) return true;
    if (typeof field.fldShown === "object" && Object.keys(field.fldShown).length > 0) {
      for (let shownKey in field.fldShown) {
        let formValue = this.props.formObject[shownKey];
        let shownConf = field.fldShown[shownKey];
        if (shownConf.indexOf(formValue) >= 0)
          return true;
        if (Array.isArray(formValue)) {
          for (let i = 0; i < formValue.length; i++) {
            if (shownConf.indexOf(formValue[i]) >= 0) return true;
          }
        }
      }
    }
    return false;
  }

  createFields() {
    let Fields = this.props.formData.Fields || [];
    let Sections = this.props.formData.Sections || [];
    let FieldsMap = {};
    let SectionFields = [];
    let RenderedFields = Fields.map((field, index) => {
      if (this.fldShownCheck(field) === false) return false;
      if (this.fldHiddenCheck(field) === true) return false;
      let renderedField = (
        <div className={`Row Field${index}`} key={field.fldName + index}>
          {this.createField(field, index)}
        </div>
      );
      FieldsMap[field.fldName] = renderedField;
      return renderedField;
    });
    if (this.props.sectionWrapper) {
      /*
        If the fields need to be grouped in sections or wrapper in specific values
        use the sectionWrapper prop to set the container.
     */
      let sectionIndex = 1;
      for (let sectionName in Sections) {
        let sectionContent = [];
        Sections[sectionName].forEach(fieldName => {
          if (FieldsMap[fieldName] && typeof FieldsMap[fieldName] !== 'undefined')
            sectionContent.push(FieldsMap[fieldName]);
        })
        /*  
            sectionContent determines the child content, if the content is empty
            the wrapper wont be rendered.
        */
        if (sectionContent.length > 0) {
          SectionFields.push(React.createElement(this.props.sectionWrapper, { sectionName, sectionIndex, key: `${sectionName}-${sectionIndex}-section` }, sectionContent));
          sectionIndex++;
        }
      }
    };
    return {
      FieldsMap, RenderedFields, SectionFields
    }
  }

  render() {
    /*
      RenderedFields are just the fields that are rendered as per the JSON
      field list order.
      SectionFields are the fields that are split into their corresponding
      section to be wrapped in the Wrapper Component.
    */
    let { SectionFields, RenderedFields } = this.createFields();
    return <div>
      {this.props.formLabel ? <h3 className="form-label">{this.props.formLabel}</h3> : false}
      {this.props.sectionWrapper ? SectionFields : RenderedFields}
      <hr />
      {this.props.formErrors ? <div className="error-section">
        <ul>{this.props.formErrors.map(formError => <li>{formError.errorType} : {formError.errorMsg}</li>)}</ul>
      </div> : false}

      <button className="form-submit-button" onClick={this.validateForm.bind(this)}>Submit</button>
      <button className="form-reset-button" onClick={this.props.handleFormReset}>Reset</button>
    </div>;
  }
}

FormBuilder.defaultProps = {
  initDefaults: false,
  formObject: {},
  formErrors: [],
  errorObject: {}
}

FormBuilder.propTypes = {
  /** Contains the fields for creating the form */
  formData: PropTypes.object.isRequired,
  /** Contains the object that has the form values */
  formObject: PropTypes.object.isRequired,
  /** Contains the object that has the form values */
  formErrors: PropTypes.array.isRequired,
  /** Contains the object that has the form errors */
  errorObject: PropTypes.object.isRequired,
  /** Method for updating the formObject */
  handleSetFormObject: PropTypes.func.isRequired,
  /** Method for updating the errorObject */
  handleSetErrorObject: PropTypes.func.isRequired,
  /** Method called when the form is submitted */
  handleFormSubmit: PropTypes.func.isRequired,
  /** Method called when the form is reset */
  handleFormReset: PropTypes.func.isRequired,
  /** Label for the Form */
  formLabel: PropTypes.string,
  /** Flag to determine if defaults need to be initialized */
  initDefaults: PropTypes.bool,
  /** The React/DOM element under which each sections are wrapped in
	PropTypes.string - In case of HTML DOM elements
    PropTypes.element - In case of React components
    PropTypes.func - In case of functional components
   */
  sectionWrapper: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func
  ])
}

export default FormBuilder;
