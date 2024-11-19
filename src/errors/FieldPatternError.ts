/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_PATTERN } from '../errors'
import FieldError from './FieldError'

class FieldPatternError extends FieldError {
  public pattern: RegExp

  constructor (field: string, pattern: RegExp, path: string) {
    super(field, path, ERROR_FIELD_PATTERN)
    Object.setPrototypeOf(this, FieldPatternError.prototype)
    this.pattern = pattern
    this.message = `The field "${path}" must match the pattern "${pattern}".`
  }
}

export default FieldPatternError
