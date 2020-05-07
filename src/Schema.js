/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import deepExtend from '@jalik/deep-extend';
import FieldUnknownError from './errors/FieldUnknownError';
import SchemaError from './errors/SchemaError';
import SchemaField from './SchemaField';

class Schema {
  constructor(fields) {
    this.fields = {};

    const fieldsKeys = Object.keys(fields);
    const fieldsLength = fieldsKeys.length;

    // Prepare fields
    for (let i = 0; i < fieldsLength; i += 1) {
      const field = fieldsKeys[i];
      this.addField(field, fields[field]);
    }
  }

  /**
   * Adds field to the schema
   * @param name
   * @param props
   */
  addField(name, props) {
    this.fields[name] = new SchemaField(name, props);
  }

  /**
   * Cleans the object based on the schema
   * @param obj
   * @param options
   * @return {*}
   */
  clean(obj, options) {
    // Default options
    const opt = {
      removeUnknown: true,
      ...options,
    };

    const fields = this.getFields();
    const keys = Object.keys(obj);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i += 1) {
      const key = keys[i];
      const field = fields[key];

      if (field) {
        const value = obj[key];
        // eslint-disable-next-line no-param-reassign
        obj[key] = field.clean(value);
      } else if (opt.removeUnknown) {
        // Remove unknown field
        // eslint-disable-next-line no-param-reassign
        delete obj[key];
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
    const keys = Object.keys(fields);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i += 1) {
      const fieldName = keys[i];
      fieldNames.push(fieldName);
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
    const keys = Object.keys(schemaFields);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i += 1) {
      const fieldName = keys[i];
      fieldProperties[fieldName] = schemaFields[fieldName].getProperties();
    }
    return new Schema(deepExtend({}, fieldProperties, fields));
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
    return this.fields;
  }

  /**
   * Parses object fields
   * @param obj
   * @return {*}
   */
  parse(obj) {
    const fields = this.getFields();
    const keys = Object.keys(fields);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i += 1) {
      const key = keys[i];
      const field = fields[key];

      if (key in obj) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = field.parse(obj[key]);
      }
    }
    return obj;
  }

  /**
   * Creates a sub schema from selected fields
   * @param fieldNames
   * @return {Schema}
   */
  pick(fieldNames) {
    const fields = {};
    const schemaFields = this.getFields();
    const keysLength = fieldNames.length;

    for (let i = 0; i < keysLength; i += 1) {
      const fieldName = fieldNames[i];

      if (typeof schemaFields[fieldName] !== 'undefined') {
        fields[fieldName] = schemaFields[fieldName].getProperties();
      }
    }
    return new Schema(fields);
  }

  /**
   * Returns the object without unknown fields
   * @param obj
   * @return {*}
   */
  removeUnknownFields(obj) {
    const fields = this.getFields();
    const keys = Object.keys(obj);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i += 1) {
      const key = keys[i];
      const field = fields[key];

      if (!field) {
        // eslint-disable-next-line no-param-reassign
        delete obj[key];
      } else if (field.getType() instanceof Schema) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = field.getType().removeUnknownFields(obj[key]);
      }
    }
    return obj;
  }

  /**
   * Builds an object from a string (ex: [colors][0][code])
   * @param path (ex: address[country][code])
   * @throws SyntaxError|TypeError
   * @return {SchemaField|null}
   */
  resolveField(path) {
    let value;
    const fields = this.getFields();
    const index = path.indexOf('[');

    // Remove array indexes
    const newPath = path.replace(/\[[0-9]+]/g, '');

    // Check missing brackets
    if (index !== -1) {
      const opening = newPath.match(/\[/g).length;
      const closing = newPath.match(/]/g).length;

      if (opening !== closing) {
        throw new SyntaxError(`Missing opening '[' or closing ']' in '${newPath}'`);
      }
    }

    let fieldName;
    let subTree = '';

    if (index < 0) {
      fieldName = newPath;
    } else if (index > 0) {
      fieldName = newPath.substring(0, index);
      subTree = newPath.substring(index);
    } else if (index === 0) {
      fieldName = newPath.substring(1, newPath.indexOf(']'));
      const index2 = newPath.indexOf('[', 1);

      if (index2 !== -1) {
        subTree = newPath.substring(index2);
      }
    }

    if (typeof fields[fieldName] !== 'undefined') {
      const field = fields[fieldName];

      // Check sub field
      if (subTree && subTree.length) {
        const schema = field.getType();

        if (schema instanceof Schema) {
          value = schema.resolveField(subTree);
        } else if (schema instanceof Array) {
          if (schema[0] instanceof Schema) {
            value = schema[0].resolveField(subTree);
          }
        } else {
          throw new TypeError(`Unknown field type for "${fieldName}".`);
        }
      } else if (newPath === fieldName || newPath === `[${fieldName}]`) {
        value = field;
      }
    }
    return value;
  }

  /**
   * Updates existing fields
   * @param fields
   * @return {Schema}
   */
  update(fields) {
    const schemaFields = this.getFields();
    const keys = Object.keys(fields);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i += 1) {
      const fieldName = keys[i];
      const props = fields[fieldName];
      const field = schemaFields[fieldName].getProperties() || {};
      this.addField(fieldName, deepExtend({}, field, props));
    }
    return this;
  }

  /**
   * Validates the object
   * @param obj
   * @param options
   * @throws Error
   * @return {*}
   */
  validate(obj, options) {
    // Default options
    const opt = {
      clean: true,
      ignoreMissing: false,
      ignoreUnknown: false,
      parse: true,
      removeUnknown: false,
      ...options,
    };

    const fields = this.getFields();

    // Check if object is null
    if (typeof obj !== 'object' || obj === null) {
      throw new SchemaError('object-invalid', 'cannot validate null object');
    }

    // Remove unknown fields
    if (opt.removeUnknown) {
      // eslint-disable-next-line no-param-reassign
      obj = this.removeUnknownFields(obj);
    }

    // Check unknown fields
    if (!opt.ignoreUnknown) {
      const objKeys = Object.keys(obj);
      const objKeysLength = objKeys.length;

      for (let i = 0; i < objKeysLength; i += 1) {
        const key = objKeys[i];

        if (!fields[key]) {
          throw new FieldUnknownError(key);
        }
      }
    }

    // Parse object fields
    if (opt.parse) {
      // eslint-disable-next-line no-param-reassign
      obj = this.parse(obj);
    }

    // Add object as context of validation
    opt.context = obj;

    const keys = Object.keys(fields);
    const keyLength = keys.length;

    // Validate fields
    for (let i = 0; i < keyLength; i += 1) {
      const key = keys[i];
      const value = obj[key];

      // Ignore missing fields
      if (typeof value !== 'undefined' || !opt.ignoreMissing) {
        // Validate field and return processed value
        // eslint-disable-next-line no-param-reassign
        obj[key] = fields[key].validate(value, opt);
      }
    }
    return obj;
  }
}

export default Schema;
