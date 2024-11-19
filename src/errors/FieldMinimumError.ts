/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MINIMUM } from '../errors'
import FieldError from './FieldError'
import { FieldMinMax } from '../checks'

class FieldMinimumError extends FieldError {
  public minimum: FieldMinMax

  constructor (field: string, minimum: FieldMinMax, path: string) {
    super(field, path, ERROR_FIELD_MINIMUM)
    Object.setPrototypeOf(this, FieldMinimumError.prototype)
    this.minimum = minimum
    this.message = `The field "${path}" must be greater than or equal to ${minimum}.`
  }
}

export default FieldMinimumError
