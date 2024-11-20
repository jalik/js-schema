/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import ValidationError from './ValidationError'

export type ValidationErrors<K extends string = string> = Record<K, ValidationError>

/**
 * Used to collect all validation "errors".
 */
class ValidateError<K extends string = string> extends Error {
  public errors: ValidationErrors<K>

  constructor (errors: ValidationErrors<K>) {
    super('Validation failed with errors.')
    this.errors = errors
  }
}

export default ValidateError
