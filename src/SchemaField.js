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
import FieldRegExError from './errors/FieldRegExError';
import FieldRequiredError from './errors/FieldRequiredError';
import FieldTypeError from './errors/FieldTypeError';
import FieldValueTypesError from './errors/FieldValueTypesError';
import Schema from './Schema';
import { contains } from './utils';

/**
 * Schema field properties
 * @type {[string]}
 */
export const fieldProperties = [
  'allowed',
  'check',
  'clean',
  'decimal',
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
  'prepare',
  'regEx',
  'required',
  'type',
];

class SchemaField {
  constructor(name, properties) {
    // Default properties
    const props = {
      allowed: undefined,
      check: undefined,
      clean: undefined,
      decimal: undefined,
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
      nullable: true,
      parse: undefined,
      prepare: undefined,
      regEx: undefined,
      required: true,
      type: undefined,
      ...properties,
    };

    // Field name
    this.name = name;

    // Field properties
    this.properties = {};

    const propsKeys = Object.keys(props);
    const propsLength = propsKeys.length;

    // Check field properties
    for (let i = 0; i < propsLength; i += 1) {
      const prop = propsKeys[i];

      if (!contains(fieldProperties, prop)) {
        // eslint-disable-next-line no-console
        console.warn(`Unknown schema field property "${name}.${prop}"`);
      }
      // Assign property
      this.properties[prop] = props[prop];
    }

    // Check field type
    if (typeof props.type !== 'undefined' && props.type !== null) {
      if (props.type instanceof Array) {
        const arrayType = props.type[0];

        // Check that array type is a function or class
        if (typeof arrayType !== 'function' && typeof arrayType !== 'object') {
          throw new TypeError(`${name}.type[] must contain a class or a function`);
        }
      } else if (!contains(['function', 'object'], typeof props.type)) {
        throw new TypeError(`${name}.type = "${props.type}" is not a valid type`);
      }
    }

    // Check allowed values
    if (typeof props.allowed !== 'undefined' && !(props.allowed instanceof Array) && typeof props.allowed !== 'function') {
      throw new TypeError(`${name}.allowed must be an array or function`);
    }

    // Check custom check function
    if (typeof props.check !== 'undefined' && typeof props.check !== 'function') {
      throw new TypeError(`${name}.check must be a function`);
    }

    // Check custom clean function
    if (typeof props.clean !== 'undefined' && typeof props.clean !== 'function') {
      throw new TypeError(`${name}.clean must be a function`);
    }

    // Check number decimal
    if (typeof props.decimal !== 'undefined' && !contains(['function', 'boolean'], typeof props.decimal)) {
      throw new TypeError(`${name}.decimal must be a boolean or function`);
    }

    // Check denied values
    if (typeof props.denied !== 'undefined' && !(props.denied instanceof Array) && typeof props.denied !== 'function') {
      throw new TypeError(`${name}.denied must be an array or function`);
    }

    // Set default label if missing
    if (typeof props.label !== 'undefined' && !contains(['function', 'string'], typeof props.label)) {
      throw new TypeError(`${name}.label must be a string or function`);
    }

    // Check length
    if (typeof props.length !== 'undefined') {
      if (props.length instanceof Array) {
        if (props.length.length > 2) {
          throw new RangeError(`${name}.length must only have 2 values [min, max]`);
        }
      } else if (!contains(['function', 'number'], typeof props.length)) {
        throw new TypeError(`${name}.length must be a function, a number or an array[min, max]`);
      }
    }

    // Check max value
    if (typeof props.max !== 'undefined' && !contains(['function', 'number', 'string'], typeof props.max) && !(props.max instanceof Date)) {
      throw new TypeError(`${name}.max must be a date, number, string or function`);
    }

    // Check max length
    if (typeof props.maxLength !== 'undefined' && !contains(['function', 'number'], typeof props.maxLength)) {
      throw new TypeError(`${name}.maxLength must be a number or function`);
    }

    // Check max words
    if (typeof props.maxWords !== 'undefined' && !contains(['function', 'number'], typeof props.maxWords)) {
      throw new TypeError(`${name}.maxWords must be a number or function`);
    }

    // Check min value
    if (typeof props.min !== 'undefined' && !contains(['function', 'number', 'string'], typeof props.min) && !(props.min instanceof Date)) {
      throw new TypeError(`${name}.min must be a date, number, string or function`);
    }

    // Check min length
    if (typeof props.minLength !== 'undefined' && !contains(['function', 'number'], typeof props.minLength)) {
      throw new TypeError(`${name}.minLength must be a number or function`);
    }

    // Check min words
    if (typeof props.minWords !== 'undefined' && !contains(['function', 'number'], typeof props.minWords)) {
      throw new TypeError(`${name}.minWords must be a number or function`);
    }

    // Check if field is nullable
    if (typeof props.nullable !== 'undefined' && !contains(['function', 'boolean'], typeof props.nullable)) {
      throw new TypeError(`${name}.nullable must be a boolean or function`);
    }

    // Check custom parse function
    if (typeof props.parse !== 'undefined' && typeof props.parse !== 'function') {
      throw new TypeError(`${name}.parse must be a function`);
    }

    // Check custom prepare function
    if (typeof props.prepare !== 'undefined' && typeof props.prepare !== 'function') {
      throw new TypeError(`${name}.prepare must be a function`);
    }

    // Check regular expression
    if (typeof props.regEx !== 'undefined' && !contains(['function'], typeof props.regEx) && !(props.regEx instanceof RegExp)) {
      throw new TypeError(`${name}.regEx must be a regular expression or function`);
    }

    // Check required
    if (typeof props.required !== 'undefined' && !contains(['function', 'boolean'], typeof props.required)) {
      throw new TypeError(`${name}.required must be a boolean or function`);
    }
  }

  /**
   * Cleans a value.
   * @param {*} value
   * @return {*}
   */
  clean(value) {
    let newValue = value;

    if (newValue !== null && typeof newValue !== 'undefined') {
      switch (typeof newValue) {
        case 'array':
          for (let i = 0; i < newValue; i += 1) {
            newValue[i] = this.clean(newValue[i]);
          }
          break;

        case 'object': {
          const keys = Object.keys(newValue);
          const keysLength = keys.length;

          for (let i = 0; i < keysLength; i += 1) {
            const key = keys[i];
            newValue[key] = this.clean(newValue[key]);
          }
          break;
        }

        case 'string':
          if (typeof newValue === 'string') {
            // Execute custom clean function
            if (typeof this.getCleanFunction() === 'function') {
              newValue = this.getCleanFunction()(newValue);
            } else {
              newValue = newValue.trim();
            }

            if (newValue.length === 0) {
              newValue = null;
            }
          }
          break;

        default:
      }
    }
    return newValue;
  }

  /**
   * Returns the value of the object.
   * todo move to utils
   * @param {*} value
   * @param {Object} context
   * @return {*}
   */
  static computeValue(value, context) {
    if (typeof value === 'function') {
      return value(context);
    }
    return value;
  }

  /**
   * Returns allowed values.
   * @return {[]|Function}
   */
  getAllowedValues() {
    return this.properties.allowed;
  }

  /**
   * Returns check function.
   * @return {Function|*}
   */
  getCheckFunction() {
    return this.properties.check;
  }

  /**
   * Returns clean function.
   * @return {Function|*}
   */
  getCleanFunction() {
    return this.properties.clean;
  }

  /**
   * Returns default value.
   * @return {*}
   */
  getDefaultValue() {
    return this.properties.defaultValue;
  }

  /**
   * Returns denied values.
   * @return {[]|Function}
   */
  getDeniedValues() {
    return this.properties.denied;
  }

  /**
   * Returns label.
   * @return {string}
   */
  getLabel() {
    return this.properties.label;
  }

  /**
   * Returns length.
   * @return {number}
   */
  getLength() {
    return this.properties.length;
  }

  /**
   * Returns maximal length.
   * @return {number}
   */
  getMaxLength() {
    return this.properties.maxLength;
  }

  /**
   * Returns maximal value.
   * @return {number}
   */
  getMaxValue() {
    return this.properties.max;
  }

  /**
   * Returns maximal words.
   * @return {number}
   */
  getMaxWords() {
    return this.properties.maxWords;
  }

  /**
   * Returns minimal length.
   * @return {number}
   */
  getMinLength() {
    return this.properties.minLength;
  }

  /**
   * Returns minimal value.
   * @return {number}
   */
  getMinValue() {
    return this.properties.min;
  }

  /**
   * Returns minimal words.
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
   * Returns field's parsing function.
   * @return {Function|*}
   */
  getParseFunction() {
    return this.properties.parse;
  }

  /**
   * Returns field's prepare function.
   * @return {Function|*}
   */
  getPrepareFunction() {
    return this.properties.prepare;
  }

  /**
   * Returns field's properties.
   * @return {Object}
   */
  getProperties() {
    return this.properties;
  }

  /**
   * Returns field's regular expression.
   * @return {RegExp|*}
   */
  getRegEx() {
    return this.properties.regEx;
  }

  /**
   * Returns field's type.
   * @return {boolean|number|string|Object|Schema}
   */
  getType() {
    return this.properties.type;
  }

  /**
   * Checks if field supports decimals.
   * @return {boolean}
   */
  isDecimal() {
    return this.properties.decimal === true;
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
   * @param {*} value
   * @return {*}
   */
  parse(value) {
    let newValue = value;

    if (typeof value === 'string') {
      const type = this.getType();

      switch (type) {
        case Boolean:
          newValue = /^(?:1|true)$/i.test(value);
          break;
        case Number:
          newValue = Number(value);
          break;
        case String:// do nothing
          break;
        default: {
          if (typeof type === 'function' && !(type instanceof Schema)
            && typeof this.getParseFunction() === 'function') {
            newValue = this.getParseFunction()(value);
          }
        }
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
  validate(value, options) {
    // Default options
    const opt = {
      context: { [this.name]: value },
      ...options,
    };

    const { context } = opt;
    const props = this.properties;
    const label = SchemaField.computeValue(props.label, context);
    const isNullable = SchemaField.computeValue(props.nullable, context);
    const isRequired = SchemaField.computeValue(props.required, context);
    const isArray = props.type === Array || props.type instanceof Array;
    let newVal = value;

    // Prepare value
    if (typeof props.prepare === 'function') {
      newVal = props.prepare.call(this, newVal, context);
    }

    // Clean value
    if (opt.clean) {
      newVal = this.clean(newVal);
    }

    // Use default value
    if (isRequired && (typeof newVal === 'undefined' || newVal === null)) {
      // Compute default value
      if (typeof props.defaultValue !== 'undefined') {
        newVal = SchemaField.computeValue(props.defaultValue, context);
      }
      // Use empty array for required non-null array field
      if (isArray && (newVal === null || typeof newVal === 'undefined')) {
        newVal = [];
      }
    }

    // Check null value
    if (!isNullable && newVal === null) {
      throw new FieldNullableError(label);
    }

    // Check if value is missing
    if (isRequired && typeof newVal === 'undefined') {
      throw new FieldRequiredError(label);
    }

    // Ignore empty value
    if (typeof newVal === 'undefined' || newVal === null) {
      return newVal;
    }

    // Check type
    switch (props.type) {
      case Array:
        if (!(newVal instanceof Array)) {
          throw new FieldTypeError(label, 'array');
        } else if (newVal.length === 0 && !isRequired) {
          // Ignore empty array if field is not required
          return newVal;
        }
        break;

      case Boolean:
        if (typeof newVal !== 'boolean') {
          throw new FieldTypeError(label, 'boolean');
        }
        break;

      case Function:
        if (typeof newVal !== 'function') {
          throw new FieldTypeError(label, 'function');
        }
        break;

      case Number:
        if (typeof newVal !== 'number' || Number.isNaN(newVal)) {
          throw new FieldTypeError(label, 'number');
        }
        if (typeof props.decimal !== 'undefined') {
          const isDecimal = SchemaField.computeValue(props.decimal, context);

          // Check decimal
          if (typeof isDecimal !== 'undefined') {
            if (isDecimal === true && !/^[0-9][0-9]*(\.[0-9]+)?$/.test(String(newVal))) {
              throw new FieldTypeError(label, 'float');
            }
            if (isDecimal === false && !/^[0-9]+$/.test(String(newVal))) {
              throw new FieldTypeError(label, 'integer');
            }
          }
        }
        break;

      case Object:
        if (typeof newVal !== 'object') {
          throw new FieldTypeError(label, 'object');
        }
        break;

      case String:
        if (typeof newVal !== 'string') {
          throw new FieldTypeError(label, 'string');
        }
        break;

      default:
        if (props.type instanceof Schema) {
          props.type.validate(newVal, opt);
        } else if (props.type instanceof Array) {
          // Check that value is an array
          if (!(newVal instanceof Array)) {
            throw new FieldTypeError(label, 'array');
          } else if (newVal.length === 0 && !isRequired) {
            // Ignore empty array if field is not required
            return newVal;
          }
          const arrayType = props.type[0];

          // Validate array items
          if (arrayType instanceof Schema) {
            for (let i = 0; i < newVal.length; i += 1) {
              arrayType.validate(newVal[i], opt);
            }
          } else {
            // Check that array contains the declared type
            switch (arrayType) {
              case Boolean:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'boolean') {
                    throw new FieldValueTypesError(label, 'boolean');
                  }
                }
                break;

              case Function:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'function') {
                    throw new FieldValueTypesError(label, 'function');
                  }
                }
                break;

              case Number:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'number') {
                    throw new FieldValueTypesError(label, 'number');
                  }
                }
                break;

              case Object:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'object') {
                    throw new FieldValueTypesError(label, 'object');
                  }
                }
                break;

              case String:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'string') {
                    throw new FieldValueTypesError(label, 'string');
                  }
                }
                break;

              default:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (!(newVal[i] instanceof arrayType)) {
                    throw new FieldValueTypesError(label, arrayType);
                  }
                }
            }
          }
        } else if (typeof props.type === 'function') {
          // Check if value is an instance of the function
          if (!(newVal instanceof props.type)) {
            throw new FieldInstanceError(label);
          }
        } else {
          // todo throw error invalid type
        }
    }

    // Check allowed values
    if (typeof props.allowed !== 'undefined') {
      const allowed = SchemaField.computeValue(props.allowed, context);

      if (newVal instanceof Array) {
        for (let i = 0; i < newVal.length; i += 1) {
          if (!contains(allowed, newVal[i])) {
            throw new FieldAllowedError(label, allowed);
          }
        }
      } else if (!contains(allowed, newVal)) {
        throw new FieldAllowedError(label, allowed);
      }
    } else if (typeof props.denied !== 'undefined') {
      // Check denied values
      const denied = SchemaField.computeValue(props.denied, context);

      if (newVal instanceof Array) {
        for (let i = 0; i < newVal.length; i += 1) {
          if (contains(denied, newVal[i])) {
            throw new FieldDeniedError(label, denied);
          }
        }
      } else if (contains(denied, newVal)) {
        throw new FieldDeniedError(label, denied);
      }
    }

    // Check length if value has the length attribute
    if (typeof props.length !== 'undefined' && typeof newVal.length !== 'undefined') {
      const length = SchemaField.computeValue(props.length, context);

      // Ranged length
      if (length instanceof Array) {
        const minLength = length[0];
        const maxLength = length[1];

        if (typeof minLength === 'number' && newVal.length < minLength) {
          throw new FieldMinLengthError(label, minLength);
        }
        if (typeof maxLength === 'number' && newVal.length > maxLength) {
          throw new FieldMaxLengthError(label, maxLength);
        }
      } else if (newVal.length !== length) {
        // Fixed length
        throw new FieldLengthError(label, length);
      }
    }

    // Check maximal length
    if (typeof props.maxLength !== 'undefined') {
      const { length } = newVal;
      const maxLength = SchemaField.computeValue(props.maxLength, context);

      if (length > maxLength) {
        throw new FieldMaxLengthError(label, maxLength);
      }
    }

    // Check minimal length
    if (typeof props.minLength !== 'undefined') {
      const { length } = newVal;
      const minLength = SchemaField.computeValue(props.minLength, context);

      if (length < minLength) {
        throw new FieldMinLengthError(label, minLength);
      }
    }

    // Check maximal words
    if (typeof props.maxWords !== 'undefined' && typeof newVal === 'string') {
      const maxWords = SchemaField.computeValue(props.maxWords, context);

      if (newVal.split(' ').length > maxWords) {
        throw new FieldMaxWordsError(label, maxWords);
      }
    }

    // Check minimal words
    if (typeof props.minWords !== 'undefined' && typeof newVal === 'string') {
      const minWords = SchemaField.computeValue(props.minWords, context);

      if (newVal.split(' ').length < minWords) {
        throw new FieldMinWordsError(label, minWords);
      }
    }

    // Check maximal value
    if (typeof props.max !== 'undefined') {
      const max = SchemaField.computeValue(props.max, context);

      if (newVal > max) {
        throw new FieldMaxError(label, max);
      }
    }

    // Check minimal value
    if (typeof props.min !== 'undefined') {
      const min = SchemaField.computeValue(props.min, context);

      if (newVal < min) {
        throw new FieldMinError(label, min);
      }
    }

    // Test regular expression
    if (typeof props.regEx !== 'undefined') {
      const regEx = SchemaField.computeValue(props.regEx, context);

      if (!regEx.test(newVal)) {
        throw new FieldRegExError(label, regEx);
      }
    }

    // Execute custom checks
    if (typeof props.check === 'function') {
      if (props.check.call(this, newVal, context) === false) {
        throw new FieldError(label);
      }
    }

    return newVal;
  }
}

export default SchemaField;
