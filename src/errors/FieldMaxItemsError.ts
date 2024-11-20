/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX_ITEMS } from '../errors'
import ValidationError from './ValidationError'

class FieldMaxItemsError extends ValidationError {
  public maxItems: number

  constructor (path: string, maxItems: number) {
    super(path, ERROR_FIELD_MAX_ITEMS)
    Object.setPrototypeOf(this, FieldMaxItemsError.prototype)
    this.maxItems = maxItems
    this.message = `The field "${path}" must contain at most ${maxItems} items.`
  }
}

export default FieldMaxItemsError
