/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_MIN_LENGTH } from '../errors';
import FieldError from './FieldError';

class FieldMinLengthError extends FieldError {
  constructor(field, minLength, path) {
    super(field, path, ERROR_FIELD_MIN_LENGTH);
    this.minLength = minLength;
    this.message = `"${field}" must have a length that is greater than or equal to ${minLength}.`;
  }
}

export default FieldMinLengthError;
