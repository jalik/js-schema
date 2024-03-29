/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_REQUIRED } from '../errors'
import FieldError from './FieldError'

class FieldRequiredError extends FieldError {
  constructor (field: string, path: string) {
    super(field, path, ERROR_FIELD_REQUIRED)
    Object.setPrototypeOf(this, FieldRequiredError.prototype)
    this.message = 'The field is required.'
  }
}

export default FieldRequiredError
