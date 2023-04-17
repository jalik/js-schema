/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_FORMAT } from '../errors';
import FieldError from './FieldError';

class FieldFormatError extends FieldError {
  public format: string;

  constructor(field: string, format: string, path: string) {
    super(field, path, ERROR_FIELD_FORMAT);
    this.format = format;
    this.message = `The field does not matches format (${format}).`;
  }
}

export default FieldFormatError;
