/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_SCHEMA_VALIDATION } from '../errors'

class ValidationError extends Error {
  public path: string
  public reason: string

  constructor (path: string, reason: string = ERROR_SCHEMA_VALIDATION) {
    super(`The value at "${path ?? '$'}" is not valid.`)
    Object.setPrototypeOf(this, ValidationError.prototype)
    this.path = path
    this.reason = reason
  }
}

export default ValidationError
