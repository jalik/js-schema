/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { ERROR_FIELD_FORMAT } from '../errors'
import ValidationError from './ValidationError'

class FieldFormatError extends ValidationError {
  public readonly format: string

  constructor (path: string, format: string) {
    super(path, `The format is not valid (${format}).`, ERROR_FIELD_FORMAT)
    Object.setPrototypeOf(this, FieldFormatError.prototype)
    this.format = format
  }
}

export default FieldFormatError
