/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MIN } from '../errors'
import FieldError from './FieldError'
import { FieldMinMax } from '../checks'

class FieldMinError extends FieldError {
  public min: FieldMinMax

  constructor (field: string, min: FieldMinMax, path: string) {
    super(field, path, ERROR_FIELD_MIN)
    Object.setPrototypeOf(this, FieldMinError.prototype)
    this.min = min
    this.message = `The field "${path}" must be greater than or equal to ${min}.`
  }
}

export default FieldMinError
