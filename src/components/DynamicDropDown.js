import React from 'react';
import FormField from './FormField';

class DynamicDropDown extends React.Component {
  handleDropdownChange(type, value) {
    let data = {
      key: "test",
      type: type,
      value: value
    };
    this.props.handleValueChange(data);
  }

  createSelect(options, selectedVal, key) {
    let elemProps = {};
    elemProps.type = "select";
    elemProps.options = options;
    elemProps.formModel = selectedVal;
    elemProps.name = key;
    elemProps.label = key;
    return (
      <FormField {...elemProps} key={key} handleValueChange={(type, value) => this.handleDropdownChange(type, value)}/>
    );
  }

  /**
   * iterateObj
   * @author Arun
   * @param {Object} obj It contains the list of options from the pricing JSON
   * @param {Array}  ary The array of UI to be rendered.
   *                      This function iterates over the options object from Pricing JSON and progressively
   *                      creates the UI fields.
   *                      If the last child ( [] -> An Array Object ) is empty this will create a text box
   *                      If the last child has options, it will create a select
   *                      It will only create the next select if the previous field is entered.
   */
  iterateObject(obj, ary) {

    for (let property in obj) {
      if (property === "") // Empty values are only required for options
        continue;
      // Selected value will be obtained from state. Based on this, the child selects will be formed.
      let selectedVal = this.props.selected[property];
      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] === "object") {
          let options;
          // This is for the last and final child where the options will only be an array
          if (Array.isArray(obj[property])) {
            options = obj[property];
          } else {
            // We take the Objects keys for options and use the selected value for the child
            options = Object.keys(obj[property]);
          }

          // In case the options are empty, We should create text boxes
          if (options.length > 0) {
            ary.push(this.createSelect(
              options,
              selectedVal,
              property
            ));
          }
          // Only create the next select element if the parent selected field has been selected.
          if (typeof selectedVal !== 'undefined' && selectedVal !== "") {
            let childObj = obj[property][selectedVal];
            // Recursion \_(0_0)_/
            if (typeof childObj === "object")
              this.iterateObject(childObj, ary);
          }
        }
      }
    }
  }

  renderOptions() {
    let ary = [];
    this.iterateObject(this.props.options, ary);
    return ary;
  }

  render() {
    return (
      <div className={"dynamic-drop-down"}>
        {this.renderOptions()}
      </div>
    );
  }
}

export default DynamicDropDown;
