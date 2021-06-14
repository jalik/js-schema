/*
 * The MIT License (MIT)
 * Copyright (c) 2021 Karl STEIN
 */

import { ERROR_FIELD_MAX_WORDS } from '../errors';
import FieldError from './FieldError';

class FieldMaxWordsError extends FieldError {
  constructor(field, maxWords, path) {
    super(field, path, ERROR_FIELD_MAX_WORDS);
    this.maxWords = maxWords;
    this.message = `The field must not contain more than ${maxWords} words.`;
  }
}

export default FieldMaxWordsError;
