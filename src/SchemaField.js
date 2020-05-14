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
import {
  checkAllowed,
  checkDenied,
  checkFieldProperties,
  checkFormat,
  checkLength,
  checkMax,
  checkMaxLength,
  checkMaxWords,
  checkMin,
  checkMinLength,
  checkMinWords,
  checkNullable,
  checkPattern,
  checkRequired,
  checkType,
  checkTypeArray,
} from './checks';
import FieldError from './errors/FieldError';
import FieldTypeError from './errors/FieldTypeError';
import { computeValue } from './utils';

/**
 * Joins parts of a field path.
 * @param {string} paths
 * @return {string}
 */
export function joinPath(...paths) {
  return paths.filter((path) => (typeof path === 'string' && path.length > 0)).join('.')
    .replace('.[', '[');
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
   * @param {*} value
   * @param {Object} options
   * @return {*}
   */
  validate(value, options = {}) {
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

    const opts = {
      clean: false,
      rootOnly: false,
      ...options,
      // Sets validation context.
      context: { ...options.context, [this.name]: newVal },
      // Sets validation path.
      path: joinPath(options.path, this.name),
    };

    const { context, path } = opts;
    const props = this.properties;
    const label = computeValue(props.label, context);
    const isRequired = computeValue(props.required, context);
    const isArray = props.type === 'array' || props.type instanceof Array;

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
    checkNullable(computeValue(props.nullable, context), newVal, label, path);

    // Check if value is missing
    checkRequired(isRequired, newVal, label, path);

    // Ignore empty value
    if (typeof newVal === 'undefined' || newVal === null) {
      return newVal;
    }

    // Check type
    if (typeof props.type === 'object' && props.type !== null) {
      // Validate sub-schema.
      if (typeof props.type.validate === 'function') {
        if (!opts.rootOnly) {
          props.type.validate(newVal, { ...opts, context, path });
        }
      } else if (typeof props.type === 'function') {
        // Check if value is an instance of the function.
        if (!(newVal instanceof props.type)) {
          throw new FieldTypeError(label, props.type.name, path);
        }
      } else if (props.type instanceof Array) {
        // Check different types (ex: ['string', 'number'])
        checkTypeArray(props.type, newVal, label, path);

        // todo check in array if there is a type that is instance of schema
        // if (typeof arrayType === 'object' && arrayType !== null
        //   && typeof arrayType.validate === 'function') {
        //   if (!opts.rootOnly) {
        //     arrayType.validate(newVal[i], {
        //       ...opts,
        //       context,
        //       path: `${path}[${i}]`,
        //     });
        //   }
        // }
      } else {
        throw new FieldTypeError(label, props.type, path);
      }
    } else {
      checkType(props.type, newVal, label, path);
    }

    // Check items
    if (typeof props.items !== 'undefined') {
      if (isRequired && !(newVal instanceof Array)) {
        throw new FieldTypeError(label, 'array', path);
      }
      for (let i = 0; i < newVal.length; i += 1) {
        const field = new SchemaField(`[${i}]`, props.items);
        field.validate(newVal[i], opts);
      }
    }

    // Check allowed values
    checkAllowed(computeValue(props.allowed, context), newVal, label, path);

    // Check denied values
    checkDenied(computeValue(props.denied, context), newVal, label, path);

    // Check string format
    checkFormat(computeValue(props.format, context), newVal, label, path);

    // Check length if value has the length attribute
    checkLength(computeValue(props.length, context), newVal, label, path);

    // Check maximal length
    checkMaxLength(computeValue(props.maxLength, context), newVal, label, path);

    // Check minimal length
    checkMinLength(computeValue(props.minLength, context), newVal, label, path);

    // Check maximal words
    checkMaxWords(computeValue(props.maxWords, context), newVal, label, path);

    // Check minimal words
    checkMinWords(computeValue(props.minWords, context), newVal, label, path);

    // Check maximal value
    checkMax(computeValue(props.max, context), newVal, label, path);

    // Check minimal value
    checkMin(computeValue(props.min, context), newVal, label, path);

    // Test regular expression
    checkPattern(computeValue(props.pattern, context), newVal, label, path);

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
