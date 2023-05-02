/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_VALIDATION } from '../errors'
import FieldError from './FieldError'

export interface FieldErrors {
  [key: string]: FieldError;
}

class ValidationError extends Error {
  public errors: FieldErrors

  public reason: string

  constructor (
    errors: FieldErrors,
    message = 'Object is not valid',
    reason: string = ERROR_VALIDATION
  ) {
    super(message)
    this.errors = errors
    this.reason = reason
  }
}

export default ValidationError
