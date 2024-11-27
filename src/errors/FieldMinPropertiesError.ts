/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MIN_PROPERTIES } from '../errors'
import ValidationError from './ValidationError'

class FieldMinPropertiesError extends ValidationError {
  public readonly minProperties: number

  constructor (path: string, minProperties: number) {
    super(path, `The field "${path}" must have at least ${minProperties} properties.`, ERROR_FIELD_MIN_PROPERTIES)
    Object.setPrototypeOf(this, FieldMinPropertiesError.prototype)
    this.minProperties = minProperties
  }
}

export default FieldMinPropertiesError
