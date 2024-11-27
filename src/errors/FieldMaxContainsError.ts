/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX_CONTAINS } from '../errors'
import ValidationError from './ValidationError'

class FieldMaxContainsError extends ValidationError {
  public readonly maxContains: number

  constructor (path: string, maxContains: number) {
    super(path, `The field "${path}" must contain no more than ${maxContains} items matching "contains".`, ERROR_FIELD_MAX_CONTAINS)
    Object.setPrototypeOf(this, FieldMaxContainsError.prototype)
    this.maxContains = maxContains
  }
}

export default FieldMaxContainsError
