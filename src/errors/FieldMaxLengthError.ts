/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_MAX_LENGTH } from '../errors'
import FieldError from './FieldError'

class FieldMaxLengthError extends FieldError {
  public maxLength: number

  constructor (field: string, maxLength: number, path: string) {
    super(field, path, ERROR_FIELD_MAX_LENGTH)
    this.maxLength = maxLength
    this.message = `The field must have a length that is lesser than or equal to ${maxLength}.`
  }
}

export default FieldMaxLengthError
