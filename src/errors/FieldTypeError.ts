/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_TYPE } from '../errors'
import ValidationError from './ValidationError'

class FieldTypeError extends ValidationError {
  public type: string

  constructor (path: string, type: string) {
    super(path, ERROR_FIELD_TYPE)
    Object.setPrototypeOf(this, FieldTypeError.prototype)
    this.type = type
    this.message = `The field "${path}" must be of type "${type}".`
  }
}

export default FieldTypeError
