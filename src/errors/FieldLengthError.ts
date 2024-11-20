/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_LENGTH } from '../errors'
import ValidationError from './ValidationError'

class FieldLengthError extends ValidationError {
  public length: number

  constructor (path: string, length: number) {
    super(path, ERROR_FIELD_LENGTH)
    Object.setPrototypeOf(this, FieldLengthError.prototype)
    this.length = length
    this.message = `The field "${path}" must have a length of ${length}.`
  }
}

export default FieldLengthError
