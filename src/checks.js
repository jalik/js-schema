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
import { contains } from './utils';

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
 * Checks the length of a value.
 * @param {number} length
 * @param {[]|string|Object} value
 * @param {string} label
 * @param {string} path
 */
export function checkLength(length, value, label, path) {
  if (typeof length === 'number' && typeof value.length === 'number' && value.length !== length) {
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
  if (typeof maxLength === 'number' && value.length > maxLength) {
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
  if (typeof minLength === 'number' && value.length < minLength) {
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
 * Checks if the type of value is one of given types.
 * @param {string[]} types
 * @param {*} value
 * @param {string} label
 * @param {string} path
 */
export function checkTypeArray(types, value, label, path) {
  const type = types[0]; // todo check all types in the array, not only the first one

  switch (type) {
    case 'boolean':
      for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'boolean') {
          throw new FieldTypeError(label, type, path);
        }
      }
      break;

    case 'function':
      for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'function') {
          throw new FieldTypeError(label, type, path);
        }
      }
      break;

    case 'integer':
      for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'number' || Number.isNaN(value[i]) || value[i] !== Math.round(value[i])) {
          throw new FieldTypeError(label, type, path);
        }
      }
      break;

    case 'number':
      for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'number') {
          throw new FieldTypeError(label, type, path);
        }
      }
      break;

    case 'object':
      for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'object' || value[i] instanceof Array) {
          throw new FieldTypeError(label, type, path);
        }
      }
      break;

    case 'string':
      for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'string') {
          throw new FieldTypeError(label, type, path);
        }
      }
      break;

    default:
      if (typeof type === 'object' && type) {
        for (let i = 0; i < value.length; i += 1) {
          if (!(value[i] instanceof type)) {
            throw new FieldTypeError(label, type, path);
          }
        }
      }
  }
}
