/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_PROPERTIES } from '../errors'
import { SchemaAttributes } from '../JSONSchema'
import ValidationError from './ValidationError'

class FieldPropertiesError extends ValidationError {
  public readonly properties: SchemaAttributes['properties']

  constructor (path: string, properties: SchemaAttributes['properties']) {
    super(path, `The field "${path}" must be an object.`, ERROR_FIELD_PROPERTIES)
    Object.setPrototypeOf(this, FieldPropertiesError.prototype)
    this.properties = properties
  }
}

export default FieldPropertiesError
