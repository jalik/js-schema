/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_FORMAT } from '../errors'
import ValidationError from './ValidationError'

class FieldFormatError extends ValidationError {
  public format: string

  constructor (path: string, format: string) {
    super(path, ERROR_FIELD_FORMAT)
    Object.setPrototypeOf(this, FieldFormatError.prototype)
    this.format = format
    this.message = `The field "${path}" must match the format "${format}".`
  }
}

export default FieldFormatError
