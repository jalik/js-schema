/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import _ from "underscore";

/**
 * Schema field properties
 * @type {[string]}
 */
export const FIELD_PROPERTIES = [
    "allowed",
    "check",
    "decimal",
    "denied",
    "label",
    "length",
    "max",
    "maxWords",
    "min",
    "minWords",
    "nullable",
    "regEx",
    "required",
    "type"
];

/**
 * Common regular expressions
 */
export const RegEx = {
    /**
     * Basic alphabetic
     */
    Alpha: /^[a-zA-Z]+$/,
    /**
     * Basic alphanumeric
     */
    Alphanumeric: /^[a-zA-Z0-9]+$/,
    /**
     * Email
     */
    Email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    /**
     * Extended alphanumeric [_-]
     */
    ExtAlphanumeric: /^[a-zA-Z0-9_-]+$/,
    /**
     * Fully Qualified Domain Name
     */
    FQDN: /(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3})/,
    /**
     * IPv4 network address
     */
    IPv4: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
};

/**
 * Validation schema
 */
export class Schema {
    constructor(fields) {
        this._fields = {};

        // Prepare fields
        for (let name in fields) {
            if (fields.hasOwnProperty(name)) {
                this.addField(name, fields[name]);
            }
        }
    }

    /**
     * Adds field to the schema
     * @param name
     * @param props
     */
    addField(name, props) {
        this._fields[name] = new SchemaField(name, props);
    }

    /**
     * Cleans the object based on the schema
     * @param obj
     * @param options
     * @return {*}
     */
    clean(obj, options) {
        // Default options
        options = _.extend({
            removeUnknown: true
        }, options);

        const fields = this.getFields();

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const field = fields[key];

                if (field) {
                    const value = obj[key];
                    obj[key] = field.clean(value);
                }
                // Remove unknown field
                else if (options.removeUnknown) {
                    delete obj[key];
                }
            }
        }
        return obj;
    }

    /**
     * Clones the schema
     * @return {Schema}
     */
    clone() {
        const schema = this.getFields();
        const fields = [];

        for (let field in schema) {
            if (schema.hasOwnProperty(field)) {
                fields.push(field);
            }
        }
        return this.pick(fields);
    }

    /**
     * Creates a new schema based on current schema
     * @param fields
     * @return {Schema}
     */
    extend(fields) {
        return new Schema(_.extend({}, this.getFields(), fields));
    }

    /**
     * Returns field
     * @param name
     * @return {SchemaField}
     */
    getField(name) {
        return this.resolveField(name);
    }

    /**
     * Returns fields
     * @return {[SchemaField]}
     */
    getFields() {
        return this._fields;
    }

    /**
     * Checks if the object is valid
     * @param obj
     * @param options
     * @return {boolean}
     */
    isValid(obj, options) {
        try {
            this.validate(obj, options);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Creates a sub schema from selected fields
     * @param fields
     * @return {Schema}
     */
    pick(fields) {
        let newSchema = {};
        const schema = this.getFields();

        for (let i = 0; i < fields.length; i += 1) {
            const field = fields[i];

            if (schema.hasOwnProperty(field)) {
                newSchema[field] = schema[field];
            }
        }
        return new Schema(newSchema);
    }

    /**
     * Builds an object from a string (ex: [colors][0][code])
     * @param path (ex: address[country][code])
     * @return {SchemaField|null}
     */
    resolveField(path) {
        const fields = this.getFields();
        const index = path.indexOf("[");

        // Remove array indexes
        path = path.replace(/\[[0-9]+]/g, "");

        // Check missing brackets
        if (index !== -1) {
            const opening = path.match(/\[/g).length;
            const closing = path.match(/]/g).length;

            if (opening > closing) {
                throw new SyntaxError(`Missing closing ']' in '${path}'`);
            }
            else if (closing < opening) {
                throw new SyntaxError(`Missing opening '[' in '${path}'`);
            }
        }

        let fieldName;
        let subTree = "";

        if (index < 0) {
            fieldName = path;
        }
        else if (index > 0) {
            fieldName = path.substring(0, index);
            subTree = path.substring(index);
        }
        else if (index === 0) {
            fieldName = path.substring(1, path.indexOf("]"));
            const index = path.indexOf("[", 1);

            if (index !== -1) {
                subTree = path.substring(index);
            }
        }

        if (fields.hasOwnProperty(fieldName)) {
            const field = fields[fieldName];

            // Check sub field
            if (subTree && subTree.length) {
                const schema = field.type;

                if (schema instanceof Schema) {
                    return schema.resolveField(subTree);
                }
                else if (schema instanceof Array) {
                    if (schema[0] instanceof Schema) {
                        return schema[0].resolveField(subTree);
                    }
                } else {
                    throw new TypeError(`Unknown field type for "${fieldName}".`);
                }
            }
            else if (path === fieldName || path === `[${fieldName}]`) {
                return field;
            }
        }
    }

    /**
     * Updates existing fields
     * @param fields
     * @return {Schema}
     */
    update(fields) {
        const schema = this.getFields();

        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                const props = fields[key];
                const field = schema[key] || {};
                this.addField(key, _.extend({}, field, props));
            }
        }
        return this;
    }

    /**
     * Validates the object
     * @param obj
     * @param options
     */
    validate(obj, options) {
        // Default options
        options = _.extend({
            clean: true,
            ignoreMissing: false,
            removeUnknown: false
        }, options);

        const fields = this.getFields();

        // Check if object is null
        if (typeof obj !== "object" || obj === null) {
            throw new SchemaError("object-invalid", "cannot validate null object");
        }

        // Check unknown fields
        if (!options.ignoreUnknown) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (!fields[key]) {
                        throw new SchemaError(`field-unknown`, `The field "${key}" is unknown`, {key});
                    }
                }
            }
        }

        // Clean object
        if (options.clean) {
            this.clean(obj, options);
        }

        // Add context
        options.context = obj;

        // Validate fields
        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                const value = obj[key];

                // Ignore missing fields
                if (value === undefined && options.ignoreMissing) {
                    continue;
                }
                // Validate field
                fields[key].validate(value, options);
            }
        }
    }
}

/**
 * Schema error
 */
export class SchemaError extends Error {
    constructor(reason, message, context) {
        super(message);
        this.context = context;
        this.name = "SchemaError";
        this.reason = reason;
    }
}

/**
 * Schema field
 */
export class SchemaField {
    constructor(field, props) {
        // Default properties
        props = _.extend({
            allowed: undefined,
            check: undefined,
            decimal: undefined,
            denied: undefined,
            label: field,
            length: undefined,
            max: undefined,
            maxWords: undefined,
            min: undefined,
            minWords: undefined,
            nullable: true,
            regEx: undefined,
            required: true,
            type: undefined
        }, props);

        // Check field properties
        for (let prop in props) {
            if (props.hasOwnProperty(prop)) {
                if (!_.contains(FIELD_PROPERTIES, prop)) {
                    console.warn(`Unknown property "${field}.${prop}"`);
                }
                // Assign property
                this[prop] = props[prop];
            }
        }

        // Check field type
        if (props.type === undefined || props.type === null) {
            throw new TypeError(`${field}.type is not defined`);
        }
        else if (props.type instanceof Array) {
            const arrayType = props.type[0];

            // Check that array type is a function or class
            if (typeof arrayType !== "function" && typeof arrayType !== "object") {
                throw new TypeError(`${field}.type[] must contain a class or a function`);
            }
        }
        else if (!_.contains(["function", "object"], typeof props.type)) {
            throw new TypeError(`${field}.type = "${props.type}" is not a valid type`);
        }

        // Check allowed values
        if (props.allowed !== undefined) {
            if (!(props.allowed instanceof Array) && typeof props.allowed !== "function") {
                throw new TypeError(`${field}.allowed must be an array or function`);
            }
        }

        // Check custom check function
        if (props.check !== undefined) {
            if (typeof props.check !== "function") {
                throw new TypeError(`${field}.check is not a function`);
            }
        }

        // Check number decimal
        if (props.decimal !== undefined) {
            if (typeof props.decimal !== "boolean") {
                throw new TypeError(`${field}.decimal is not a boolean`);
            }
        }

        // Check denied values
        if (props.denied !== undefined) {
            if (!(props.denied instanceof Array) && typeof props.denied !== "function") {
                throw new TypeError(`${field}.denied must be an array or function`);
            }
        }

        // Set default label if missing
        if (props.label !== undefined && typeof props.label !== "string") {
            throw new TypeError(`${field}.label is not a string`);
        }

        // Check length
        if (props.length !== undefined) {
            if (props.length instanceof Array) {
                if (props.length.length > 2) {
                    throw new RangeError(`${field}.length must only have 2 values [min, max]`);
                }
            } else if (!_.contains(["function", "number"], typeof props.length)) {
                throw new TypeError(`${field}.length must be a function, a number or an array[min, max]`);
            }
        }

        // Check max value
        if (props.max !== undefined) {
            if (!_.contains(["function", "number", "string"], typeof props.max) && !(props.max instanceof Date)) {
                throw new TypeError(`${field}.max must be a date, number, string or function`);
            }
        }

        // Check max words
        if (props.maxWords !== undefined) {
            if (!_.contains(["function", "number"], typeof props.maxWords)) {
                throw new TypeError(`${field}.maxWords must be a number or function`);
            }
        }

        // Check min value
        if (props.min !== undefined) {
            if (!_.contains(["function", "number", "string"], typeof props.min) && !(props.min instanceof Date)) {
                throw new TypeError(`${field}.min must be a date, number, string or function`);
            }
        }

        // Check min words
        if (props.minWords !== undefined) {
            if (!_.contains(["function", "number"], typeof props.minWords)) {
                throw new TypeError(`${field}.minWords must be a number or function`);
            }
        }

        // Check if field is nullable
        if (props.nullable !== undefined && typeof props.nullable !== "boolean") {
            throw new TypeError(`${field}.nullable is not a boolean`);
        }

        // Check regular expression
        if (props.regEx !== undefined) {
            if (!_.contains(["function"], typeof props.regEx) && !(props.regEx instanceof RegExp)) {
                throw new TypeError(`${field}.regEx must be a regular expression or a function`);
            }
        }

        // Set default value for required
        if (props.required !== undefined && typeof props.required !== "boolean") {
            throw new TypeError(`${field}.required is not a boolean`);
        }
    }

    /**
     * Cleans the value
     * @param value
     * @return {*}
     */
    clean(value) {
        if (value !== null && value !== undefined) {
            switch (typeof value) {

                case "array":
                    for (let i = 0; i < value; i += 1) {
                        value[i] = this.clean(value[i]);
                    }
                    break;

                case "object":
                    for (let k in value) {
                        if (value.hasOwnProperty(k)) {
                            value[k] = this.clean(value[k]);
                        }
                    }
                    break;

                case "string":
                    if (typeof value === "string") {
                        value = value.trim();

                        if (value.length === 0) {
                            value = null;
                        }
                    }
                    break;
            }
        }
        return value;
    }

    /**
     * Returns the value of the function
     * @param value
     * @return {*}
     */
    dynamicValue(value) {
        if (typeof value === "function") {
            return value();
        }
        return value;
    }

    /**
     *
     * @param field
     */
    throwFieldBadValueError(field) {
        throw new SchemaError(`field-bad-value`, `The field "${field}" contains a bad value`, {field});
    }

    /**
     *
     * @param field
     */
    throwFieldDeniedValueError(field) {
        throw new SchemaError(`field-denied-value`, `The field "${field}" contains a denied value`, {field});
    }

    /**
     *
     * @param field
     */
    throwFieldInstanceError(field) {
        throw new SchemaError(`field-instance`, `The field "${field}" is not a valid instance`, {field});
    }

    /**
     *
     * @param field
     * @param length
     */
    throwFieldLengthError(field, length) {
        throw new SchemaError(`field-length`, `Length of field "${field}" must be exactly ${length}`, {
            field,
            length
        });
    }

    /**
     *
     * @param field
     * @param max
     */
    throwFieldMaxLengthError(field, max) {
        throw new SchemaError(`field-max-length`, `Length of field "${field}" must be at more ${max}`, {
            field,
            max
        });
    }

    /**
     *
     * @param field
     * @param max
     */
    throwFieldMaxValueError(field, max) {
        throw new SchemaError(`field-max-value`, `The field "${field}" must be lesser than or equals to ${max}`, {
            field,
            max
        });
    }

    /**
     *
     * @param field
     * @param min
     */
    throwFieldMaxWordsError(field, min) {
        throw new SchemaError(`field-max-words`, `The field "${field}" must contain ${min} words max`, {
            field,
            min
        });
    }

    /**
     *
     * @param field
     * @param min
     */
    throwFieldMinLengthError(field, min) {
        throw new SchemaError(`field-min-length`, `Length of field "${field}" must be at least ${min}`, {
            field,
            min
        });
    }

    /**
     *
     * @param field
     * @param min
     */
    throwFieldMinValueError(field, min) {
        throw new SchemaError(`field-min-value`, `The field "${field}" must be greater than or equals to ${min}`, {
            field,
            min
        });
    }

    /**
     *
     * @param field
     * @param min
     */
    throwFieldMinWordsError(field, min) {
        throw new SchemaError(`field-min-words`, `The field "${field}" must contain at least ${min} words`, {
            field,
            min
        });
    }

    /**
     *
     * @param field
     */
    throwFieldMissingError(field) {
        throw new SchemaError(`field-missing`, `The field "${field}" is missing`, {field});
    }

    /**
     *
     * @param field
     * @param regEx
     */
    throwFieldRegExError(field, regEx) {
        throw new SchemaError(`field-regex`, `The field "${field}" does not match the pattern ${regEx}`, {
            field,
            regEx
        });
    }

    /**
     *
     * @param field
     * @param type
     */
    throwFieldTypeError(field, type) {
        throw new SchemaError(`field-type`, `The field "${field}" is not of type ${type}`, {field});
    }

    /**
     *
     * @param field
     */
    throwFieldUnknownError(field) {
        throw new SchemaError(`field-unknown`, `The field "${field}" is unknown`, {field});
    }

    /**
     *
     * @param field
     * @param type
     */
    throwFieldValueTypesError(field, type) {
        throw new SchemaError(`field-values-type`, `The field "${field}" contains values of incorrect type`, {
            field,
            type
        });
    }

    /**
     * Validates the field
     * @param value
     * @param options
     */
    validate(value, options) {
        const props = this;
        const label = props.label;
        const type = props.type;

        // Default options
        options = _.extend({
            context: {[label]: value}
        }, options);

        // Check if value is missing
        if (props.required && (value === undefined || value === null)) {
            if (!props.nullable || value !== null) {
                this.throwFieldMissingError(label);
            } else {
                return;
            }
        }

        // Check type
        switch (type) {

            case Array:
                if (!(value instanceof Array)) {
                    this.throwFieldTypeError(label, "array");
                }
                // Ignore empty array if field is not required
                else if (value.length === 0 && !props.required) {
                    return;
                }
                break;

            case Boolean:
                if (typeof value !== "boolean") {
                    this.throwFieldTypeError(label, "boolean");
                }
                break;

            case Function:
                if (typeof value !== "function") {
                    this.throwFieldTypeError(label, "function");
                }
                break;

            case Number:
                if (typeof value !== "number" || isNaN(value)) {
                    this.throwFieldTypeError(label, "number");
                }
                // Check decimal
                if (props.decimal !== undefined) {
                    if (props.decimal === true && !/^[0-9][0-9]*(\.[0-9]+)?$/.test(String(value))) {
                        this.throwFieldTypeError(label, "float");
                    }
                    if (props.decimal === false && !/^[0-9]+$/.test(String(value))) {
                        this.throwFieldTypeError(label, "integer");
                    }
                }
                break;

            case Object:
                if (typeof value !== "object") {
                    this.throwFieldTypeError(label, "object");
                }
                break;

            case String:
                if (typeof value !== "string") {
                    this.throwFieldTypeError(label, "string");
                }
                break;

            default:
                if (type instanceof Schema) {
                    type.validate(value, options);
                }
                else if (type instanceof Array) {
                    // Check that value is an array
                    if (!(value instanceof Array)) {
                        this.throwFieldTypeError(label, "array");
                    }
                    // Ignore empty array if field is not required
                    else if (value.length === 0 && !props.required) {
                        return;
                    }
                    const arrayType = type[0];

                    // Validate array items
                    if (arrayType instanceof Schema) {
                        for (let i = 0; i < value.length; i += 1) {
                            arrayType.validate(value[i], options);
                        }
                    }
                    // Check that array contains the declared type
                    else {
                        switch (arrayType) {

                            case Boolean:
                                for (let i = 0; i < value.length; i += 1) {
                                    if (typeof value[i] !== "boolean") {
                                        this.throwFieldValueTypesError(label, "boolean");
                                    }
                                }
                                break;

                            case Function:
                                for (let i = 0; i < value.length; i += 1) {
                                    if (typeof value[i] !== "function") {
                                        this.throwFieldValueTypesError(label, "function");
                                    }
                                }
                                break;

                            case Number:
                                for (let i = 0; i < value.length; i += 1) {
                                    if (typeof value[i] !== "number") {
                                        this.throwFieldValueTypesError(label, "number");
                                    }
                                }
                                break;

                            case Object:
                                for (let i = 0; i < value.length; i += 1) {
                                    if (typeof value[i] !== "object") {
                                        this.throwFieldValueTypesError(label, "object");
                                    }
                                }
                                break;

                            case String:
                                for (let i = 0; i < value.length; i += 1) {
                                    if (typeof value[i] !== "string") {
                                        this.throwFieldValueTypesError(label, "string");
                                    }
                                }
                                break;

                            default:
                                for (let i = 0; i < value.length; i += 1) {
                                    if (!(value[i] instanceof arrayType)) {
                                        this.throwFieldValueTypesError(label, arrayType);
                                    }
                                }
                        }
                    }
                }
                else if (typeof type === "function") {
                    // Check if value is an instance of the function
                    if (!(value instanceof type)) {
                        this.throwFieldInstanceError(label);
                    }
                }
                else {
                    // todo throw error invalid type
                }
        }

        // Check allowed values
        if (props.allowed !== undefined) {
            const allowed = this.dynamicValue(props.allowed);

            if (value instanceof Array) {
                for (let i = 0; i < value.length; i += 1) {
                    if (!_.contains(allowed, value[i])) {
                        this.throwFieldBadValueError(label, allowed);
                    }
                }
            }
            else if (!_.contains(allowed, value)) {
                this.throwFieldBadValueError(label, allowed);
            }
        }
        // Check denied values
        else if (props.denied !== undefined) {
            const denied = this.dynamicValue(props.denied);

            if (value instanceof Array) {
                for (let i = 0; i < value.length; i += 1) {
                    if (_.contains(denied, value[i])) {
                        this.throwFieldDeniedValueError(label, denied);
                    }
                }
            }
            else if (_.contains(denied, value)) {
                this.throwFieldDeniedValueError(label, denied);
            }
        }

        // Check length if value has the length attribute
        if (props.length !== undefined && value.length !== undefined) {
            const length = this.dynamicValue(props.length);

            // Ranged length
            if (length instanceof Array) {
                const min = length[0];
                const max = length[1];

                if (typeof min === "number" && value.length < min) {
                    this.throwFieldMinLengthError(label, min);
                }
                if (typeof max === "number" && value.length > max) {
                    this.throwFieldMaxLengthError(label, max);
                }
            }
            // Fixed length
            else if (value.length !== length) {
                this.throwFieldLengthError(label, length);
            }
        }

        // Check min value
        if (props.min !== undefined) {
            const min = this.dynamicValue(props.min);

            if (value < min) {
                this.throwFieldMinValueError(label, min);
            }
        }

        // Check min words
        if (props.minWords !== undefined && typeof value === "string") {
            const min = this.dynamicValue(props.minWords);

            if (value.split(" ").length < min) {
                this.throwFieldMinWordsError(label, min);
            }
        }

        // Check max value
        if (props.max !== undefined) {
            const max = this.dynamicValue(props.max);

            if (value > max) {
                this.throwFieldMaxValueError(label, max);
            }
        }

        // Check max words
        if (props.maxWords !== undefined && typeof value === "string") {
            const max = this.dynamicValue(props.maxWords);

            if (value.split(" ").length > max) {
                this.throwFieldMaxWordsError(label, max);
            }
        }

        // Test regular expression
        if (props.regEx !== undefined) {
            const regEx = this.dynamicValue(props.regEx);

            if (!regEx.test(value)) {
                this.throwFieldRegExError(label, regEx);
            }
        }

        // Test custom checks
        if (props.check !== undefined) {
            if (props.check.call(this, value, label, options.context) === false) {
                this.throwFieldBadValueError(label);
            }
        }
    }
}

Schema.RegEx = RegEx;

export default Schema;
