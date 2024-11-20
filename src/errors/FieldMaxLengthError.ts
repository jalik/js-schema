/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX_LENGTH } from '../errors'
import ValidationError from './ValidationError'

class FieldMaxLengthError extends ValidationError {
  public maxLength: number

  constructor (path: string, maxLength: number) {
    super(path, ERROR_FIELD_MAX_LENGTH)
    Object.setPrototypeOf(this, FieldMaxLengthError.prototype)
    this.maxLength = maxLength
    this.message = `The field "${path}" must have a length that is lesser than or equal to ${maxLength}.`
  }
}

export default FieldMaxLengthError
