/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import {
  ERROR_FIELD_DENIED,
  ERROR_FIELD_ENUM,
  ERROR_FIELD_EXCLUSIVE_MAXIMUM,
  ERROR_FIELD_EXCLUSIVE_MINIMUM,
  ERROR_FIELD_FORMAT,
  ERROR_FIELD_INVALID,
  ERROR_FIELD_LENGTH,
  ERROR_FIELD_MAX_ITEMS,
  ERROR_FIELD_MAX_LENGTH,
  ERROR_FIELD_MAX_WORDS,
  ERROR_FIELD_MAXIMUM,
  ERROR_FIELD_MIN_ITEMS,
  ERROR_FIELD_MIN_LENGTH,
  ERROR_FIELD_MIN_WORDS,
  ERROR_FIELD_MINIMUM,
  ERROR_FIELD_MULTIPLE_OF,
  ERROR_FIELD_PATTERN,
  ERROR_FIELD_PROPERTIES,
  ERROR_FIELD_REQUIRED,
  ERROR_FIELD_TYPE,
  ERROR_FIELD_UNIQUE_ITEMS,
  ERROR_FIELD_UNKNOWN,
  ERROR_VALIDATION
} from '../errors'
import { LocaleData } from '../locale'

const en: LocaleData = {
  [ERROR_FIELD_DENIED]: 'The field contains a denied value.',
  [ERROR_FIELD_ENUM]: 'The field must be one of "{allowed}".',
  [ERROR_FIELD_EXCLUSIVE_MAXIMUM]: 'The field must be lesser than {exclusiveMaximum}.',
  [ERROR_FIELD_EXCLUSIVE_MINIMUM]: 'The field must be greater than {exclusiveMinimum}',
  [ERROR_FIELD_FORMAT]: 'The field does not match format ({format}).',
  [ERROR_FIELD_INVALID]: 'The field is not valid.',
  [ERROR_FIELD_LENGTH]: 'The field must have a length of {length}.',
  [ERROR_FIELD_MAXIMUM]: 'The field must be lesser than or equal to {maximum}.',
  [ERROR_FIELD_MAX_ITEMS]: 'The field must contain at most {maxItems} items.',
  [ERROR_FIELD_MAX_LENGTH]: 'The field must have a length that is lesser than or equal to {maxLength}.',
  [ERROR_FIELD_MAX_WORDS]: 'The field must not contain more than {maxWords} words.',
  [ERROR_FIELD_MINIMUM]: 'The field must be greater than or equal to {minimum}.',
  [ERROR_FIELD_MIN_ITEMS]: 'The field must contain at least {minItems} items.',
  [ERROR_FIELD_MIN_LENGTH]: 'The field must have a length that is greater than or equal to {minLength}.',
  [ERROR_FIELD_MIN_WORDS]: 'The field must contain at least {minWords} words.',
  [ERROR_FIELD_MULTIPLE_OF]: 'The field must be a multiple of {multipleOf}.',
  [ERROR_FIELD_PATTERN]: 'The field does not match the pattern "{pattern}".',
  [ERROR_FIELD_PROPERTIES]: 'The field must be an object.',
  [ERROR_FIELD_REQUIRED]: 'The field is required.',
  [ERROR_FIELD_TYPE]: 'The field type is not valid.',
  [ERROR_FIELD_UNIQUE_ITEMS]: 'The field must contain unique items.',
  [ERROR_FIELD_UNKNOWN]: 'The field is unknown.',
  [ERROR_VALIDATION]: 'The object is not valid.'
}

export default en
