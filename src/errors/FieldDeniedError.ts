/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_DENIED } from '../errors'
import ValidationError from './ValidationError'

class FieldDeniedError extends ValidationError {
  public readonly denied: unknown[]

  constructor (path: string, denied: unknown[]) {
    super(path, `The field "${path}" must not be one of ${denied}.`, ERROR_FIELD_DENIED)
    Object.setPrototypeOf(this, FieldDeniedError.prototype)
    this.denied = denied
  }
}

export default FieldDeniedError
