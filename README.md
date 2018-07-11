# JSON Options

## Fields

#### fldName 
String  input to determine the name of the field.
This is also used as the key in most places like hiddenOptions, disabledOptions etc.

#### fldType 
Can be either Checkbox, Radio, Input, Select
Dropdown - To be implemented

#### triggerChildUpdates
Array of fields that get updated on change of this field

#### defaultValue
The defaultValue to be set on component load,
If the field is a checkbox, the value needs to be an Array

#### isMandatory
Determines whether the field is required as part of validation

#### hiddenOptions
1. Each key inside this is a field name
2. Each entry indicates the value dependent on the field name.
3. The option that needs to be hidden as keys of the values.

```
hiddenOptions: {
	"<existingField>": {
		"<valueOfExistingField>": [
			"<Array of values to be hidden>"
		]
	}
}
```

#### disabledOptions
Same as [hiddenOptions](#hiddenOptions)

#### updateFromParent
Almost the same as [hiddenOptions](#hiddenOptions)
```
updateFromParent: {
	"<existingField>": {
		"<value1OfExistingField>": "<newValueToBeUsed>",
		"<value2OfExistingField>": "<newValueToBeUsed>"
	}
}
```

#### fldShown / fldHidden
Used to show or hide the field based on a different field value
```
fldShown / fldHidden: {
	"<existingField>": "<valueOfExistingField>"
}
```
To clear the value of the child based on parent value
```
fldShown / fldHidden: {
	"<existingField>": ""
}
fldShown / fldHidden: {
	"<existingField>": {}
}
```

## Validators

#### Types of validators
There are currently two types of validators. 
- <b>ALL</b> - Add all required fields no matter other conditions
- <b>CO-MANDATORY</b> - Add all the dependent field conditions here.

##### ALL
<b>requiredFlds</b> will have an array of elements that need be entered. If the formObject doesn't have the value, it will be considered an error
The error format will be ALL_REQUIRED_FIELD_<b>\<fieldIndex\></b>

##### CO-MANDATORY
Co Mandatory configurations have two sections
<b>parentFields</b> - Array of objects. Each will have a fldName and fldValue attribute
fldName - Parent field name
fldValue - The current value to be validated again

<b>childFields</b> - Array of Arrays of objects. Each object will have a fldName and fldValue attribute
Each row is iterated and validated, this allows multiple child fields to be validated based on a single parent field
The error format will be COMANDATORY_REQUIRED_<b>\<parentFieldIndex\></b>_<b>\<childFieldIndex\></b>

fldName can have an array of fields to be check. In such cases we need to add valMode as OR or AND to ensure the proper checks are handled
fldValue can be left blank if we need to check the presense of the field alone.
```
{
	"fldName": <Array of fields>,
	"fldValue": <requiredValue>,
	"valMode": <OR | AND>
}
```


## Sections

The fields can be grouped into Section and have a Wrappers that encompass the fields inside them. Useful in scenarios where u need a fieldset or panel to wrap some set of fields.

```
"Sections": {
	"<sectionName>": [<Array of Section fields>]
}
```

## ErrorMessages

Error message can be configured. It can have two different implementations

It can either have a field Name level mapping or based on ALL or COMANDATORY validations
```
{
	"<fieldName>": {
		<validationType>: "Error Message"
	}
	"requiredOrCoMandValidationType": "Error Message"
}
```

## Enum

Not Implemented