/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { ERROR_SCHEMA_VALIDATION } from '../errors'

class ValidationError extends Error {
  public readonly path: string
  public readonly reason: string

  constructor (
    path: string,
    message: string = 'The field is not valid.',
    reason: string = ERROR_SCHEMA_VALIDATION) {
    super(message)
    Object.setPrototypeOf(this, ValidationError.prototype)
    this.path = path
    this.reason = reason
  }
}

export default ValidationError
