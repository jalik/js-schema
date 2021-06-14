/*
 * The MIT License (MIT)
 * Copyright (c) 2021 Karl STEIN
 */

import { ERROR_FIELD_DENIED } from '../errors';
import FieldError from './FieldError';

class FieldDeniedError extends FieldError {
  constructor(field, denied, path) {
    super(field, path, ERROR_FIELD_DENIED);
    this.denied = denied;
    this.message = `The field contains a value that is denied (${denied}).`;
  }
}

export default FieldDeniedError;
