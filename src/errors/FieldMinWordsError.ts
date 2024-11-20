/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MIN_WORDS } from '../errors'
import ValidationError from './ValidationError'

class FieldMinWordsError extends ValidationError {
  public minWords: number

  constructor (path: string, minWords: number) {
    super(path, ERROR_FIELD_MIN_WORDS)
    Object.setPrototypeOf(this, FieldMinWordsError.prototype)
    this.minWords = minWords
    this.message = `The field "${path}" must contain at least ${minWords} words.`
  }
}

export default FieldMinWordsError
