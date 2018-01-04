# jk-schema

This package allows you to validate complex objects using schemas.

## Introduction

A schema is a definition of all characteristics of an object.
For example, a person has a first name, age, gender and so on...
some information are required while others are optional.
With a schema you can tell how your object must be defined.
And when your schema is created you can then validate any data against it
to check if the data is valid or not.

**This library is well tested with more than 120+ unit tests.**

## Schema field properties

You can use any of the given properties to define a field.

```js
import {Schema} from "jk-schema/dist/schema";

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
import {Schema} from "jk-schema/dist/schema";

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
import RegEx from "jk-schema/dist/regex";
import {Schema} from "jk-schema/dist/schema";

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

## Updating a schema

The update creates fields that do not exist, but only modifies existing properties of fields,
so you can keep properties that have already been defined.

```js
import {Schema} from "jk-schema/dist/schema";

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

PersonSchema.update({
    age: {type: Number},
    name: {length:[0,20]}
});
```

## Extending a schema (inheritance)

The extend operation creates a new schema based on the current one.

```js
import {Schema} from "jk-schema/dist/schema";

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
import {Schema} from "jk-schema/dist/schema";

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const ClonedSchema = PersonSchema.clone();
```

## Updating a schema

```js
import {Schema} from "jk-schema/dist/schema";

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
import RegEx from "jk-schema/dist/regex";
import {Schema} from "jk-schema/dist/schema";

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

### v0.4.2
- Adds method `SchemaField.getName()`
- Adds method `SchemaField.throwFieldNullError()`
- Adds unit tests for `defaultValue` option
- Uses return value of `SchemaField.validate()` to modify field value
- Uses empty array `[]` as default value for `Array` fields defined as required and non-null
- Throws missing field error only when a required field is `undefined` (does not depend on `nullable` option anymore)

### v0.4.1
- Fixes main file exports
- Fixes documentation for importing classes and methods

### v0.4.0
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

### v0.3.4
- Updates documentation

### v0.3.3
- Fixes `Unknown property "field.name"` when assigning a name to a field

### v0.3.2
- Allows to pass function for `decimal`, `label`, `nullable` and `required` field properties
- Changes error messages

### v0.3.1
- Adds value as first argument of `check(value)` field property

### v0.3.0
- Fixes `nullable` and `required` field options

### v0.2.9
- Adds class `SchemaField`
- Adds method `Schema.addField(name, props)`
- Adds method `Schema.clone()`
- Adds method `Schema.update(fields)`
- Moves `Schema.cleanField()` to  `SchemaField.clean()`
- Moves `Schema.dynamicValue()` to  `SchemaField.dynamicValue()`
- Moves `Schema.validateField()` to  `SchemaField.validate()`

### v0.2.8
- Adds `resolveField(name)` method

### v0.2.7
- Adds `getField(name)` method
- Adds unit tests to check `length` field option
- Uses field name as first parameter of `validateField(name, value)` method instead of field properties

### v0.2.6
- Removes warning `Unknown property "${field}.label"`

### v0.2.5
- Changes `schema.extend(fields)` signature, uses fields instead of parent schema

### v0.2.4
- Adds `schema.extend(fields)` to create a schema based on an existing one
- Adds `schema.getFields()` to return schema fields
- Adds `schema.isValid(obj, options)` to validate an object without throwing an error
- Adds `nullable` field option to allow a field to be `null`
- Adds `ignoreMissing` option to `Schema.validate()` to ignore missing fields (useful for updates)

### v0.2.1
- First public release

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R7XM4Q3TNE47L)
