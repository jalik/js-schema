/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_LENGTH } from '../errors'
import FieldError from './FieldError'

class FieldLengthError extends FieldError {
  public length: number

  constructor (field: string, length: number, path: string) {
    super(field, path, ERROR_FIELD_LENGTH)
    Object.setPrototypeOf(this, FieldLengthError.prototype)
    this.length = length
    this.message = `The field "${path}" must have a length of ${length}.`
  }
}

export default FieldLengthError
