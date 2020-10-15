/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import FieldAllowedError from './errors/FieldAllowedError';
import FieldDeniedError from './errors/FieldDeniedError';
import FieldFormatError from './errors/FieldFormatError';
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
  DateRegExp,
  DateTimeRegExp,
  EmailRegExp,
  HostnameRegExp,
  IPv4RegExp,
  IPv6RegExp,
  TimeRegExp,
  UriRegExp,
} from './regex';
import { contains } from './utils';

/**
 * Schema field properties
 * @type {string[]}
 */
const fieldProperties = [
  'allowed',
  'check',
  'clean',
  'defaultValue',
  'denied',
  'format',
  'items',
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
 * Checks if value is allowed.
 * @param {[]} allowed
 * @param {*} value
 * @param {string} label
 * @param {string} path
 */
export function checkAllowed(allowed, value, label, path) {
  if (typeof allowed !== 'undefined') {
    if (value instanceof Array) {
      for (let i = 0; i < value.length; i += 1) {
        if (!contains(allowed, value[i])) {
          throw new FieldAllowedError(label, allowed, path);
        }
      }
    } else if (!contains(allowed, value)) {
      throw new FieldAllowedError(label, allowed, path);
    }
  }
}

/**
 * Checks if a value is denied.
 * @param {[]} denied
 * @param {*} value
 * @param {string} label
 * @param {string} path
 */
export function checkDenied(denied, value, label, path) {
  if (typeof denied !== 'undefined') {
    if (value instanceof Array) {
      for (let i = 0; i < value.length; i += 1) {
        if (contains(denied, value[i])) {
          throw new FieldDeniedError(label, denied, path);
        }
      }
    } else if (contains(denied, value)) {
      throw new FieldDeniedError(label, denied, path);
    }
  }
}

/**
 * Throws an error if properties are not valid.
 * @param {string} name
 * @param {Object} props
 */
export function checkFieldProperties(name, props) {
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
    format,
    items,
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

  // Check format
  if (typeof format !== 'undefined' && !contains(['string', 'function'], typeof format)) {
    throw new TypeError(`${name}.format must be a string or function`);
  }

  // Check items
  if (typeof items !== 'undefined' && typeof items !== 'object') {
    throw new TypeError(`${name}.items must be an object`);
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

/**
 * Checks the format of a value.
 * @param {string} format
 * @param {string} value
 * @param {string} label
 * @param {string} path
 */
export function checkFormat(format, value, label, path) {
  if (typeof format === 'string') {
    if (typeof value !== 'string') {
      throw new FieldFormatError(label, format, path);
    }
    let regexp;

    switch (format) {
      case 'date':
        regexp = DateRegExp;
        break;
      case 'datetime':
        regexp = DateTimeRegExp;
        break;
      case 'email':
        regexp = EmailRegExp;
        break;
      case 'hostname':
        regexp = HostnameRegExp;
        break;
      case 'ipv4':
        regexp = IPv4RegExp;
        break;
      case 'ipv6':
        regexp = IPv6RegExp;
        break;
      case 'time':
        regexp = TimeRegExp;
        break;
      case 'uri':
        regexp = UriRegExp;
        break;
      default:
        throw new Error(`"${format}" is not a valid format`);
    }

    if (!regexp.test(value)) {
      throw new FieldFormatError(label, format, path);
    }
  }
}

/**
 * Checks the length of a value.
 * @param {number} length
 * @param {[]|string|Object} value
 * @param {string} label
 * @param {string} path
 */
export function checkLength(length, value, label, path) {
  if (typeof length === 'number' && typeof value !== 'undefined'
    && value !== null && typeof value.length === 'number' && value.length !== length) {
    throw new FieldLengthError(label, length, path);
  }
}

/**
 * Checks if the value is lesser than or equal to max.
 * @param {number|Date} max
 * @param {number|Date} value
 * @param {string} label
 * @param {string} path
 */
export function checkMax(max, value, label, path) {
  if (typeof max !== 'undefined' && value > max) {
    throw new FieldMaxError(label, max, path);
  }
}

/**
 * Checks if the length of the value is lesser than or equal to max.
 * @param {number} maxLength
 * @param {[]|string|Object} value
 * @param {string} label
 * @param {string} path
 */
export function checkMaxLength(maxLength, value, label, path) {
  if (typeof maxLength === 'number' && typeof value !== 'undefined'
    && value !== null && value.length > maxLength) {
    throw new FieldMaxLengthError(label, maxLength, path);
  }
}

/**
 * Checks if the number of words is lesser than of equal to max.
 * @param {number} maxWords
 * @param {string} value
 * @param {string} label
 * @param {string} path
 */
export function checkMaxWords(maxWords, value, label, path) {
  if (typeof maxWords === 'number' && typeof value === 'string' && value.split(' ').length > maxWords) {
    throw new FieldMaxWordsError(label, maxWords, path);
  }
}

/**
 * Checks if the value is greater than or equal to min.
 * @param {number|Date} min
 * @param {number|Date} value
 * @param {string} label
 * @param {string} path
 */
export function checkMin(min, value, label, path) {
  if (typeof min !== 'undefined' && value < min) {
    throw new FieldMinError(label, min, path);
  }
}

/**
 * Checks if the value is greater than or equal to min.
 * @param {number} minLength
 * @param {[]|string|Object} value
 * @param {string} label
 * @param {string} path
 */
export function checkMinLength(minLength, value, label, path) {
  if (typeof minLength === 'number' && typeof value !== 'undefined'
    && value !== null && value.length < minLength) {
    throw new FieldMinLengthError(label, minLength, path);
  }
}

/**
 * Checks if the number of words is greater or equal to min.
 * @param {number} minWords
 * @param {string} value
 * @param {string} label
 * @param {string} path
 */
export function checkMinWords(minWords, value, label, path) {
  if (typeof minWords === 'number' && typeof value === 'string' && value.split(' ').length < minWords) {
    throw new FieldMinWordsError(label, minWords, path);
  }
}

/**
 * Checks if the value is null.
 * @param {boolean} nullable
 * @param {null|*} value
 * @param {string} label
 * @param {string} path
 */
export function checkNullable(nullable, value, label, path) {
  if (!nullable && value === null) {
    throw new FieldNullableError(label, path);
  }
}

/**
 * Checks if the value matches the pattern.
 * @param {string|RegExp} pattern
 * @param {string} value
 * @param {string} label
 * @param {string} path
 */
export function checkPattern(pattern, value, label, path) {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

  if (typeof regex !== 'undefined' && !regex.test(value)) {
    throw new FieldPatternError(label, regex, path);
  }
}

/**
 * Checks if the value is required.
 * @param {boolean} required
 * @param {*} value
 * @param {string} label
 * @param {string} path
 */
export function checkRequired(required, value, label, path) {
  if (required && typeof value === 'undefined') {
    throw new FieldRequiredError(label, path);
  }
}

/**
 * Checks type of value.
 * @param {string} type
 * @param {*} value
 * @param {string} label
 * @param {string} path
 */
export function checkType(type, value, label, path) {
  if (typeof type === 'string') {
    switch (type) {
      case 'array':
        if (!(value instanceof Array)) {
          throw new FieldTypeError(label, type, path);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new FieldTypeError(label, type, path);
        }
        break;
      case 'function':
        if (typeof value !== 'function') {
          throw new FieldTypeError(label, type, path);
        }
        break;
      case 'integer':
        if (typeof value !== 'number' || Number.isNaN(value) || value !== Math.round(value)) {
          throw new FieldTypeError(label, type, path);
        }
        break;
      case 'number':
        if (typeof value !== 'number' || Number.isNaN(value)) {
          throw new FieldTypeError(label, type, path);
        }
        break;
      case 'object':
        if (typeof value !== 'object') {
          throw new FieldTypeError(label, type, path);
        }
        break;
      case 'string':
        if (typeof value !== 'string') {
          throw new FieldTypeError(label, type, path);
        }
        break;
      default:
        throw new Error(`unsupported type "${type}"`);
    }
  }
}

/**
 * Checks if the type of value is one of given types.
 * todo check if type is instance of schema
 * @param {Array} types
 * @param {Array} values
 * @param {string} label
 * @param {string} path
 */
export function checkTypeArray(types, values, label, path) {
  if (types instanceof Array) {
    if (!(values instanceof Array)) {
      throw new FieldTypeError(label, types, path);
    }
    for (let i = 0; i < values.length; i += 1) {
      let oneOf = false;

      for (let j = 0; j < types.length; j += 1) {
        try {
          checkType(types[j], values[i], label, path);
          oneOf = true;
        } catch (e) {
          // do nothing
        }
      }
      if (!oneOf) {
        throw new FieldTypeError(label, types, path);
      }
    }
  }
}
