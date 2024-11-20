/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_DENIED } from '../errors'
import ValidationError from './ValidationError'

class FieldDeniedError extends ValidationError {
  public denied: unknown[]

  constructor (path: string, denied: unknown[]) {
    super(path, ERROR_FIELD_DENIED)
    Object.setPrototypeOf(this, FieldDeniedError.prototype)
    this.denied = denied
    this.message = `The field "${path}" must not be one of: ${denied}.`
  }
}

export default FieldDeniedError
