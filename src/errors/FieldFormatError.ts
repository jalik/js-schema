/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_FORMAT } from '../errors'
import ValidationError from './ValidationError'

class FieldFormatError extends ValidationError {
  public readonly format: string

  constructor (path: string, format: string) {
    super(path, `The field "${path}" must be a valid "${format}".`, ERROR_FIELD_FORMAT)
    Object.setPrototypeOf(this, FieldFormatError.prototype)
    this.format = format
  }
}

export default FieldFormatError
