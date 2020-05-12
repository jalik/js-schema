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
import SchemaField from './SchemaField';

class Schema {
  /**
   * Creates a schema.
   * @param {Object} fields
   */
  constructor(fields) {
    this.fields = {};

    // Adds fields.
    Object.keys(fields).forEach((name) => {
      this.fields[name] = new SchemaField(name, fields[name]);
    });
  }

  /**
   * Returns a copy of the object with all fields cleaned.
   * @param {Object} object
   * @param {Object} options
   * @return {Object}
   */
  clean(object, options = {}) {
    const opts = {
      removeUnknown: true,
      ...options,
    };

    const clone = deepExtend({}, object);

    Object.keys(clone).forEach((name) => {
      if (typeof this.fields[name] !== 'undefined') {
        clone[name] = this.fields[name].clean(clone[name]);
      } else if (opts.removeUnknown) {
        delete clone[name];
      }
    });
    return clone;
  }

  /**
   * Returns a clone of the schema.
   * @return {Schema}
   */
  clone() {
    return this.pick(Object.keys(this.getFields()));
  }

  /**
   * Returns a new schema based on current schema.
   * @param {Object} fields
   * @return {Schema}
   */
  extend(fields) {
    const properties = {};

    Object.keys(this.fields).forEach((name) => {
      properties[name] = this.fields[name].getProperties();
    });
    return new Schema(deepExtend({}, properties, fields));
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
   * Returns a copy of the object with all fields parsed.
   * @param {Object} object
   * @return {Object}
   */
  parse(object) {
    const clone = deepExtend({}, object);

    Object.keys(clone).forEach((name) => {
      if (typeof this.fields[name] !== 'undefined') {
        clone[name] = this.fields[name].parse(clone[name]);
      }
    });
    return clone;
  }

  /**
   * Returns a sub schema from selected fields.
   * @param {string[]} fieldNames
   * @return {Schema}
   */
  pick(fieldNames) {
    const fields = {};

    fieldNames.forEach((name) => {
      if (typeof this.fields[name] !== 'undefined') {
        fields[name] = this.fields[name].getProperties();
      }
    });
    return new Schema(deepExtend({}, fields));
  }

  /**
   * Returns a copy of the object without unknown fields.
   * todo move logic to clean()
   * @param {Object} object
   * @return {Object}
   */
  removeUnknownFields(object) {
    const clone = deepExtend({}, object);

    Object.keys(clone).forEach((name) => {
      if (typeof this.fields[name] === 'undefined') {
        delete clone[name];
      } else if (this.fields[name].getType() instanceof Schema) {
        clone[name] = this.fields[name].getType().removeUnknownFields(clone[name]);
      }
    });
    return clone;
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

    // Removes array indexes from path because we want to resolve field and not data.
    const realPath = path.replace(/\[\d+]/g, '');

    const bracketIndex = realPath.indexOf('[');
    const bracketEnd = realPath.indexOf(']');
    const dotIndex = realPath.indexOf('.');

    // Do not check syntax errors if already done.
    if (!syntaxChecked) {
      // Check for extra space.
      if (realPath.indexOf(' ') !== -1) {
        throw new SyntaxError(`path "${path}" is not valid`);
      }
      // Check if key is not defined (ex: []).
      if (realPath.indexOf('[]') !== -1) {
        throw new SyntaxError(`missing array index or object attribute in "${path}"`);
      }
      // Check for missing object attribute.
      if (dotIndex + 1 === realPath.length) {
        throw new SyntaxError(`missing object attribute in "${path}"`);
      }

      const closingBrackets = realPath.split(']').length;
      const openingBrackets = realPath.split('[').length;

      // Check for missing opening bracket.
      if (openingBrackets < closingBrackets) {
        throw new SyntaxError(`missing opening bracket "[" in "${path}"`);
      }
      // Check for missing closing bracket.
      if (closingBrackets < openingBrackets) {
        throw new SyntaxError(`missing closing bracket "]" in "${path}"`);
      }
    }

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
        name = realPath.substring(bracketIndex + 1, bracketEnd);
        // Resolve "field" instead of ".field" if array is followed by a dot.
        subPath = realPath.substr(bracketEnd + (
          realPath.substr(bracketEnd + 1, 1) === '.' ? 2 : 1
        ));
      } else {
        // ex: "array[a].field" => field: "array", subPath: "[a].field"
        name = realPath.substr(0, bracketIndex);
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
        field = type.resolveField(subPath, true);
      } else if (type instanceof Array && type[0] instanceof Schema) {
        field = type[0].resolveField(subPath, true);
      } else {
        throw new Error(`Field type not supported for "${name}".`);
      }
    }
    return field;
  }

  /**
   * Throws an error when an unknown field is found.
   * @param {Object} object
   * @throws {FieldUnknownError}
   */
  throwUnknownFields(object) {
    Object.keys(object).forEach((name) => {
      if (typeof this.fields[name] === 'undefined') {
        throw new FieldUnknownError(name);
      }
    });
  }

  /**
   * Validates an object.
   * @param {Object} object
   * @param {Object} options
   * @throws {FieldUnknownError}
   * @return {Object}
   */
  validate(object, options = {}) {
    if (typeof object !== 'object' || object === null) {
      throw new TypeError('cannot validate null object');
    }

    const opts = {
      clean: true,
      ignoreMissing: false,
      ignoreUnknown: false,
      parse: true,
      removeUnknown: false,
      ...options,
    };

    let clone = deepExtend({}, object);
    const fields = this.getFields();
    const fieldNames = Object.keys(fields);

    // Removes or throws unknown fields.
    if (opts.removeUnknown) {
      clone = this.removeUnknownFields(clone);
    } else if (!opts.ignoreUnknown) {
      this.throwUnknownFields(clone);
    }

    // Parses values.
    if (opts.parse) {
      clone = this.parse(clone);
    }

    // Sets object as validation context.
    opts.context = clone;

    for (let i = 0; i < fieldNames.length; i += 1) {
      const name = fieldNames[i];
      const value = clone[name];

      // Ignore missing field if allowed.
      if (typeof value !== 'undefined' || !opts.ignoreMissing) {
        clone[name] = fields[name].validate(value, opts);
      }
    }
    return clone;
  }
}

export default Schema;
