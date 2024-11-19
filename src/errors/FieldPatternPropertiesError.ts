/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_PATTERN_PROPERTIES } from '../errors'
import FieldError from './FieldError'

class FieldPatternPropertiesError extends FieldError {
  public patternProperties: string[]

  constructor (field: string, patternProperties: string[], path: string) {
    super(field, path, ERROR_FIELD_PATTERN_PROPERTIES)
    Object.setPrototypeOf(this, FieldPatternPropertiesError.prototype)
    this.patternProperties = patternProperties
    this.message = `The field "${path}" contains invalid property names "${patternProperties}".`
  }
}

export default FieldPatternPropertiesError
