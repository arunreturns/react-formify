# JSON Options

#### fldName 
String  input to determine the name of the field.
This is also used as the key in most places like hiddenOptions, disabledOptions etc.

#### fldType 
Can be either Checkbox, Radio, Input, Select

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