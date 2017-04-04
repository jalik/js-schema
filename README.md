# Schema

This package allows you to validate complex objects using schemas.

## Creating a schema

To define a schema, use the `Schema` class.

```js
const RegEx = require("jk-schema").RegEx;
const Schema = require("jk-schema").Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        length: [3, 30]
    },
    email: {
        type :String,
        regEx: RegEx.Email,
        required: false
    },
    birthday: {
        type: Date,
        required: false,
        max: function() {
            const YEARS_18 = 18*365*24*60*60*1000;
            return new Date(Date.now() - YEARS_18);
        }
    }
});
```

## Validating a schema

To validate data using a schema, use the method `schema.validate(obj)`.
If the validation fails, it will throw a `SchemaError` containing information about the error.

```js
const RegEx = require("jk-schema").RegEx;
const Schema = require("jk-schema").Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        length: [3, 30]
    },
    email: {
        type :String,
        regEx: RegEx.Email,
        required: false
    },
    birthday: {
        type: Date,
        required: false,
        max: function() {
            const YEARS_18 = 18*365*24*60*60*1000;
            return new Date(Date.now() - YEARS_18);
        }
    }
});

// This won't throw any error because data is valid
UserSchema.validate({
    name: 'karl',
    email: 'karl@mail.com'
});

// This is not valid, an error will be thrown
UserSchema.validate({
    email: 'karl@mail.com',
    birthday: '1999-12-20'
});
```

## Examples of validation

```js
const RegEx = require("jk-schema").RegEx;
const Schema = require("jk-schema").Schema;

const PrimitiveSchema = new Schema({
    array: {
        type: Array,
        length: [1, 2]
    },
    binaryArray: {
        type: [Number],
        allowed: [0, 1]
    },
    stringArray: {
        type: [String],
        allowed: ["a", "b", "c"]
    },
    status: {
        type: String,
        allowed: ["on", "off"]
    },
    boolean: {
        type: Boolean
    },
    date: {
        type: Date
    },
    error: {
        type: Error
    },
    email: {
        type: String,
        regEx: RegEx.Email
    },
    ipv4: {
        type: String,
        regEx: RegEx.IPv4
    },
    float: {
        type: Number,
        decimal: true
    },
    integer: {
        type: Number,
        decimal: false
    },
    method: {
        type: Function
    },
    number: {
        type: Number
    },
    object: {
        type: Object
    },
    string: {
        type: String,
        length: [1, 10]
        // regEx: /^[a-z-0-9]+$/i
    },
});

const ComplexSchema = new Schema({
    child: {
        type: PrimitiveSchema
    },
    children: {
        type: [PrimitiveSchema]
    },
    dates: {
        type: [Date]
    }
});

const DATA = {
    // intruder: "@#=*",
    array: [0, 1],
    binaryArray: [0, 1, 1, 0],
    stringArray: ["a", "b", "a"],
    status: "on",
    boolean: false,
    date: new Date(),
    email: "jalik26@mail.com",
    ipv4: "10.0.0.255",
    error: new TypeError(),
    float: 13.37,
    integer: 1337,
    method: function () {
    },
    number: 123,
    object: {a: "  1 ", b: 2},
    string: " hell0   "
};

// Create a sub schema by picking only some fields
const subSchema = PrimitiveSchema.pick(["number", "string"]);

// Validate data using the sub schema
subSchema.validate({
    number: 123,
    string: "  a "
});

// Validate data using primitive schema
PrimitiveSchema.validate(DATA);

// Validate data using complex schema
ComplexSchema.validate({
    dates: [new Date()],
    child: DATA,
    children: [DATA]
});
```

## Changelog

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
