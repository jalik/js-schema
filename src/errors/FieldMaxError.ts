/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX } from '../errors'
import FieldError from './FieldError'
import { FieldMinMax } from '../checks'

class FieldMaxError extends FieldError {
  public max: FieldMinMax

  constructor (field: string, max: FieldMinMax, path: string) {
    super(field, path, ERROR_FIELD_MAX)
    Object.setPrototypeOf(this, FieldMaxError.prototype)
    this.max = max
    this.message = `The field "${path}" must be lesser than or equal to ${max}.`
  }
}

export default FieldMaxError
