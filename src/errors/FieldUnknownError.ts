/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_UNKNOWN } from '../errors';
import FieldError from './FieldError';

class FieldUnknownError extends FieldError {
  constructor(field: string, path: string) {
    super(field, path, ERROR_FIELD_UNKNOWN);
    this.message = 'The field is unknown.';
  }
}

export default FieldUnknownError;
