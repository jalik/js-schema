/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_ENUM } from '../errors'
import FieldError from './FieldError'

class FieldEnumError extends FieldError {
  public enum: any[]

  constructor (field: string, values: any[], path: string) {
    super(field, path, ERROR_FIELD_ENUM)
    Object.setPrototypeOf(this, FieldEnumError.prototype)
    this.enum = values
    this.message = `The field "${path}" must be one of: ${values}.`
  }
}

export default FieldEnumError
