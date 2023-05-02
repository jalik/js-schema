/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_MAX } from '../errors'
import FieldError from './FieldError'

class FieldMaxError extends FieldError {
  public max: number | Date

  constructor (field: string, max: number | Date, path: string) {
    super(field, path, ERROR_FIELD_MAX)
    this.max = max
    this.message = `The field must be lesser than or equal to ${max}.`
  }
}

export default FieldMaxError
