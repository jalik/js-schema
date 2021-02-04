/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import deepExtend from '@jalik/deep-extend';
import FieldError from './errors/FieldError';
import FieldUnknownError from './errors/FieldUnknownError';
import ValidationError from './errors/ValidationError';
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
    return this.pick(Object.keys(this.fields));
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
   * Returns fields errors without throwing an error.
   * @param {Object} object
   * @param {Object} options
   * @return {Object}
   */
  getErrors(object, options = {}) {
    const opts = {
      ...options,
      clean: false,
      parse: false,
      removeUnknown: false,
    };
    let errors = null;

    try {
      this.validate(object, opts);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors = error.errors;
      } else {
        throw error;
      }
    }
    return errors;
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
   * @param {Object} object
   * @return {Object}
   */
  removeUnknownFields(object) {
    const clone = deepExtend({}, object);

    Object.keys(clone).forEach((name) => {
      const field = this.fields[name];

      if (typeof field === 'undefined') {
        delete clone[name];
      } else if (field.getType() instanceof Schema) {
        clone[name] = field.getType().removeUnknownFields(clone[name]);
      } else if (field.getItems() && field.getItems().type instanceof Schema) {
        if (clone[name] instanceof Array) {
          clone[name] = clone[name].map((item) => field.getItems().type.removeUnknownFields(item));
        }
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

    if (typeof this.fields[name] === 'undefined') {
      throw new Error(`Field "${name}" does not exist`);
    }

    let field = this.fields[name];

    if (typeof subPath === 'string' && subPath.length > 0) {
      const type = field.getType();
      const props = field.getProperties();

      if (type instanceof Schema) {
        field = type.resolveField(subPath, true);
      } else if (typeof props.items !== 'undefined'
        && typeof props.items.type !== 'undefined' && props.items.type instanceof Schema) {
        field = props.items.type.resolveField(subPath, true);
      } else {
        throw new Error(`Field type not supported for "${name}".`);
      }
    }
    return field;
  }

  /**
   * Throws an error when an unknown field is found.
   * @param {Object} object
   * @param {string} path
   * @throws {FieldUnknownError}
   */
  throwUnknownFields(object, path) {
    Object.keys(object).forEach((name) => {
      if (typeof this.fields[name] === 'undefined') {
        throw new FieldUnknownError(name, path);
      }
    });
  }

  /**
   * Validates an object.
   * @param {Object} object
   * @param {Object} options
   * @throws {ValidationError|FieldUnknownError}
   * @return {Object}
   */
  validate(object, options = {}) {
    if (typeof object !== 'object' || object === null) {
      throw new TypeError('cannot validate null object');
    }

    const opts = {
      clean: false,
      ignoreMissing: false,
      ignoreUnknown: false,
      parse: false,
      path: null,
      removeUnknown: false,
      ...options,
    };

    // Checks conflicting options.
    if (opts.ignoreUnknown && opts.removeUnknown) {
      throw new Error('options "ignoreUnknown" and "removeUnknown" cannot be both true');
    }

    let clone = deepExtend({}, object);

    // Removes or throws unknown fields.
    if (opts.removeUnknown) {
      clone = this.removeUnknownFields(clone);
    } else if (!opts.ignoreUnknown) {
      this.throwUnknownFields(clone, opts.path);
    }

    // Parses values.
    if (opts.parse) {
      clone = this.parse(clone);
    }

    // Sets validation context.
    opts.context = clone;

    const errors = {};

    Object.keys(this.fields).forEach((name) => {
      const value = clone[name];

      // Ignore missing field if allowed.
      if (typeof value !== 'undefined' || !opts.ignoreMissing) {
        try {
          clone[name] = this.fields[name].validate(value, opts);
        } catch (error) {
          if (error instanceof FieldError) {
            errors[error.path] = error;
          } else if (error instanceof ValidationError) {
            Object.keys(error.errors).forEach((path) => {
              errors[path] = error.errors[path];
            });
          }
        }
      }
    });

    // Throws schema errors.
    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }
    return clone;
  }

  /**
   * Returns a sub schema without some fields.
   * @param {string[]} fieldNames
   * @return {Schema}
   */
  without(fieldNames) {
    const fields = {};

    Object.keys(this.fields).forEach((name) => {
      if (fieldNames.indexOf(name) === -1) {
        fields[name] = this.fields[name].getProperties();
      }
    });
    return new Schema(deepExtend({}, fields));
  }
}

export default Schema;
