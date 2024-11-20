/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAXIMUM } from '../errors'
import ValidationError from './ValidationError'

class FieldMaximumError extends ValidationError {
  public maximum: number

  constructor (path: string, maximum: number) {
    super(path, ERROR_FIELD_MAXIMUM)
    Object.setPrototypeOf(this, FieldMaximumError.prototype)
    this.maximum = maximum
    this.message = `The field "${path}" must be lesser than or equal to ${maximum}.`
  }
}

export default FieldMaximumError
