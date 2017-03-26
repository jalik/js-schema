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
 * @type {{Email: RegExp, IPv4: RegExp}}
 */
export const RegEx = {
    /**
     * Email regular expression
     */
    Email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    /**
     * IPv4 network address
     */
    IPv4: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
};

/**
 * Schema
 */
export class Schema {
    constructor(schema) {
        // Check schema
        for (let field in schema) {
            if (schema.hasOwnProperty(field)) {
                const prop = schema[field];

                // Check field properties
                for (let p in prop) {
                    if (prop.hasOwnProperty(p) && !_.contains(FIELD_PROPERTIES, p)) {
                        console.warn(`Unknown property "${field}.${p}"`);
                    }
                }

                // Check field type
                if (prop.type === undefined || prop.type === null) {
                    throw new TypeError(`${field}.type is not defined`);
                }
                else if (prop.type instanceof Array) {
                    const arrayType = prop.type[0];

                    // Check that array type is a function or class
                    if (typeof arrayType !== "function" && typeof arrayType !== "object") {
                        throw new TypeError(`${field}.type[] must contain a class or a function`);
                    }
                }
                else if (!_.contains(["function", "object"], typeof prop.type)) {
                    throw new TypeError(`${field}.type = "${prop.type}" is not a valid type`);
                }

                // Check allowed values
                if (prop.allowed !== undefined) {
                    if (!(prop.allowed instanceof Array) && typeof prop.allowed !== "function") {
                        throw new TypeError(`${field}.allowed must be an array or function`);
                    }
                }

                // Check custom check function
                if (prop.check !== undefined) {
                    if (typeof prop.check !== "function") {
                        throw new TypeError(`${field}.check is not a function`);
                    }
                }

                // Check number decimal
                if (prop.decimal !== undefined) {
                    if (typeof prop.decimal !== "boolean") {
                        throw new TypeError(`${field}.decimal is not a boolean`);
                    }
                }

                // Check denied values
                if (prop.denied !== undefined) {
                    if (!(prop.denied instanceof Array) && typeof prop.denied !== "function") {
                        throw new TypeError(`${field}.denied must be an array or function`);
                    }
                }

                // Set default label if missing
                if (prop.label === undefined) {
                    prop.label = field;
                } else if (typeof prop.label !== "string") {
                    throw new TypeError(`${field}.label is not a string`);
                }

                // Check length
                if (prop.length !== undefined) {
                    if (prop.length instanceof Array) {
                        if (prop.length.length > 2) {
                            throw new RangeError(`${field}.length must only have 2 values [min, max]`);
                        }
                    } else if (!_.contains(["function", "number"], typeof prop.length)) {
                        throw new TypeError(`${field}.length must be a function, a number or an array[min, max]`);
                    }
                }

                // Check max value
                if (prop.max !== undefined) {
                    if (!_.contains(["function", "number", "string"], typeof prop.max) && !(prop.max instanceof Date)) {
                        throw new TypeError(`${field}.max must be a date, number, string or function`);
                    }
                }

                // Check max words
                if (prop.maxWords !== undefined) {
                    if (!_.contains(["function", "number"], typeof prop.maxWords)) {
                        throw new TypeError(`${field}.maxWords must be a number or function`);
                    }
                }

                // Check min value
                if (prop.min !== undefined) {
                    if (!_.contains(["function", "number", "string"], typeof prop.min) && !(prop.min instanceof Date)) {
                        throw new TypeError(`${field}.min must be a date, number, string or function`);
                    }
                }

                // Check min words
                if (prop.minWords !== undefined) {
                    if (!_.contains(["function", "number"], typeof prop.minWords)) {
                        throw new TypeError(`${field}.minWords must be a number or function`);
                    }
                }

                // Check if attribute is nullable
                if (prop.nullable !== undefined) {
                    if (typeof prop.nullable !== "boolean") {
                        throw new TypeError(`${field}.nullable is not a boolean`);
                    }
                }

                // Check regular expression
                if (prop.regEx !== undefined) {
                    if (!_.contains(["function"], typeof prop.regEx) && !(prop.regEx instanceof RegExp)) {
                        throw new TypeError(`${field}.regEx must be a regular expression or a function`);
                    }
                }

                // Set default value for required
                if (prop.required === undefined) {
                    prop.required = true;
                } else if (typeof prop.required !== "boolean") {
                    throw new TypeError(`${field}.required is not a boolean`);
                }
            }
        }

        /**
         * Cleans the object based on the schema
         * @param obj
         * @param options
         * @return {*}
         */
        this.clean = (obj, options) => {
            // Default options
            options = _.extend({
                removeUnknown: true
            }, options);

            for (let field in obj) {
                if (obj.hasOwnProperty(field)) {
                    if (schema.hasOwnProperty(field)) {
                        const value = obj[field];
                        obj[field] = this.cleanField(value);
                    }
                    // Remove unknown field
                    else if (options.removeUnknown) {
                        delete obj[field];
                    }
                }
            }
            return obj;
        };

        /**
         * Returns the field cleaned
         * @param value
         * @return {*}
         */
        this.cleanField = (value) => {
            if (value !== null && value !== undefined) {
                switch (typeof value) {

                    case "array":
                        for (let i = 0; i < value; i += 1) {
                            value[i] = this.cleanField(value[i]);
                        }
                        break;

                    case "object":
                        for (let k in value) {
                            if (value.hasOwnProperty(k)) {
                                value[k] = this.cleanField(value[k]);
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
        };

        /**
         * Returns the value of the function
         * @param value
         * @return {*}
         */
        this.dynamicValue = (value) => {
            if (typeof value === "function") {
                return value();
            }
            return value;
        };

        /**
         * Extends schema with fields from another schema
         * @param parent
         * @return {Schema}
         */
        this.extend = (parent) => {
            if (!(parent instanceof Schema)) {
                throw new TypeError(`Cannot extend object that is not a Schema`, parent);
            }
            const fields = parent.getFields();

            for (let field in fields) {
                if (fields.hasOwnProperty(field) && !schema.hasOwnProperty(field)) {
                    schema[field] = fields[field];
                }
            }
            return this;
        };

        /**
         * Returns fields
         * @return {*}
         */
        this.getFields = () => {
            return schema;
        };

        /**
         * Checks if the object is valid
         * @param obj
         * @param options
         * @return {boolean}
         */
        this.isValid = (obj, options) => {
            try {
                this.validate(obj, options);
                return true;
            } catch (err) {
                return false;
            }
        };

        /**
         * Creates a sub schema from selected fields
         * @param fields
         * @return {Schema}
         */
        this.pick = (fields) => {
            let newSchema = {};

            for (let i = 0; i < fields.length; i += 1) {
                const field = fields[i];

                if (schema.hasOwnProperty(field)) {
                    newSchema[field] = schema[field];
                }
            }
            return new Schema(newSchema);
        };

        /**
         *
         * @param field
         */
        this.throwFieldBadValueError = function (field) {
            throw new SchemaError(`field-bad-value`, `The field "${field}" contains a bad value`, {field});
        };

        /**
         *
         * @param field
         */
        this.throwFieldDeniedValueError = function (field) {
            throw new SchemaError(`field-denied-value`, `The field "${field}" contains a denied value`, {field});
        };

        /**
         *
         * @param field
         */
        this.throwFieldInstanceError = function (field) {
            throw new SchemaError(`field-instance`, `The field "${field}" is not a valid instance`, {field});
        };

        /**
         *
         * @param field
         * @param length
         */
        this.throwFieldLengthError = function (field, length) {
            throw new SchemaError(`field-length`, `Length of field "${field}" must be exactly ${length}`, {
                field,
                length
            });
        };

        /**
         *
         * @param field
         * @param max
         */
        this.throwFieldMaxLengthError = function (field, max) {
            throw new SchemaError(`field-max-length`, `Length of field "${field}" must be at more ${max}`, {
                field,
                max
            });
        };

        /**
         *
         * @param field
         * @param max
         */
        this.throwFieldMaxValueError = function (field, max) {
            throw new SchemaError(`field-max-value`, `The field "${field}" must be lesser than or equals to ${max}`, {
                field,
                max
            });
        };

        /**
         *
         * @param field
         * @param min
         */
        this.throwFieldMaxWordsError = function (field, min) {
            throw new SchemaError(`field-max-words`, `The field "${field}" must contain ${min} words max`, {
                field,
                min
            });
        };

        /**
         *
         * @param field
         * @param min
         */
        this.throwFieldMinLengthError = function (field, min) {
            throw new SchemaError(`field-min-length`, `Length of field "${field}" must be at least ${min}`, {
                field,
                min
            });
        };

        /**
         *
         * @param field
         * @param min
         */
        this.throwFieldMinValueError = function (field, min) {
            throw new SchemaError(`field-min-value`, `The field "${field}" must be greater than or equals to ${min}`, {
                field,
                min
            });
        };

        /**
         *
         * @param field
         * @param min
         */
        this.throwFieldMinWordsError = function (field, min) {
            throw new SchemaError(`field-min-words`, `The field "${field}" must contain at least ${min} words`, {
                field,
                min
            });
        };

        /**
         *
         * @param field
         */
        this.throwFieldMissingError = function (field) {
            throw new SchemaError(`field-missing`, `The field "${field}" is missing`, {field});
        };

        /**
         *
         * @param field
         * @param regEx
         */
        this.throwFieldRegExError = function (field, regEx) {
            throw new SchemaError(`field-regex`, `The field "${field}" does not match the pattern ${regEx}`, {
                field,
                regEx
            });
        };

        /**
         *
         * @param field
         * @param type
         */
        this.throwFieldTypeError = function (field, type) {
            throw new SchemaError(`field-type`, `The field "${field}" is not of type ${type}`, {field});
        };

        /**
         *
         * @param field
         */
        this.throwFieldUnknownError = function (field) {
            throw new SchemaError(`field-unknown`, `The field "${field}" is unknown`, {field});
        };

        /**
         *
         * @param field
         * @param type
         */
        this.throwFieldValueTypesError = function (field, type) {
            throw new SchemaError(`field-values-type`, `The field "${field}" contains values of incorrect type`, {
                field,
                type
            });
        };

        /**
         * Validates the object
         * @param obj
         * @param options
         */
        this.validate = (obj, options) => {
            // Default options
            options = _.extend({
                clean: true,
                ignoreUnknown: false,
                ignoreMissing: false,
                removeUnknown: true
            }, options);

            // Check if object is null
            if (typeof obj !== "object" || obj === null) {
                throw new SchemaError("object-invalid", "cannot validate null object");
            }

            // Check unknown fields
            if (!options.ignoreUnknown) {
                for (let field in obj) {
                    if (obj.hasOwnProperty(field)) {
                        if (!schema[field]) {
                            this.throwFieldUnknownError(field);
                        }
                    }
                }
            }

            // Clean/compress object
            if (options.clean) {
                this.clean(obj, options);
            }

            // Add context
            options.context = obj;

            // Check fields
            for (let field in schema) {
                if (schema.hasOwnProperty(field)) {
                    const prop = schema[field];
                    const value = obj[field];

                    // Ignore missing fields
                    if (value === undefined && options.ignoreMissing) {
                        continue;
                    }
                    this.validateField(prop, value, options);
                }
            }
        };

        /**
         * Validates the field
         * @param field
         * @param value
         * @param options
         */
        this.validateField = (field, value, options) => {
            const label = field.label;
            const type = field.type;

            // Default options
            options = _.extend({
                context: null
            }, options);

            // Check if value is missing
            if (value === undefined || value === null) {
                if (field.required && !field.nullable) {
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
                    else if (value.length === 0 && !field.required) {
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
                    if (field.decimal !== undefined) {
                        if (field.decimal === true && !/^[0-9][0-9]*(\.[0-9]+)?$/.test(String(value))) {
                            this.throwFieldTypeError(label, "float");
                        }
                        if (field.decimal === false && !/^[0-9]+$/.test(String(value))) {
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
                        else if (value.length === 0 && !field.required) {
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
            if (field.allowed !== undefined) {
                const allowed = this.dynamicValue(field.allowed);

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
            else if (field.denied !== undefined) {
                const denied = this.dynamicValue(field.denied);

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
            if (field.length !== undefined && value.length !== undefined) {
                const length = this.dynamicValue(field.length);

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
            if (field.min !== undefined) {
                const min = this.dynamicValue(field.min);

                if (value < min) {
                    this.throwFieldMinValueError(label, min);
                }
            }

            // Check min words
            if (field.minWords !== undefined && typeof value === "string") {
                const min = this.dynamicValue(field.minWords);

                if (value.split(" ").length < min) {
                    this.throwFieldMinWordsError(label, min);
                }
            }

            // Check max value
            if (field.max !== undefined) {
                const max = this.dynamicValue(field.max);

                if (value > max) {
                    this.throwFieldMaxValueError(label, max);
                }
            }

            // Check max words
            if (field.maxWords !== undefined && typeof value === "string") {
                const max = this.dynamicValue(field.maxWords);

                if (value.split(" ").length > max) {
                    this.throwFieldMaxWordsError(label, max);
                }
            }

            // Test regular expression
            if (field.regEx !== undefined) {
                const regEx = this.dynamicValue(field.regEx);

                if (!regEx.test(value)) {
                    this.throwFieldRegExError(label, regEx);
                }
            }

            // Test custom checks
            if (field.check !== undefined) {
                if (field.check.call(this, value, label, options.context) === false) {
                    this.throwFieldBadValueError(label);
                }
            }
        };
    }
}

/**
 * Schema error
 */
export class SchemaError extends Error {
    constructor(reason, message, context) {
        super(message);
        this.name = "SchemaError";
    }
}

export default Schema;
