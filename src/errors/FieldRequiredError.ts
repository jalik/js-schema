/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_REQUIRED } from '../errors'
import ValidationError from './ValidationError'

class FieldRequiredError extends ValidationError {
  constructor (path: string) {
    super(path, ERROR_FIELD_REQUIRED)
    Object.setPrototypeOf(this, FieldRequiredError.prototype)
    this.message = `The field "${path}" is required.`
  }
}

export default FieldRequiredError
