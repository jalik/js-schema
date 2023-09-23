/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_MAX_ITEMS } from '../errors'
import FieldError from './FieldError'

class FieldMaxItemsError extends FieldError {
  public maxItems: number

  constructor (field: string, maxItems: number, path: string) {
    super(field, path, ERROR_FIELD_MAX_ITEMS)
    Object.setPrototypeOf(this, FieldMaxItemsError.prototype)
    this.maxItems = maxItems
    this.message = `The field must contain at most ${maxItems} items.`
  }
}

export default FieldMaxItemsError
