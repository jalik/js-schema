/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MIN_LENGTH } from '../errors'
import ValidationError from './ValidationError'

class FieldMinLengthError extends ValidationError {
  public minLength: number

  constructor (path: string, minLength: number) {
    super(path, ERROR_FIELD_MIN_LENGTH)
    Object.setPrototypeOf(this, FieldMinLengthError.prototype)
    this.minLength = minLength
    this.message = `The field "${path}" must have a length that is greater than or equal to ${minLength}.`
  }
}

export default FieldMinLengthError
