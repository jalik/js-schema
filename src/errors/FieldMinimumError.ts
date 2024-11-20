/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MINIMUM } from '../errors'
import ValidationError from './ValidationError'

class FieldMinimumError extends ValidationError {
  public minimum: number

  constructor (path: string, minimum: number) {
    super(path, ERROR_FIELD_MINIMUM)
    Object.setPrototypeOf(this, FieldMinimumError.prototype)
    this.minimum = minimum
    this.message = `The field "${path}" must be greater than or equal to ${minimum}.`
  }
}

export default FieldMinimumError
