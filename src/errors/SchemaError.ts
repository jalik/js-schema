/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_SCHEMA_INVALID } from '../errors'

class SchemaError extends Error {
  public path: string
  public reason: string

  constructor (path: string, reason: string = ERROR_SCHEMA_INVALID) {
    super(`The schema attribute "${path ?? '$'}" is not valid.`)
    Object.setPrototypeOf(this, SchemaError.prototype)
    this.path = path
    this.reason = reason
  }
}

export default SchemaError
