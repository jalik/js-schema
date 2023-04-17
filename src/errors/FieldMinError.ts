/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_MIN } from '../errors';
import FieldError from './FieldError';

class FieldMinError extends FieldError {
  public min: number | Date;

  constructor(field: string, min: number | Date, path: string) {
    super(field, path, ERROR_FIELD_MIN);
    this.min = min;
    this.message = `The field must be greater than or equal to ${min}.`;
  }
}

export default FieldMinError;
