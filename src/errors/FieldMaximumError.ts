/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAXIMUM } from '../errors'
import ValidationError from './ValidationError'

class FieldMaximumError extends ValidationError {
  public readonly maximum: number

  constructor (path: string, maximum: number) {
    super(path, `The field "${path}" must be lesser than or equal to ${maximum}.`, ERROR_FIELD_MAXIMUM)
    Object.setPrototypeOf(this, FieldMaximumError.prototype)
    this.maximum = maximum
  }
}

export default FieldMaximumError
