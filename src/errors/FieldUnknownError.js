/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_UNKNOWN } from '../errors';
import FieldError from './FieldError';

class FieldUnknownError extends FieldError {
  constructor(field, path) {
    super(field, path, ERROR_FIELD_UNKNOWN);
    this.message = `"${field}" is unknown.`;
  }
}

export default FieldUnknownError;
