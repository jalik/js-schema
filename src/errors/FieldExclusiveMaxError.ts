/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_EXCLUSIVE_MAXIMUM } from '../errors'
import FieldError from './FieldError'
import { FieldMinMax } from '../checks'

class FieldExclusiveMaximumError extends FieldError {
  public max: FieldMinMax

  constructor (field: string, max: FieldMinMax, path: string) {
    super(field, path, ERROR_FIELD_EXCLUSIVE_MAXIMUM)
    Object.setPrototypeOf(this, FieldExclusiveMaximumError.prototype)
    this.max = max
    this.message = `The field must be lesser than ${max}.`
  }
}

export default FieldExclusiveMaximumError
