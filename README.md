# @jalik/schema

This package allows you to validate complex objects using schemas.

## Introduction

A schema is a definition of all characteristics of an object.
For example, a person has a first name, age, gender and so on...
some information are required while others are optional.
With a schema you can tell how your object must be defined.
And when your schema is created you can then validate any data against it
to check if the data is valid or not.

**This library is well tested with more than 120 unit tests.**

## Schema field properties

A schema is defined using fields and attributes,
it's similar to a `CREATE TABLE (...)` in SQL.
So you define all fields, with their constraints.

Below is an example of use of all available attributes,
to show what can be achieved in terms of constraints.

```js
import moment from 'moment';
import Schema from '@jalik/schema';

const ExampleSchema = new Schema({    
    // CHECK FUNCTION
    // accept a function that is called after all native validations
    check: {
        type: Number,
        // cehck that number is even
        check(value) { return value % 2 === 0; }
    },
    
    // CLEAN FUNCTION
    // accept a function that is called on each 
    clean: {
        type: String,
        clean(value) {
            return value.trim().toLowerCase();
        }
    },

    // PARSE FUNCTION
    date: {
      type: Date,
      parse(value) {
        // Returns a Date using moment to parse the string
        return moment(value, 'YYYY-MM-DD').toDate();
      }
    },

    // PREPARE FUNCTION
    // execute the prepare function on field value
    // before clean and check execution.
    // It can be useful in some case
    // where clean cannot be used to do what you want.
    orderedNumbers: {
        type: [Number],
        prepare(numbers) {
            // sort numbers
            return numbers.sort();
        }
    },
});
```

## Checking allowed values

The value(s) of a field can be checked against a whitelist with the following option:
- `allowed: Boolean or Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The string must contain only '0' and '1'.
  binaryString: {
    type: String,
    allowed: ['0', '1']
  },
  // The array must contain only 0 and 1 as numbers.
  binaryNumber: {
    type: [Number],
    allowed: [0, 1]
 },
  // The array must contain only hot colors.
  hotColors: {
    type: [String],
    allowed: ['red', 'yellow', 'orange']
 },
});
```

## Checking denied values

The value(s) of a field can be checked against a blacklist with the following option:
- `denied: Boolean or Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The array of strings must not contain 'yes' or 'no'.
  message: {
    type: [String],
    denied: ['yes', 'no']
  },
});
```

## Checking field's type

The type of a field can be checked with the following option:
- `type: Array or Boolean or Number or String or Schema`

```js
import Schema from '@jalik/schema';
import UserSchema from './UserSchema';

const schema = new Schema({
  // The field must be a boolean.
  checked: {
    type: Boolean
  },
  // The field must be a number.
  number: {
    type: Number
  },
  // The field must be a string.
  string: {
    type: String
  },
  // The field must be an array of any values.
  array: {
    type: Array
  },
  // The field must be an array of booleans.
  booleanArray: {
    type: [Boolean]
  },
  // The field must be an array of numbers.
  numberArray: {
    type: [Number]
  },
  // The field must be an array of strings.
  stringArray: {
    type: [String]
  },
  // The field must match user's schema.
  user: UserSchema
});
```

## Checking floating/integer number

The type of a number can be checked with the following option:
- `decimal: Boolean or Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The field must be a float.
  float: {
    type: Number,
    decimal: true
  },
  // The field must be an integer.
  integer: {
    type: Number,
    decimal: false
  },
});
```

## Checking length

The length of a field can be checked with the following options:
- `length: Number or Function`
- `minLength: Number or Function`
- `maxLength: Number or Function`

This works on any object with a `length` attribute (`String`, `Array`...), so if you have objects like `MyList.length`, it will work too.

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The array must have exactly two values.
  arrayLength: {
    type: Array,
    length: 2
  },
  // The string must have exactly ten characters.
  fixedLength: {
    type: String,
    length: 10
  },
  // The string must have at least three characters.
  minLength: {
    type: String,
    minLength: 3
  },
  // The array must have ten values or less.
  maxLength: {
    type: String,
    maxLength: 10
  },
  // The string must have between five and ten characters (inclusive).
  minMaxLength: {
    type: String,
    minLength: 5,
    maxLength: 10
  }
});
```

## Checking maximum and minimum value

The maximum/minimum value of an object can be checked with the following options:
- `max: Number or Function`
- `min: Number or Function`

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
    type: Number,
    max: -1
  },
  // The number must be positive.
  positiveNumber: {
    type: Number,
    min: 0
  }
});
```

## Checking nullable value

The `null` value of a field can be checked with the following options:
- `nullable: Boolean or Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The field cannot be null
  notNullable: {
    type: String,
    nullable: false
  },
  // The field can be null
  nullable: {
    type: String,
    nullable: true
  },
});
```

## Checking words count

The number of words in a `String` can be checked with the following options:
- `maxWords: Number or Function`
- `minWords: Number or Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The summary must not have more than 50 words.
  summary: {
    type: String,
    maxWords: 50
  },
  // The description must have at least ten words.
  description: {
    type: String,
    minWords: 10
  },
});
```

## Checking required field

The presence of a field can be checked with the following option:
- `required: Boolean or Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The field is optional.
  optional: {
    type: String,
    required: false
  },
  // The field must be present.
  required: {
    type: String,
    required: true
  },
});
```

## Checking with regular expression

The value of a `String` can be tested against a regular expression with the following option:
- `regEx: RegExp or Function`

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  // The time must be like 'HH:mm'.
  time: {
    type: String,
    regEx:/^\d{1,2}:\d{1,2}$/
  },
});
```

## Defining the default value

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
    type: Number,
    defaultValue: 0
  }
});
```

## Defining the label of a field

The label of a field can be set with the following option:
- `label: String or Function`

Note that the label could be used in errors, and if the label is not set, the field's name is used instead.

```js
import Schema from '@jalik/schema';

const schema = new Schema({
  birthday: {
    type: Date,
    label: 'Date of Birth'
  },
});
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
        type: String,
        nullable: false,
        required: isPublishing
    },
    text: {
        type: String,
        nullable: false,
        required: isPublishing
    },
    status: {
        type: String,
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

## Creating a schema

To create a schema, use the `Schema` class.

```js
import RegEx from '@jalik/schema/dist/regex';
import Schema from '@jalik/schema';

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true,
        length: [3, 30] // min 3, max 30
    },
    presentation: {
        type: String,
        required: false,
        length: [0, 500],
        minWords: 10
    },
    email: {
        type :String,
        regEx: RegEx.Email,
        required: false
    },
    birthday: {
        type: Date,
        required: false,
        nullable: true,
        max() {
            const YEARS_18 = 18*365*24*60*60*1000;
            return new Date(Date.now() - YEARS_18);
        }
    }
});
```

## Extending a schema (inheritance)

The extend operation creates a new schema based on the current one.

```js
import Schema from '@jalik/schema';

const PersonSchema = new Schema({
    age: {type: Number},
    name: {
        type: String,
        required: true
    }
});

const ParentSchema = PersonSchema.extend({
    children: {
        type: [PersonSchema],
        required: true,
        length: [0] // min = 0, no max
    }
});
```

## Cloning a schema

```js
import Schema from '@jalik/schema';

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const ClonedSchema = PersonSchema.clone();
```

## Updating a schema

The update creates fields that do not exist, but only modifies existing properties of fields,
so you can keep properties that have already been defined.

```js
import Schema from '@jalik/schema';

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// This only changes specified fields
// and creates new one.
PersonSchema.update({
    name:{
        required: false
    },
    age:{
        type: Number,
        required: false
    }
});
```

## Validating data using a schema

To validate data using a schema, use the method `schema.validate(obj)`.
If the validation fails, it will throw a `SchemaError` containing information about the error.

```js
import RegEx from '@jalik/schema/dist/regex';
import Schema from '@jalik/schema';

const AddressSchema = new Schema({
    city: {
        type: String,
        required: true,
        length: [1, 30]
    },
    country: {
        type: String,
        required: true,
        allowed: ['PF', 'FR', 'US', 'CA']
    }
});

const PhoneSchema = new Schema({
    number: {
        type: String,
        required: true,
        regEx: /^[0-9 -.]+$/
    }
});

const PersonSchema = new Schema({
    birthday: {
        type: Date,
        required: false,
        nullable: true,
        max: function() {
            const YEARS_18 = 18*365*24*60*60*1000;
            return new Date(Date.now() - YEARS_18);
        }
    },
    email: {
        type :String,
        regEx: RegEx.Email,
        required: false
    },
    name: {
        type: String,
        required: true,
        length: [3, 30] // min 3, max 30
    },
    phones: {
        type: [PhoneSchema],
        required: false
    },
    postalAddress: {
        // Inherit from AddressSchema
        type: AddressSchema.extend({
            postalCode: {
                type: Number,
                required: false
            }
        }),
        required: true
    },
    presentation: {
        type: String,
        required: false,
        length: [0, 500],
        minWords: 10
    }
});

try {
    // This won't throw any error because data is valid
    PersonSchema.validate({
        name: 'karl',
        birthday: null,
        email: 'karl@mail.com',
        postalAddress: {
            city: 'Papeete',
            country: 'PF'
        }
    });
    
    // This will throw an error because date is not valid
    PersonSchema.validate({
        email: 'karl@mail.com',
        birthday: '1999-12-20',
        postalAddress: {
            city: 'Papeete',
            country: 'PF'
        }
    });
}
catch (err) {
    // err is an instance of SchemaError
    console.error(err.message);
}
```

## Changelog

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R7XM4Q3TNE47L)
