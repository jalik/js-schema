/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

export const ERROR_FIELD_ALLOWED = 'field-allowed'
export const ERROR_FIELD_DENIED = 'field-denied'
export const ERROR_FIELD_EXCLUSIVE_MAXIMUM = 'field-exclusive-maximum'
export const ERROR_FIELD_EXCLUSIVE_MINIMUM = 'field-exclusive-minimum'
export const ERROR_FIELD_FORMAT = 'field-format'
export const ERROR_FIELD_INVALID = 'field-invalid'
export const ERROR_FIELD_LENGTH = 'field-length'
export const ERROR_FIELD_MAX = 'field-max'
export const ERROR_FIELD_MAX_ITEMS = 'field-max-items'
export const ERROR_FIELD_MAX_LENGTH = 'field-max-length'
export const ERROR_FIELD_MAX_WORDS = 'field-max-words'
export const ERROR_FIELD_MIN = 'field-min'
export const ERROR_FIELD_MIN_ITEMS = 'field-min-items'
export const ERROR_FIELD_MIN_LENGTH = 'field-min-length'
export const ERROR_FIELD_MIN_WORDS = 'field-min-words'
export const ERROR_FIELD_MULTIPLE_OF = 'field-multiple-of'
export const ERROR_FIELD_PATTERN = 'field-pattern'
export const ERROR_FIELD_REQUIRED = 'field-required'
export const ERROR_FIELD_TYPE = 'field-type'
export const ERROR_FIELD_UNIQUE_ITEMS = 'field-unique-items'
export const ERROR_FIELD_UNKNOWN = 'field-unknown'
export const ERROR_VALIDATION = 'object-invalid'

const errors = [
  ERROR_FIELD_ALLOWED,
  ERROR_FIELD_DENIED,
  ERROR_FIELD_EXCLUSIVE_MINIMUM,
  ERROR_FIELD_EXCLUSIVE_MAXIMUM,
  ERROR_FIELD_FORMAT,
  ERROR_FIELD_INVALID,
  ERROR_FIELD_LENGTH,
  ERROR_FIELD_MAX,
  ERROR_FIELD_MAX_ITEMS,
  ERROR_FIELD_MAX_LENGTH,
  ERROR_FIELD_MAX_WORDS,
  ERROR_FIELD_MIN,
  ERROR_FIELD_MIN_ITEMS,
  ERROR_FIELD_MIN_LENGTH,
  ERROR_FIELD_MIN_WORDS,
  ERROR_FIELD_MULTIPLE_OF,
  ERROR_FIELD_PATTERN,
  ERROR_FIELD_REQUIRED,
  ERROR_FIELD_TYPE,
  ERROR_FIELD_UNIQUE_ITEMS,
  ERROR_FIELD_UNKNOWN,
  ERROR_VALIDATION
] as const

type ErrorType = typeof errors[number]

export type ErrorMessages = {
  [key in ErrorType]: string
}

export default errors
