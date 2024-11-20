/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MULTIPLE_OF } from '../errors'
import ValidationError from './ValidationError'

class FieldMultipleOfError extends ValidationError {
  public multipleOf: number

  constructor (path: string, multipleOf: number) {
    super(path, ERROR_FIELD_MULTIPLE_OF)
    Object.setPrototypeOf(this, FieldMultipleOfError.prototype)
    this.multipleOf = multipleOf
    this.message = `The field "${path}" must be a multiple of ${multipleOf}.`
  }
}

export default FieldMultipleOfError
