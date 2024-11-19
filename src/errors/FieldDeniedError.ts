/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_DENIED } from '../errors'
import FieldError from './FieldError'

class FieldDeniedError extends FieldError {
  public denied: any[]

  constructor (field: string, denied: any[], path: string) {
    super(field, path, ERROR_FIELD_DENIED)
    Object.setPrototypeOf(this, FieldDeniedError.prototype)
    this.denied = denied
    this.message = `The field "${path}" must not be one of: ${denied}.`
  }
}

export default FieldDeniedError
