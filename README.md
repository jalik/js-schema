# @jalik/schema

![GitHub package.json version](https://img.shields.io/github/package-json/v/jalik/js-schema.svg)
[![Build Status](https://travis-ci.com/jalik/js-schema.svg?branch=master)](https://travis-ci.com/jalik/js-schema)
![GitHub](https://img.shields.io/github/license/jalik/js-schema.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/jalik/js-schema.svg)
[![GitHub issues](https://img.shields.io/github/issues/jalik/js-schema.svg)](https://github.com/jalik/js-schema/issues)
![npm](https://img.shields.io/npm/dt/@jalik/schema.svg)

## Introduction

A schema describes all fields of an object, with various constraints.
It can be used to:
- validate an object
- parse an object
- clean an object

## Creating a schema

Let's start with the schema of a person, which could be understood by anyone.

```js
import Schema from '@jalik/schema';

const PersonSchema = new Schema({
  age: {
    type: 'integer',
    required: true,
    min: 1,
  },
  gender: {
    type: 'string',
    required: true,
    allowed: ['male', 'female'],
  },
  hobbies: {
    type: 'array',
    allowed: ['coding', 'playing', 'sleeping'],
  },
  name: {
    type: 'string',
    required: true,
    maxLength: 50,
  },
});

export default PersonSchema;
```

## Extending a schema (inheritance)

If we want to create a new schema based on another, we can extend the base schema.

```js
import PersonSchema from './PersonSchema';

const ParentSchema = PersonSchema.extend({
  children: {
    type: 'array',
    items: { type: PersonSchema }
  },
  married: {
    type: 'boolean',
    required: true,
    nullable: true,
  },
  spouse: {
    type: PersonSchema
  }
});

export default ParentSchema;
```

## Cloning a schema

```js
import Schema from '@jalik/schema';

const ProductSchema = new Schema({
  name: {
    type: 'string',
    required: true
  },
  price: {
    type: 'number',
    required: true,
    min: 0,
  }
});

export default ProductSchema;

export const ASchema = ProductSchema.clone();
export const BSchema = ProductSchema.clone();
export const CSchema = ProductSchema.clone();
```

## Validating objects

You want to validate an object with a schema, for sure! This is why you're here.

```js
import Schema from '@jalik/schema';

const PhoneSchema = new Schema({
  code: {
    type: 'string',
    required: true,
  },
  number: {
    type: 'string',
    required: true,
  }
});

const UserSchema = new Schema({
  age: {
    type: 'integer',
    required: true,
    min: 18,
  },
  gender: {
    type: 'string',
    required: true,
    allowed: ['male', 'female'],
  },
  name: {
    type: 'string',
    required: true,
    maxLength: 50,
  },
  phone: {
    type: PhoneSchema
  }
});

// A valid object
const validUser = {
  age: 33,
  gender: 'male',
  name: 'me',
};

// An invalid object
const invalidUser = {
  age: 16,
  gender: null,
  phone: { code: 777, number: 10101001 }
};

try {
  // This will not throw an error.
  UserSchema.validate(validUser);

  // This will throw a ValidationError.
  UserSchema.validate(invalidUser);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.errors);
  }
}
```

The `ValidationError` object looks like this:

```json
{
  "reason": "object-invalid",
  "message": "Object is not valid",
  "errors": {
    "age": "\"age\" must be greater than or equal to 16",
    "gender": "\"gender\" cannot be null",
    "name": "\"name\" is required",
    "phone.code": "\"code\" is not of type \"string\"",
    "phone.number": "\"number\" is not of type \"string\""
  }
}
```

Note that you can get errors without having to "try/catch", by using the `getErrors()` method.

**If there are no errors, it will return `null`;**

```js
const errors = UserSchema.getErrors({
  age: 16,
  gender: null,
  phone: { code: 777, number: 10101001 }
});
```

## Handling errors

If the schema fails to validate an object, it will throw a specific error (ex: `FieldLengthError`, `FieldTypeError`, `FieldRequiredError`...), which is helpful to handle errors display.

For example, a `FieldRequiredError` looks like this:

```json
{
  "reason": "field-required",
  "message": "\"Phone Number\" is required",
  "field": "Phone Number",
  "path": "phones[0].number"
}
```

If you need to detect the type of the error, it is recommended to check the `reason` attribute of the error against a constant, instead of comparing class instance.

Here is the list of all errors types constants:

```js
import {
  ERROR_FIELD_ALLOWED,
  ERROR_FIELD_DENIED,
  ERROR_FIELD_FORMAT,
  ERROR_FIELD_INVALID,
  ERROR_FIELD_LENGTH,
  ERROR_FIELD_MAX,
  ERROR_FIELD_MAX_LENGTH,
  ERROR_FIELD_MAX_WORDS,
  ERROR_FIELD_MIN,
  ERROR_FIELD_MIN_LENGTH,
  ERROR_FIELD_MIN_WORDS,
  ERROR_FIELD_NULLABLE,
  ERROR_FIELD_PATTERN,
  ERROR_FIELD_REQUIRED,
  ERROR_FIELD_TYPE,
  ERROR_FIELD_UNKNOWN,
} from '@jalik/schema/errors';
```

## Translating errors

The following example shows how to return a translated error, however you would adapt this to fit your current i18n library.

```js
import { getErrorMessage, setLocale } from '@jalik/schema/dist/locale';
import { ERROR_FIELD_MIN_LENGTH } from '@jalik/schema/errors'

// Define french translations of error messages.
setLocale('fr', {
  [ERROR_FIELD_MIN_LENGTH] : 'Le champ {field} doit comporter au moins {minLength} caractères.'
  // other translations...
});

// Get translated message from an FieldError.
const message = getErrorMessage(fieldRequiredError, 'fr');
// will return "Le champ xxx doit comporter au moins nnn caractères."
```

The errors are in english by default, so you don't have to set the english locale, only if you want to replace default error messages.

The **french** locale is available.

```js
import { setLocale } from '@jalik/schema/dist/locale';
import fr from '@jalik/schema/dist/locales/fr'

setLocale('fr', fr);
```

**Contributions to translations are welcome.**

## Checking the type

Use `type` to check the type of the field value. It can be a basic type (array, boolean, number, object, string), or an advanced type like an instance of `Schema` or an object constructor like `Date`.

- Accepts `"array"`, `"boolean"`, `"integer"`, `"number"`, `"object"`, `"string"`, `Date`, or a `Schema`
- Throws `FieldTypeError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // The field must be an array of any values.
  array: { type: 'array' },
  // The field must be a boolean.
  boolean: { type: 'boolean' },
  // The field must be an integer.
  integer: { type: 'integer' },
  // The field must be a number (integer or float).
  number: { type: 'number' },
  // The field must be an object.
  object: { type: 'object' },
  // The field must be a string.
  string: { type: 'string' },
  // The field must matches UserSchema.
  example: { type: ExampleSchema },
  // The field must be an array of objects matching UserSchema.
  examples: { type: 'array', items: { type: ExampleSchema} },
  // The field must be an array of arrays.
  arrayArray: { type: 'array', items: { type: 'array' } },
  // The field must be an array of booleans.
  booleanArray: { type: 'array', items: { type: 'boolean' } },
  // The field must be an array of integers.
  integerArray: { type: 'array', items: { type: 'integer' } },
  // The field must be an array of numbers.
  numberArray: { type: 'array', items: { type: 'number' } },
  // The field must be an array of objects.
  objectArray: { type: 'array', items: { type: 'object' } },
  // The field must be an array of strings.
  stringArray: { type: 'array', items: { type: 'string' } },
});
```

## Checking required values

Use `required` to check if a field is `undefined`. Be advised that
`required` will not throw an error if the field is `null`, use `nullable` if you want to check for `null` value.

- Accepts `Boolean` or `Function`
- Throws `FieldRequiredError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // The field is optional.
  optional: {
    required: false
  },
  // The field must not be undefined.
  required: {
    required: true
  },
});
```

## Checking nullable values

Use `nullable` to check if a field value is `null`.

- Accepts `Boolean` or `Function`
- Throws `FieldNullableError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // The field must be set with anything than null
  notNullable: {
    required: true,
    nullable: false,
  },
  // The field can be null or undefined
  nullable: {
    nullable: true
  },
});
```

## Checking the maximum and minimum values

Use `max` and `min` to check if a field value is below or above a limit.

- Accepts `Number` or `Function`
- Throws `FieldMaxError`, `FieldMinError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // The date must be between the previous hour and the next hour.
  date: {
    type: Date,
    min: () => new Date(Date.now() - 3600 * 1000),
    max: () => new Date(Date.now() + 3600 * 1000)
  },
  // The number must be negative.
  negativeNumber: {
    type: 'number',
    max: -1
  },
  // The number must be positive.
  positiveNumber: {
    type: 'number',
    min: 0
  }
});
```

## Checking the length

Use `maxLength` and `minLength` to check the length of a field value.
It works on any object with a `length` attribute (`String`, `Array`...), so if you have objects like `MyList.length`, it will work too.

- Accepts `Number` or `Function`
- Throws `FieldMaxLengthError`, `FieldMinLengthError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // The array must have exactly two values.
  arrayLength: {
    type: 'array',
    length: 2
  },
  // The string must have exactly ten characters.
  fixedLength: {
    type: 'string',
    length: 10
  },
  // The string must have at least three characters.
  minLength: {
    type: 'string',
    minLength: 3
  },
  // The array must have ten values or less.
  maxLength: {
    type: 'string',
    maxLength: 10
  },
  // The string must have between five and ten characters (inclusive).
  minMaxLength: {
    type: 'string',
    minLength: 5,
    maxLength: 10
  },
  // It also works with objects having a length attribute.
  objectWithLength: {
    type: 'object',
    minLength: 1,
    maxLength: 1
  }
});
```

## Checking the number of words

Use `maxWords` and `minWords` to limit words count in a string.

- Accepts `Number` or `Function`
- Throws `FieldMaxWordsError`, `FieldMinWordsError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // The summary must not have more than 50 words.
  summary: {
    type: 'string',
    maxWords: 50
  },
  // The description must have at least ten words.
  description: {
    type: 'string',
    minWords: 10
  },
});
```

## Checking allowed values

Use `allowed` to check if a field value is allowed.

- Accepts `Boolean` or `Function`
- Throws `FieldAllowedError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // The string must be 'yes' or 'no'.
  answer: {
    type: 'string',
    allowed: ['yes', 'no']
  },
  // The array must contain only 0 and 1 as numbers.
  binaryNumbers: {
    type: 'array',
    items: { type: 'number' },
    allowed: [0, 1]
 },
  // The array must contain only hot colors.
  hotColors: {
    type: 'array',
    items: { type: 'string' },
    allowed: ['red', 'yellow', 'orange']
 },
});
```

## Checking denied values

Use `denied` to check if a field value is denied.

- Accepts `Boolean` or `Function`
- Throws `FieldDeniedError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  message: {
    type: 'string',
    denied: ['duck', 'six', 'slot']
  },
});
```

## Checking using a pattern (regular expression)

Use `pattern` to check if a field value matches a regular expression.

- Accepts `RegExp`, `String` or `Function`
- Throws `FieldPatternError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  time: {
    type: 'string',
    // The time must be like 'HH:mm'
    pattern: '^\\d{1,2}:\\d{1,2}$'
  },
  password: {
    type: 'string',
    // The password must contain alphanumeric and special characters
    pattern: /^[a-zA-Z0-9_&#@$*%?!]+$/
  }
});
```

## Checking a format (based on regular expression)

Use `format` to check if a field value matches a specific known format.

- Accepts `String` or `Function`
- Throws `FieldFormatError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  date: {
    type: 'string',
    format: 'date'
  },
  datetime: {
    type: 'string',
    format: 'date-time'
  },
  email: {
    type: 'string',
    format: 'email'
  },
  hostname: {
    type: 'string',
    format: 'hostname'
  },
  ipv4: {
    type: 'string',
    format: 'ipv4'
  },
  ipv6: {
    type: 'string',
    format: 'ipv6'
  },
  time: {
    type: 'string',
    format: 'time'
  },
  uri: {
    type: 'string',
    format: 'uri'
  },
});
```

## Checking using a function

Use `check` to apply custom checks that are not possible with the schema.

- Accepts `Function`
- Throws `FieldError`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  evenNumber: {
    type: 'number',
    // The number must be even.
    check: (value) => value % 2 === 0
  }
});
```

## Parsing values

Use `parse` to parse string values before validation.

- Accepts `Function`

```js
import Schema from '@jalik/schema';
import moment from 'moment';

export const ExampleSchema = new Schema({
  // The date is formatted to ISO8601 using moment.
  birthday: {
    type: 'string',
    parse: (value) => moment(value, 'DD-MM-YYYY').format()
  },
});
```

## Preparing values

Use `prepare` to perform some operations before validation.

- Accepts `Function`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // Execute the prepare function on field value
  // before clean and check execution.
  // It can be useful in some case
  // where clean cannot be used to do what you want.
  numbers: {
    type: 'array',
    items: { type: 'number' },
    prepare: (numbers) => numbers.sort()
  },
});

const result = ExampleSchema.prepare({ numbers: [5,9,0,3,2,7] })
```

So `result` will be:

```json
{ "numbers": [0,2,3,5,7,9] }
```

## Cleaning values

Use `clean` to perform some cleaning on a value.

- Accepts `Function`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // Every items in the list will be trimmed and lowercase.
  list: {
    type: 'array',
    items: { type: 'string' },
    clean: (list) => list.map((item) => item.trim().toLowerCase())
  },
});
```

## Setting default value

Use `defaultValue` to set the default value of a field. It will only be used if the value is `null` or `undefined` and the field required.

- Accepts `Boolean`, `Number`, `String` or `Function`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  // The default value will be the current date at the execution time.
  createdAt: {
    type: Date,
    defaultValue: () => new Date()  
  },
  // The default priority is zero.
  priority: {
    type: 'number',
    defaultValue: 0
  }
});
```

## Setting field's label

Use `label` to set field's label. Note that the label will be used in errors, if the label is not set, the field's name will be used instead.

- Accepts `String` or `Function`

```js
import Schema from '@jalik/schema';

export const ExampleSchema = new Schema({
  birthday: {
    type: Date,
    label: 'Date of Birth'
  },
});
```

## Dynamic field properties

Almost all field properties accept a function, it is useful to return a constraint based on some conditions. The function is called with a single argument representing the current context (data) being validated by the schema.

```js
import Schema from '@jalik/schema';

const isPublishing = function(context) {
    // context refers to the data being validated
    return context.status === 'published';
};

const PostSchema = new Schema({
  title: {
    type: 'string',
    nullable: false,
    required: isPublishing
  },
  text: {
    type: 'string',
    nullable: false,
    required: isPublishing
  },
  status: {
    type: 'string',
    required: true,
    allowed: ['published', 'draft']
  }
});

// So this is valid
PostSchema.validate({
  title: 'Hello World',
  text: 'This is a hello world post !',
  status: 'published'
});

// And this is valid too..
PostSchema.validate({
  status: 'draft'
});

// But this is not valid !
PostSchema.validate({
  title: 'Hello World',
  text: null,
  status: 'published'
});
```

## Changelog

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R7XM4Q3TNE47L)
