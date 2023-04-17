/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_PATTERN } from '../errors';
import FieldError from './FieldError';

class FieldPatternError extends FieldError {
  public pattern: RegExp;

  constructor(field: string, pattern: RegExp, path: string) {
    super(field, path, ERROR_FIELD_PATTERN);
    this.pattern = pattern;
    this.message = `The field does not match the pattern "${pattern}".`;
  }
}

export default FieldPatternError;
