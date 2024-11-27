/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MIN_WORDS } from '../errors'
import ValidationError from './ValidationError'

class FieldMinWordsError extends ValidationError {
  public readonly minWords: number

  constructor (path: string, minWords: number) {
    super(path, `The field "${path}" must contain at least ${minWords} words.`, ERROR_FIELD_MIN_WORDS)
    Object.setPrototypeOf(this, FieldMinWordsError.prototype)
    this.minWords = minWords
  }
}

export default FieldMinWordsError
