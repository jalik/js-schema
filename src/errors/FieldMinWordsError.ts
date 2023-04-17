/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_MIN_WORDS } from '../errors';
import FieldError from './FieldError';

class FieldMinWordsError extends FieldError {
  public minWords: number;

  constructor(field: string, minWords: number, path: string) {
    super(field, path, ERROR_FIELD_MIN_WORDS);
    this.minWords = minWords;
    this.message = `The field must contain at least ${minWords} words.`;
  }
}

export default FieldMinWordsError;
