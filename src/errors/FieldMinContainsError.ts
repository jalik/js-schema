/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX_CONTAINS } from '../errors'
import ValidationError from './ValidationError'

class FieldMinContainsError extends ValidationError {
  public readonly minContains: number

  constructor (path: string, minContains: number) {
    super(path, `The field "${path}" must contain at least than ${minContains} items matching "contains".`, ERROR_FIELD_MAX_CONTAINS)
    Object.setPrototypeOf(this, FieldMinContainsError.prototype)
    this.minContains = minContains
  }
}

export default FieldMinContainsError
