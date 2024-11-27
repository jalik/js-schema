/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_ENUM } from '../errors'
import ValidationError from './ValidationError'

class FieldEnumError extends ValidationError {
  public readonly enum: unknown[]

  constructor (path: string, enums: unknown[]) {
    super(path, `The field "${path}" must be one of ${enums}.`, ERROR_FIELD_ENUM)
    Object.setPrototypeOf(this, FieldEnumError.prototype)
    this.enum = enums
  }
}

export default FieldEnumError
