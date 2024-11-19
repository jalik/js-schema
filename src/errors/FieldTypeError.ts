/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_TYPE } from '../errors'
import FieldError from './FieldError'

class FieldTypeError extends FieldError {
  public type: string

  constructor (field: string, type: string, path: string) {
    super(field, path, ERROR_FIELD_TYPE)
    Object.setPrototypeOf(this, FieldTypeError.prototype)
    this.type = type
    this.message = `The field "${path}" must be of type "${type}".`
  }
}

export default FieldTypeError
