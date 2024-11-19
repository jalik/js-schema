/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_UNKNOWN } from '../errors'
import FieldError from './FieldError'

// todo delete (instead use FieldResolutionError)
class FieldUnknownError extends FieldError {
  constructor (field: string, path: string) {
    super(field, path, ERROR_FIELD_UNKNOWN)
    Object.setPrototypeOf(this, FieldUnknownError.prototype)
    this.message = `The field "${path}" is unknown.`
  }
}

export default FieldUnknownError
