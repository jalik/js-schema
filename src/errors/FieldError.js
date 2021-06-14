/*
 * The MIT License (MIT)
 * Copyright (c) 2021 Karl STEIN
 */

import { ERROR_FIELD_INVALID } from '../errors';

class FieldError extends Error {
  /**
   * Creates a field error.
   * @param {string} field
   * @param {string} path
   * @param {string} reason
   */
  constructor(field, path, reason = ERROR_FIELD_INVALID) {
    super();
    this.field = field;
    this.message = 'The field is not valid.';
    this.path = path;
    this.reason = reason;
  }
}

export default FieldError;
