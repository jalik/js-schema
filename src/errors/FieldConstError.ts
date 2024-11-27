/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_CONST } from '../errors'
import ValidationError from './ValidationError'

class FieldConstError extends ValidationError {
  public readonly constant: unknown

  constructor (path: string, constant: unknown) {
    super(path, `The field "${path}" must be equal to ${constant}.`, ERROR_FIELD_CONST)
    Object.setPrototypeOf(this, FieldConstError.prototype)
    this.constant = constant
  }
}

export default FieldConstError
