/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_EXCLUSIVE_MAXIMUM } from '../errors'
import FieldError from './FieldError'
import { FieldMinMax } from '../checks'

class FieldExclusiveMaximumError extends FieldError {
  public exclusiveMaximum: FieldMinMax

  constructor (field: string, exclusiveMaximum: FieldMinMax, path: string) {
    super(field, path, ERROR_FIELD_EXCLUSIVE_MAXIMUM)
    Object.setPrototypeOf(this, FieldExclusiveMaximumError.prototype)
    this.exclusiveMaximum = exclusiveMaximum
    this.message = `The field "${path}" must be lesser than ${exclusiveMaximum}.`
  }
}

export default FieldExclusiveMaximumError
