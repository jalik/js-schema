/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_LENGTH } from '../errors'
import ValidationError from './ValidationError'

class FieldLengthError extends ValidationError {
  public readonly length: number

  constructor (path: string, length: number) {
    super(path, `The field "${path}" must have a length of ${length}.`, ERROR_FIELD_LENGTH)
    Object.setPrototypeOf(this, FieldLengthError.prototype)
    this.length = length
  }
}

export default FieldLengthError
