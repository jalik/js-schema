/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_TYPE } from '../errors';
import FieldError from './FieldError';

class FieldTypeError extends FieldError {
  public type: string;

  constructor(field: string, type: string, path: string) {
    super(field, path, ERROR_FIELD_TYPE);
    this.type = type;
    this.message = `The field type is not valid.`;
  }
}

export default FieldTypeError;
