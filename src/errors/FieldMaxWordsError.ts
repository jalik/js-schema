/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX_WORDS } from '../errors'
import ValidationError from './ValidationError'

class FieldMaxWordsError extends ValidationError {
  public maxWords: number

  constructor (path: string, maxWords: number) {
    super(path, ERROR_FIELD_MAX_WORDS)
    Object.setPrototypeOf(this, FieldMaxWordsError.prototype)
    this.maxWords = maxWords
    this.message = `The field "${path}" must not contain more than ${maxWords} words.`
  }
}

export default FieldMaxWordsError
