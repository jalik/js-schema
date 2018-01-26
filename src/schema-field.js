/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
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

import SchemaUtils from "./utils";
import {Schema} from "./schema";
import {SchemaError} from "./schema-error";

/**
 * Schema field properties
 * @type {[string]}
 */
export const fieldProperties = [
    "allowed",
    "check",
    "clean",
    "decimal",
    "defaultValue",
    "denied",
    "label",
    "length",
    "max",
    "maxWords",
    "min",
    "minWords",
    "name",
    "nullable",
    "prepare",
    "regEx",
    "required",
    "type"
];

export class SchemaField {

    constructor(fieldName, props) {
        // Default properties
        props = SchemaUtils.extend({
            allowed: undefined,
            check: undefined,
            clean: undefined,
            decimal: undefined,
            defaultValue: undefined,
            denied: undefined,
            label: fieldName,
            length: undefined,
            max: undefined,
            maxWords: undefined,
            min: undefined,
            minWords: undefined,
            nullable: true,
            prepare: undefined,
            regEx: undefined,
            required: true,
            type: undefined
        }, props);

        // Field name
        this.name = fieldName;

        // Field properties
        this.properties = {};

        // Check field properties
        for (let prop in props) {
            if (props.hasOwnProperty(prop)) {
                if (!SchemaUtils.contains(fieldProperties, prop)) {
                    console.warn(`Unknown schema field property "${fieldName}.${prop}"`);
                }
                // Assign property
                this.properties[prop] = props[prop];
            }
        }

        // Check field type
        if (typeof props.type === "undefined" || props.type === null) {
            throw new TypeError(`${fieldName}.type is missing`);
        }
        else if (props.type instanceof Array) {
            const arrayType = props.type[0];

            // Check that array type is a function or class
            if (typeof arrayType !== "function" && typeof arrayType !== "object") {
                throw new TypeError(`${fieldName}.type[] must contain a class or a function`);
            }
        }
        else if (!SchemaUtils.contains(["function", "object"], typeof props.type)) {
            throw new TypeError(`${fieldName}.type = "${props.type}" is not a valid type`);
        }

        // Check allowed values
        if (typeof props.allowed !== "undefined" && !(props.allowed instanceof Array) && typeof props.allowed !== "function") {
            throw new TypeError(`${fieldName}.allowed must be an array or function`);
        }

        // Check custom check function
        if (typeof props.check !== "undefined" && typeof props.check !== "function") {
            throw new TypeError(`${fieldName}.check must be a function`);
        }

        // Check custom clean function
        if (typeof props.clean !== "undefined" && typeof props.clean !== "function") {
            throw new TypeError(`${fieldName}.clean must be a function`);
        }

        // Check number decimal
        if (typeof props.decimal !== "undefined" && !SchemaUtils.contains(["function", "boolean"], typeof props.decimal)) {
            throw new TypeError(`${fieldName}.decimal must be a boolean or function`);
        }

        // Check denied values
        if (typeof props.denied !== "undefined" && !(props.denied instanceof Array) && typeof props.denied !== "function") {
            throw new TypeError(`${fieldName}.denied must be an array or function`);
        }

        // Set default label if missing
        if (typeof props.label !== "undefined" && !SchemaUtils.contains(["function", "string"], typeof props.label)) {
            throw new TypeError(`${fieldName}.label must be a string or function`);
        }

        // Check length
        if (typeof props.length !== "undefined") {
            if (props.length instanceof Array) {
                if (props.length.length > 2) {
                    throw new RangeError(`${fieldName}.length must only have 2 values [min, max]`);
                }
            } else if (!SchemaUtils.contains(["function", "number"], typeof props.length)) {
                throw new TypeError(`${fieldName}.length must be a function, a number or an array[min, max]`);
            }
        }

        // Check max value
        if (typeof props.max !== "undefined" && !SchemaUtils.contains(["function", "number", "string"], typeof props.max) && !(props.max instanceof Date)) {
            throw new TypeError(`${fieldName}.max must be a date, number, string or function`);
        }

        // Check max words
        if (typeof props.maxWords !== "undefined" && !SchemaUtils.contains(["function", "number"], typeof props.maxWords)) {
            throw new TypeError(`${fieldName}.maxWords must be a number or function`);
        }

        // Check min value
        if (typeof props.min !== "undefined" && !SchemaUtils.contains(["function", "number", "string"], typeof props.min) && !(props.min instanceof Date)) {
            throw new TypeError(`${fieldName}.min must be a date, number, string or function`);
        }

        // Check min words
        if (typeof props.minWords !== "undefined" && !SchemaUtils.contains(["function", "number"], typeof props.minWords)) {
            throw new TypeError(`${fieldName}.minWords must be a number or function`);
        }

        // Check if field is nullable
        if (typeof props.nullable !== "undefined" && !SchemaUtils.contains(["function", "boolean"], typeof props.nullable)) {
            throw new TypeError(`${fieldName}.nullable must be a boolean or function`);
        }

        // Check custom prepare function
        if (typeof props.prepare !== "undefined" && typeof props.prepare !== "function") {
            throw new TypeError(`${fieldName}.prepare must be a function`);
        }

        // Check regular expression
        if (typeof props.regEx !== "undefined" && !SchemaUtils.contains(["function"], typeof props.regEx) && !(props.regEx instanceof RegExp)) {
            throw new TypeError(`${fieldName}.regEx must be a regular expression or function`);
        }

        // Check required
        if (typeof props.required !== "undefined" && !SchemaUtils.contains(["function", "boolean"], typeof props.required)) {
            throw new TypeError(`${fieldName}.required must be a boolean or function`);
        }
    }

    /**
     * Cleans the value
     * @param value
     * @return {*}
     */
    clean(value) {
        if (value !== null && typeof value !== "undefined") {
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
                        // Execute custom clean function
                        if (typeof this.getCleanFunction() === "function") {
                            value = this.getCleanFunction()(value);
                        } else {
                            value = value.trim();
                        }

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
     * Returns the value of the object
     * @param value
     * @param context
     * @return {*}
     */
    computeValue(value, context) {
        if (typeof value === "function") {
            return value(context);
        }
        return value;
    }

    /**
     * Returns field's allowed values
     * @return {*}
     */
    getAllowedValues() {
        return this.properties.allowed;
    }

    /**
     * Returns field's check function
     * @return {Function|*}
     */
    getCheckFunction() {
        return this.properties.check;
    }

    /**
     * Returns field's clean function
     * @return {Function|*}
     */
    getCleanFunction() {
        return this.properties.clean;
    }

    /**
     * Returns field's default value
     * @return {*}
     */
    getDefaultValue() {
        return this.properties.defaultValue;
    }

    /**
     * Returns field's denied values
     * @return {*}
     */
    getDeniedValues() {
        return this.properties.denied;
    }

    /**
     * Returns field's label
     * @return {*}
     */
    getLabel() {
        return this.properties.label;
    }

    /**
     * Returns field's length
     * @return {*}
     */
    getLength() {
        return this.properties.length;
    }

    /**
     * Returns field's maximal value
     * @return {*}
     */
    getMaxValue() {
        return this.properties.max;
    }

    /**
     * Returns field's maximal words
     * @return {*}
     */
    getMaxWords() {
        return this.properties.maxWords;
    }

    /**
     * Returns field's minimal value
     * @return {*}
     */
    getMinValue() {
        return this.properties.min;
    }

    /**
     * Returns field's minimal words
     * @return {*}
     */
    getMinWords() {
        return this.properties.minWords;
    }

    /**
     * Returns field name
     * @return {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Returns field's prepare function
     * @return {Function|*}
     */
    getPrepareFunction() {
        return this.properties.prepare;
    }

    /**
     * Returns field's properties
     * @return {Object}
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Returns field's regular expression
     * @return {*}
     */
    getRegEx() {
        return this.properties.regEx;
    }

    /**
     * Returns field's type
     * @return {*}
     */
    getType() {
        return this.properties.type;
    }

    /**
     * Checks if field supports decimals
     * @return {*}
     */
    isDecimal() {
        return this.properties.decimal;
    }

    /**
     * Checks if field is nullable
     * @return {boolean}
     */
    isNullable() {
        return this.properties.nullable === true;
    }

    /**
     * Checks if field is required
     * @return {boolean}
     */
    isRequired() {
        return this.properties.required === true;
    }

    /**
     *
     * @param field
     */
    throwFieldBadValueError(field) {
        throw new SchemaError(`field-bad-value`, `The field "${field}" contains a bad value.`, {field});
    }

    /**
     *
     * @param field
     */
    throwFieldDeniedValueError(field) {
        throw new SchemaError(`field-denied-value`, `The field "${field}" contains a denied value.`, {field});
    }

    /**
     *
     * @param field
     */
    throwFieldInstanceError(field) {
        throw new SchemaError(`field-instance`, `The field "${field}" is not a valid instance.`, {field});
    }

    /**
     *
     * @param field
     * @param length
     */
    throwFieldLengthError(field, length) {
        throw new SchemaError(`field-length`, `Length of field "${field}" must be exactly ${length}.`, {
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
        throw new SchemaError(`field-max-length`, `Length of field "${field}" must be at more ${max}.`, {
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
        throw new SchemaError(`field-max-value`, `The field "${field}" must be lesser than or equals to ${max}.`, {
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
        throw new SchemaError(`field-max-words`, `The field "${field}" must contain ${min} words max.`, {
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
        throw new SchemaError(`field-min-length`, `Length of field "${field}" must be at least ${min}.`, {
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
        throw new SchemaError(`field-min-value`, `The field "${field}" must be greater than or equals to ${min}.`, {
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
        throw new SchemaError(`field-min-words`, `The field "${field}" must contain at least ${min} words.`, {
            field,
            min
        });
    }

    /**
     *
     * @param field
     */
    throwFieldMissingError(field) {
        throw new SchemaError(`field-missing`, `The field "${field}" is missing.`, {field});
    }

    /**
     *
     * @param field
     */
    throwFieldNullError(field) {
        throw new SchemaError(`field-null`, `The field "${field}" cannot be null.`, {field});
    }

    /**
     *
     * @param field
     * @param regEx
     */
    throwFieldRegExError(field, regEx) {
        throw new SchemaError(`field-regex`, `The field "${field}" does not match the pattern ${regEx}.`, {
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
        throw new SchemaError(`field-type`, `The field "${field}" is not of type ${type}.`, {field});
    }

    /**
     *
     * @param field
     * @param type
     */
    throwFieldValueTypesError(field, type) {
        throw new SchemaError(`field-values-type`, `The field "${field}" contains values of incorrect type.`, {
            field,
            type
        });
    }

    /**
     * Validates the field
     * @param value
     * @param options
     * @return {*}
     */
    validate(value, options) {
        const props = this.properties;
        const type = props.type;

        // Default options
        options = SchemaUtils.extend({
            context: {[this.name]: value}
        }, options);

        const context = options.context;
        const label = this.computeValue(props.label, context);
        const isNullable = this.computeValue(props.nullable, context);
        const isRequired = this.computeValue(props.required, context);
        const isArray = props.type === Array || props.type instanceof Array;

        // Prepare value
        if (typeof props.prepare === "function") {
            value = props.prepare.call(this, value, context);
        }

        // Clean value
        if (options.clean) {
            value = this.clean(value);
        }

        // Use default value
        if (isRequired && (typeof value === "undefined" || value === null)) {
            // Compute default value
            if (typeof props.defaultValue !== "undefined") {
                value = this.computeValue(props.defaultValue, context);
            }
            // Use empty array for required non-null array field
            if (isArray && (value === null || typeof value === "undefined")) {
                value = [];
            }
        }

        // Check null value
        if (!isNullable && value === null) {
            this.throwFieldNullError(label);
        }

        // Check if value is missing
        if (isRequired && typeof value === "undefined") {
            this.throwFieldMissingError(label);
        }

        // Ignore empty value
        if (typeof value === "undefined" || value === null) {
            return value;
        }

        // Check type
        switch (type) {
            case Array:
                if (!(value instanceof Array)) {
                    this.throwFieldTypeError(label, "array");
                }
                // Ignore empty array if field is not required
                else if (value.length === 0 && !isRequired) {
                    return value;
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
                if (typeof props.decimal !== "undefined") {
                    const isDecimal = this.computeValue(props.decimal, context);

                    // Check decimal
                    if (typeof isDecimal !== "undefined") {
                        if (isDecimal === true && !/^[0-9][0-9]*(\.[0-9]+)?$/.test(String(value))) {
                            this.throwFieldTypeError(label, "float");
                        }
                        if (isDecimal === false && !/^[0-9]+$/.test(String(value))) {
                            this.throwFieldTypeError(label, "integer");
                        }
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
                    else if (value.length === 0 && !isRequired) {
                        return value;
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
        if (typeof props.allowed !== "undefined") {
            const allowed = this.computeValue(props.allowed, context);

            if (value instanceof Array) {
                for (let i = 0; i < value.length; i += 1) {
                    if (!SchemaUtils.contains(allowed, value[i])) {
                        this.throwFieldBadValueError(label);
                    }
                }
            }
            else if (!SchemaUtils.contains(allowed, value)) {
                this.throwFieldBadValueError(label);
            }
        }
        // Check denied values
        else if (typeof props.denied !== "undefined") {
            const denied = this.computeValue(props.denied, context);

            if (value instanceof Array) {
                for (let i = 0; i < value.length; i += 1) {
                    if (SchemaUtils.contains(denied, value[i])) {
                        this.throwFieldDeniedValueError(label);
                    }
                }
            }
            else if (SchemaUtils.contains(denied, value)) {
                this.throwFieldDeniedValueError(label);
            }
        }

        // Check length if value has the length attribute
        if (typeof props.length !== "undefined" && typeof value.length !== "undefined") {
            const length = this.computeValue(props.length, context);

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
        if (typeof props.min !== "undefined") {
            const min = this.computeValue(props.min, context);

            if (value < min) {
                this.throwFieldMinValueError(label, min);
            }
        }

        // Check min words
        if (typeof props.minWords !== "undefined" && typeof value === "string") {
            const min = this.computeValue(props.minWords, context);

            if (value.split(" ").length < min) {
                this.throwFieldMinWordsError(label, min);
            }
        }

        // Check max value
        if (typeof props.max !== "undefined") {
            const max = this.computeValue(props.max, context);

            if (value > max) {
                this.throwFieldMaxValueError(label, max);
            }
        }

        // Check max words
        if (typeof props.maxWords !== "undefined" && typeof value === "string") {
            const max = this.computeValue(props.maxWords, context);

            if (value.split(" ").length > max) {
                this.throwFieldMaxWordsError(label, max);
            }
        }

        // Test regular expression
        if (typeof props.regEx !== "undefined") {
            const regEx = this.computeValue(props.regEx, context);

            if (!regEx.test(value)) {
                this.throwFieldRegExError(label, regEx);
            }
        }

        // Execute custom checks
        if (typeof props.check === "function") {
            if (props.check.call(this, value, context) === false) {
                this.throwFieldBadValueError(label);
            }
        }

        return value;
    }
}
