/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { ERROR_FIELD_MAX_WORDS } from '../errors'
import FieldError from './FieldError'

class FieldMaxWordsError extends FieldError {
  public maxWords: number

  constructor (field: string, maxWords: number, path: string) {
    super(field, path, ERROR_FIELD_MAX_WORDS)
    Object.setPrototypeOf(this, FieldMaxWordsError.prototype)
    this.maxWords = maxWords
    this.message = `The field "${path}" must not contain more than ${maxWords} words.`
  }
}

export default FieldMaxWordsError
