/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX_WORDS } from '../errors'
import ValidationError from './ValidationError'

class FieldMaxWordsError extends ValidationError {
  public readonly maxWords: number

  constructor (path: string, maxWords: number) {
    super(path, `The field "${path}" must not contain more than ${maxWords} words.`, ERROR_FIELD_MAX_WORDS)
    Object.setPrototypeOf(this, FieldMaxWordsError.prototype)
    this.maxWords = maxWords
  }
}

export default FieldMaxWordsError
