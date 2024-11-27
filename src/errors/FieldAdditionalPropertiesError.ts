/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_ADDITIONAL_PROPERTIES } from '../errors'
import ValidationError from './ValidationError'

class FieldAdditionalPropertiesError extends ValidationError {
  constructor (path: string) {
    super(path, `The field "${path}" is not allowed as additional property.`, ERROR_FIELD_ADDITIONAL_PROPERTIES)
    Object.setPrototypeOf(this, FieldAdditionalPropertiesError.prototype)
  }
}

export default FieldAdditionalPropertiesError
