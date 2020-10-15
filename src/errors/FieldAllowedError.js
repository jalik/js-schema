/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_ALLOWED } from '../errors';
import FieldError from './FieldError';

class FieldAllowedError extends FieldError {
  constructor(field, allowed, path) {
    super(field, path, ERROR_FIELD_ALLOWED);
    this.allowed = allowed;
    this.message = `"${field}" contains a value that is not allowed (${allowed}).`;
  }
}

export default FieldAllowedError;
