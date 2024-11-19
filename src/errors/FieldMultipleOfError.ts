/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MULTIPLE_OF } from '../errors'
import FieldError from './FieldError'

class FieldMultipleOfError extends FieldError {
  public multipleOf: number

  constructor (field: string, multipleOf: number, path: string) {
    super(field, path, ERROR_FIELD_MULTIPLE_OF)
    Object.setPrototypeOf(this, FieldMultipleOfError.prototype)
    this.multipleOf = multipleOf
    this.message = `The field "${path}" must be a multiple of ${multipleOf}.`
  }
}

export default FieldMultipleOfError
