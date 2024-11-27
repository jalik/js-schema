/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_PATTERN } from '../errors'
import ValidationError from './ValidationError'

class FieldPatternError extends ValidationError {
  public readonly pattern: RegExp

  constructor (path: string, pattern: RegExp) {
    super(path, `The field "${path}" must match the pattern "${pattern}".`, ERROR_FIELD_PATTERN)
    Object.setPrototypeOf(this, FieldPatternError.prototype)
    this.pattern = pattern
  }
}

export default FieldPatternError
