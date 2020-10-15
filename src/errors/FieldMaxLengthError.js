/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_MAX_LENGTH } from '../errors';
import FieldError from './FieldError';

class FieldMaxLengthError extends FieldError {
  constructor(field, maxLength, path) {
    super(field, path, ERROR_FIELD_MAX_LENGTH);
    this.maxLength = maxLength;
    this.message = `"${field}" must have a length that is lesser than or equal to ${maxLength}.`;
  }
}

export default FieldMaxLengthError;
