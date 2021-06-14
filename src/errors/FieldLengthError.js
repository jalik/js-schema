/*
 * The MIT License (MIT)
 * Copyright (c) 2021 Karl STEIN
 */

import { ERROR_FIELD_LENGTH } from '../errors';
import FieldError from './FieldError';

class FieldLengthError extends FieldError {
  constructor(field, length, path) {
    super(field, path, ERROR_FIELD_LENGTH);
    this.length = length;
    this.message = `The field must have a length of ${length}.`;
  }
}

export default FieldLengthError;
