/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_NULLABLE } from '../errors';
import FieldError from './FieldError';

class FieldNullableError extends FieldError {
  constructor(field: string, path: string) {
    super(field, path, ERROR_FIELD_NULLABLE);
    this.message = 'The field cannot be null.';
  }
}

export default FieldNullableError;
