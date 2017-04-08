# jk-schema

This package allows you to validate complex objects using schemas.

## Introduction

A schema is a definition of all characteristics of an object.
For example, a person has a first name, age, gender and so on...
some information are required while others are optional.
With a schema you can tell how your object must be defined.
And when your schema is created you can then validate any data against it
to check if the data is valid or not.

**This library is well tested with more than 80+ unit tests.**

## Schema field properties

You can use any of the given properties to define a field.

```js
const Schema = require("jk-schema").Schema;

const ExampleSchema = new Schema({

    // ALLOWED
    allowed: {type:String, allowed:["0","1"]}, // force binary values
    
    // CHECK
    // accept a function that is called after all native validations
    check: {type:Number, check:(value) => value % 2 === 0}, // number must be even
    
    // DENIED
    denied: {type:Number, denied:["yes", "no"]}, // allow maybe :)
    
    // LABEL
    // used in errors for a more human description
    labelled: {type:String, label: "Labelled field"},

    // LENGTH
    arrayLength: {type:[Number], length: 2}, // must contain 2 values
    fixedLength: {type:String, length: 10}, // length must be 10
    maxLength: {type:String, length: [0, 10]}, // max = 10, min = 0
    minLength: {type:String, length: [2]}, // min = 2, no max

    // MAX
    maxDate: {type:Date, max: new Date(Date.now() + 3600*1000)},
    maxNumber: {type:Number, max: 10},
    
    // MAX WORDS
    maxWords: {type:String, maxWords:50},

    // MIN
    minDate: {type:Date, min: new Date(Date.now() - 3600*1000)},
    minNumber: {type:Number, min: 0},
    
    // MIN WORDS
    minWords: {type:String, minWords:5},

    // NULLABLE
    nullable: {type:String, nullable: false},
    notNullable: {type:String, nullable: true},
    
    // REGEX
    regEx: {type:String, regEx:/^\d{1,2}:\d{1,2}$/}, // force time format "00:00"

    // REQUIRED
    optional: {type:String, required: false},
    required: {type:String, required: true},

    // TYPE
    boolean: {type: Boolean},
    booleanArray: {type: [Boolean]},
    float: {type: Number, decimal: true},
    // note: we don't have float array yet
    integer: {type: Number, decimal: false},
    // note: we don't have integer array yet
    number: {type: Number},
    numberArray: {type: [Number]},
    string: {type: String},
    stringArray: {type: [String]},
});
```

## Creating a schema

To create a schema, use the `Schema` class.

```js
const RegEx = require("jk-schema").RegEx;
const Schema = require("jk-schema").Schema;

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
        max: function() {
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
const Schema = require("jk-schema").Schema;

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
const Schema = require("jk-schema").Schema;

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
const Schema = require("jk-schema").Schema;

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const ClonedSchema = PersonSchema.clone();
```

## Validating data using a schema

To validate data using a schema, use the method `schema.validate(obj)`.
If the validation fails, it will throw a `SchemaError` containing information about the error.

```js
const RegEx = require("jk-schema").RegEx;
const Schema = require("jk-schema").Schema;

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

This project is released under the [MIT License](http://www.opensource.org/licenses/MIT).
