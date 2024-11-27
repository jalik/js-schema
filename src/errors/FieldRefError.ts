/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_REF } from '../errors'
import ValidationError from './ValidationError'

class FieldRefError extends ValidationError {
  public readonly ref: string

  constructor (path: string, ref: string) {
    super(path, `The field "${path}" has an invalid reference "${ref}".`, ERROR_FIELD_REF)
    Object.setPrototypeOf(this, FieldRefError.prototype)
    this.ref = ref
  }
}

export default FieldRefError
