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
import Schema from "@jalik/schema";

const ExampleSchema = new Schema({
    // ALLOWED
    allowed: {
        type: String,
        // force binary values
        allowed:["0","1"]
     },
    
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
    
    defaultField: {
      type: Number,
      defaultValue: 1337  
    },
    
    // DENIED
    denied: {
        type: Number,
        // will throw an error if these values are present
        denied: [0, 1]
    },
    
    // LABEL
    // used in errors for a more human description
    labelled: {
        type: String,
        label: "Labelled field"
    },

    // LENGTH
    arrayLength: {
        type: [Number],
        // array must contain exactly two values
        length: 2
    },
    fixedLength: {
        type: String,
        // length must be exactly 10
        length: 10
    },
    maxLength: {
        type: String,
        // max length is 10, min length is 0
        length: [0, 10]
    },
    minLength: {
        type: String,
        // min length is 2, there is no max length
        length: [2]
    },

    // MAX
    maxDate: {
        type: Date,
        max: new Date(Date.now() + 3600*1000)
    },
    maxNumber: {
        type: Number,
        // max value is 10
        max: 10
    },
    
    // MAX WORDS
    maxWords: {
        type: String,
        // there must have 50 words max
        maxWords: 50
    },

    // MIN
    minDate: {
        type: Date,
        // min value is now minus 10 hours
        min: new Date(Date.now() - 3600*1000)
    },
    minNumber: {
        type: Number,
        // min value is 0
        min: 0
    },
    
    // MIN WORDS
    minWords: {
        type: String,
        // there must have 5 words minimum
        minWords: 5
    },

    // NULLABLE
    nullable: {
        type: String,
        // field cannot be null
        nullable: false
    },
    notNullable: {
        type: String,
        // field can be null
        nullable: true
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
    
    // REGEX
    regEx: {
        type: String,
         // force time format "00:00"
        regEx:/^\d{1,2}:\d{1,2}$/
    },

    // REQUIRED
    optional: {
        type: String,
        required: false
    },
    required: {
        type: String,
        required: true
    },

    // TYPE
    boolean: {
        type: Boolean
    },
    booleanArray: {
        type: [Boolean]
    },
    float: {
        type: Number,
        decimal: true
    },
    // note: we don't have float array yet
    integer: {
        type: Number,
        decimal: false
    },
    // note: we don't have integer array yet
    number: {
        type: Number
    },
    numberArray: {
        type: [Number]
    },
    string: {
        type: String
    },
    stringArray: {
        type: [String]
    },
});
```

## Dynamic field properties

Almost all properties (excepted `type`) accept a function instead of the usual value, it is useful to return a constraint based on some conditions when the field is actually validated.
The given function is called with a single argument representing the current context (data) being validated by the schema.

```js
import Schema from "@jalik/schema";

const isPublishing = function(context) {
    // context refers to the data being validated
    return context.status === "published";
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
        allowed: ["published", "draft"]
    }
});

// So this is valid
PostSchema.validate({
    title: "Hello World",
    text: "This is a hello world post !",
    status: "published"
});

// And this is valid too..
PostSchema.validate({
    status: "draft"
});

// But this is not valid !
PostSchema.validate({
    title: "Hello World",
    text: null,
    status: "published"
});
```

## Creating a schema

To create a schema, use the `Schema` class.

```js
import RegEx from "@jalik/schema/dist/regex";
import Schema from "@jalik/schema";

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
import Schema from "@jalik/schema";

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
import Schema from "@jalik/schema";

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
import Schema from "@jalik/schema";

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
import RegEx from "@jalik/schema/dist/regex";
import Schema from "@jalik/schema";

const AddressSchema = new Schema({
    city: {
        type: String,
        required: true,
        length: [1, 30]
    },
    country: {
        type: String,
        required: true,
        allowed: ["PF", "FR", "US", "CA"]
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
            city: "Papeete",
            country: "PF"
        }
    });
    
    // This will throw an error because date is not valid
    PersonSchema.validate({
        email: 'karl@mail.com',
        birthday: '1999-12-20',
        postalAddress: {
            city: "Papeete",
            country: "PF"
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
