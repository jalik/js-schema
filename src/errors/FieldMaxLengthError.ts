/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX_LENGTH } from '../errors'
import ValidationError from './ValidationError'

class FieldMaxLengthError extends ValidationError {
  public readonly maxLength: number

  constructor (path: string, maxLength: number) {
    super(path, `The field "${path}" must have a length that is lesser than or equal to ${maxLength}.`, ERROR_FIELD_MAX_LENGTH)
    Object.setPrototypeOf(this, FieldMaxLengthError.prototype)
    this.maxLength = maxLength
  }
}

export default FieldMaxLengthError
