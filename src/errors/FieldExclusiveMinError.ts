/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_EXCLUSIVE_MINIMUM } from '../errors'
import FieldError from './FieldError'
import { FieldMinMax } from '../checks'

class FieldExclusiveMinimumError extends FieldError {
  public exclusiveMinimum: FieldMinMax

  constructor (field: string, exclusiveMinimum: FieldMinMax, path: string) {
    super(field, path, ERROR_FIELD_EXCLUSIVE_MINIMUM)
    Object.setPrototypeOf(this, FieldExclusiveMinimumError.prototype)
    this.exclusiveMinimum = exclusiveMinimum
    this.message = `The field "${path}" must be greater than ${exclusiveMinimum}.`
  }
}

export default FieldExclusiveMinimumError
