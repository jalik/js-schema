/*
 * The MIT License (MIT)
 * Copyright (c) 2021 Karl STEIN
 */

import { ERROR_FIELD_MAX } from '../errors';
import FieldError from './FieldError';

class FieldMaxError extends FieldError {
  constructor(field, max, path) {
    super(field, path, ERROR_FIELD_MAX);
    this.max = max;
    this.message = `The field must be lesser than or equal to ${max}.`;
  }
}

export default FieldMaxError;
