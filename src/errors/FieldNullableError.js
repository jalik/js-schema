/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_NULLABLE } from '../errors';
import FieldError from './FieldError';

class FieldNullableError extends FieldError {
  constructor(field, path) {
    super(field, path, ERROR_FIELD_NULLABLE);
    this.message = `"${field}" cannot be null.`;
  }
}

export default FieldNullableError;
