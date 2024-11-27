/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MINIMUM } from '../errors'
import ValidationError from './ValidationError'

class FieldMinimumError extends ValidationError {
  public readonly minimum: number

  constructor (path: string, minimum: number) {
    super(path, `The field "${path}" must be greater than or equal to ${minimum}.`, ERROR_FIELD_MINIMUM)
    Object.setPrototypeOf(this, FieldMinimumError.prototype)
    this.minimum = minimum
  }
}

export default FieldMinimumError
