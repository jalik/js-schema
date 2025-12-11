/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { ERROR_FIELD_PROPERTY_NAMES } from '../errors'
import ValidationError from './ValidationError'

class FieldPropertyNamesError extends ValidationError {
  constructor (path: string) {
    super(path, 'The field does not have a valid name.', ERROR_FIELD_PROPERTY_NAMES)
    Object.setPrototypeOf(this, FieldPropertyNamesError.prototype)
  }
}

export default FieldPropertyNamesError
