/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_MIN_LENGTH } from '../errors'
import FieldError from './FieldError'

class FieldMinLengthError extends FieldError {
  public minLength: number

  constructor (field: string, minLength: number, path: string) {
    super(field, path, ERROR_FIELD_MIN_LENGTH)
    Object.setPrototypeOf(this, FieldMinLengthError.prototype)
    this.minLength = minLength
    this.message = `The field must have a length that is greater than or equal to ${minLength}.`
  }
}

export default FieldMinLengthError
