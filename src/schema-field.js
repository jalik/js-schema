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

// eslint-disable-next-line import/no-cycle
import Schema from './schema';
import SchemaError from './schema-error';
import utils from './utils';

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

      if (!utils.contains(fieldProperties, prop)) {
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
      } else if (!utils.contains(['function', 'object'], typeof props.type)) {
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
    if (typeof props.decimal !== 'undefined' && !utils.contains(['function', 'boolean'], typeof props.decimal)) {
      throw new TypeError(`${name}.decimal must be a boolean or function`);
    }

    // Check denied values
    if (typeof props.denied !== 'undefined' && !(props.denied instanceof Array) && typeof props.denied !== 'function') {
      throw new TypeError(`${name}.denied must be an array or function`);
    }

    // Set default label if missing
    if (typeof props.label !== 'undefined' && !utils.contains(['function', 'string'], typeof props.label)) {
      throw new TypeError(`${name}.label must be a string or function`);
    }

    // Check length
    if (typeof props.length !== 'undefined') {
      if (props.length instanceof Array) {
        if (props.length.length > 2) {
          throw new RangeError(`${name}.length must only have 2 values [min, max]`);
        }
      } else if (!utils.contains(['function', 'number'], typeof props.length)) {
        throw new TypeError(`${name}.length must be a function, a number or an array[min, max]`);
      }
    }

    // Check max value
    if (typeof props.max !== 'undefined' && !utils.contains(['function', 'number', 'string'], typeof props.max) && !(props.max instanceof Date)) {
      throw new TypeError(`${name}.max must be a date, number, string or function`);
    }

    // Check max length
    if (typeof props.maxLength !== 'undefined' && !utils.contains(['function', 'number'], typeof props.maxLength)) {
      throw new TypeError(`${name}.maxLength must be a number or function`);
    }

    // Check max words
    if (typeof props.maxWords !== 'undefined' && !utils.contains(['function', 'number'], typeof props.maxWords)) {
      throw new TypeError(`${name}.maxWords must be a number or function`);
    }

    // Check min value
    if (typeof props.min !== 'undefined' && !utils.contains(['function', 'number', 'string'], typeof props.min) && !(props.min instanceof Date)) {
      throw new TypeError(`${name}.min must be a date, number, string or function`);
    }

    // Check min length
    if (typeof props.minLength !== 'undefined' && !utils.contains(['function', 'number'], typeof props.minLength)) {
      throw new TypeError(`${name}.minLength must be a number or function`);
    }

    // Check min words
    if (typeof props.minWords !== 'undefined' && !utils.contains(['function', 'number'], typeof props.minWords)) {
      throw new TypeError(`${name}.minWords must be a number or function`);
    }

    // Check if field is nullable
    if (typeof props.nullable !== 'undefined' && !utils.contains(['function', 'boolean'], typeof props.nullable)) {
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
    if (typeof props.regEx !== 'undefined' && !utils.contains(['function'], typeof props.regEx) && !(props.regEx instanceof RegExp)) {
      throw new TypeError(`${name}.regEx must be a regular expression or function`);
    }

    // Check required
    if (typeof props.required !== 'undefined' && !utils.contains(['function', 'boolean'], typeof props.required)) {
      throw new TypeError(`${name}.required must be a boolean or function`);
    }
  }

  /**
   * Cleans the value
   * @param value
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
   * Returns the value of the object
   * @param value
   * @param context
   * @return {*}
   */
  static computeValue(value, context) {
    if (typeof value === 'function') {
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
   * Returns field's maximal length
   * @return {null|number}
   */
  getMaxLength() {
    return this.properties.maxLength;
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
   * Returns field's minimal length
   * @return {null|number}
   */
  getMinLength() {
    return this.properties.minLength;
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
   * Returns field's parsing function
   * @return {Function|*}
   */
  getParseFunction() {
    return this.properties.parse;
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
   * Parses value
   * @param value
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
   *
   * @param field
   */
  static throwFieldBadValueError(field) {
    throw new SchemaError(
      'field-bad-value',
      `The field "${field}" contains a bad value.`,
      { field },
    );
  }

  /**
   *
   * @param field
   */
  static throwFieldDeniedValueError(field) {
    throw new SchemaError(
      'field-denied-value',
      `The field "${field}" contains a denied value.`,
      { field },
    );
  }

  /**
   *
   * @param field
   */
  static throwFieldInstanceError(field) {
    throw new SchemaError(
      'field-instance',
      `The field "${field}" is not a valid instance.`,
      { field },
    );
  }

  /**
   *
   * @param field
   * @param length
   */
  static throwFieldLengthError(field, length) {
    throw new SchemaError(
      'field-length',
      `Length of field "${field}" must be exactly ${length}.`,
      { field, length },
    );
  }

  /**
   *
   * @param field
   * @param max
   */
  static throwFieldMaxLengthError(field, max) {
    throw new SchemaError(
      'field-max-length',
      `Length of field "${field}" must be at more ${max}.`,
      { field, max },
    );
  }

  /**
   *
   * @param field
   * @param max
   */
  static throwFieldMaxValueError(field, max) {
    throw new SchemaError(
      'field-max-value',
      `The field "${field}" must be lesser than or equals to ${max}.`,
      { field, max },
    );
  }

  /**
   *
   * @param field
   * @param min
   */
  static throwFieldMaxWordsError(field, min) {
    throw new SchemaError(
      'field-max-words',
      `The field "${field}" must contain ${min} words max.`,
      { field, min },
    );
  }

  /**
   *
   * @param field
   * @param min
   */
  static throwFieldMinLengthError(field, min) {
    throw new SchemaError(
      'field-min-length',
      `Length of field "${field}" must be at least ${min}.`,
      { field, min },
    );
  }

  /**
   *
   * @param field
   * @param min
   */
  static throwFieldMinValueError(field, min) {
    throw new SchemaError(
      'field-min-value',
      `The field "${field}" must be greater than or equals to ${min}.`,
      { field, min },
    );
  }

  /**
   *
   * @param field
   * @param min
   */
  static throwFieldMinWordsError(field, min) {
    throw new SchemaError(
      'field-min-words',
      `The field "${field}" must contain at least ${min} words.`,
      { field, min },
    );
  }

  /**
   *
   * @param field
   */
  static throwFieldMissingError(field) {
    throw new SchemaError(
      'field-missing',
      `The field "${field}" is missing.`,
      { field },
    );
  }

  /**
   *
   * @param field
   */
  static throwFieldNullError(field) {
    throw new SchemaError(
      'field-null',
      `The field "${field}" cannot be null.`,
      { field },
    );
  }

  /**
   *
   * @param field
   * @param regEx
   */
  static throwFieldRegExError(field, regEx) {
    throw new SchemaError(
      'field-regex',
      `The field "${field}" does not match the pattern ${regEx}.`,
      { field, regEx },
    );
  }

  /**
   *
   * @param field
   * @param type
   */
  static throwFieldTypeError(field, type) {
    throw new SchemaError(
      'field-type',
      `The field "${field}" is not of type ${type}.`,
      { field },
    );
  }

  /**
   *
   * @param field
   * @param type
   */
  static throwFieldValueTypesError(field, type) {
    throw new SchemaError(
      'field-values-type',
      `The field "${field}" contains values of incorrect type.`,
      { field, type },
    );
  }

  /**
   * Validates the field
   * @param value
   * @param options
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
      SchemaField.throwFieldNullError(label);
    }

    // Check if value is missing
    if (isRequired && typeof newVal === 'undefined') {
      SchemaField.throwFieldMissingError(label);
    }

    // Ignore empty value
    if (typeof newVal === 'undefined' || newVal === null) {
      return newVal;
    }

    // Check type
    switch (props.type) {
      case Array:
        if (!(newVal instanceof Array)) {
          SchemaField.throwFieldTypeError(label, 'array');
        } else if (newVal.length === 0 && !isRequired) {
          // Ignore empty array if field is not required
          return newVal;
        }
        break;

      case Boolean:
        if (typeof newVal !== 'boolean') {
          SchemaField.throwFieldTypeError(label, 'boolean');
        }
        break;

      case Function:
        if (typeof newVal !== 'function') {
          SchemaField.throwFieldTypeError(label, 'function');
        }
        break;

      case Number:
        if (typeof newVal !== 'number' || Number.isNaN(newVal)) {
          SchemaField.throwFieldTypeError(label, 'number');
        }
        if (typeof props.decimal !== 'undefined') {
          const isDecimal = SchemaField.computeValue(props.decimal, context);

          // Check decimal
          if (typeof isDecimal !== 'undefined') {
            if (isDecimal === true && !/^[0-9][0-9]*(\.[0-9]+)?$/.test(String(newVal))) {
              SchemaField.throwFieldTypeError(label, 'float');
            }
            if (isDecimal === false && !/^[0-9]+$/.test(String(newVal))) {
              SchemaField.throwFieldTypeError(label, 'integer');
            }
          }
        }
        break;

      case Object:
        if (typeof newVal !== 'object') {
          SchemaField.throwFieldTypeError(label, 'object');
        }
        break;

      case String:
        if (typeof newVal !== 'string') {
          SchemaField.throwFieldTypeError(label, 'string');
        }
        break;

      default:
        if (props.type instanceof Schema) {
          props.type.validate(newVal, opt);
        } else if (props.type instanceof Array) {
          // Check that value is an array
          if (!(newVal instanceof Array)) {
            SchemaField.throwFieldTypeError(label, 'array');
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
                    SchemaField.throwFieldValueTypesError(label, 'boolean');
                  }
                }
                break;

              case Function:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'function') {
                    SchemaField.throwFieldValueTypesError(label, 'function');
                  }
                }
                break;

              case Number:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'number') {
                    SchemaField.throwFieldValueTypesError(label, 'number');
                  }
                }
                break;

              case Object:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'object') {
                    SchemaField.throwFieldValueTypesError(label, 'object');
                  }
                }
                break;

              case String:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (typeof newVal[i] !== 'string') {
                    SchemaField.throwFieldValueTypesError(label, 'string');
                  }
                }
                break;

              default:
                for (let i = 0; i < newVal.length; i += 1) {
                  if (!(newVal[i] instanceof arrayType)) {
                    SchemaField.throwFieldValueTypesError(label, arrayType);
                  }
                }
            }
          }
        } else if (typeof props.type === 'function') {
          // Check if value is an instance of the function
          if (!(newVal instanceof props.type)) {
            SchemaField.throwFieldInstanceError(label);
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
          if (!utils.contains(allowed, newVal[i])) {
            SchemaField.throwFieldBadValueError(label);
          }
        }
      } else if (!utils.contains(allowed, newVal)) {
        SchemaField.throwFieldBadValueError(label);
      }
    } else if (typeof props.denied !== 'undefined') {
      // Check denied values
      const denied = SchemaField.computeValue(props.denied, context);

      if (newVal instanceof Array) {
        for (let i = 0; i < newVal.length; i += 1) {
          if (utils.contains(denied, newVal[i])) {
            SchemaField.throwFieldDeniedValueError(label);
          }
        }
      } else if (utils.contains(denied, newVal)) {
        SchemaField.throwFieldDeniedValueError(label);
      }
    }

    // Check length if value has the length attribute
    if (typeof props.length !== 'undefined' && typeof newVal.length !== 'undefined') {
      const length = SchemaField.computeValue(props.length, context);

      // Ranged length
      if (length instanceof Array) {
        const min = length[0];
        const max = length[1];

        if (typeof min === 'number' && newVal.length < min) {
          SchemaField.throwFieldMinLengthError(label, min);
        }
        if (typeof max === 'number' && newVal.length > max) {
          SchemaField.throwFieldMaxLengthError(label, max);
        }
      } else if (newVal.length !== length) {
        // Fixed length
        SchemaField.throwFieldLengthError(label, length);
      }
    }

    // Check maximal length
    if (typeof props.maxLength !== 'undefined') {
      const { length } = newVal;
      const maxLength = SchemaField.computeValue(props.maxLength, context);

      if (length > maxLength) {
        SchemaField.throwFieldMaxLengthError(label, maxLength);
      }
    }

    // Check minimal length
    if (typeof props.minLength !== 'undefined') {
      const { length } = newVal;
      const minLength = SchemaField.computeValue(props.minLength, context);

      if (length < minLength) {
        SchemaField.throwFieldMinLengthError(label, minLength);
      }
    }

    // Check maximal words
    if (typeof props.maxWords !== 'undefined' && typeof newVal === 'string') {
      const max = SchemaField.computeValue(props.maxWords, context);

      if (newVal.split(' ').length > max) {
        SchemaField.throwFieldMaxWordsError(label, max);
      }
    }

    // Check minimal words
    if (typeof props.minWords !== 'undefined' && typeof newVal === 'string') {
      const min = SchemaField.computeValue(props.minWords, context);

      if (newVal.split(' ').length < min) {
        SchemaField.throwFieldMinWordsError(label, min);
      }
    }

    // Check maximal value
    if (typeof props.max !== 'undefined') {
      const max = SchemaField.computeValue(props.max, context);

      if (newVal > max) {
        SchemaField.throwFieldMaxValueError(label, max);
      }
    }

    // Check minimal value
    if (typeof props.min !== 'undefined') {
      const min = SchemaField.computeValue(props.min, context);

      if (newVal < min) {
        SchemaField.throwFieldMinValueError(label, min);
      }
    }

    // Test regular expression
    if (typeof props.regEx !== 'undefined') {
      const regEx = SchemaField.computeValue(props.regEx, context);

      if (!regEx.test(newVal)) {
        SchemaField.throwFieldRegExError(label, regEx);
      }
    }

    // Execute custom checks
    if (typeof props.check === 'function') {
      if (props.check.call(this, newVal, context) === false) {
        SchemaField.throwFieldBadValueError(label);
      }
    }

    return newVal;
  }
}

export default SchemaField;
