/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_ALLOWED } from '../errors'
import FieldError from './FieldError'

class FieldAllowedError extends FieldError {
  public allowed: any[]

  constructor (field: string, allowed: any[], path: string) {
    super(field, path, ERROR_FIELD_ALLOWED)
    this.allowed = allowed
    this.message = `The field must contain an allowed value (${allowed}).`
  }
}

export default FieldAllowedError
