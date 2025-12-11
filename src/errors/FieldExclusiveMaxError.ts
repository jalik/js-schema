/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { ERROR_FIELD_EXCLUSIVE_MAXIMUM } from '../errors'
import ValidationError from './ValidationError'

class FieldExclusiveMaximumError extends ValidationError {
  public readonly exclusiveMaximum: number

  constructor (path: string, exclusiveMaximum: number) {
    super(path, `The field must be lesser than ${exclusiveMaximum}.`, ERROR_FIELD_EXCLUSIVE_MAXIMUM)
    Object.setPrototypeOf(this, FieldExclusiveMaximumError.prototype)
    this.exclusiveMaximum = exclusiveMaximum
  }
}

export default FieldExclusiveMaximumError
