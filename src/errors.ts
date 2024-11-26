/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

export const ERROR_FIELD_ADDITIONAL_PROPERTIES = 'field-additional-properties'
export const ERROR_FIELD_DENIED = 'field-denied'
export const ERROR_FIELD_ENUM = 'field-enum'
export const ERROR_FIELD_EXCLUSIVE_MAXIMUM = 'field-exclusive-maximum'
export const ERROR_FIELD_EXCLUSIVE_MINIMUM = 'field-exclusive-minimum'
export const ERROR_FIELD_FORMAT = 'field-format'
export const ERROR_FIELD_LENGTH = 'field-length'
export const ERROR_FIELD_MAXIMUM = 'field-maximum'
export const ERROR_FIELD_MAX_ITEMS = 'field-max-items'
export const ERROR_FIELD_MAX_LENGTH = 'field-max-length'
export const ERROR_FIELD_MAX_WORDS = 'field-max-words'
export const ERROR_FIELD_MINIMUM = 'field-minimum'
export const ERROR_FIELD_MIN_ITEMS = 'field-min-items'
export const ERROR_FIELD_MIN_LENGTH = 'field-min-length'
export const ERROR_FIELD_MIN_WORDS = 'field-min-words'
export const ERROR_FIELD_MULTIPLE_OF = 'field-multiple-of'
export const ERROR_FIELD_PATTERN = 'field-pattern'
export const ERROR_FIELD_PATTERN_PROPERTIES = 'field-pattern-properties'
export const ERROR_FIELD_PROPERTIES = 'field-properties'
export const ERROR_FIELD_PROPERTY_NAMES = 'field-property-names'
export const ERROR_FIELD_REQUIRED = 'field-required'
export const ERROR_FIELD_TYPE = 'field-type'
export const ERROR_FIELD_UNIQUE_ITEMS = 'field-unique-items'

export const ERROR_SCHEMA_INVALID = 'schema-invalid'
export const ERROR_SCHEMA_VALIDATION = 'schema-validation'

const errors = [
  ERROR_FIELD_ADDITIONAL_PROPERTIES,
  ERROR_FIELD_DENIED,
  ERROR_FIELD_ENUM,
  ERROR_FIELD_EXCLUSIVE_MINIMUM,
  ERROR_FIELD_EXCLUSIVE_MAXIMUM,
  ERROR_FIELD_FORMAT,
  ERROR_FIELD_LENGTH,
  ERROR_FIELD_MAXIMUM,
  ERROR_FIELD_MAX_ITEMS,
  ERROR_FIELD_MAX_LENGTH,
  ERROR_FIELD_MAX_WORDS,
  ERROR_FIELD_MINIMUM,
  ERROR_FIELD_MIN_ITEMS,
  ERROR_FIELD_MIN_LENGTH,
  ERROR_FIELD_MIN_WORDS,
  ERROR_FIELD_MULTIPLE_OF,
  ERROR_FIELD_PATTERN,
  ERROR_FIELD_PATTERN_PROPERTIES,
  ERROR_FIELD_PROPERTIES,
  ERROR_FIELD_PROPERTY_NAMES,
  ERROR_FIELD_REQUIRED,
  ERROR_FIELD_TYPE,
  ERROR_FIELD_UNIQUE_ITEMS,
  ERROR_SCHEMA_VALIDATION
] as const

type ErrorType = typeof errors[number]

export type ErrorMessages = {
  [key in ErrorType]: string
}

export default errors
