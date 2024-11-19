/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_FORMAT } from '../errors'
import FieldError from './FieldError'

class FieldFormatError extends FieldError {
  public format: string

  constructor (field: string, format: string, path: string) {
    super(field, path, ERROR_FIELD_FORMAT)
    Object.setPrototypeOf(this, FieldFormatError.prototype)
    this.format = format
    this.message = `The field "${path}" must match the format "${format}".`
  }
}

export default FieldFormatError
