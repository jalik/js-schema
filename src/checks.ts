/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import FieldEnumError from './errors/FieldEnumError'
import FieldDeniedError from './errors/FieldDeniedError'
import FieldFormatError from './errors/FieldFormatError'
import FieldLengthError from './errors/FieldLengthError'
import FieldMaximumError from './errors/FieldMaximumError'
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
import JSONSchema, { SchemaAttributes } from './JSONSchema'
import FieldMinItemsError from './errors/FieldMinItemsError'
import FieldMaxItemsError from './errors/FieldMaxItemsError'
import FieldExclusiveMaximumError from './errors/FieldExclusiveMaxError'
import FieldExclusiveMinimumError from './errors/FieldExclusiveMinError'
import FieldPropertiesError from './errors/FieldPropertiesError'
import FieldAdditionalPropertiesError from './errors/FieldAdditionalPropertiesError'
import { joinPath } from './utils'
import ValidateError, { ValidationErrors } from './errors/ValidateError'
import SchemaError from './errors/SchemaError'

/**
 * The format of a string.
 * @see https://json-schema.org/understanding-json-schema/reference/string#format
 */
export type SchemaFormat =
  'date'
  | 'date-time'
  // todo add 'duration'
  | 'email'
  | 'hostname'
  | 'ipv4'
  | 'ipv6'
  | 'time'
  | 'uri'
// todo add 'uuid'

/**
 * The constraints of items in an array.
 * @see https://json-schema.org/understanding-json-schema/reference/array#items
 */
export type SchemaItems = Omit<SchemaAttributes, '$schema' | '$id'>

/**
 * The type of the data.
 * @see https://json-schema.org/understanding-json-schema/reference/type#type-specific-keywords
 */
export type SchemaType =
// https://json-schema.org/understanding-json-schema/reference/array#array
  'array'
  // https://json-schema.org/understanding-json-schema/reference/boolean#boolean
  | 'boolean'
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
  | SchemaType[]

/**
 * Checks additional properties.
 * @param additionalProperties
 * @param properties
 * @param patternProperties
 * @param value
 * @param path
 * @param throwOnError
 */
export function checkAdditionalProperties (
  additionalProperties: SchemaAttributes['additionalProperties'],
  properties: SchemaAttributes['properties'],
  patternProperties: SchemaAttributes['patternProperties'],
  value: Record<string, unknown>,
  path: string,
  throwOnError: boolean): void {
  if (additionalProperties != null && value != null) {
    // ignore arrays
    if (value instanceof Array) {
      return
    }
    for (const key in value) {
      if (additionalProperties === false) {
        if (patternProperties != null) {
          for (const pattern in patternProperties) {
            // ignore properties matching pattern
            if (new RegExp(pattern).test(key)) {
              return
            }
          }
        }
        if (properties == null || !(key in properties)) {
          throw new FieldAdditionalPropertiesError(joinPath(path, key))
        }
      } else if (properties != null && !(key in properties)) {
        new JSONSchema(additionalProperties)
          .validate(value[key], {
            path: joinPath(path, key),
            throwOnError
          })
      }
    }
  }
}

/**
 * Checks if value is allowed.
 * @param enums
 * @param value
 * @param path
 */
export function checkEnum (enums: unknown[], value: unknown, path: string): void {
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i += 1) {
      if (!enums.includes(value[i])) {
        throw new FieldEnumError(path, enums)
      }
    }
  } else if (!enums.includes(value)) {
    throw new FieldEnumError(path, enums)
  }
}

/**
 * Checks if a value is denied.
 * @param denied
 * @param value
 * @param path
 */
export function checkDenied (denied: unknown[], value: unknown, path: string): void {
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i += 1) {
      if (denied.includes(value[i])) {
        throw new FieldDeniedError(path, denied)
      }
    }
  } else if (denied.includes(value)) {
    throw new FieldDeniedError(path, denied)
  }
}

/**
 * Checks if the value is lesser than or equal to maximum (excluded).
 * @param exclusiveMaximum
 * @param value
 * @param path
 */
export function checkExclusiveMaximum (exclusiveMaximum: number, value: number, path: string): void {
  if (value >= exclusiveMaximum) {
    throw new FieldExclusiveMaximumError(path, exclusiveMaximum)
  }
}

/**
 * Checks if the value is greater than or equal to min (excluded).
 * @param exclusiveMinimum
 * @param value
 * @param path
 */
export function checkExclusiveMinimum (exclusiveMinimum: number, value: number, path: string): void {
  if (value <= exclusiveMinimum) {
    throw new FieldExclusiveMinimumError(path, exclusiveMinimum)
  }
}

/**
 * Checks the format of a value.
 * @param format
 * @param strict
 * @param value
 * @param path
 */
export function checkFormat (format: SchemaFormat, strict: boolean, value: string, path: string): void {
  let regexp

  switch (format) {
    case 'date':
      regexp = DateRegExp
      break
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
    if (strict) {
      throw new FieldFormatError(path, format)
    } else {
      console.warn(new FieldFormatError(path, format).message)
    }
  }
}

/**
 * Checks items in an array.
 * @param items
 * @param value
 * @param path
 * @param throwOnError
 */
export function checkItems (
  items: SchemaItems,
  value: unknown[],
  path: string,
  throwOnError: boolean): void {
  if (items != null) {
    let errors: ValidationErrors = {}

    for (let i = 0; i < value.length; i += 1) {
      const itemPath = `${path}[${i}]`

      errors = {
        ...errors,
        ...new JSONSchema(items)
          .validate(value[i], {
            path: itemPath,
            throwOnError
          })
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidateError(errors)
    }
  }
}

/**
 * Checks the length of a value.
 * @param length
 * @param value
 * @param path
 */
export function checkLength (length: number, value: unknown, path: string): void {
  if (value != null && (value as any)?.length !== length) {
    throw new FieldLengthError(path, length)
  }
}

/**
 * Checks if the value is lesser than or equal to maximum.
 * @param maximum
 * @param value
 * @param path
 */
export function checkMaximum (maximum: number, value: number, path: string): void {
  if (value > maximum) {
    throw new FieldMaximumError(path, maximum)
  }
}

/**
 * Checks if the array contains at most a number of items.
 * @param maxItems
 * @param value
 * @param path
 */
export function checkMaxItems (maxItems: number, value: unknown[], path: string): void {
  if (value.length > maxItems) {
    throw new FieldMaxItemsError(path, maxItems)
  }
}

/**
 * Checks if the length of the value is lesser than or equal to max.
 * @param maxLength
 * @param value
 * @param path
 */
export function checkMaxLength (maxLength: number, value: unknown, path: string): void {
  if (value != null && (value as any)?.length > maxLength) {
    throw new FieldMaxLengthError(path, maxLength)
  }
}

/**
 * Checks if the number of words is lesser than of equal to max.
 * @param maxWords
 * @param value
 * @param path
 */
export function checkMaxWords (maxWords: number, value: string, path: string): void {
  if (value.split(' ').length > maxWords) {
    throw new FieldMaxWordsError(path, maxWords)
  }
}

/**
 * Checks if the value is greater than or equal to minimum.
 * @param minimum
 * @param value
 * @param path
 */
export function checkMinimum (minimum: number, value: number, path: string): void {
  if (typeof minimum !== 'undefined' && value < minimum) {
    throw new FieldMinimumError(path, minimum)
  }
}

/**
 * Checks if the array contains at least a number of items.
 * @param minItems
 * @param value
 * @param path
 */
export function checkMinItems (minItems: number, value: unknown[], path: string): void {
  if (value.length < minItems) {
    throw new FieldMinItemsError(path, minItems)
  }
}

/**
 * Checks if the value is greater than or equal to min.
 * @param minLength
 * @param value
 * @param path
 */
export function checkMinLength (minLength: number, value: unknown, path: string): void {
  if (value != null && (value as any)?.length < minLength) {
    throw new FieldMinLengthError(path, minLength)
  }
}

/**
 * Checks if the number of words is greater or equal to min.
 * @param minWords
 * @param value
 * @param path
 */
export function checkMinWords (minWords: number, value: string, path: string): void {
  if (value.split(' ').length < minWords) {
    throw new FieldMinWordsError(path, minWords)
  }
}

/**
 * Checks if the value is a multiple of a number.
 * @param multipleOf
 * @param value
 * @param path
 */
export function checkMultipleOf (multipleOf: number, value: number, path: string): void {
  if (value % multipleOf !== 0) {
    throw new FieldMultipleOfError(path, multipleOf)
  }
}

/**
 * Checks if the value matches the pattern.
 * @param pattern
 * @param value
 * @param path
 */
export function checkPattern (pattern: string, value: string, path: string): void {
  const regex = new RegExp(pattern)

  if (!regex.test(value)) {
    throw new FieldPatternError(path, regex)
  }
}

/**
 * Checks pattern properties.
 * @param patternProperties
 * @param value
 * @param path
 * @param throwOnError
 */
export function checkPatternProperties (
  patternProperties: SchemaAttributes['patternProperties'],
  value: Record<string, unknown>,
  path: string,
  throwOnError: boolean): void {
  if (patternProperties != null && value != null) {
    for (const key in value) {
      for (const pattern in patternProperties) {
        if (new RegExp(pattern).test(key)) {
          new JSONSchema(patternProperties[pattern])
            .validate(value[key], {
              path: joinPath(path, key),
              throwOnError
            })
        }
      }
    }
  }
}

/**
 * Checks if the properties are valid.
 * @param properties
 * @param value
 * @param path
 * @param throwOnError
 */
export function checkProperties (
  properties: SchemaAttributes['properties'],
  value: Record<string, unknown>,
  path: string,
  throwOnError: boolean): void {
  if (properties != null) {
    if (typeof value !== 'undefined' && (typeof value !== 'object' || value === null)) {
      throw new FieldPropertiesError(path, properties)
    }
    let errors = {} as ValidationErrors

    for (const key in properties) {
      errors = {
        ...errors,
        ...new JSONSchema(properties[key])
          .validate(value[key], {
            path: joinPath(path, key),
            throwOnError
          })
      }
    }
    if (Object.keys(errors).length > 0) {
      throw new ValidateError(errors)
    }
  }
}

/**
 * Checks if the value is required.
 * @param required
 * @param value
 * @param path
 */
export function checkRequired (required: string[], value: unknown, path: string): void {
  if (required instanceof Array && typeof value === 'object' && value != null) {
    for (const key of required) {
      if (!(key in value)) {
        throw new FieldRequiredError(path)
      }
    }
  }
}

/**
 * Throws an error if schema attributes are not valid.
 * @param attributes
 * @param path
 */
export function checkSchemaAttributes (attributes: SchemaAttributes, path = ''): void {
  // Check type
  const { type } = attributes
  if (type != null) {
    if (type instanceof Array) {
      type.forEach((el) => {
        if (typeof el !== 'string') {
          throw new SchemaError(`${joinPath(path, 'type')} is not valid`)
        }
      })
    } else if (typeof type !== 'string') {
      throw new SchemaError(`${joinPath(path, 'type')} = "${type}" must be a string or an array of strings`)
    }
  }
  // Check enum
  if (typeof attributes.enum !== 'undefined' && !(attributes.enum instanceof Array)) {
    throw new SchemaError(`${joinPath(path, 'enum')} must be an array`)
  }
  // Check format
  const { format } = attributes
  if (!['undefined', 'string'].includes(typeof format)) {
    throw new SchemaError(`${joinPath(path, 'format')} must be a string`)
  }
  // Check items
  const { items } = attributes
  if (typeof items !== 'undefined' && typeof items !== 'object') {
    throw new SchemaError(`${joinPath(path, 'items')} must be an object`)
  }
  // Check length
  if (!['undefined', 'number'].includes(typeof length)) {
    throw new SchemaError(`${joinPath(path, 'length')} must be a number`)
  }
  // Check maximum value
  const { maximum } = attributes
  if (!['undefined', 'number'].includes(typeof maximum)) {
    throw new SchemaError(`${joinPath(path, 'maximum')} must be a number`)
  }
  // Check max length
  const { maxLength } = attributes
  if (!['undefined', 'number'].includes(typeof maxLength)) {
    throw new SchemaError(`${joinPath(path, 'maxLength')} must be a number`)
  }
  // Check minimum value
  const { minimum } = attributes
  if (!['undefined', 'number'].includes(typeof minimum)) {
    throw new SchemaError(`${joinPath(path, 'minimum')} must be a number`)
  }
  // Check min length
  const { minLength } = attributes
  if (!['undefined', 'number'].includes(typeof minLength)) {
    throw new SchemaError(`${joinPath(path, 'minLength')} must be a number`)
  }
  // Check pattern
  const { pattern } = attributes
  if (!['undefined', 'string'].includes(typeof pattern)) {
    throw new SchemaError(`${joinPath(path, 'pattern')} must be a string`)
  }
  // Check pattern properties
  const { patternProperties } = attributes
  if (typeof patternProperties !== 'undefined' && (typeof patternProperties !== 'object' || patternProperties === null)) {
    throw new SchemaError(`${joinPath(path, 'patternProperties')} must be an object`)
  }
  // Check properties
  const { properties } = attributes
  if (typeof properties !== 'undefined' && (typeof properties !== 'object' || properties === null)) {
    throw new SchemaError(`${joinPath(path, 'properties')} must be an object`)
  }
  // Check title
  const { title } = attributes
  if (!['undefined', 'string'].includes(typeof title)) {
    throw new SchemaError(`${joinPath(path, 'title')} must be a string`)
  }

  // Check denied values
  const { denied } = attributes
  if (typeof denied !== 'undefined' && !(denied instanceof Array)) {
    throw new SchemaError(`${joinPath(path, 'denied')} must be an array`)
  }
  // Check max words
  const { maxWords } = attributes
  if (!['undefined', 'number'].includes(typeof maxWords)) {
    throw new SchemaError(`${joinPath(path, 'maxWords')} must be a number`)
  }
  // Check min words
  const { minWords } = attributes
  if (!['undefined', 'number'].includes(typeof minWords)) {
    throw new SchemaError(`${joinPath(path, 'minWords')} must be a number`)
  }
  // Check required
  const { required } = attributes
  if (typeof required !== 'undefined' && !(required instanceof Array)) {
    throw new SchemaError(`${joinPath(path, 'required')} must be an array`)
  }
  // Check conflicting options.
  if (attributes.enum && attributes.denied) {
    throw new SchemaError(`${joinPath(path, 'enum')} and ${joinPath(path, 'denied')} cannot be defined together`)
  }
}

/**
 * Checks type of value.
 * @param type
 * @param value
 * @param path
 */
export function checkType (
  type: SchemaType,
  value: unknown,
  path: string
): void {
  // Ignore if value is undefined
  if (value === undefined) {
    return
  }
  if (type instanceof Array) {
    // Check different types (ex: ['string', 'number'])
    let valid = false

    for (let i = 0; i < type.length; i += 1) {
      try {
        checkType(type[i], value, path)
        valid = true
      } catch {
        // do nothing
      }
    }
    if (!valid) {
      throw new FieldTypeError(path, type.toString())
    }
  } else {
    switch (type) {
      case 'array':
        if (!(value instanceof Array)) {
          throw new FieldTypeError(path, type)
        }
        break
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new FieldTypeError(path, type)
        }
        break
      case 'integer':
        if (typeof value !== 'number' || Number.isNaN(value) || value !== Math.round(value)) {
          throw new FieldTypeError(path, type)
        }
        break
      case 'null':
        if (value !== null) {
          throw new FieldTypeError(path, type)
        }
        break
      case 'number':
        if (typeof value !== 'number' || Number.isNaN(value)) {
          throw new FieldTypeError(path, type)
        }
        break
      case 'object':
        if (typeof value !== 'object' || value === null || value instanceof Array) {
          throw new FieldTypeError(path, type)
        }
        break
      case 'string':
        if (typeof value !== 'string') {
          throw new FieldTypeError(path, type)
        }
        break
      default:
        throw new Error(`unsupported type "${type}"`)
    }
  }
}

/**
 * Checks if items are unique.
 * @param value
 * @param path
 */
export function checkUniqueItems (value: unknown[], path: string): void {
  if (value != null) {
    const dict = new Map()

    for (let i = 0; i < value.length; i += 1) {
      if (value[i] instanceof Array) {
        const v = JSON.stringify(value[i])

        if (dict.get(v)) {
          throw new FieldUniqueItemsError(path)
        } else {
          dict.set(v, true)
        }
        continue
      }

      if (dict.get(value[i])) {
        throw new FieldUniqueItemsError(path)
      }
      dict.set(value[i], true)
    }
  }
}
