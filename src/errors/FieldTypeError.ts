/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_TYPE } from '../errors'
import ValidationError from './ValidationError'

class FieldTypeError extends ValidationError {
  public readonly type: string

  constructor (path: string, type: string) {
    super(path, `The field "${path}" must be of type "${type}".`, ERROR_FIELD_TYPE)
    Object.setPrototypeOf(this, FieldTypeError.prototype)
    this.type = type
  }
}

export default FieldTypeError
