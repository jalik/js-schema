# Changelog

## v2.0.0

**DELETIONS**
- [BREAK] Exports named function `contains()` in utils.js
- [BREAK] Moves function `computeValue()` to utils.js
- [BREAK] Removes attribute `context` on fields errors
- [BREAK] Removes error reason `field-instance`
- [BREAK] Removes method `isValid()` from `Schema`
- [BREAK] Removes method `update()` in `Schema`
- [BREAK] Removes method `addField()` in `Schema`
- [BREAK] Removes method `getCheckFunction()` from `SchemaField`
- [BREAK] Removes method `getCleanFunction()` from `SchemaField`
- [BREAK] Removes method `getParseFunction()` from `SchemaField`
- [BREAK] Removes method `getPrepareFunction()` from `SchemaField`
- [BREAK] Removes option `decimal` in `SchemaField`
- [BREAK] Removes regexp `AlphaRegex` in regex.js
- [BREAK] Removes regexp `AlphaNumericRegex` in regex.js
- [BREAK] Removes regexp `ExtendedAlphaNumericRegex` in regex.js
- [BREAK] Removes support for syntax `[min, max]` of option `length` in `SchemaField`

**MODIFICATIONS**
- [BREAK] Changes default value of option `nullable` to `false` in `SchemaField`
- [BREAK] Changes default value of option `required` to `false` in `SchemaField`
- [BREAK] Changes default value of options `clean` and `parse` to `false` in `Schema.validate()` and `SchemaField.validate()`
- [BREAK] Changes parsing of `"boolean"` fields to return `true` only if value is `true` (case-insensitive)
- [BREAK] Renames error reason `field-bad-value` to `field-allowed`
- [BREAK] Renames error reason `field-max-value` to `field-max`
- [BREAK] Renames error reason `field-min-value` to `field-min`
- [BREAK] Renames error reason `field-missing` to `field-required`
- [BREAK] Renames error reason `field-null` to `field-nullable`
- [BREAK] Renames error reason `field-regex` to `field-pattern`
- [BREAK] Renames file `schema.js` to `Schema.js`
- [BREAK] Renames file `schema-field.js` to `SchemaField.js`
- [BREAK] Renames method `getAllowedValues()` to `getAllowed()` in `SchemaField`
- [BREAK] Renames method `getDeniedValues()` to `getDenied()` in `SchemaField`
- [BREAK] Renames method `getMaxValue()` to `getMax()` in `SchemaField`
- [BREAK] Renames method `getMinValue()` to `getMin()` in `SchemaField`
- [BREAK] Renames option `regEx` to `pattern` in `SchemaField`
- [BREAK] Renames regexp `EmailRegex` to `EmailRegExp` in regex.js
- [BREAK] Renames regexp `FQDNRegex` to `HostnameRegExp` in regex.js
- [BREAK] Renames regexp `IPv4Regex` to `IPv4RegExp` in regex.js
- [BREAK] Replaces type option `Array` by `"array"` in `SchemaField`
- [BREAK] Replaces type option `Boolean` by `"boolean"` in `SchemaField`
- [BREAK] Replaces type option `Number` by `"number"` in `SchemaField`
- [BREAK] Replaces type option `String` by `"string"` in `SchemaField`
- [BREAK] Throws `FieldTypeError` instead of `FieldInstanceError`
- [BREAK] Throws `FieldTypeError` instead of `FieldValueTypesError`
- Changes error messages

**FIXES**
- Returns the cloned properties with `getProperties()` in `SchemaField`
- Returns the cloned object with `clean()` in `Schema`
- Returns the cloned object with `parse()` in `Schema`
- Returns the cloned object with `removeUnknownFields()` in `Schema`
- Returns the cloned object with `validate()` in `Schema`
- Returns the parsed value of type `"boolean"`, `"integer"` or `"number"` if `parse` option is missing in `SchemaField`
- Throws an error when options `allowed` and `denied` are both defined in `SchemaField`

**ADDITIONS**
- Adds attribute `errors` in `ValidationError`
- Adds attribute `path` in `FieldError`
- Adds errors classes in `errors/*.js` (ex: `errors/FieldRequiredError.js`)
- Adds errors constants in `errors.js`
- Adds function `getErrorMessage()` in locale.js
- Adds function `setLocale()` in locale.js
- Adds method `getErrors()` in `Schema`
- Adds option `rootOnly` in `SchemaField.validate()` to not check nested schemas
- Adds regexp `DateRegExp` in regex.js
- Adds regexp `DateTimeRegExp` in regex.js
- Adds regexp `TimeRegExp` in regex.js
- Adds support for dot syntax in field path (ex: `Schema.getField('profile.phones.number')`)
- Adds support for `"integer"` with option `type` in `SchemaField`
- Adds support for `String` with option `pattern` in `SchemaField`
- Adds translation for french in `locales/fr.js`

**UPDATES**
- Update dependencies

## v1.3.5

- Updates dependencies

## v1.3.4

- Updates dependencies

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
