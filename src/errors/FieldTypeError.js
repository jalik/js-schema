/*
 * The MIT License (MIT)
 * Copyright (c) 2021 Karl STEIN
 */

import { ERROR_FIELD_TYPE } from '../errors';
import FieldError from './FieldError';

class FieldTypeError extends FieldError {
  constructor(field, type, path) {
    super(field, path, ERROR_FIELD_TYPE);
    this.type = type;
    this.message = `The field is not of type "${type}".`;
  }
}

export default FieldTypeError;
