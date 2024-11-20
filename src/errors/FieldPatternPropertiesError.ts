/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_PATTERN_PROPERTIES } from '../errors'
import ValidationError from './ValidationError'

class FieldPatternPropertiesError extends ValidationError {
  public patternProperties: string[]

  constructor (path: string, patternProperties: string[]) {
    super(path, ERROR_FIELD_PATTERN_PROPERTIES)
    Object.setPrototypeOf(this, FieldPatternPropertiesError.prototype)
    this.patternProperties = patternProperties
    this.message = `The field "${path}" contains invalid property names "${patternProperties}".`
  }
}

export default FieldPatternPropertiesError
