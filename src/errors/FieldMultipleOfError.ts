/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { ERROR_FIELD_MULTIPLE_OF } from '../errors'
import ValidationError from './ValidationError'

class FieldMultipleOfError extends ValidationError {
  public readonly multipleOf: number

  constructor (path: string, multipleOf: number) {
    super(path, `The field must be a multiple of ${multipleOf}.`, ERROR_FIELD_MULTIPLE_OF)
    Object.setPrototypeOf(this, FieldMultipleOfError.prototype)
    this.multipleOf = multipleOf
  }
}

export default FieldMultipleOfError
