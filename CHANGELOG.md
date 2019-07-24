# Changelog

## v1.3.3
- Updates dependencies

## v1.3.1
- Updates dependencies

## v1.3.0
- Lib available in ES6+ syntax (see `src` folder) to enable auto-completion in IDEs
- Updates dependencies

## v1.2.2
- Updates dependencies

## v1.2.1
- Fixes error thrown for `maxLength` constraint

## v1.2.0
- Adds method `SchemaField.getMaxLength()`
- Adds method `SchemaField.getMinLength()`
- Adds option `maxLength: Number or Function` to `SchemaField(options)`
- Adds option `minLength: Number or Function` to `SchemaField(options)`

## v1.1.3
- Updates dependencies

## v1.1.2
- Updates dependencies
- Removes unused devDependencies

## v1.1.1
- Updates dependencies

## v1.1.0
- Adds option `parse: Boolean` to `Schema.validate(Object)`
- Adds method `Schema.parse(Object)`
- Adds method `SchemaField.getParseFunction()`
- Adds method `SchemaField.parse(String)`
- Adds option `parse: Function` to `SchemaField` constructor
- Fixes `Schema.removeUnknownFields()` to remove unknown nested fields

## v1.0.1
- Makes method `SchemaField.computeValue` static
- Makes method `SchemaField.throwFieldBadValueError` static
- Makes method `SchemaField.throwFieldDeniedValueError` static
- Makes method `SchemaField.throwFieldInstanceError` static
- Makes method `SchemaField.throwFieldLengthError` static
- Makes method `SchemaField.throwFieldMaxLengthError` static
- Makes method `SchemaField.throwFieldMaxValueError` static
- Makes method `SchemaField.throwFieldMaxWordsError` static
- Makes method `SchemaField.throwFieldMinLengthError` static
- Makes method `SchemaField.throwFieldMinValueError` static
- Makes method `SchemaField.throwFieldMinWordsError` static
- Makes method `SchemaField.throwFieldMissingError` static
- Makes method `SchemaField.throwFieldNullError` static
- Makes method `SchemaField.throwFieldRegExError` static
- Makes method `SchemaField.throwFieldTypeError` static
- Makes method `SchemaField.throwFieldValueTypesError` static

## v1.0.0
- Exports `Schema` using ES6 default export
- Exports `SchemaError` using ES6 default export
- Exports `SchemaField` using ES6 default export

## v0.5.1
- Makes option `type: *` optional for `SchemaField` constructor

## v0.5.0
- Adds method `SchemaField.getPrepareFunction()`
- Adds option `prepare: Function` for `SchemaField` constructor

## v0.4.2
- Adds method `SchemaField.getName()`
- Adds method `SchemaField.throwFieldNullError()`
- Uses return value of `SchemaField.validate()` to modify field value
- Uses empty array `[]` as default value for `Array` fields defined as required and non-null
- Throws missing field error only when a required field is `undefined` (does not depend on `nullable` option anymore)

## v0.4.1
- Fixes main file exports
- Fixes documentation for importing classes and methods

## v0.4.0
- Explodes classes in multiple files (see doc to import classes and methods)
- Adds method `Schema.removeUnknownFields(obj)`
- Adds method `SchemaField.getAllowedValues()`
- Adds method `SchemaField.getCheckFunction()`
- Adds method `SchemaField.getCleanFunction()`
- Adds method `SchemaField.getDefaultValue()`
- Adds method `SchemaField.getDeniedValues()`
- Adds method `SchemaField.getLabel()`
- Adds method `SchemaField.getLength()`
- Adds method `SchemaField.getMaxValue()`
- Adds method `SchemaField.getMaxWords()`
- Adds method `SchemaField.getMinValue()`
- Adds method `SchemaField.getMinWords()`
- Adds method `SchemaField.getProperties()`
- Adds method `SchemaField.getRegEx()`
- Adds method `SchemaField.getType()`
- Adds method `SchemaField.isDecimal()`
- Adds method `SchemaField.isNullable()`
- Adds method `SchemaField.isRequired()`
- Adds field option `defaultValue` to set default value, works only if field is required but has its value `undefined`
- Renames method `SchemaField.dynamicValue()` to `SchemaField.computeValue()`
- The method `SchemaField.validate()` now returns the processed value (ex: default value or cleaned value)
- Updates documentation

## v0.3.4
- Updates documentation

## v0.3.3
- Fixes console warning `Unknown property "field.name"` when assigning a name to a field

## v0.3.2
- Allows to use function for `decimal`, `label`, `nullable` and `required` constructor options in
 `SchemaField`
- Changes error messages

## v0.3.1
- Adds value as first argument of `check(value)` field property

## v0.3.0
- Fixes options `nullable` and `required` in `SchemaField` constructor

## v0.2.9
- Adds class `SchemaField`
- Adds method `Schema.addField(name, props)`
- Adds method `Schema.clone()`
- Adds method `Schema.update(fields)`
- Moves `Schema.cleanField()` to  `SchemaField.clean()`
- Moves `Schema.dynamicValue()` to  `SchemaField.dynamicValue()`
- Moves `Schema.validateField()` to  `SchemaField.validate()`

## v0.2.8
- Adds `resolveField(name)` method

## v0.2.7
- Adds `getField(name)` method
- Uses field name as first parameter of `validateField(name, value)` method instead of field properties

## v0.2.6
- Removes warning `Unknown property "${field}.label"`

## v0.2.5
- Changes `schema.extend(fields)` signature, uses fields instead of parent schema

## v0.2.4
- Adds `schema.extend(fields)` to create a schema based on an existing one
- Adds `schema.getFields()` to return schema fields
- Adds `schema.isValid(obj, options)` to validate an object without throwing an error
- Adds `nullable` field option to allow a field to be `null`
- Adds `ignoreMissing` option to `Schema.validate()` to ignore missing fields (useful for updates)

## v0.2.1
- First public release
