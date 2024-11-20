/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MIN_ITEMS } from '../errors'
import ValidationError from './ValidationError'

class FieldMinItemsError extends ValidationError {
  public minItems: number

  constructor (path: string, minItems: number) {
    super(path, ERROR_FIELD_MIN_ITEMS)
    Object.setPrototypeOf(this, FieldMinItemsError.prototype)
    this.minItems = minItems
    this.message = `The field "${path}" must contain at least ${minItems} items.`
  }
}

export default FieldMinItemsError
