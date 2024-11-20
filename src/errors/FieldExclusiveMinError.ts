/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_EXCLUSIVE_MINIMUM } from '../errors'
import ValidationError from './ValidationError'

class FieldExclusiveMinimumError extends ValidationError {
  public exclusiveMinimum: number

  constructor (path: string, exclusiveMinimum: number) {
    super(path, ERROR_FIELD_EXCLUSIVE_MINIMUM)
    Object.setPrototypeOf(this, FieldExclusiveMinimumError.prototype)
    this.exclusiveMinimum = exclusiveMinimum
    this.message = `The field "${path}" must be greater than ${exclusiveMinimum}.`
  }
}

export default FieldExclusiveMinimumError
