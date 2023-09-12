# Changelog

## v4.0.4 (2023-09-11)

- Fixed "required field" error on nested attributes of an optional object when using option `removeUnknown: true`
- Upgraded dependencies

## v4.0.3 (2023-09-11)

- Throw `FieldResolutionError` when path is not valid

## v4.0.2 (2023-05-18)

- Added `FieldError` to exports

## v4.0.1 (2023-05-01)

- Upgraded dependencies

## v4.0.0 (2023-04-17)

- **[BREAKING]** Removed `Schema` from default package export (still available with `import { Schema } from '@jalik/schema'`)
- **[BREAKING]** Removed `defaultValue` option from `SchemaField` definition
- **[BREAKING]** Removed `nullable` option from `SchemaField` definition
- **[BREAKING]** Renamed `setLocale()` to `setLocaleMessages()`
- **[BREAKING]** From now, setting `required: true` on a field will throw an error with `null` values

## v3.1.0

- Added `isValid()` to `Schema` instance
- Added `isValid()` to `SchemaField` instance
- Allow passing context to field properties functions (ex: `field.isRequired(context)`)

## v3.0.10

- Upgraded dependencies

## v3.0.9

- Upgraded dependencies

## v3.0.8

- Added exports of error constants and locale functions in index.js
- Added locale "en" as a file to not rely on defaults ("en" still remains the default locale)
- Changed the default error messages to not contain the field name
- Fixed potential breaking "export from" syntax in main file (index.js)
- Upgraded dependencies

## v3.0.7

- Fixed imports in README.md

## v3.0.6

- Upgraded dependencies

## v3.0.5

- Fixed options passed to `Schema.getErrors()` being ignored

## v3.0.4

- Fixed checking of "date-time" format
- Fixed removing of unknown fields in nested array items when passing `removeUnknown: true`
  to `Schema.validate()`

## v3.0.3

- Fixed missing check of optional second fraction in `date-time` and `time` format
- Added alias `date-time` for `datetime` format like in JSON Schema specification

## v3.0.2

- Upgraded dependencies

## v3.0.1

- Upgraded dependencies

## v3.0.0

- [BREAK] Method `getErrors()` of `Schema` returns `null` instead of `{}` if no errors
- Added method `without(fieldNames)` to `Schema`
- Upgraded dependencies

## v2.0.2

- Upgraded dependencies

## v2.0.1

- Fixed missing french message for ERROR_FIELD_FORMAT
- Upgraded dependencies

## v2.0.0

**DELETIONS**

- [BREAK] Exports named function `contains()` in utils.js
- [BREAK] Moves function `computeValue()` to utils.js
- [BREAK] Removed attribute `context` on fields errors
- [BREAK] Removed error reason `field-instance`
- [BREAK] Removed method `isValid()` from `Schema`
- [BREAK] Removed method `update()` in `Schema`
- [BREAK] Removed method `addField()` in `Schema`
- [BREAK] Removed method `getCheckFunction()` from `SchemaField`
- [BREAK] Removed method `getCleanFunction()` from `SchemaField`
- [BREAK] Removed method `getParseFunction()` from `SchemaField`
- [BREAK] Removed method `getPrepareFunction()` from `SchemaField`
- [BREAK] Removed option `decimal` in `SchemaField`
- [BREAK] Removed regexp `AlphaRegex` in regex.js
- [BREAK] Removed regexp `AlphaNumericRegex` in regex.js
- [BREAK] Removed regexp `ExtendedAlphaNumericRegex` in regex.js
- [BREAK] Removed support for syntax `[min, max]` of option `length` in `SchemaField`

**MODIFICATIONS**

- [BREAK] Changed array interpretation for option `type` in `SchemaField`
- [BREAK] Changed default value of option `nullable` to `false` in `SchemaField`
- [BREAK] Changed default value of option `required` to `false` in `SchemaField`
- [BREAK] Changed default value of options `clean` and `parse` to `false` in `Schema.validate()`
  and `SchemaField.validate()`
- [BREAK] Changed parsing of `"boolean"` fields to return `true` only if value is `true` (
  case-insensitive)
- [BREAK] Renamed error reason `field-bad-value` to `field-allowed`
- [BREAK] Renamed error reason `field-max-value` to `field-max`
- [BREAK] Renamed error reason `field-min-value` to `field-min`
- [BREAK] Renamed error reason `field-missing` to `field-required`
- [BREAK] Renamed error reason `field-null` to `field-nullable`
- [BREAK] Renamed error reason `field-regex` to `field-pattern`
- [BREAK] Renamed file `schema.js` to `Schema.js`
- [BREAK] Renamed file `schema-field.js` to `SchemaField.js`
- [BREAK] Renamed method `getAllowedValues()` to `getAllowed()` in `SchemaField`
- [BREAK] Renamed method `getDeniedValues()` to `getDenied()` in `SchemaField`
- [BREAK] Renamed method `getMaxValue()` to `getMax()` in `SchemaField`
- [BREAK] Renamed method `getMinValue()` to `getMin()` in `SchemaField`
- [BREAK] Renamed option `regEx` to `pattern` in `SchemaField`
- [BREAK] Renamed regexp `EmailRegex` to `EmailRegExp` in regex.js
- [BREAK] Renamed regexp `FQDNRegex` to `HostnameRegExp` in regex.js
- [BREAK] Renamed regexp `IPv4Regex` to `IPv4RegExp` in regex.js
- [BREAK] Replaced type option `Array` by `"array"` in `SchemaField`
- [BREAK] Replaced type option `Boolean` by `"boolean"` in `SchemaField`
- [BREAK] Replaced type option `Number` by `"number"` in `SchemaField`
- [BREAK] Replaced type option `String` by `"string"` in `SchemaField`
- [BREAK] Throw `FieldTypeError` instead of `FieldInstanceError`
- [BREAK] Throw `FieldTypeError` instead of `FieldValueTypesError`
- Changed error messages

**FIXES**

- Return the cloned properties with `getProperties()` in `SchemaField`
- Return the cloned object with `clean()` in `Schema`
- Return the cloned object with `parse()` in `Schema`
- Return the cloned object with `removeUnknownFields()` in `Schema`
- Return the cloned object with `validate()` in `Schema`
- Return the parsed value of type `"boolean"`, `"integer"` or `"number"` if `parse` option is
  missing in `SchemaField`
- Throw an error when options `allowed` and `denied` are both defined in `SchemaField`

**ADDITIONS**

- Added attribute `errors` in `ValidationError`
- Added attribute `path` in `FieldError`
- Added errors classes in `errors/*.js` (ex: `errors/FieldRequiredError.js`)
- Added errors constants in `errors.js`
- Added function `getErrorMessage()` in locale.js
- Added function `setLocale()` in locale.js
- Added method `getErrors()` in `Schema`
- Added option `format` with accepted values `date`, `datetime`, `email`, `hostname`, `ipv4`, `ipv6`
  , `time`, `uri` in `SchemaField`
- Added option `items` in `SchemaField` to set constraints of array items
- Added option `rootOnly` in `SchemaField.validate()` to not check nested schemas
- Added regexp `DateRegExp` in regex.js
- Added regexp `DateTimeRegExp` in regex.js
- Added regexp `TimeRegExp` in regex.js
- Added support for dot syntax in field path (ex: `Schema.getField('profile.phones.number')`)
- Added support for `"integer"` with option `type` in `SchemaField`
- Added support for `String` with option `pattern` in `SchemaField`
- Added translation for french in `locales/fr.js`

**UPDATES**

- Upgraded dependencies

## v1.3.5

- Upgraded dependencies

## v1.3.4

- Upgraded dependencies

## v1.3.3

- Upgraded dependencies

## v1.3.1

- Upgraded dependencies

## v1.3.0

- Lib available in ES6+ syntax (see `src` folder) to enable auto-completion in IDEs
- Upgraded dependencies

## v1.2.2

- Upgraded dependencies

## v1.2.1

- Fixed error thrown for `maxLength` constraint

## v1.2.0

- Added method `SchemaField.getMaxLength()`
- Added method `SchemaField.getMinLength()`
- Added option `maxLength: Number or Function` to `SchemaField(options)`
- Added option `minLength: Number or Function` to `SchemaField(options)`

## v1.1.3

- Upgraded dependencies

## v1.1.2

- Upgraded dependencies
- Removed unused devDependencies

## v1.1.1

- Upgraded dependencies

## v1.1.0

- Added option `parse: Boolean` to `Schema.validate(Object)`
- Added method `Schema.parse(Object)`
- Added method `SchemaField.getParseFunction()`
- Added method `SchemaField.parse(String)`
- Added option `parse: Function` to `SchemaField` constructor
- Fixed `Schema.removeUnknownFields()` to remove unknown nested fields

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

- Added method `SchemaField.getPrepareFunction()`
- Added option `prepare: Function` for `SchemaField` constructor

## v0.4.2

- Added method `SchemaField.getName()`
- Added method `SchemaField.throwFieldNullError()`
- Uses return value of `SchemaField.validate()` to modify field value
- Uses empty array `[]` as default value for `Array` fields defined as required and non-null
- Throw missing field error only when a required field is `undefined` (does not depend on `nullable`
  option anymore)

## v0.4.1

- Fixed main file exports
- Fixed documentation for importing classes and methods

## v0.4.0

- Explodes classes in multiple files (see doc to import classes and methods)
- Added method `Schema.removeUnknownFields(obj)`
- Added method `SchemaField.getAllowedValues()`
- Added method `SchemaField.getCheckFunction()`
- Added method `SchemaField.getCleanFunction()`
- Added method `SchemaField.getDefaultValue()`
- Added method `SchemaField.getDeniedValues()`
- Added method `SchemaField.getLabel()`
- Added method `SchemaField.getLength()`
- Added method `SchemaField.getMaxValue()`
- Added method `SchemaField.getMaxWords()`
- Added method `SchemaField.getMinValue()`
- Added method `SchemaField.getMinWords()`
- Added method `SchemaField.getProperties()`
- Added method `SchemaField.getRegEx()`
- Added method `SchemaField.getType()`
- Added method `SchemaField.isDecimal()`
- Added method `SchemaField.isNullable()`
- Added method `SchemaField.isRequired()`
- Added field option `defaultValue` to set default value, works only if field is required but has
  its value `undefined`
- Renamed method `SchemaField.dynamicValue()` to `SchemaField.computeValue()`
- The method `SchemaField.validate()` now returns the processed value (ex: default value or cleaned
  value)
- Updates README.md

## v0.3.4

- Updates README.md

## v0.3.3

- Fixed console warning `Unknown property "field.name"` when assigning a name to a field

## v0.3.2

- Allows to use function for `decimal`, `label`, `nullable` and `required` constructor options in
  `SchemaField`
- Changed error messages

## v0.3.1

- Added value as first argument of `check(value)` field property

## v0.3.0

- Fixed options `nullable` and `required` in `SchemaField` constructor

## v0.2.9

- Added class `SchemaField`
- Added method `Schema.addField(name, props)`
- Added method `Schema.clone()`
- Added method `Schema.update(fields)`
- Moves `Schema.cleanField()` to  `SchemaField.clean()`
- Moves `Schema.dynamicValue()` to  `SchemaField.dynamicValue()`
- Moves `Schema.validateField()` to  `SchemaField.validate()`

## v0.2.8

- Added `resolveField(name)` method

## v0.2.7

- Added `getField(name)` method
- Uses field name as first parameter of `validateField(name, value)` method instead of field
  properties

## v0.2.6

- Removed warning `Unknown property "${field}.label"`

## v0.2.5

- Changed `schema.extend(fields)` signature, uses fields instead of parent schema

## v0.2.4

- Added `schema.extend(fields)` to create a schema based on an existing one
- Added `schema.getFields()` to return schema fields
- Added `schema.isValid(obj, options)` to validate an object without throwing an error
- Added `nullable` field option to allow a field to be `null`
- Added `ignoreMissing` option to `Schema.validate()` to ignore missing fields (useful for updates)

## v0.2.1

- First public release
