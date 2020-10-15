/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_REQUIRED } from '../errors';
import FieldError from './FieldError';

class FieldRequiredError extends FieldError {
  constructor(field, path) {
    super(field, path, ERROR_FIELD_REQUIRED);
    this.message = `"${field}" is required.`;
  }
}

export default FieldRequiredError;
