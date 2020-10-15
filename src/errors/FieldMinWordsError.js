/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import { ERROR_FIELD_MIN_WORDS } from '../errors';
import FieldError from './FieldError';

class FieldMinWordsError extends FieldError {
  constructor(field, minWords, path) {
    super(field, path, ERROR_FIELD_MIN_WORDS);
    this.minWords = minWords;
    this.message = `"${field}" must contain at least ${minWords} words.`;
  }
}

export default FieldMinWordsError;
