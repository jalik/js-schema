/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAXIMUM } from '../errors'
import FieldError from './FieldError'
import { FieldMinMax } from '../checks'

class FieldMaximumError extends FieldError {
  public maximum: FieldMinMax

  constructor (field: string, maximum: FieldMinMax, path: string) {
    super(field, path, ERROR_FIELD_MAXIMUM)
    Object.setPrototypeOf(this, FieldMaximumError.prototype)
    this.maximum = maximum
    this.message = `The field "${path}" must be lesser than or equal to ${maximum}.`
  }
}

export default FieldMaximumError
