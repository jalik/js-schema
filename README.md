# jk-schema

This package allows you to validate complex objects using schemas.

## Creating a schema

To define a schema, use the `Schema` class.

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

const CloneSchema = PersonSchema.clone();
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

// This won't throw any error because data is valid
PersonSchema.validate({
    name: 'karl',
    email: 'karl@mail.com',
    postalAddress: {
        city: "Papeete",
        country: "PF"
    }
});

// This will throw an error since date is not valid
PersonSchema.validate({
    email: 'karl@mail.com',
    birthday: '1999-12-20',
    postalAddress: {
        city: "Papeete",
        country: "PF"
    }
});
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
