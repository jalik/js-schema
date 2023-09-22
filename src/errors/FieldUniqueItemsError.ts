/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_UNIQUE_ITEMS } from '../errors'
import FieldError from './FieldError'

class FieldUniqueItemsError extends FieldError {
  constructor (field: string, path: string) {
    super(field, path, ERROR_FIELD_UNIQUE_ITEMS)
    Object.setPrototypeOf(this, FieldUniqueItemsError.prototype)
    this.message = 'The field must contain unique items.'
  }
}

export default FieldUniqueItemsError
