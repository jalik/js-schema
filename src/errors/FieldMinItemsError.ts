/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_MIN_ITEMS } from '../errors'
import FieldError from './FieldError'

class FieldMinItemsError extends FieldError {
  public minItems: number

  constructor (field: string, minItems: number, path: string) {
    super(field, path, ERROR_FIELD_MIN_ITEMS)
    Object.setPrototypeOf(this, FieldMinItemsError.prototype)
    this.minItems = minItems
    this.message = `The field must contain at least ${minItems} items.`
  }
}

export default FieldMinItemsError
