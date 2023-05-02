/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_INVALID } from '../errors'

class FieldError extends Error {
  public field: string

  public path: string

  public reason: string

  constructor (field: string, path: string, reason: string = ERROR_FIELD_INVALID) {
    super('The field is not valid.')
    this.field = field
    this.path = path
    this.reason = reason
  }
}

export default FieldError
