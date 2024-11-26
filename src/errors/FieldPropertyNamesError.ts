/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_PROPERTY_NAMES } from '../errors'
import ValidationError from './ValidationError'

class FieldPropertyNamesError extends ValidationError {
  constructor (path: string) {
    super(path, ERROR_FIELD_PROPERTY_NAMES)
    Object.setPrototypeOf(this, FieldPropertyNamesError.prototype)
    this.message = `The field "${path}" does not have a valid name.`
  }
}

export default FieldPropertyNamesError
