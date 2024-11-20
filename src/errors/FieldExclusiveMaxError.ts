/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_EXCLUSIVE_MAXIMUM } from '../errors'
import ValidationError from './ValidationError'

class FieldExclusiveMaximumError extends ValidationError {
  public exclusiveMaximum: number

  constructor (path: string, exclusiveMaximum: number) {
    super(path, ERROR_FIELD_EXCLUSIVE_MAXIMUM)
    Object.setPrototypeOf(this, FieldExclusiveMaximumError.prototype)
    this.exclusiveMaximum = exclusiveMaximum
    this.message = `The field "${path}" must be lesser than ${exclusiveMaximum}.`
  }
}

export default FieldExclusiveMaximumError
