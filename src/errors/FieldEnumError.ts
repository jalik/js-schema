/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_ENUM } from '../errors'
import ValidationError from './ValidationError'

class FieldEnumError extends ValidationError {
  public enum: unknown[]

  constructor (path: string, values: unknown[]) {
    super(path, ERROR_FIELD_ENUM)
    Object.setPrototypeOf(this, FieldEnumError.prototype)
    this.enum = values
    this.message = `The field "${path}" must be one of: ${values}.`
  }
}

export default FieldEnumError
