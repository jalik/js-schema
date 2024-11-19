/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_PROPERTIES } from '../errors'
import FieldError from './FieldError'
import { FieldProperties } from '../SchemaField'

class FieldPropertiesError extends FieldError {
  public properties: FieldProperties['properties']

  constructor (field: string, properties: FieldProperties['properties'], path: string) {
    super(field, path, ERROR_FIELD_PROPERTIES)
    Object.setPrototypeOf(this, FieldPropertiesError.prototype)
    this.properties = properties
    this.message = `The field "${path}" must be an object.`
  }
}

export default FieldPropertiesError
