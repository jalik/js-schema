/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_MAX_WORDS } from '../errors'
import FieldError from './FieldError'

class FieldMaxWordsError extends FieldError {
  public maxWords: number

  constructor (field: string, maxWords: number, path: string) {
    super(field, path, ERROR_FIELD_MAX_WORDS)
    Object.setPrototypeOf(this, FieldMaxWordsError.prototype)
    this.maxWords = maxWords
    this.message = `The field must not contain more than ${maxWords} words.`
  }
}

export default FieldMaxWordsError
