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
  /**
   * Creates a schema.
   * @param {Object} fields
   */
  constructor(fields) {
    this.fields = {};

    // Prepare fields
    Object.entries(fields).forEach((field) => {
      this.addField(field[0], field[1]);
    });
  }

  /**
   * Adds field to the schema.
   * @param {string} name
   * @param {Object} props
   */
  addField(name, props) {
    this.fields[name] = new SchemaField(name, props);
  }

  /**
   * Returns a cloned version of the object with all fields cleaned.
   * @param {Object} object
   * @param {Object} options
   * @return {Object}
   */
  clean(object, options) {
    // Default options
    const opt = {
      removeUnknown: true,
      ...options,
    };

    const clonedObject = deepExtend({}, object);
    const fields = this.getFields();
    const keys = Object.keys(clonedObject);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i += 1) {
      const key = keys[i];
      const field = fields[key];

      if (field) {
        const value = clonedObject[key];
        // eslint-disable-next-line no-param-reassign
        clonedObject[key] = field.clean(value);
      } else if (opt.removeUnknown) {
        // Remove unknown field
        // eslint-disable-next-line no-param-reassign
        delete clonedObject[key];
      }
    }
    return clonedObject;
  }

  /**
   * Returns a clone of the schema.
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
   * Returns a new schema based on current schema.
   * @param {Object} fields
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
   * Returns a field.
   * @param {string} name
   * @return {SchemaField}
   */
  getField(name) {
    return this.resolveField(name);
  }

  /**
   * Returns all fields.
   * @return {Object}
   */
  getFields() {
    return this.fields;
  }

  /**
   * Returns the cloned object with all fields parsed.
   * @param {Object} object
   * @return {Object}
   */
  parse(object) {
    const fields = this.getFields();
    const keys = Object.keys(fields);
    const keysLength = keys.length;
    const clonedObject = deepExtend({}, object);

    for (let i = 0; i < keysLength; i += 1) {
      const key = keys[i];
      const field = fields[key];

      if (key in clonedObject) {
        // eslint-disable-next-line no-param-reassign
        clonedObject[key] = field.parse(clonedObject[key]);
      }
    }
    return clonedObject;
  }

  /**
   * Returns a sub schema from selected fields.
   * @param {string[]} fieldNames
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
    return new Schema(deepExtend({}, fields));
  }

  /**
   * Returns a copy of the object without unknown fields.
   * todo move logic to clean()
   * @param {Object} object
   * @return {Object}
   */
  removeUnknownFields(object) {
    const fields = this.getFields();
    const clonedObject = deepExtend({}, object);
    const keys = Object.keys(clonedObject);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i += 1) {
      const key = keys[i];
      const field = fields[key];

      if (!field) {
        // eslint-disable-next-line no-param-reassign
        delete clonedObject[key];
      } else if (field.getType() instanceof Schema) {
        // eslint-disable-next-line no-param-reassign
        clonedObject[key] = field.getType().removeUnknownFields(clonedObject[key]);
      }
    }
    return clonedObject;
  }

  /**
   * Builds an object from a string (ex: [colors][0][code]).
   * @param {string} path (ex: address[country][code])
   * @param {boolean} syntaxChecked
   * @throws {SyntaxError|TypeError}
   * @return {SchemaField|null}
   */
  resolveField(path, syntaxChecked = false) {
    if (typeof path !== 'string') {
      throw new Error('path must be a string');
    }

    const bracketIndex = path.indexOf('[');
    const bracketEnd = path.indexOf(']');
    const dotIndex = path.indexOf('.');

    // Do not check syntax errors if already done.
    if (!syntaxChecked) {
      // Check for extra space.
      if (path.indexOf(' ') !== -1) {
        throw new SyntaxError(`path "${path}" is not valid`);
      }
      // Check if key is not defined (ex: []).
      if (path.indexOf('[]') !== -1) {
        throw new SyntaxError(`missing array index or object attribute in "${path}"`);
      }
      // Check for missing object attribute.
      if (dotIndex + 1 === path.length) {
        throw new SyntaxError(`missing object attribute in "${path}"`);
      }

      const closingBrackets = path.split(']').length;
      const openingBrackets = path.split('[').length;

      // Check for missing opening bracket.
      if (openingBrackets < closingBrackets) {
        throw new SyntaxError(`missing opening bracket "[" in "${path}"`);
      }
      // Check for missing closing bracket.
      if (closingBrackets < openingBrackets) {
        throw new SyntaxError(`missing closing bracket "]" in "${path}"`);
      }
    }

    // Removes array indexes from path because we want to resolve field and not data.
    const realPath = path.replace(/\[[0-9]+]/g, '');

    const fields = this.getFields();
    let name = realPath;
    let subPath;

    // Resolve dot "." path.
    if (dotIndex !== -1 && (bracketIndex === -1 || dotIndex < bracketIndex)) {
      // ex: "object.field" => field: "object", subPath: "field"
      name = realPath.substr(0, dotIndex);
      subPath = realPath.substr(dotIndex + 1);
    }

    // Resolve brackets "[..]" path.
    if (bracketIndex !== -1 && (dotIndex === -1 || bracketIndex < dotIndex)) {
      // ex: "[a].field" => field: "[a]", subPath: "field"
      if (bracketIndex === 0) {
        name = path.substring(bracketIndex + 1, bracketEnd);
        // Resolve "field" instead of ".field" if array is followed by a dot.
        subPath = realPath.substr(bracketEnd + (
          realPath.substr(bracketEnd + 1, 1) === '.' ? 2 : 1
        ));
      } else {
        // ex: "array[a].field" => field: "array", subPath: "[a].field"
        name = path.substr(0, bracketIndex);
        subPath = realPath.substr(bracketIndex);
      }
    }

    if (typeof fields[name] === 'undefined') {
      throw new Error(`Field "${name}" does not exist`);
    }

    let field = fields[name];

    if (typeof subPath === 'string' && subPath.length > 0) {
      const type = field.getType();

      if (type instanceof Schema) {
        field = type.resolveField(subPath);
      } else if (type instanceof Array && type[0] instanceof Schema) {
        field = type[0].resolveField(subPath);
      } else {
        throw new Error(`Field type not supported for "${name}".`);
      }
    }
    return field;
  }

  /**
   * Validates an object.
   * todo do not parse in validate
   * todo return a Promise
   * @param {Object} object
   * @param {Object} options
   * @throws {SchemaError|FieldUnknownError}
   * @return {Object}
   */
  validate(object, options = {}) {
    // Default options
    const opt = {
      clean: true,
      ignoreMissing: false,
      ignoreUnknown: false,
      parse: true,
      removeUnknown: false,
      ...options,
    };

    let clonedObject = deepExtend({}, object);
    const fields = this.getFields();

    // Check if object is null
    if (typeof clonedObject !== 'object' || clonedObject === null) {
      throw new SchemaError('object-invalid', 'cannot validate null object');
    }

    // Remove unknown fields
    if (opt.removeUnknown) {
      // eslint-disable-next-line no-param-reassign
      clonedObject = this.removeUnknownFields(clonedObject);
    }

    // Check unknown fields
    if (!opt.ignoreUnknown) {
      const objKeys = Object.keys(clonedObject);
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
      clonedObject = this.parse(clonedObject);
    }

    // Add object as context of validation
    opt.context = clonedObject;

    const keys = Object.keys(fields);
    const keyLength = keys.length;

    // Validate fields
    for (let i = 0; i < keyLength; i += 1) {
      const key = keys[i];
      const value = clonedObject[key];

      // Ignore missing fields
      if (typeof value !== 'undefined' || !opt.ignoreMissing) {
        // Validate field and return processed value
        // eslint-disable-next-line no-param-reassign
        clonedObject[key] = fields[key].validate(value, opt);
      }
    }
    return clonedObject;
  }
}

export default Schema;
