/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_SCHEMA_INVALID } from '../errors'

class SchemaError extends Error {
  public readonly reason: string

  constructor (message: string, reason: string = ERROR_SCHEMA_INVALID) {
    super(message ?? 'The schema is not valid.')
    Object.setPrototypeOf(this, SchemaError.prototype)
    this.reason = reason
  }
}

export default SchemaError
