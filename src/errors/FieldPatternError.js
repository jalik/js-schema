/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_PATTERN } from '../errors';
import FieldError from './FieldError';

class FieldPatternError extends FieldError {
  constructor(field, pattern, path) {
    super(field, path, ERROR_FIELD_PATTERN);
    this.pattern = pattern;
    this.message = `"${field}" does not match the pattern "${pattern}".`;
  }
}

export default FieldPatternError;
