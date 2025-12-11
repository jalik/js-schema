/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { ERROR_FIELD_MAX_PROPERTIES } from '../errors'
import ValidationError from './ValidationError'

class FieldMaxPropertiesError extends ValidationError {
  public readonly maxProperties: number

  constructor (path: string, maxProperties: number) {
    super(path, `The field must not have more than ${maxProperties} properties.`, ERROR_FIELD_MAX_PROPERTIES)
    Object.setPrototypeOf(this, FieldMaxPropertiesError.prototype)
    this.maxProperties = maxProperties
  }
}

export default FieldMaxPropertiesError
