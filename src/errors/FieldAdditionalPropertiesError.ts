/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_ADDITIONAL_PROPERTIES } from '../errors'
import FieldError from './FieldError'

class FieldAdditionalPropertiesError extends FieldError {
  public additionalProperties: string[]

  constructor (field: string, additionalProperties: string[], path: string) {
    super(field, path, ERROR_FIELD_ADDITIONAL_PROPERTIES)
    Object.setPrototypeOf(this, FieldAdditionalPropertiesError.prototype)
    this.additionalProperties = additionalProperties
    this.message = `The field "${path}" contains additional properties "${additionalProperties}".`
  }
}

export default FieldAdditionalPropertiesError
