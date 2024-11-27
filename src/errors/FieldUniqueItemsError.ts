/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_UNIQUE_ITEMS } from '../errors'
import ValidationError from './ValidationError'

class FieldUniqueItemsError extends ValidationError {
  constructor (path: string) {
    super(path, `The field "${path}" must contain unique items.`, ERROR_FIELD_UNIQUE_ITEMS)
    Object.setPrototypeOf(this, FieldUniqueItemsError.prototype)
  }
}

export default FieldUniqueItemsError
