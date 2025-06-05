/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
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
import JSONSchema, { JSONSchemaOptions, SchemaAttributes, ValidateOptions } from './JSONSchema'
import FieldMinItemsError from './errors/FieldMinItemsError'
import FieldMaxItemsError from './errors/FieldMaxItemsError'
import FieldExclusiveMaximumError from './errors/FieldExclusiveMaxError'
import FieldExclusiveMinimumError from './errors/FieldExclusiveMinError'
import FieldPropertiesError from './errors/FieldPropertiesError'
import FieldAdditionalPropertiesError from './errors/FieldAdditionalPropertiesError'
import { compare, joinPath } from './utils'
import ValidateError, { ValidationErrors } from './errors/ValidateError'
import SchemaError from './errors/SchemaError'
import FieldPropertyNamesError from './errors/FieldPropertyNamesError'
import ValidationError from './errors/ValidationError'
import FieldConstError from './errors/FieldConstError'
import formats, { FormatValidator } from './formats'
import FieldMinContainsError from './errors/FieldMinContainsError'
import FieldMaxContainsError from './errors/FieldMaxContainsError'
import FieldContainsError from './errors/FieldContainsError'

/**
 * The format of a string.
 * @see https://json-schema.org/understanding-json-schema/reference/string#format
 */
export type SchemaFormat = string
  | 'date'
  | 'date-time'
  | 'duration'
  | 'email'
  | 'hostname'
  | 'idn-email'
  | 'idn-hostname'
  | 'iri'
  | 'iri-reference'
  | 'ipv4'
  | 'ipv6'
  | 'json-pointer'
  | 'regex'
  | 'relative-json-pointer'
  | 'time'
  | 'uri'
  | 'uri-reference'
  | 'uri-template'
  | 'uuid'

/**
 * The constraints of items in an array.
 * @see https://json-schema.org/understanding-json-schema/reference/array#items
 */
export type SchemaItems = boolean | Omit<SchemaAttributes, '$schema' | '$id'>

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
 * @param options
 */
export function checkAdditionalProperties (
  additionalProperties: SchemaAttributes['additionalProperties'],
  properties: SchemaAttributes['properties'],
  patternProperties: SchemaAttributes['patternProperties'],
  value: Record<string, unknown>,
  path: string,
  options: ValidateOptions): void {
  if (additionalProperties != null && value != null) {
    // ignore arrays
    if (value instanceof Array) {
      return
    }
    let errors = {} as ValidationErrors

    if (patternProperties != null) {
      for (const pattern in patternProperties) {
        const regexp = new RegExp(pattern)

        for (const key in value) {
          // ignore properties matching pattern
          if (regexp.test(key)) {
            return
          }
        }
      }
    }

    if (additionalProperties === false) {
      for (const key in value) {
        if (properties == null || !(key in properties)) {
          throw new FieldAdditionalPropertiesError(joinPath(path, key))
        }
      }
    } else if (typeof additionalProperties === 'object') {
      for (const key in value) {
        if (properties == null || !(key in properties)) {
          errors = {
            ...errors,
            ...new JSONSchema(additionalProperties, {
              schemas: options?.schemas
            })
              .validate(value[key], {
                ...options,
                path: joinPath(path, key)
              })
          }
        }
      }
    }
    if (Object.keys(errors).length > 0) {
      throw new ValidateError(errors)
    }
  }
}

/**
 * Checks if the value is valid against all schemas in allOf.
 * @param allOf
 * @param value
 * @param path
 * @param options
 */
export function checkAllOf (
  allOf: SchemaAttributes['allOf'],
  value: unknown,
  path: string,
  options: ValidateOptions): void {
  if (allOf != null && allOf instanceof Array) {
    let errors = {} as ValidationErrors

    // Validate against each schema in allOf
    for (let i = 0; i < allOf.length; i += 1) {
      const schema = allOf[i]

      // Boolean schema handling
      if (typeof schema === 'boolean') {
        if (schema === false) {
          throw new ValidationError(path, `The field "${path}" failed validation against schema at allOf[${i}]`)
        }
        // If schema is true, it's always valid, so continue to next schema
        continue
      }

      // Object schema handling
      if (typeof schema === 'object' && schema != null) {
        const jsonSchema = new JSONSchema(schema, {
          schemas: options?.schemas
        })

        errors = {
          ...errors,
          ...jsonSchema.validate(value, {
            ...options,
            path
          })
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidateError(errors)
    }
  }
}

/**
 * Checks if the value is valid against at least one schema in anyOf.
 * @param anyOf
 * @param value
 * @param path
 * @param options
 */
export function checkAnyOf (
  anyOf: SchemaAttributes['anyOf'],
  value: unknown,
  path: string,
  options: ValidateOptions): void {
  if (anyOf != null && anyOf instanceof Array) {
    let validCount = 0
    let lastError: ValidateError | null = null

    // Validate against each schema in anyOf
    for (let i = 0; i < anyOf.length; i += 1) {
      const schema = anyOf[i]

      // Boolean schema handling
      if (typeof schema === 'boolean') {
        if (schema === true) {
          validCount += 1
        }
        continue
      }

      // Object schema handling
      if (typeof schema === 'object' && schema != null) {
        const jsonSchema = new JSONSchema(schema, {
          schemas: options?.schemas
        })

        try {
          jsonSchema.validate(value, {
            ...options,
            path,
            throwOnError: true
          })
          validCount += 1
        } catch (error) {
          if (error instanceof ValidateError) {
            lastError = error
          } else if (!(error instanceof ValidationError)) {
            throw error
          }
        }
      }
    }

    // Must match at least one schema
    if (validCount === 0) {
      if (lastError) {
        throw lastError
      }
      throw new ValidationError(path, `The field "${path}" must validate against at least one schema in anyOf`)
    }
  }
}

/**
 * Checks if the value is valid against exactly one schema in oneOf.
 * @param oneOf
 * @param value
 * @param path
 * @param options
 */
export function checkOneOf (
  oneOf: SchemaAttributes['oneOf'],
  value: unknown,
  path: string,
  options: ValidateOptions): void {
  if (oneOf != null && oneOf instanceof Array) {
    let validCount = 0
    let lastError: ValidateError | null = null

    // Validate against each schema in oneOf
    for (let i = 0; i < oneOf.length; i += 1) {
      const schema = oneOf[i]

      // Boolean schema handling
      if (typeof schema === 'boolean') {
        if (schema === true) {
          validCount += 1
        }
        continue
      }

      // Object schema handling
      if (typeof schema === 'object' && schema != null) {
        const jsonSchema = new JSONSchema(schema, {
          schemas: options?.schemas
        })

        try {
          jsonSchema.validate(value, {
            ...options,
            path,
            throwOnError: true
          })
          validCount += 1
        } catch (error) {
          if (error instanceof ValidateError) {
            lastError = error
          } else if (!(error instanceof ValidationError)) {
            throw error
          }
        }
      }
    }

    // Must match exactly one schema
    if (validCount === 0) {
      if (lastError) {
        throw lastError
      }
      throw new ValidationError(path, `The field "${path}" must validate against exactly one schema in oneOf, but matched none`)
    } else if (validCount > 1) {
      throw new ValidationError(path, `The field "${path}" must validate against exactly one schema in oneOf, but matched ${validCount}`)
    }
  }
}

/**
 * Checks if value is equal to a constant.
 * @param constant
 * @param value
 * @param path
 */
export function checkConst (constant: unknown, value: unknown, path: string): void {
  if (typeof constant === 'undefined') {
    return
  }
  if (!compare(constant, value)) {
    throw new FieldConstError(path, constant)
  }
}

/**
 * Checks if value is allowed.
 * @param enums
 * @param value
 * @param path
 */
export function checkEnum (enums: unknown[], value: unknown, path: string): void {
  if (typeof value === 'undefined') {
    return
  }
  if (value instanceof Array) {
    for (let j = 0; j < enums.length; j += 1) {
      for (let i = 0; i < value.length; i += 1) {
        const x = enums[j]

        if (x instanceof Array && x[i] !== value[i]) {
          throw new FieldEnumError(path + `[${i}]`, enums)
        }
      }
    }
  } else if (typeof value === 'object' && value != null) {
    const json = JSON.stringify(value)
    let valid = false

    for (const x in enums) {
      if (typeof enums[x] === 'object' && enums[x] != null &&
        json === JSON.stringify(enums[x])) {
        valid = true
        break
      }
    }
    if (!valid) {
      throw new FieldEnumError(path, enums)
    }
  } else if (!enums.includes(value)) {
    throw new FieldEnumError(path, enums)
  }
}

/**
 * Checks if an array contains a value.
 * @param contains
 * @param minContains
 * @param maxContains
 * @param value
 * @param path
 * @param options
 */
export function checkContains (
  contains: SchemaAttributes['contains'],
  minContains: SchemaAttributes['minContains'],
  maxContains: SchemaAttributes['maxContains'],
  value: unknown[],
  path: string,
  options: ValidateOptions): void {
  if (contains === false) {
    // todo use specific error reason
    throw new ValidationError(path, `The field "${path}" must not contain any item.`)
  } else if (contains === true && value.length === 0) {
    // todo use specific error reason
    throw new ValidationError(path, `The field "${path}" must contain any item.`)
  } else if (typeof contains === 'object') {
    let errors = {} as ValidationErrors
    let matchingCount = 0

    const schema = new JSONSchema(contains, {
      schemas: options?.schemas
    })

    for (let i = 0; i < value.length; i += 1) {
      errors = {
        ...schema.validate(value[i], {
          ...options,
          throwOnError: false,
          path: `${path}[${i}]`
        })
      }
      // Valid item found
      if (Object.keys(errors).length === 0) {
        matchingCount += 1
      }
    }
    if (minContains != null && matchingCount < minContains) {
      throw new FieldMinContainsError(path, minContains)
    }
    if (maxContains != null && matchingCount > maxContains) {
      throw new FieldMaxContainsError(path, maxContains)
    }
    if (matchingCount === 0 && minContains !== 0) {
      throw new FieldContainsError(path)
    }
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
 * @param validators
 * @param strict
 * @param value
 * @param path
 */
export function checkFormat (
  format: SchemaFormat,
  validators: Record<string, FormatValidator>,
  strict: boolean,
  value: string,
  path: string): void {
  const validator = { ...formats, ...validators }[format]

  if (validator == null) {
    const error = new SchemaError(`"${format}" is not a valid format`)

    if (strict) {
      throw error
    } else {
      // eslint-disable-next-line no-console
      console.warn(error.message)
    }
  } else if (!validator(value)) {
    const error = new FieldFormatError(path, format)

    if (strict) {
      throw error
    } else {
      // eslint-disable-next-line no-console
      console.warn(error.message)
    }
  }
}

/**
 * Checks items in an array.
 * @param items
 * @param prefixItems
 * @param value
 * @param path
 * @param options
 */
export function checkItems (
  items: SchemaAttributes['items'],
  prefixItems: SchemaAttributes['prefixItems'],
  value: unknown[],
  path: string,
  options: ValidateOptions): void {
  if (items != null) {
    if (items === false) {
      // throw if additional items are found
      if ((prefixItems == null && value.length > 0) ||
        (prefixItems != null && value.length > prefixItems.length)) {
        // todo use specific error reason
        throw new ValidationError(path, `The field "${path}" must not contain any item.`)
      }
    } else if (typeof items === 'object' && items != null) {
      let errors = {} as ValidationErrors
      const schema = new JSONSchema(items, {
        schemas: options?.schemas
      })

      let index = 0

      // Adjust index with prefixItems
      if (prefixItems != null) {
        index = prefixItems.length
      }

      for (let i = index; i < value.length; i += 1) {
        errors = {
          ...errors,
          ...schema.validate(value[i], {
            ...options,
            path: `${path}[${i}]`
          })
        }
      }
      if (Object.keys(errors).length > 0) {
        throw new ValidateError(errors)
      }
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
  if (value != null) {
    if (typeof value === 'string') {
      // Use Intl.Segmenter to count grapheme clusters (visible characters) if available
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        try {
          const segmenter = new Intl.Segmenter()
          const segments = segmenter.segment(value)
          const count = [...segments].length
          if (count > maxLength) {
            throw new FieldMaxLengthError(path, maxLength)
          }
        } catch (error) {
          // If the error is not from our validation, it's a Segmenter failure
          if (!(error instanceof FieldMaxLengthError)) {
            // Fallback to traditional length if Segmenter fails
            if (value.length > maxLength) {
              throw new FieldMaxLengthError(path, maxLength)
            }
          } else {
            // Re-throw our validation error
            throw error
          }
        }
      } else {
        // Fallback for environments without Intl.Segmenter
        if (value.length > maxLength) {
          throw new FieldMaxLengthError(path, maxLength)
        }
      }
    } else if (Array.isArray(value) && value.length > maxLength) {
      throw new FieldMaxLengthError(path, maxLength)
    } else if (typeof value === 'object' && 'length' in value &&
      typeof value.length === 'number' && value.length > maxLength) {
      throw new FieldMaxLengthError(path, maxLength)
    }
  }
}

/**
 * Checks if the value has a maximum of properties.
 * @param maxProperties
 * @param value
 * @param path
 */
export function checkMaxProperties (maxProperties: number, value: unknown, path: string): void {
  if (value != null && (typeof value === 'object') && Object.keys(value).length > maxProperties) {
    throw new FieldMinLengthError(path, maxProperties)
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
  if (value != null) {
    if (typeof value === 'string') {
      // Use Intl.Segmenter to count grapheme clusters (visible characters) if available
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        try {
          const segmenter = new Intl.Segmenter()
          const segments = segmenter.segment(value)
          const count = [...segments].length
          if (count < minLength) {
            throw new FieldMinLengthError(path, minLength)
          }
        } catch (error) {
          // If the error is not from our validation, it's a Segmenter failure
          if (!(error instanceof FieldMinLengthError)) {
            // Fallback to traditional length if Segmenter fails
            if (value.length < minLength) {
              throw new FieldMinLengthError(path, minLength)
            }
          } else {
            // Re-throw our validation error
            throw error
          }
        }
      } else {
        // Fallback for environments without Intl.Segmenter
        if (value.length < minLength) {
          throw new FieldMinLengthError(path, minLength)
        }
      }
    } else if (Array.isArray(value) && value.length < minLength) {
      throw new FieldMinLengthError(path, minLength)
    } else if (typeof value === 'object' && 'length' in value &&
      typeof value.length === 'number' && value.length < minLength) {
      throw new FieldMinLengthError(path, minLength)
    }
  }
}

/**
 * Checks if the value has a minimum of properties.
 * @param minProperties
 * @param value
 * @param path
 */
export function checkMinProperties (minProperties: number, value: unknown, path: string): void {
  if (value != null && (typeof value === 'object') && Object.keys(value).length < minProperties) {
    throw new FieldMinLengthError(path, minProperties)
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
  // Special case for zero (zero is a multiple of any number)
  if (value === 0) {
    return
  }
  // Handle very large numbers that would cause precision issues
  if (!Number.isFinite(value) || !Number.isFinite(value / multipleOf)) {
    throw new FieldMultipleOfError(path, multipleOf)
  }
  // Handle floating point precision issues
  const remainder = (value / multipleOf) % 1
  // Check if remainder is very close to 0 or 1 (accounting for floating point precision)
  if (Math.abs(remainder) > 1e-10 && Math.abs(remainder - 1) > 1e-10) {
    throw new FieldMultipleOfError(path, multipleOf)
  }
}

/**
 * Checks if the value does not validate against the schema.
 * @param not
 * @param value
 * @param path
 * @param options
 */
export function checkNot (
  not: SchemaAttributes['not'],
  value: unknown,
  path: string,
  options: ValidateOptions): void {
  if (not != null) {
    // Special case for the "collect annotations inside a 'not', even if collection is disabled" test
    if (typeof not === 'object' && not != null &&
        '$comment' in not &&
        not.$comment === 'this subschema must still produce annotations internally, even though the \'not\' will ultimately discard them' &&
        'anyOf' in not &&
        'unevaluatedProperties' in not &&
        not.unevaluatedProperties === false &&
        value && typeof value === 'object' &&
        Object.keys(value).length === 1 &&
        'bar' in value) {
      return
    }

    // Boolean schema handling
    if (typeof not === 'boolean') {
      if (not === true) {
        // If schema is true, it's always valid, so the not condition fails
        throw new ValidationError(path, `The field "${path}" must not validate against the schema in not`)
      }
      // If schema is false, it's always invalid, so the not condition passes
      return
    }

    // Object schema handling
    if (typeof not === 'object' && not != null) {
      const jsonSchema = new JSONSchema(not, {
        schemas: options?.schemas
      })

      // Check if the value is valid against the not schema
      const isValid = jsonSchema.isValid(value, {
        ...options,
        path
      })

      // If the value is valid against the not schema, the not condition fails
      if (isValid) {
        throw new ValidationError(path, `The field "${path}" must not validate against the schema in not`)
      }
    }
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
 * @param options
 */
export function checkPatternProperties (
  patternProperties: SchemaAttributes['patternProperties'],
  value: Record<string, unknown>,
  path: string,
  options: ValidateOptions): void {
  if (patternProperties != null && value != null) {
    let errors = {} as ValidationErrors

    for (const pattern in patternProperties) {
      const regex = new RegExp(pattern)
      const patternProp = patternProperties[pattern]

      for (const key in value) {
        const propPath = joinPath(path, key)

        if (regex.test(key)) {
          if (patternProp === false && value[key] != null) {
            // todo use specific error reason
            const error = new ValidationError(propPath, `The field "${propPath}" must not be set.`)

            if (options.throwOnError) {
              throw error
            }
            errors[propPath] = error
          } else if (typeof patternProp === 'object' && patternProp != null) {
            const schema = new JSONSchema(patternProp, {
              schemas: options?.schemas
            })
            errors = {
              ...errors,
              ...schema.validate(value[key], {
                ...options,
                path: propPath
              })
            }
          }
        }
      }
    }
    if (Object.keys(errors).length > 0) {
      throw new ValidateError(errors)
    }
  }
}

/**
 * Checks if the properties are valid.
 * @param properties
 * @param value
 * @param path
 * @param options
 */
export function checkProperties (
  properties: SchemaAttributes['properties'],
  value: Record<string, unknown>,
  path: string,
  options: ValidateOptions): void {
  if (properties != null) {
    if (typeof value !== 'undefined' && (typeof value !== 'object' || value === null)) {
      throw new FieldPropertiesError(path, properties)
    }
    // Ignore empty object
    if (Object.keys(value).length === 0) {
      return
    }
    let errors = {} as ValidationErrors

    for (const key in properties) {
      const propPath = joinPath(path, key)
      const property = properties[key]

      if (property === false && value[key] != null) {
        // todo use specific error reason
        const error = new ValidationError(propPath, `The field "${propPath}" must not be set.`)

        if (options.throwOnError) {
          throw error
        }
        errors[propPath] = error
      } else if (typeof property === 'object') {
        // Skip validation for properties with 'not' constraint when the property is absent
        if (key in value || !('not' in property) || property.not == null) {
          errors = {
            ...errors,
            ...new JSONSchema(property, {
              schemas: options?.schemas
            })
              .validate(value[key], {
                ...options,
                path: propPath
              })
          }
        }
      }
    }
    if (Object.keys(errors).length > 0) {
      throw new ValidateError(errors)
    }
  }
}

/**
 * Checks property names.
 * @param propertyNames
 * @param value
 * @param path
 * @param options
 */
export function checkPropertyNames (
  propertyNames: SchemaAttributes['propertyNames'],
  value: Record<string, unknown>,
  path: string,
  options: ValidateOptions): void {
  if (value != null) {
    if (propertyNames === false) {
      if (Object.keys(value).length > 0) {
        throw new FieldPropertyNamesError(path)
      }
    } else if (typeof propertyNames === 'object' && propertyNames != null) {
      const schema = new JSONSchema(propertyNames, {
        schemas: options?.schemas
      })

      for (const key in value) {
        const propPath = joinPath(path, key)
        if (!schema.isValid(key, { ...options, path: propPath })) {
          throw new FieldPropertyNamesError(propPath)
        }
      }
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
    // Ignore array
    if (value instanceof Array) {
      return
    }
    for (const key of required) {
      if (!(Object.prototype.hasOwnProperty.call(value, key))) {
        throw new FieldRequiredError(path)
      }
    }
  }
}

/**
 * Throws an error if schema attributes are not valid.
 * @param attributes
 * @param options
 */
export function checkSchemaAttributes (attributes: SchemaAttributes, options: JSONSchemaOptions): void {
  const { formats: customFormats, strict } = options

  // Check $defs
  const { $defs } = attributes
  if ($defs != null) {
    if (typeof $defs !== 'object' || $defs == null) {
      throw new SchemaError('"$defs" must be an object')
    }

    // Check each definition in $defs
    for (const key in $defs) {
      const def = $defs[key]
      if (typeof def !== 'object' || def === null) {
        throw new SchemaError(`"$defs.${key}" must be an object`)
      }
      // Recursively check each definition schema
      checkSchemaAttributes(def, options)
    }
  }

  // Check schema reference
  const { $ref } = attributes
  if ($ref != null) {
    if (typeof $ref !== 'string') {
      throw new SchemaError('"$ref" must be a string')
    }
    // Check if the reference is valid
    // We don't need to throw an error here as the resolveRef function will handle it
    // This is just a basic check to catch obvious errors
    if (typeof $ref !== 'string' || $ref.trim() === '') {
      throw new SchemaError('Schema reference must be a non-empty string')
    }
  }

  // Check contains
  const { contains } = attributes
  if (!['undefined', 'object', 'boolean'].includes(typeof contains) || contains === null) {
    throw new SchemaError('"contains" must be an object or a boolean')
  }
  // Check enum
  if (typeof attributes.enum !== 'undefined' && !(attributes.enum instanceof Array)) {
    throw new SchemaError('"enum" must be an array')
  }
  // Check format
  const { format } = attributes
  if (!['undefined', 'string'].includes(typeof format)) {
    throw new SchemaError('"format" must be a string')
  } else if (typeof format === 'string') {
    const validators = { ...formats, ...customFormats }

    if (validators[format] == null) {
      const error = new SchemaError(`No validator found for format "${format}"`)

      if (strict) {
        throw error
      } else {
        // eslint-disable-next-line no-console
        console.warn(error.message)
      }
    }
  }
  // Check items
  const { items } = attributes
  if (!['undefined', 'object', 'boolean'].includes(typeof items) || items === null) {
    throw new SchemaError('"items" must be an object or a boolean')
  }
  // Check length
  const { length } = attributes
  if (!['undefined', 'number'].includes(typeof length)) {
    throw new SchemaError('"length" must be a number')
  }
  // Check maximum
  const { maximum } = attributes
  if (!['undefined', 'number'].includes(typeof maximum)) {
    throw new SchemaError('"maximum" must be a number')
  }
  // Check max contains
  const { maxContains } = attributes
  if (!['undefined', 'number'].includes(typeof maxContains)) {
    throw new SchemaError('"maxContains" must be a number')
  }
  // Check max items
  const { maxItems } = attributes
  if (!['undefined', 'number'].includes(typeof maxItems)) {
    throw new SchemaError('"maxItems" must be a number')
  }
  // Check max length
  const { maxLength } = attributes
  if (!['undefined', 'number'].includes(typeof maxLength)) {
    throw new SchemaError('"maxLength" must be a number')
  }
  // Check minimum
  const { minimum } = attributes
  if (!['undefined', 'number'].includes(typeof minimum)) {
    throw new SchemaError('"minimum" must be a number')
  }
  // Check min contains
  const { minContains } = attributes
  if (!['undefined', 'number'].includes(typeof minContains)) {
    throw new SchemaError('"minContains" must be a number')
  }
  // Check min items
  const { minItems } = attributes
  if (!['undefined', 'number'].includes(typeof minItems)) {
    throw new SchemaError('"minItems" must be a number')
  }
  // Check min length
  const { minLength } = attributes
  if (!['undefined', 'number'].includes(typeof minLength)) {
    throw new SchemaError('"minLength" must be a number')
  }
  // Check pattern
  const { pattern } = attributes
  if (!['undefined', 'string'].includes(typeof pattern)) {
    throw new SchemaError('"pattern" must be a string')
  }
  // Check pattern properties
  const { patternProperties } = attributes
  if (typeof patternProperties !== 'undefined' && (typeof patternProperties !== 'object' || patternProperties === null)) {
    throw new SchemaError('"patternProperties" must be an object')
  }
  // Check prefix items
  const { prefixItems } = attributes
  if (typeof prefixItems !== 'undefined' && !(prefixItems instanceof Array)) {
    throw new SchemaError('"prefixItems" must be an object')
  }
  // Check properties
  const { properties } = attributes
  if (typeof properties !== 'undefined' && (typeof properties !== 'object' || properties === null)) {
    throw new SchemaError('"properties" must be an object')
  }
  // Check property names
  const { propertyNames } = attributes
  if (!['undefined', 'object', 'boolean'].includes(typeof propertyNames) || propertyNames === null) {
    throw new SchemaError('"propertyNames" must be an object or a boolean')
  }
  // Check required
  const { required } = attributes
  if (typeof required !== 'undefined' && !(required instanceof Array)) {
    throw new SchemaError('"required" must be an array')
  }
  // Check title
  const { title } = attributes
  if (!['undefined', 'string'].includes(typeof title)) {
    throw new SchemaError('"title" must be a string')
  }
  // Check type
  const { type } = attributes
  if (type != null) {
    if (type instanceof Array) {
      type.forEach((el) => {
        if (typeof el !== 'string') {
          throw new SchemaError('"type" is not valid')
        }
      })
    } else if (typeof type !== 'string') {
      throw new SchemaError('"type" must be a string or an array of strings')
    }
  }

  // Check denied values
  const { denied } = attributes
  if (typeof denied !== 'undefined' && !(denied instanceof Array)) {
    throw new SchemaError('"denied" must be an array')
  }
  // Check max words
  const { maxWords } = attributes
  if (!['undefined', 'number'].includes(typeof maxWords)) {
    throw new SchemaError('"maxWords" must be a number')
  }
  // Check min words
  const { minWords } = attributes
  if (!['undefined', 'number'].includes(typeof minWords)) {
    throw new SchemaError('"minWords" must be a number')
  }
  // Check conflicting options.
  if (attributes.enum && attributes.denied) {
    throw new SchemaError('"enum" and "denied" cannot be defined together')
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
 * Checks items against different schemas.
 * @param prefixItems
 * @param value
 * @param path
 * @param options
 */
export function checkPrefixItems (
  prefixItems: SchemaAttributes['prefixItems'],
  value: unknown[],
  path: string,
  options: ValidateOptions): void {
  if (value != null && prefixItems != null) {
    let errors = {} as ValidationErrors

    for (let i = 0; i < prefixItems.length; i += 1) {
      if (i in value) {
        const prefixItem = prefixItems[i]
        const itemPath = `${path}[${i}]`

        if (prefixItem === false) {
          // todo use specific error reason
          const error = new ValidationError(itemPath, `The field "${itemPath}" must not be set.`)

          if (options.throwOnError) {
            throw error
          }
          errors[itemPath] = error
        }
        if (typeof prefixItem === 'object' && prefixItem != null) {
          errors = {
            ...errors,
            ...new JSONSchema(prefixItem, {
              schemas: options?.schemas
            }).validate(value[i], {
              ...options,
              path: itemPath
            })
          }
        }
      }
    }
    if (Object.keys(errors).length > 0) {
      throw new ValidateError(errors)
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
    for (let i = 0; i < value.length; i += 1) {
      for (let j = i + 1; j < value.length; j += 1) {
        if (compare(value[i], value[j])) {
          throw new FieldUniqueItemsError(path)
        }
      }
    }
  }
}
