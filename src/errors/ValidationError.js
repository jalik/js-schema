/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_VALIDATION } from '../errors';

class ValidationError extends Error {
  /**
   * Creates a validation error.
   * @param {Object} errors
   * @param {string} message
   * @param {string} reason
   */
  constructor(errors = {}, message = 'Object is not valid', reason = ERROR_VALIDATION) {
    super();
    this.errors = errors;
    this.message = message;
    this.reason = reason;
  }
}

export default ValidationError;
