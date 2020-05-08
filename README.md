# @jalik/schema

![GitHub package.json version](https://img.shields.io/github/package-json/v/jalik/js-schema.svg)
[![Build Status](https://travis-ci.com/jalik/js-schema.svg?branch=master)](https://travis-ci.com/jalik/js-schema)
![GitHub](https://img.shields.io/github/license/jalik/js-schema.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/jalik/js-schema.svg)
[![GitHub issues](https://img.shields.io/github/issues/jalik/js-schema.svg)](https://github.com/jalik/js-schema/issues)
![npm](https://img.shields.io/npm/dt/@jalik/schema.svg)

This lib allows you to easily validate complex (nested) objects using schemas.
You can even create forms or UI components by using a schema, or schema fields.

## Introduction

A schema is a definition of all characteristics of an object.
For example, a person has a name, age, gender and so on...
some information are required while others are optional.
Schemas are a powerful way to describe structures of data and define constraints to validate objects.

It can be used for:
- validate data
- parse data
- clean data

## Creating a schema

Let's start with the following schema that describes a person.

```js
import Schema from '@jalik/schema';

const PersonSchema = new Schema({
  name: {
    type: 'string',
    required: true,
    maxLength: 50
  },
  age: {
    type: 'number',
    min: 1,
    max: 100
  },
  gender: {
    type: 'string',
    allowed: ['male', 'female'],
  },
  hobbies: {
    type: ['string'],
    allowed: ['coding', 'playing', 'trolling']
  }
});

export default PersonSchema;
```

## Extending a schema (inheritance)

The extend operation allows you to build schema on top of another.
Let's reuse the `PersonSchema` and create a `ParentSchema`.

```js
import PersonSchema from './PersonSchema';

const ParentSchema = PersonSchema.extend({
  // This fields is an array of persons.
  children: {
    type: [PersonSchema]
  },
  wifeOrHusband: {
    type: PersonSchema
  }
});

export default ParentSchema;
```

## Cloning a schema

The basic cloning method that returns a clone of the schema (just in case).

```js
import Schema from '@jalik/schema';

const ProductSchema = new Schema({
  name: {
    type: 'string',
    required: true
  },
  price: {
    type: 'number',
    min: 0.0,
    required: true
  }
});

export default ProductSchema;

export const ASchema = ProductSchema.clone();
export const BSchema = ProductSchema.clone();
export const CSchema = ProductSchema.clone();
```

## Updating a schema

You may want to update a schema programmatically, so here is how to do it. The update works like `extend()`, but operates on the schema directly instead of creating a new one.

```js
import PersonSchema from './PersonSchema';

// This only changes specified fields
// and creates new one.
PersonSchema.update({
  // Add or update this field
  nickName: {
    type: 'string',
    required: false
  }
});
```

## Validating data using a schema

Ok, here is the most important part, the validation.
You have defined your schemas and now you want to check data, let see how to do that.
The following code shows how to validate a user structure, note how it's easy to do a validation in cascade just by passing a schema in the type of a field (phones, address and friends).

```js
import Schema from '@jalik/schema';

const AddressSchema = new Schema({
  city: {
    type: 'string',
    maxLength: 100,
    required: true
  },
  country: {
    type: 'string',
    allowed: ['PF', 'FR', 'US', 'CA'],
    required: true
  }
});

const PhoneSchema = new Schema({
  number: {
    type: 'string',
    required: true,
    regEx: /^\+[0-9.]+$/
  },
  type: {
    type: 'string',
    allowed: ['mobile', 'home', 'business']
  }
});

const UserSchema = new Schema({
  name: {
    type: 'string',
    maxLength: 50,
    required: true,
  },
  email: {
    type: 'string',
    maxLength: 255,
    // Don't use this regexp, it's just for the example.
    regEx: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+/,
    required: true,
  },
  friends: {
    type: [UserSchema],
    required: false,
  },
  phones: {
    type: [PhoneSchema],
    minLength: 1,
    required: false
  },
  address: {
    type: AddressSchema,
    required: true
  }
});

// Define a first user with only the minimum required fields.
const Kevin = {
  name: 'kevin',
  email: 'kevin@something.com',
  address: {
    city: 'Faa\'a',
    country: 'PF'
  },
}

// Then define a second user that links the first one.
const Karl = {
  name: 'karl',
  email: 'jalik@something.com',
  phones:[{
    number: '+689.87.123.456',
    type: 'mobile'
  }],
  address: {
    city: 'Punaauia',
    country: 'PF'
  },
  friends: [Kevin]
}

try {
  // This won't throw any error because data is valid.
  UserSchema.validate(Karl);
}
catch (error) {
  // Error is an instance of SchemaError with an explicit message.
  console.error(error.message);
}
```

## Handling validation errors

Currently, all errors thrown by the validation are instances of `SchemaError` with a `message` attribute in English. This may not be convenient for translation, however you can for now rely on the `reason` attribute of a `SchemaError` to detect the exact error and do whatever you want (like translating).

**( ! ) Consider this as an experimental feature, as it is planned for a next version to return explicit error objects like `FieldMinLengthError` instead of the generic `SchemaError`.**

The following example shows how to return a translated error, however you would adapt this to fit your current i18n library.

```js
// Define translations of error messages.
const errors = {
  en: { 'field-min-length': 'The field {label} must have at least {min} characters.' },
  fr: { 'field-min-length': 'Le champ {label} doit comporter au moins {min} caractères.' }
};

function getSchemaErrorMessage(error, locale) {
  // Get localized message if available.
  const message = typeof errors[locale][error.reason] !== 'undefined'
    ? errors[locale][error.reason]
    : error.message;
  
  // Replace context variables in message.
  Object.entries(error.context).forEach(([k, v]) => {
    message.replace(`{${k}}`, v);
  });
  return message;
}
```

## Checking field's type

Use `type` to check the type of the field value. It can be a basic type (array, boolean, number, object, string), or an advanced type like an instance of `Schema` or an object constructor like `Date`.

- Accepts `"array"`, `"boolean"`, `"integer"`, `"number"`, `"string"`, `Date`, `instance of Schema`
- Throws `FieldTypeError`

```js
import Schema from '@jalik/schema';
import UserSchema from './UserSchema';

const schema = new Schema({
  // The field must be a boolean.
  boolean: {
    type: 'boolean'
  },
  // The field must be an integer.
  integer: {
    type: 'integer'
  },
  // The field must be a number (integer or float).
  number: {
    type: 'number'
  },
  // The field must be a string.
  string: {
    type: 'string'
  },
  // The field must matches UserSchema.
  user: {
    type: UserSchema
  },
  // The field must be an array of any values.
  array: {
    type: 'array'
  },
  // The field must be an array of booleans.
  booleanArray: {
    type: ['boolean']
  },
  // The field must be an array of integers.
  integerArray: {
    type: ['integer']
  },
  // The field must be an array of numbers.
  numberArray: {
    type: ['number']
  },
  // The field must be an array of strings.
  stringArray: {
    type: ['string']
  },
  // The field must be an array of objects matching UserSchema.
  users: {
    type: [UserSchema]
  },
});
```

## Checking length

Use `maxLength` and `minLength` to check the length of a field value.
It works on any object with a `length` attribute (`String`, `Array`...), so if you have objects like `MyList.length`, it will work too.

- Accepts `"number"`, `Function`
- Throws `FieldMaxLengthError`, `FieldMinLengthError`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
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
  }
});

export default schema;
```

## Checking maximum and minimum value

Use `max` and `min` to check if a field value is below or above a limit.

- Accepts `"number"`, `Function`
- Throws `FieldMaxError`, `FieldMinError`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
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

export default schema;
```

## Checking nullable value

Use `nullable` to check if a field value is `null`.

- Accepts `"boolean"`, `Function`
- Throws `FieldNullableError`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The field cannot be null
  notNullable: {
    type: 'string',
    nullable: false
  },
  // The field can be null
  nullable: {
    type: 'string',
    nullable: true
  },
});

export default schema;
```

## Checking words count

Use `maxWords` and `minWords` to limit words count in a string.

- Accepts `"number"`, `Function`
- Throws `FieldMaxWordsError`, `FieldMinWordsError`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
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

export default schema;
```

## Checking required field

Use `required` to check if a field is `undefined`. Be advised that
`required` will not throw an error if the field is `null`, use `nullable` if you want to check for `null` value.

- Accepts `"boolean"`, `Function`
- Throws `FieldRequiredError`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The field is optional.
  optional: {
    type: 'string',
    required: false
  },
  // The field must be present.
  required: {
    type: 'string',
    required: true
  },
});

export default schema;
```

## Checking allowed values

Use `allowed` to check if a field value is allowed.

- Accepts `"boolean"`, `Function`
- Throws `FieldAllowedError`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The string must contain only '0' and '1'.
  binaryString: {
    type: 'string',
    allowed: ['0', '1']
  },
  // The array must contain only 0 and 1 as numbers.
  binaryNumber: {
    type: ['number'],
    allowed: [0, 1]
 },
  // The array must contain only hot colors.
  hotColors: {
    type: ['string'],
    allowed: ['red', 'yellow', 'orange']
 },
});

export default schema;
```

## Checking denied values

Use `denied` to check if a field value is denied.

- Accepts `"boolean"`, `Function`
- Throws `FieldDeniedError`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The array of strings must not contain 'yes' or 'no'.
  message: {
    type: ['string'],
    denied: ['fuck', 'sex', 'slut']
  },
});

export default schema;
```

## Checking with regular expression

Use `regEx` to check if a field value matches a regular expression.

- Accepts `RegEx`, `Function`
- Throws `FieldRegExError`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The time must be like 'HH:mm'.
  time: {
    type: 'string',
    regEx:/^\d{1,2}:\d{1,2}$/
  },
});

export default schema;
```

## Preparing value with custom function

The value(s) of a field can be prepared using a custom function with the following option:
- `prepare: Function`

Note that the `prepare` function is executed before any checks.

```js
import Schema from '@jalik/schema';

const schema = new Schema({
    // Execute the prepare function on field value
    // before clean and check execution.
    // It can be useful in some case
    // where clean cannot be used to do what you want.
    orderedNumbers: {
        type: ['number'],
        prepare: numbers => numbers.sort()
    },
});

export default schema;
```

## Checking with custom function

The value(s) of a field can be checked using a custom function with the following option:
- `check: Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The number must be even.
  evenNumber: {
    type: 'number',
    check: value => value % 2 === 0
  }
});

export default schema;
```

## Cleaning value with custom function

The value(s) of a field can be cleaned using a custom function with the following option:
- `clean: Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // Every items in the list will be trimmed and lowercase.
  list: {
    type: ['string'],
    clean: list => list.map(item => item.trim().toLowerCase())
  },
});

export default schema;
```

## Parsing value with custom function

The value(s) of a field can be parsed using a custom function with the following option:
- `parse: Function`

```js
import Schema from '@jalik/schema';
import moment from 'moment';

const schema = new Schema({
  // The date is formatted to ISO8601 using moment.
  birthday: {
    type: 'string',
    parse: value => moment(value, 'DD-MM-YYYY').format()
  },
});

export default schema;
```

## Setting default value

The default value of a field can be set with the following options:
- `defaultValue: *`

Note that the default value will only be used if the value is `null` or `undefined` and the field is declared as `required: true`.

```js
import Schema from '@jalik/schema';

const schema = new Schema({
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

export default schema;
```

## Setting field's label

The label of a field can be set with the following option:
- `label: 'string'|Function`

Note that the label could be used in errors, and if the label is not set, the field's name is used instead.

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  birthday: {
    type: Date,
    label: 'Date of Birth'
  },
});

export default schema;
```

## Dynamic field properties

Almost all properties (excepted `type`) accept a function instead of the usual value, it is useful to return a constraint based on some conditions when the field is actually validated.
The given function is called with a single argument representing the current context (data) being validated by the schema.

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
