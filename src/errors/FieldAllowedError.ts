/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_ALLOWED } from '../errors'
import FieldError from './FieldError'

class FieldAllowedError extends FieldError {
  public allowed: any[]

  constructor (field: string, allowed: any[], path: string) {
    super(field, path, ERROR_FIELD_ALLOWED)
    Object.setPrototypeOf(this, FieldAllowedError.prototype)
    this.allowed = allowed
    this.message = `The field "${path}" must be one of: ${allowed}.`
  }
}

export default FieldAllowedError
