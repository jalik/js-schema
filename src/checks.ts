/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import FieldEnumError from './errors/FieldEnumError'
import FieldDeniedError from './errors/FieldDeniedError'
import FieldFormatError from './errors/FieldFormatError'
import FieldLengthError from './errors/FieldLengthError'
import FieldMaxError from './errors/FieldMaxError'
import FieldMaxLengthError from './errors/FieldMaxLengthError'
import FieldMaxWordsError from './errors/FieldMaxWordsError'
import FieldMinimumError from './errors/FieldMinimumError'
import FieldMinLengthError from './errors/FieldMinLengthError'
import FieldMinWordsError from './errors/FieldMinWordsError'
import FieldMultipleOfError from './errors/FieldMultipleOfError'
import FieldPatternError from './errors/FieldPatternError'
import FieldRequiredError from './errors/FieldRequiredError'
import FieldTypeError from './errors/FieldTypeError'
import FieldUniqueItemsError from './errors/FieldUniqueItemsError'
import {
  DateRegExp,
  DateTimeRegExp,
  EmailRegExp,
  HostnameRegExp,
  IPv4RegExp,
  IPv6RegExp,
  TimeRegExp,
  UriRegExp
} from './regex'
import Schema from './Schema'
import { FieldProperties } from './SchemaField'
import FieldMinItemsError from './errors/FieldMinItemsError'
import FieldMaxItemsError from './errors/FieldMaxItemsError'
import FieldExclusiveMaximumError from './errors/FieldExclusiveMaxError'
import FieldExclusiveMinimumError from './errors/FieldExclusiveMinError'

// https://json-schema.org/understanding-json-schema/reference/string#format
export type FieldFormat =
  'date'
  | 'datetime'
  | 'date-time'
  // todo add 'duration'
  | 'email'
  | 'hostname'
  | 'ipv4'
  | 'ipv6'
  | 'time'
  | 'uri'
// todo add 'uuid'

export type FieldMinMax = number | Date

export type FieldPattern = string | RegExp

export type FieldType =
  // https://json-schema.org/understanding-json-schema/reference/array#array
  'array'
  // https://json-schema.org/understanding-json-schema/reference/boolean#boolean
  | 'boolean'
  | 'function' // todo remove in v5
  // https://json-schema.org/understanding-json-schema/reference/numeric#integer
  | 'integer'
  // https://json-schema.org/understanding-json-schema/reference/null#null
  | 'null'
  // https://json-schema.org/understanding-json-schema/reference/numeric#number
  | 'number'
  // https://json-schema.org/understanding-json-schema/reference/object#object
  | 'object'
  // https://json-schema.org/understanding-json-schema/reference/string#string
  | 'string'
  | Schema
  // todo remove in v5
  | Array<'array' | 'boolean' | 'function' | 'integer' | 'number' | 'object' | 'string' | Schema>

export type FieldItems = {
  type?: FieldType
}

export type Computable<T> = T | ((context: Record<string, unknown>) => T)

/**
 * Schema field properties
 */
const FIELD_PROPERTIES: (keyof FieldProperties)[] = [
  'check',
  'clean',
  'denied',
  'enum',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'format',
  'items',
  'length',
  'maximum',
  'maxItems',
  'maxLength',
  'maxWords',
  'minimum',
  'minItems',
  'minLength',
  'minWords',
  'multipleOf',
  'parse',
  'pattern',
  'prepare',
  'required',
  'title',
  'type',
  'uniqueItems'
]

/**
 * Checks if value is allowed.
 * @param values
 * @param value
 * @param label
 * @param path
 */
export function checkEnum (values: any[], value: any, label: string, path: string): void {
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i += 1) {
      if (!values.includes(value[i])) {
        throw new FieldEnumError(label, values, path)
      }
    }
  } else if (!values.includes(value)) {
    throw new FieldEnumError(label, values, path)
  }
}

/**
 * Checks if a value is denied.
 * @param denied
 * @param value
 * @param label
 * @param path
 */
export function checkDenied (denied: any[], value: any, label: string, path: string): void {
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i += 1) {
      if (denied.includes(value[i])) {
        throw new FieldDeniedError(label, denied, path)
      }
    }
  } else if (denied.includes(value)) {
    throw new FieldDeniedError(label, denied, path)
  }
}

/**
 * Checks if the value is lesser than or equal to maximum (excluded).
 * @param maximum
 * @param value
 * @param label
 * @param path
 */
export function checkExclusiveMaximum (maximum: FieldMinMax, value: FieldMinMax, label: string, path: string): void {
  if (value >= maximum) {
    throw new FieldExclusiveMaximumError(label, maximum, path)
  }
}

/**
 * Checks if the value is greater than or equal to min (excluded).
 * @param exclusiveMinimum
 * @param value
 * @param label
 * @param path
 */
export function checkExclusiveMinimum (exclusiveMinimum: FieldMinMax, value: FieldMinMax, label: string, path: string): void {
  if (value <= exclusiveMinimum) {
    throw new FieldExclusiveMinimumError(label, exclusiveMinimum, path)
  }
}

/**
 * Throws an error if properties are not valid.
 * @param name
 * @param props
 */
export function checkFieldProperties (name: string, props: FieldProperties): void {
  // Check unknown properties.
  const keys = Object.keys(props)
  keys.forEach((prop) => {
    if (!FIELD_PROPERTIES.includes(prop as keyof FieldProperties)) {
      // eslint-disable-next-line no-console
      console.warn(`Unknown schema field property "${name}.${prop}"`)
    }
  })

  // Check field type
  const { type } = props
  if (typeof type !== 'undefined' && type !== null) {
    if (type instanceof Array) {
      const arrayType = type[0]

      // Check that array type is a function or class
      if (!['function', 'object', 'string'].includes(typeof arrayType)) {
        throw new TypeError(`${name}.type[] must contain a class or a function`)
      }
    } else if (!['function', 'object', 'string'].includes(typeof type)) {
      throw new TypeError(`${name}.type = "${type}" is not a valid type`)
    }
  }

  // Check conflicting options.
  const { denied } = props
  if (props.enum && denied) {
    throw new TypeError('enum and denied cannot be defined together')
  }

  // Check enum
  if (typeof props.enum !== 'undefined' && !(props.enum instanceof Array) && typeof props.enum !== 'function') {
    throw new TypeError(`${name}.enum must be an array or function`)
  }

  // Check custom check function
  const { check } = props
  if (typeof check !== 'undefined' && typeof check !== 'function') {
    throw new TypeError(`${name}.check must be a function`)
  }

  // Check custom clean function
  const { clean } = props
  if (typeof clean !== 'undefined' && typeof clean !== 'function') {
    throw new TypeError(`${name}.clean must be a function`)
  }

  // Check denied values
  if (typeof denied !== 'undefined' && !(denied instanceof Array) && typeof denied !== 'function') {
    throw new TypeError(`${name}.denied must be an array or function`)
  }

  // Check format
  const { format } = props
  if (!['undefined', 'string', 'function'].includes(typeof format)) {
    throw new TypeError(`${name}.format must be a string or function`)
  }

  // Check items
  const { items } = props
  if (typeof items !== 'undefined' && typeof items !== 'object') {
    throw new TypeError(`${name}.items must be an object`)
  }

  // Check label
  const { title } = props
  if (!['undefined', 'function', 'string'].includes(typeof title)) {
    throw new TypeError(`${name}.label must be a string or function`)
  }

  // Check length
  if (!['undefined', 'function', 'number'].includes(typeof length)) {
    throw new TypeError(`${name}.length must be a function or number`)
  }

  // Check maximum value
  const { maximum } = props
  if (!['undefined', 'function', 'number', 'string'].includes(typeof maximum) && !(maximum instanceof Date)) {
    throw new TypeError(`${name}.maximum must be a date, number, string or function`)
  }

  // Check max length
  const { maxLength } = props
  if (!['undefined', 'function', 'number'].includes(typeof maxLength)) {
    throw new TypeError(`${name}.maxLength must be a number or function`)
  }

  // Check max words
  const { maxWords } = props
  if (!['undefined', 'function', 'number'].includes(typeof maxWords)) {
    throw new TypeError(`${name}.maxWords must be a number or function`)
  }

  // Check minimum value
  const { minimum } = props
  if (!['undefined', 'function', 'number', 'string'].includes(typeof minimum) && !(minimum instanceof Date)) {
    throw new TypeError(`${name}.minimum must be a date, number, string or function`)
  }

  // Check min length
  const { minLength } = props
  if (!['undefined', 'function', 'number'].includes(typeof minLength)) {
    throw new TypeError(`${name}.minLength must be a number or function`)
  }

  // Check min words
  const { minWords } = props
  if (!['undefined', 'function', 'number'].includes(typeof minWords)) {
    throw new TypeError(`${name}.minWords must be a number or function`)
  }

  // Check custom parse function
  const { parse } = props
  if (typeof parse !== 'undefined' && typeof parse !== 'function') {
    throw new TypeError(`${name}.parse must be a function`)
  }

  // Check custom prepare function
  const { prepare } = props
  if (typeof prepare !== 'undefined' && typeof prepare !== 'function') {
    throw new TypeError(`${name}.prepare must be a function`)
  }

  // Check pattern (regular expression)
  const { pattern } = props
  if (!['undefined', 'string', 'object', 'function'].includes(typeof pattern) && !(pattern instanceof RegExp)) {
    throw new TypeError(`${name}.pattern must be a string, a RegExp or function`)
  }

  // Check required
  const { required } = props
  if (!['undefined', 'function', 'boolean'].includes(typeof required)) {
    throw new TypeError(`${name}.required must be a boolean or function`)
  }
}

/**
 * Checks the format of a value.
 * @param format
 * @param value
 * @param label
 * @param path
 */
export function checkFormat (format: FieldFormat, value: string, label: string, path: string) {
  let regexp

  switch (format) {
    case 'date':
      regexp = DateRegExp
      break
    case 'datetime':
    case 'date-time':
      regexp = DateTimeRegExp
      break
    case 'email':
      regexp = EmailRegExp
      break
    case 'hostname':
      regexp = HostnameRegExp
      break
    case 'ipv4':
      regexp = IPv4RegExp
      break
    case 'ipv6':
      regexp = IPv6RegExp
      break
    case 'time':
      regexp = TimeRegExp
      break
    case 'uri':
      regexp = UriRegExp
      break
    default:
      throw new Error(`"${format}" is not a valid format`)
  }

  if (!regexp.test(value)) {
    throw new FieldFormatError(label, format, path)
  }
}

/**
 * Checks the length of a value.
 * @param length
 * @param value
 * @param label
 * @param path
 */
export function checkLength (length: number, value: {
  length: number
}, label: string, path: string): void {
  if (value.length !== length) {
    throw new FieldLengthError(label, length, path)
  }
}

/**
 * Checks if the value is lesser than or equal to maximum.
 * @param maximum
 * @param value
 * @param label
 * @param path
 */
export function checkMax (maximum: FieldMinMax, value: FieldMinMax, label: string, path: string): void {
  if (value > maximum) {
    throw new FieldMaxError(label, maximum, path)
  }
}

/**
 * Checks if the array contains at most a number of items.
 * @param maxItems
 * @param value
 * @param label
 * @param path
 */
export function checkMaxItems (maxItems: number, value: any[], label: string, path: string): void {
  if (value.length > maxItems) {
    throw new FieldMaxItemsError(label, maxItems, path)
  }
}

/**
 * Checks if the length of the value is lesser than or equal to max.
 * @param maxLength
 * @param value
 * @param label
 * @param path
 */
export function checkMaxLength (maxLength: number, value: {
  length: number
}, label: string, path: string): void {
  if (value.length > maxLength) {
    throw new FieldMaxLengthError(label, maxLength, path)
  }
}

/**
 * Checks if the number of words is lesser than of equal to max.
 * @param maxWords
 * @param value
 * @param label
 * @param path
 */
export function checkMaxWords (maxWords: number, value: string, label: string, path: string): void {
  if (value.split(' ').length > maxWords) {
    throw new FieldMaxWordsError(label, maxWords, path)
  }
}

/**
 * Checks if the value is greater than or equal to minimum.
 * @param minimum
 * @param value
 * @param label
 * @param path
 */
export function checkMinimum (minimum: FieldMinMax, value: FieldMinMax, label: string, path: string): void {
  if (typeof minimum !== 'undefined' && value < minimum) {
    throw new FieldMinimumError(label, minimum, path)
  }
}

/**
 * Checks if the array contains at least a number of items.
 * @param minItems
 * @param value
 * @param label
 * @param path
 */
export function checkMinItems (minItems: number, value: any[], label: string, path: string): void {
  if (value.length < minItems) {
    throw new FieldMinItemsError(label, minItems, path)
  }
}

/**
 * Checks if the value is greater than or equal to min.
 * @param minLength
 * @param value
 * @param label
 * @param path
 */
export function checkMinLength (minLength: number, value: {
  length: number
}, label: string, path: string): void {
  if (value.length < minLength) {
    throw new FieldMinLengthError(label, minLength, path)
  }
}

/**
 * Checks if the number of words is greater or equal to min.
 * @param minWords
 * @param value
 * @param label
 * @param path
 */
export function checkMinWords (minWords: number, value: string, label: string, path: string): void {
  if (value.split(' ').length < minWords) {
    throw new FieldMinWordsError(label, minWords, path)
  }
}

/**
 * Checks if the value is a multiple of a number.
 * @param multipleOf
 * @param value
 * @param label
 * @param path
 */
export function checkMultipleOf (multipleOf: number, value: number, label: string, path: string) {
  if (value % multipleOf !== 0) {
    throw new FieldMultipleOfError(label, multipleOf, path)
  }
}

/**
 * Checks if the value matches the pattern.
 * @param pattern
 * @param value
 * @param label
 * @param path
 */
export function checkPattern (pattern: FieldPattern, value: string, label: string, path: string): void {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern

  if (!regex.test(value)) {
    throw new FieldPatternError(label, regex, path)
  }
}

/**
 * Checks if the value is required.
 * @param required
 * @param value
 * @param label
 * @param path
 */
export function checkRequired (required: boolean, value: any, label: string, path: string): void {
  if (required && value == null) {
    throw new FieldRequiredError(label, path)
  }
}

/**
 * Checks type of value.
 * @param type
 * @param value
 * @param label
 * @param path
 */
export function checkType (
  type: FieldType,
  value: any[] | boolean | null | number | object | string | ((...args: any[]) => void),
  label: string,
  path: string
): void {
  if (typeof type === 'string') {
    switch (type) {
      case 'array':
        if (!(value instanceof Array)) {
          throw new FieldTypeError(label, type, path)
        }
        break
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new FieldTypeError(label, type, path)
        }
        break
      case 'function':
        if (typeof value !== 'function') {
          throw new FieldTypeError(label, type, path)
        }
        break
      case 'integer':
        if (typeof value !== 'number' || Number.isNaN(value) || value !== Math.round(value)) {
          throw new FieldTypeError(label, type, path)
        }
        break
      case 'null':
        if (value !== null) {
          throw new FieldTypeError(label, type, path)
        }
        break
      case 'number':
        if (typeof value !== 'number' || Number.isNaN(value)) {
          throw new FieldTypeError(label, type, path)
        }
        break
      case 'object':
        if (typeof value !== 'object') {
          throw new FieldTypeError(label, type, path)
        }
        break
      case 'string':
        if (typeof value !== 'string') {
          throw new FieldTypeError(label, type, path)
        }
        break
      default:
        throw new Error(`unsupported type "${type}"`)
    }
  }
}

/**
 * Checks if the type of value is one of given types.
 * todo check if type is instance of schema
 * @param types
 * @param values
 * @param label
 * @param path
 */
export function checkTypeArray (
  types: Array<FieldType>,
  values: Array<any[] | boolean | number | object | string | ((...args: any[]) => void)>,
  label: string,
  path: string
): void {
  for (let i = 0; i < values.length; i += 1) {
    let oneOf = false

    for (let j = 0; j < types.length; j += 1) {
      try {
        checkType(types[j], values[i], label, path)
        oneOf = true
      } catch {
        // do nothing
      }
    }
    if (!oneOf) {
      throw new FieldTypeError(label, types.toString(), path)
    }
  }
}

/**
 * Checks if items are unique.
 * @param items
 * @param label
 * @param path
 */
export function checkUniqueItems (items: any[], label: string, path: string) {
  const dict = new Map()

  for (let i = 0; i < items.length; i += 1) {
    if (dict.has(items[i])) {
      throw new FieldUniqueItemsError(label, path)
    }
    dict.set(items[i], true)
  }
}
