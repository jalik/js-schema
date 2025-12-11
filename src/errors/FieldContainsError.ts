/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { ERROR_FIELD_CONTAINS } from '../errors'
import ValidationError from './ValidationError'

class FieldContainsError extends ValidationError {
  constructor (path: string) {
    super(path, 'The field does not contain a valid item.', ERROR_FIELD_CONTAINS)
    Object.setPrototypeOf(this, FieldContainsError.prototype)
  }
}

export default FieldContainsError
