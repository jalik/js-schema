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
import FieldAllowedError from './errors/FieldAllowedError';
import FieldDeniedError from './errors/FieldDeniedError';
import FieldError from './errors/FieldError';
import FieldInstanceError from './errors/FieldInstanceError';
import FieldLengthError from './errors/FieldLengthError';
import FieldMaxError from './errors/FieldMaxError';
import FieldMaxLengthError from './errors/FieldMaxLengthError';
import FieldMaxWordsError from './errors/FieldMaxWordsError';
import FieldMinError from './errors/FieldMinError';
import FieldMinLengthError from './errors/FieldMinLengthError';
import FieldMinWordsError from './errors/FieldMinWordsError';
import FieldNullableError from './errors/FieldNullableError';
import FieldPatternError from './errors/FieldPatternError';
import FieldRequiredError from './errors/FieldRequiredError';
import FieldTypeError from './errors/FieldTypeError';
import {
  computeValue,
  contains,
} from './utils';

export function joinPath(...paths) {
  return paths.filter((path) => (typeof path === 'string' && path.length > 0)).join('.');
}

/**
 * Schema field properties
 * @type {string[]}
 */
export const fieldProperties = [
  'allowed',
  'check',
  'clean',
  'defaultValue',
  'denied',
  'label',
  'length',
  'max',
  'maxLength',
  'maxWords',
  'min',
  'minLength',
  'minWords',
  'name',
  'nullable',
  'parse',
  'pattern',
  'prepare',
  'required',
  'type',
];

/**
 * Throws an error if properties are not valid.
 * @param {string} name
 * @param {Object} props
 */
function checkFieldProperties(name, props) {
  // Check unknown properties.
  Object.keys(props).forEach((prop) => {
    if (!contains(fieldProperties, prop)) {
      // eslint-disable-next-line no-console
      console.warn(`Unknown schema field property "${name}.${prop}"`);
    }
  });

  const {
    allowed,
    check,
    clean,
    denied,
    label,
    length,
    max,
    maxLength,
    maxWords,
    min,
    minLength,
    minWords,
    nullable,
    parse,
    pattern,
    prepare,
    required,
    type,
  } = props;

  // Check field type
  if (typeof type !== 'undefined' && type !== null) {
    if (type instanceof Array) {
      const arrayType = type[0];

      // Check that array type is a function or class
      if (!contains(['function', 'object', 'string'], typeof arrayType)) {
        throw new TypeError(`${name}.type[] must contain a class or a function`);
      }
    } else if (!contains(['function', 'object', 'string'], typeof type)) {
      throw new TypeError(`${name}.type = "${type}" is not a valid type`);
    }
  }

  // Check conflicting options.
  if (allowed && denied) {
    throw new TypeError('allowed and denied cannot be defined together');
  }

  // Check allowed values
  if (typeof allowed !== 'undefined' && !(allowed instanceof Array) && typeof allowed !== 'function') {
    throw new TypeError(`${name}.allowed must be an array or function`);
  }

  // Check custom check function
  if (typeof check !== 'undefined' && typeof check !== 'function') {
    throw new TypeError(`${name}.check must be a function`);
  }

  // Check custom clean function
  if (typeof clean !== 'undefined' && typeof clean !== 'function') {
    throw new TypeError(`${name}.clean must be a function`);
  }

  // Check denied values
  if (typeof denied !== 'undefined' && !(denied instanceof Array) && typeof denied !== 'function') {
    throw new TypeError(`${name}.denied must be an array or function`);
  }

  // Check label
  if (typeof label !== 'undefined' && !contains(['function', 'string'], typeof label)) {
    throw new TypeError(`${name}.label must be a string or function`);
  }

  // Check length
  if (typeof length !== 'undefined' && !contains(['function', 'number'], typeof length)) {
    throw new TypeError(`${name}.length must be a function or number`);
  }

  // Check max value
  if (typeof max !== 'undefined' && !contains(['function', 'number', 'string'], typeof max) && !(max instanceof Date)) {
    throw new TypeError(`${name}.max must be a date, number, string or function`);
  }

  // Check max length
  if (typeof maxLength !== 'undefined' && !contains(['function', 'number'], typeof maxLength)) {
    throw new TypeError(`${name}.maxLength must be a number or function`);
  }

  // Check max words
  if (typeof maxWords !== 'undefined' && !contains(['function', 'number'], typeof maxWords)) {
    throw new TypeError(`${name}.maxWords must be a number or function`);
  }

  // Check min value
  if (typeof min !== 'undefined' && !contains(['function', 'number', 'string'], typeof min) && !(min instanceof Date)) {
    throw new TypeError(`${name}.min must be a date, number, string or function`);
  }

  // Check min length
  if (typeof minLength !== 'undefined' && !contains(['function', 'number'], typeof minLength)) {
    throw new TypeError(`${name}.minLength must be a number or function`);
  }

  // Check min words
  if (typeof minWords !== 'undefined' && !contains(['function', 'number'], typeof minWords)) {
    throw new TypeError(`${name}.minWords must be a number or function`);
  }

  // Check if field is nullable
  if (typeof nullable !== 'undefined' && !contains(['function', 'boolean'], typeof nullable)) {
    throw new TypeError(`${name}.nullable must be a boolean or function`);
  }

  // Check custom parse function
  if (typeof parse !== 'undefined' && typeof parse !== 'function') {
    throw new TypeError(`${name}.parse must be a function`);
  }

  // Check custom prepare function
  if (typeof prepare !== 'undefined' && typeof prepare !== 'function') {
    throw new TypeError(`${name}.prepare must be a function`);
  }

  // Check pattern (regular expression)
  if (!contains(['undefined', 'string', 'object', 'function'], typeof pattern)
    || (typeof pattern === 'object' && !(pattern instanceof RegExp))) {
    throw new TypeError(`${name}.pattern must be a string, a RegExp or function`);
  }

  // Check required
  if (typeof required !== 'undefined' && !contains(['function', 'boolean'], typeof required)) {
    throw new TypeError(`${name}.required must be a boolean or function`);
  }
}

class SchemaField {
  /**
   * Creates a schema field.
   * @param {string} name
   * @param {Object} properties
   */
  constructor(name, properties) {
    // Default properties
    const props = {
      allowed: undefined,
      check: undefined,
      clean: undefined,
      defaultValue: undefined,
      denied: undefined,
      label: name,
      length: undefined,
      max: undefined,
      maxLength: undefined,
      maxWords: undefined,
      min: undefined,
      minLength: undefined,
      minWords: undefined,
      nullable: undefined,
      parse: undefined,
      pattern: undefined,
      prepare: undefined,
      required: undefined,
      type: undefined,
      ...properties,
    };

    checkFieldProperties(name, props);

    this.name = name;
    this.properties = props;
  }

  /**
   * Cleans a value.
   * todo return a Promise
   * @param {*} value
   * @param {Object} options
   * @return {*}
   */
  clean(value, options = {}) {
    let newValue = value;

    if (newValue !== null) {
      switch (typeof newValue) {
        case 'object': {
          // Cleans all values in the array.
          if (newValue instanceof Array) {
            Object.keys(newValue).forEach((key) => {
              newValue[key] = this.clean(newValue[key]);
            });
          } else if (typeof this.properties.type === 'object' && this.properties.type !== null
            && typeof this.properties.type.clean === 'function') {
            newValue = this.properties.type.clean(newValue, options);
          }
          break;
        }

        case 'string':
          if (typeof this.properties.clean === 'function') {
            newValue = this.properties.clean.call(this, newValue);
          } else {
            newValue = newValue.trim();
          }

          // Return null instead of empty string.
          if (newValue.length === 0) {
            newValue = null;
          }
          break;

        default:
          if (typeof this.properties.clean === 'function') {
            newValue = this.properties.clean.call(this, newValue);
          }
      }
    }
    return newValue;
  }

  /**
   * Returns field's allowed values.
   * @return {[]|function}
   */
  getAllowed() {
    return this.properties.allowed;
  }

  /**
   * Returns field's default value.
   * @return {*}
   */
  getDefaultValue() {
    return this.properties.defaultValue;
  }

  /**
   * Returns field's denied values.
   * @return {[]|function}
   */
  getDenied() {
    return this.properties.denied;
  }

  /**
   * Returns field's label.
   * @return {string}
   */
  getLabel() {
    return this.properties.label;
  }

  /**
   * Returns field's length.
   * @return {number}
   */
  getLength() {
    return this.properties.length;
  }

  /**
   * Returns field's maximal value.
   * @return {number}
   */
  getMax() {
    return this.properties.max;
  }

  /**
   * Returns field's maximal length.
   * @return {number}
   */
  getMaxLength() {
    return this.properties.maxLength;
  }

  /**
   * Returns field's maximal words.
   * @return {number}
   */
  getMaxWords() {
    return this.properties.maxWords;
  }

  /**
   * Returns field's minimal value.
   * @return {number}
   */
  getMin() {
    return this.properties.min;
  }

  /**
   * Returns field's minimal length.
   * @return {number}
   */
  getMinLength() {
    return this.properties.minLength;
  }

  /**
   * Returns field's minimal words.
   * @return {number}
   */
  getMinWords() {
    return this.properties.minWords;
  }

  /**
   * Returns field name.
   * @return {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Returns field's pattern (regular expression).
   * @return {string|RegExp|*}
   */
  getPattern() {
    return this.properties.pattern;
  }

  /**
   * Returns a copy of the field's properties.
   * @return {Object}
   */
  getProperties() {
    return deepExtend({}, this.properties);
  }

  /**
   * Returns field's type.
   * @return {[]|string|Schema}
   */
  getType() {
    return this.properties.type;
  }

  /**
   * Checks if field is nullable.
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
   * Parses a value.
   * todo return a Promise
   * @param {*} value
   * @return {*}
   */
  parse(value) {
    let newValue = value;

    if (newValue !== null) {
      switch (typeof newValue) {
        case 'object':
          // Parses all values in the array.
          if (newValue instanceof Array) {
            Object.keys(newValue).forEach((key) => {
              newValue[key] = this.parse(newValue[key]);
            });
          } else if (typeof this.properties.type === 'object' && this.properties.type !== null
            && typeof this.properties.type.parse === 'function') {
            this.properties.type.parse(newValue);
          }
          break;

        case 'string':
          if (typeof this.properties.parse === 'function') {
            newValue = this.properties.parse.call(this, newValue);
          } else {
            switch (this.properties.type) {
              case 'boolean':
                newValue = /^true$/i.test(newValue);
                break;

              case 'integer':
                newValue = parseInt(newValue, 10);
                break;

              case 'number':
                newValue = Number(newValue);
                break;

              default:
            }
          }
          break;

        default:
      }
    }
    return newValue;
  }

  /**
   * Validates a value.
   * todo return a Promise
   * @param {*} value
   * @param {Object} options
   * @return {*}
   */
  validate(value, options = {}) {
    const opts = {
      clean: false,
      rootOnly: false,
      ...options,
      // Sets validation context.
      context: deepExtend({}, options.context, { [this.name]: value }),
      // Sets validation path.
      path: joinPath(options.path, this.name),
    };

    const { context, path } = opts;
    const props = this.properties;
    const label = computeValue(props.label, context);
    const isNullable = computeValue(props.nullable, context);
    const isRequired = computeValue(props.required, context);
    const isArray = props.type === 'array' || props.type instanceof Array;
    let newVal;

    // Clone value.
    if (typeof value === 'object' && value !== null) {
      if (value instanceof Array) {
        newVal = deepExtend([], value);
      } else if (value instanceof Date) {
        newVal = new Date(value.getTime());
      } else {
        newVal = deepExtend({}, value);
      }
    } else {
      newVal = value;
    }

    // Prepare value
    if (typeof props.prepare === 'function') {
      newVal = props.prepare.call(this, newVal, context);
    }

    // Clean value
    if (opts.clean) {
      newVal = this.clean(newVal);
    }

    // Use default value
    if (isRequired && (typeof newVal === 'undefined' || newVal === null)) {
      // Compute default value
      if (typeof props.defaultValue !== 'undefined') {
        newVal = computeValue(props.defaultValue, context);
      }
      // Use empty array for required non-null array field
      if (isArray && (newVal === null || typeof newVal === 'undefined')) {
        newVal = [];
      }
    }

    // Check null value
    if (!isNullable && newVal === null) {
      throw new FieldNullableError(label, path);
    }

    // Check if value is missing
    if (isRequired && typeof newVal === 'undefined') {
      throw new FieldRequiredError(label, path);
    }

    // Ignore empty value
    if (typeof newVal === 'undefined' || newVal === null) {
      return newVal;
    }

    // Check type
    switch (props.type) {
      case 'array':
        if (!(newVal instanceof Array)) {
          throw new FieldTypeError(label, props.type, path);
        }
        if (newVal.length === 0 && !isRequired) {
          // Ignore empty array if field is not required
          return newVal;
        }
        break;

      case 'boolean':
        if (typeof newVal !== 'boolean') {
          throw new FieldTypeError(label, props.type, path);
        }
        break;

      case 'function':
        if (typeof newVal !== 'function') {
          throw new FieldTypeError(label, 'function', path);
        }
        break;

      case 'integer':
        if (typeof newVal !== 'number' || Number.isNaN(newVal) || newVal !== Math.round(newVal)) {
          throw new FieldTypeError(label, props.type, path);
        }
        break;

      case 'number':
        if (typeof newVal !== 'number' || Number.isNaN(newVal)) {
          throw new FieldTypeError(label, props.type, path);
        }
        break;

      case 'object':
        if (typeof newVal !== 'object' || newVal instanceof Array) {
          throw new FieldTypeError(label, props.type, path);
        }
        break;

      case 'string':
        if (typeof newVal !== 'string') {
          throw new FieldTypeError(label, props.type, path);
        }
        break;

      default:
        // Field is a schema.
        if (typeof props.type === 'object' && props.type !== null
          && typeof props.type.validate === 'function') {
          if (!opts.rootOnly) {
            props.type.validate(newVal, { ...opts, context, path });
          }
        } else if (props.type instanceof Array) {
          // Check that value is an array
          if (!(newVal instanceof Array)) {
            throw new FieldTypeError(label, 'array', path);
          } else if (newVal.length === 0 && !isRequired) {
            // Ignore empty array if field is not required
            return newVal;
          }
          const arrayType = props.type[0];

          // Validate array items using a schema.
          if (typeof arrayType === 'object' && arrayType !== null
            && typeof arrayType.validate === 'function') {
            for (let i = 0; i < newVal.length; i += 1) {
              if (!opts.rootOnly) {
                arrayType.validate(newVal[i], {
                  ...opts,
                  context,
                  path: joinPath(path, `[${i}]`),
                });
              }
            }
          } else {
            // Check that array contains the declared type
            switch (arrayType) {
              case 'boolean':
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'boolean') {
                    throw new FieldTypeError(label, props.type, path);
                  }
                }
                break;

              case 'function':
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'function') {
                    throw new FieldTypeError(label, 'function', path);
                  }
                }
                break;

              case 'integer':
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'number' || Number.isNaN(newVal[i]) || newVal[i] !== Math.round(newVal[i])) {
                    throw new FieldTypeError(label, props.type, path);
                  }
                }
                break;

              case 'number':
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'number') {
                    throw new FieldTypeError(label, props.type, path);
                  }
                }
                break;

              case 'object':
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'object' || newVal[i] instanceof Array) {
                    throw new FieldTypeError(label, props.type, path);
                  }
                }
                break;

              case 'string':
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'string') {
                    throw new FieldTypeError(label, props.type, path);
                  }
                }
                break;

              default:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (!(newVal[i] instanceof arrayType)) {
                    throw new FieldTypeError(label, arrayType, path);
                  }
                }
            }
          }
        } else if (typeof props.type === 'function') {
          // Check if value is an instance of the function
          if (!(newVal instanceof props.type)) {
            throw new FieldInstanceError(label, path);
          }
        } else {
          // todo throw error invalid type
        }
    }

    // Check allowed values
    if (typeof props.allowed !== 'undefined') {
      const allowed = computeValue(props.allowed, context);

      if (newVal instanceof Array) {
        for (let i = 0; i < newVal.length; i += 1) {
          if (!contains(allowed, newVal[i])) {
            throw new FieldAllowedError(label, allowed, path);
          }
        }
      } else if (!contains(allowed, newVal)) {
        throw new FieldAllowedError(label, allowed, path);
      }
    }

    // Check denied values
    if (typeof props.denied !== 'undefined') {
      const denied = computeValue(props.denied, context);

      if (newVal instanceof Array) {
        for (let i = 0; i < newVal.length; i += 1) {
          if (contains(denied, newVal[i])) {
            throw new FieldDeniedError(label, denied, path);
          }
        }
      } else if (contains(denied, newVal)) {
        throw new FieldDeniedError(label, denied, path);
      }
    }

    // Check length if value has the length attribute
    if (typeof props.length !== 'undefined' && typeof newVal.length !== 'undefined') {
      const length = computeValue(props.length, context);

      if (newVal.length !== length) {
        throw new FieldLengthError(label, length, path);
      }
    }

    // Check maximal length
    if (typeof props.maxLength !== 'undefined') {
      const { length } = newVal;
      const maxLength = computeValue(props.maxLength, context);

      if (length > maxLength) {
        throw new FieldMaxLengthError(label, maxLength, path);
      }
    }

    // Check minimal length
    if (typeof props.minLength !== 'undefined') {
      const { length } = newVal;
      const minLength = computeValue(props.minLength, context);

      if (length < minLength) {
        throw new FieldMinLengthError(label, minLength, path);
      }
    }

    // Check maximal words
    if (typeof props.maxWords !== 'undefined' && typeof newVal === 'string') {
      const maxWords = computeValue(props.maxWords, context);

      if (newVal.split(' ').length > maxWords) {
        throw new FieldMaxWordsError(label, maxWords, path);
      }
    }

    // Check minimal words
    if (typeof props.minWords !== 'undefined' && typeof newVal === 'string') {
      const minWords = computeValue(props.minWords, context);

      if (newVal.split(' ').length < minWords) {
        throw new FieldMinWordsError(label, minWords, path);
      }
    }

    // Check maximal value
    if (typeof props.max !== 'undefined') {
      const max = computeValue(props.max, context);

      if (newVal > max) {
        throw new FieldMaxError(label, max, path);
      }
    }

    // Check minimal value
    if (typeof props.min !== 'undefined') {
      const min = computeValue(props.min, context);

      if (newVal < min) {
        throw new FieldMinError(label, min, path);
      }
    }

    // Test regular expression
    if (typeof props.pattern !== 'undefined') {
      let pattern = computeValue(props.pattern, context);

      if (typeof pattern === 'string') {
        pattern = new RegExp(pattern);
      }
      if (!pattern.test(newVal)) {
        throw new FieldPatternError(label, pattern, path);
      }
    }

    // Execute custom checks
    if (typeof props.check === 'function') {
      if (props.check.call(this, newVal, context) === false) {
        throw new FieldError(label, path);
      }
    }

    return newVal;
  }
}

export default SchemaField;
