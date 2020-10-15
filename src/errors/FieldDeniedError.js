/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_DENIED } from '../errors';
import FieldError from './FieldError';

class FieldDeniedError extends FieldError {
  constructor(field, denied, path) {
    super(field, path, ERROR_FIELD_DENIED);
    this.denied = denied;
    this.message = `"${field}" contains a value that is denied (${denied}).`;
  }
}

export default FieldDeniedError;
