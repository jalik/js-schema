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

import SchemaUtils from "./index";
import {SchemaError} from "./schema-error";
import {SchemaField} from "./schema-field";

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
        options = SchemaUtils.extend({
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
        const fields = this.getFields();
        const fieldNames = [];

        for (let fieldName in fields) {
            if (fields.hasOwnProperty(fieldName)) {
                fieldNames.push(fieldName);
            }
        }
        return this.pick(fieldNames);
    }

    /**
     * Creates a new schema based on current schema
     * @param fields
     * @return {Schema}
     */
    extend(fields) {
        const fieldProperties = {};
        const schemaFields = this.getFields();

        for (let fieldName in schemaFields) {
            if (schemaFields.hasOwnProperty(fieldName)) {
                fieldProperties[fieldName] = schemaFields[fieldName].getProperties();
            }
        }
        return new Schema(SchemaUtils.extend({}, fieldProperties, fields));
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
     * @return {Object}
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
     * @param fieldNames
     * @return {Schema}
     */
    pick(fieldNames) {
        let fields = {};
        const schemaFields = this.getFields();

        for (let i = 0; i < fieldNames.length; i += 1) {
            const fieldName = fieldNames[i];

            if (schemaFields.hasOwnProperty(fieldName)) {
                fields[fieldName] = schemaFields[fieldName].getProperties();
            }
        }
        return new Schema(fields);
    }

    /**
     * Remove unknown fields
     * @param obj
     * @return {*}
     */
    removeUnknownFields(obj) {
        const fields = this.getFields();

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const field = fields[key];

                if (!field) {
                    delete obj[key];
                }
            }
        }
        return obj;
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
                const schema = field.getType();

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
        const schemaFields = this.getFields();

        for (let fieldName in fields) {
            if (fields.hasOwnProperty(fieldName)) {
                const props = fields[fieldName];
                const field = schemaFields[fieldName].getProperties() || {};
                this.addField(fieldName, SchemaUtils.extend({}, field, props));
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
        options = SchemaUtils.extend({
            clean: true,
            ignoreMissing: false,
            ignoreUnknown: false,
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

        // Remove unknown fields
        if (options.removeUnknown) {
            this.removeUnknownFields(obj);
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
