/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import {
  ERROR_FIELD_ALLOWED,
  ERROR_FIELD_DENIED,
  ERROR_FIELD_FORMAT,
  ERROR_FIELD_INVALID,
  ERROR_FIELD_LENGTH,
  ERROR_FIELD_MAX,
  ERROR_FIELD_MAX_LENGTH,
  ERROR_FIELD_MAX_WORDS,
  ERROR_FIELD_MIN,
  ERROR_FIELD_MIN_LENGTH,
  ERROR_FIELD_MIN_WORDS,
  ERROR_FIELD_NULLABLE,
  ERROR_FIELD_PATTERN,
  ERROR_FIELD_REQUIRED,
  ERROR_FIELD_TYPE,
  ERROR_FIELD_UNKNOWN,
} from '../errors';

const en = {
  [ERROR_FIELD_ALLOWED]: 'The field must contain an allowed value ({allowed}).',
  [ERROR_FIELD_DENIED]: 'The field contains a value that is denied ({denied}).',
  [ERROR_FIELD_FORMAT]: 'The field does not matches format ({format}).',
  [ERROR_FIELD_INVALID]: 'The field is not valid.',
  [ERROR_FIELD_LENGTH]: 'The field must have a length of {length}.',
  [ERROR_FIELD_MAX]: 'The field must be lesser than or equal to {max}.',
  [ERROR_FIELD_MAX_LENGTH]: 'The field must have a length that is lesser than or equal to {maxLength}.',
  [ERROR_FIELD_MAX_WORDS]: 'The field must not contain more than {maxWords} words.',
  [ERROR_FIELD_MIN]: 'The field must be greater than or equal to {min}.',
  [ERROR_FIELD_MIN_LENGTH]: 'The field must have a length that is greater than or equal to {minLength}.',
  [ERROR_FIELD_MIN_WORDS]: 'The field must contain at least {minWords} words.',
  [ERROR_FIELD_NULLABLE]: 'The field cannot be null.',
  [ERROR_FIELD_PATTERN]: 'The field does not match the pattern "{pattern}".',
  [ERROR_FIELD_REQUIRED]: 'The field is required.',
  [ERROR_FIELD_TYPE]: 'The field is not of type "{type}".',
  [ERROR_FIELD_UNKNOWN]: 'The field is unknown.',
};

export default en;
