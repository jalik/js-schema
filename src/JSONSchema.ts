/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import deepExtend from '@jalik/deep-extend'
import InvalidPathError from './errors/InvalidPathError'
import { validate } from './utils'
import {
  checkAdditionalProperties,
  checkDenied,
  checkEnum,
  checkExclusiveMaximum,
  checkExclusiveMinimum,
  checkFormat,
  checkItems,
  checkLength,
  checkMaximum,
  checkMaxItems,
  checkMaxLength,
  checkMaxWords,
  checkMinimum,
  checkMinItems,
  checkMinLength,
  checkMinWords,
  checkMultipleOf,
  checkPattern,
  checkPatternProperties,
  checkProperties,
  checkRequired,
  checkSchemaAttributes,
  checkType,
  checkUniqueItems,
  SchemaFormat,
  SchemaItems,
  SchemaType
} from './checks'
import { ValidationErrors } from './errors/ValidateError'

export type ValidateOptions = {
  path?: string;
  throwOnError?: boolean;
}

// todo add contains https://json-schema.org/understanding-json-schema/reference/array#contains
// todo add maxContains https://json-schema.org/understanding-json-schema/reference/array#mincontains-maxcontains
// todo add minContains https://json-schema.org/understanding-json-schema/reference/array#mincontains-maxcontains
export type SchemaAttributes = {
  // https://json-schema.org/understanding-json-schema/structuring#id
  $id?: string;
  // https://json-schema.org/understanding-json-schema/reference/schema#schema
  $schema?: string;
  // https://json-schema.org/understanding-json-schema/reference/object#additionalproperties
  additionalProperties?: false | Record<string, SchemaAttributes>;
  denied?: unknown[];
  // https://json-schema.org/understanding-json-schema/reference/enum#enumerated-values
  enum?: unknown[];
  // https://json-schema.org/understanding-json-schema/reference/numeric#range
  exclusiveMaximum?: number;
  // https://json-schema.org/understanding-json-schema/reference/numeric#range
  exclusiveMinimum?: number;
  // https://json-schema.org/understanding-json-schema/reference/string#format
  format?: SchemaFormat;
  // https://json-schema.org/understanding-json-schema/reference/array#items
  items?: SchemaItems;
  // https://json-schema.org/understanding-json-schema/reference/string#length
  length?: number;
  // https://json-schema.org/understanding-json-schema/reference/numeric#range
  maximum?: number;
  // https://json-schema.org/understanding-json-schema/reference/array#length
  maxItems?: number;
  // https://json-schema.org/understanding-json-schema/reference/string#length
  maxLength?: number;
  maxWords?: number;
  // https://json-schema.org/understanding-json-schema/reference/numeric#range
  minimum?: number;
  // https://json-schema.org/understanding-json-schema/reference/array#length
  minItems?: number;
  // https://json-schema.org/understanding-json-schema/reference/string#length
  minLength?: number;
  minWords?: number;
  // https://json-schema.org/understanding-json-schema/reference/numeric#multiples
  multipleOf?: number;
  // https://json-schema.org/understanding-json-schema/reference/string#regexp
  pattern?: string;
  // https://json-schema.org/understanding-json-schema/reference/object#patternProperties
  patternProperties?: Record<string, SchemaAttributes>;
  // https://json-schema.org/understanding-json-schema/reference/object#properties
  properties?: Record<string, SchemaAttributes>;
  // https://json-schema.org/understanding-json-schema/reference/object#required
  required?: string[];
  // https://json-schema.org/understanding-json-schema/reference/annotations
  title?: string;
  // https://json-schema.org/understanding-json-schema/reference/type
  type?: SchemaType;
  // https://json-schema.org/understanding-json-schema/reference/array#uniqueItems
  uniqueItems?: boolean;
}

/**
 * Extend an existing schema with new attributes.
 */
export type Extend<A extends SchemaAttributes, NA extends SchemaAttributes> =
  Omit<A, keyof NA>
  & Pick<NA, keyof NA>

/**
 * Removes some properties.
 */
export type OmitProperties<A extends SchemaAttributes, AK extends keyof A['properties']> =
  Omit<A, 'properties'>
  & { properties: Omit<A['properties'], AK> }

/**
 * Makes all properties partial.
 */
export type PartialProperties<A extends SchemaAttributes> = Omit<A, 'required'>

/**
 * Select some properties.
 */
export type PickProperties<A extends SchemaAttributes, AK extends keyof A['properties']> =
  Omit<A, 'properties'>
  & { properties: Pick<A['properties'], AK> }

/**
 * Makes all properties mandatory.
 */
export type RequiredProperties<A extends SchemaAttributes> =
  Omit<A, 'required'>
  & { required: (keyof A['properties'] & string)[] }

export const JSON_SCHEMA_DRAFT_2020_12 = 'https://json-schema.org/draft/2020-12/schema'

class JSONSchema<A extends SchemaAttributes> {
  protected readonly attributes: A

  constructor (attributes: A) {
    this.attributes = {
      $schema: JSON_SCHEMA_DRAFT_2020_12,
      ...attributes
    }
    checkSchemaAttributes(attributes)
  }

  /**
   * Returns a clone of the schema.
   */
  clone (): JSONSchema<A> {
    return new JSONSchema(this.toJSON())
  }

  /**
   * Returns a new schema based on current schema.
   * @param attributes
   */
  extend<NA extends SchemaAttributes> (attributes: NA): JSONSchema<Extend<A, NA>> {
    const newAttributes = this.clone().toJSON() as unknown as Extend<A, NA>

    if (attributes) {
      for (const key in attributes) {
        newAttributes[key] = attributes[key as keyof NA] as any
      }
    }
    return new JSONSchema(newAttributes)
  }

  // todo add extendProperties(properties)

  /**
   * Returns additional properties.
   */
  getAdditionalProperties (): A['additionalProperties'] {
    return this.attributes.additionalProperties
  }

  /**
   * Returns enum values.
   */
  getEnum (): A['enum'] {
    return this.attributes.enum
  }

  /**
   * Returns validation errors instead of throwing them.
   * @param value
   * @param options
   */
  getErrors (value: unknown, options?: ValidateOptions): ValidationErrors<(keyof A['properties'] & string) | string> | null {
    return this.validate(value, {
      path: '',
      ...options,
      throwOnError: false
    })
  }

  /**
   * Returns denied values.
   */
  getDenied (): A['denied'] {
    return this.attributes.denied
  }

  /**
   * Returns the exclusive maximum value.
   */
  getExclusiveMaximum (): A['exclusiveMaximum'] {
    return this.attributes.exclusiveMaximum
  }

  /**
   * Returns the exclusive minimum value.
   */
  getExclusiveMinimum (): A['exclusiveMinimum'] {
    return this.attributes.exclusiveMinimum
  }

  /**
   * Returns format.
   */
  getFormat (): A['format'] {
    return this.attributes.format
  }

  /**
   * Returns items.
   */
  getItems (): A['items'] {
    return this.attributes.items
  }

  /**
   * Returns length.
   */
  getLength (): A['length'] {
    return this.attributes.length
  }

  /**
   * Returns maximum value.
   */
  getMaximum (): A['maximum'] {
    return this.attributes.maximum
  }

  /**
   * Returns max length.
   */
  getMaxLength (): A['maxLength'] {
    return this.attributes.maxLength
  }

  /**
   * Returns max words.
   */
  getMaxWords (): A['maxWords'] {
    return this.attributes.maxWords
  }

  /**
   * Returns minimum value.
   */
  getMinimum (): A['minimum'] {
    return this.attributes.minimum
  }

  /**
   * Returns min length.
   */
  getMinLength (): A['minLength'] {
    return this.attributes.minLength
  }

  /**
   * Returns min words.
   */
  getMinWords (): A['minWords'] {
    return this.attributes.minWords
  }

  /**
   * Returns pattern (regular expression).
   */
  getPattern (): A['pattern'] {
    return this.attributes.pattern
  }

  /**
   * Returns properties.
   */
  getProperties (): A['properties'] {
    return this.attributes.properties
  }

  /**
   * Returns a property by name.
   * @param name
   */
  getProperty<N extends keyof A['properties']> (name: N): undefined | A['properties'][N] {
    if (this.attributes.properties?.[name as string] != null) {
      return this.attributes.properties?.[name as string] as any
    }
  }

  /**
   * Returns title.
   */
  getTitle (): A['title'] {
    return this.attributes.title
  }

  /**
   * Returns type.
   */
  getType (): A['type'] {
    return this.attributes.type
  }

  /**
   * Checks if a property is required.
   */
  isPropertyRequired (name: keyof A['properties'] & string): boolean {
    return this.attributes.required instanceof Array && this.attributes.required.includes(name)
  }

  /**
   * Checks if an object is valid without throwing error.
   * @param value
   * @param options
   */
  isValid (value: unknown, options?: ValidateOptions): boolean {
    try {
      this.validate(value, { ...options, throwOnError: true })
      return true
    } catch {
      return false
    }
  }

  /**
   * Returns a copy of the schema without some properties.
   * @param keys
   */
  omitProperties<K extends keyof A['properties']> (keys: K[]):
  // fixme fix return type
  // @ts-ignore
    JSONSchema<OmitProperties<A, K>> {
    const attributes = this.toJSON()

    if (attributes.properties) {
      for (const key of keys) {
        if (key in attributes.properties) {
          delete attributes.properties[key as string]
        }
      }
    }
    return new JSONSchema(attributes) as any
  }

  /**
   Returns a copy of the schema with all properties optional.
   */
  partial (): JSONSchema<PartialProperties<A>> {
    const attributes = this.toJSON()

    if (attributes.required != null) {
      delete attributes.required
    }
    return new JSONSchema(attributes)
  }

  /**
   * Returns a copy of the schema containing only selected properties.
   * @param keys
   */
  pickProperties<K extends keyof A['properties']> (keys: K[]):
  // fixme fix return type
  // @ts-ignore
    JSONSchema<PickProperties<A, K>> {
    const attributes = this.toJSON()

    if (attributes.properties) {
      for (const key in attributes.properties) {
        if (!keys.includes(key as K)) {
          delete attributes.properties[key]
        }
      }
    }
    return new JSONSchema(attributes) as any
  }

  /**
   * Returns a copy of the value without unknown properties.
   * @param value
   */
  removeUnknownProperties (value: unknown): any {
    if (value == null) {
      return value
    }

    if (value instanceof Array) {
      const copy = deepExtend([], value) as unknown[]
      const items = this.attributes.items

      if (items != null) {
        copy.forEach((item, index) => {
          copy[index] = new JSONSchema(items).removeUnknownProperties(item)
        })
      }
      return copy
    }

    if (typeof value === 'object') {
      const copy = deepExtend({}, value)
      Object.keys(copy).forEach((key) => {
        try {
          const prop = this.resolveProperty(key)

          if (prop != null) {
            copy[key] = new JSONSchema(prop).removeUnknownProperties(copy[key])
          }
        } catch (error) {
          if (error instanceof InvalidPathError) {
            delete copy[key]
          }
        }
      })
      return copy
    }
    return value
  }

  /**
   * Returns a copy of the schema with all properties required.
   */
  required (): JSONSchema<RequiredProperties<A>> {
    const attributes = this.toJSON()

    if (attributes.properties) {
      attributes.required = Object.keys(attributes.properties)
    }
    return new JSONSchema(attributes) as any
  }

  /**
   * Builds an object from a string (ex: [colors][0][code]).
   * @param path (ex: address[country][code])
   * @param syntaxChecked
   */
  resolveProperty<PA extends SchemaAttributes> (path: keyof A['properties'] | string, syntaxChecked = false): PA {
    const currentPath = path.toString()
    // Removes array indexes from path because we want to resolve field and not data.
    const realPath = currentPath.replace(/^\[\d+]$/g, '')

    const bracketIndex = realPath.indexOf('[')
    const bracketEnd = realPath.indexOf(']')
    const dotIndex = realPath.indexOf('.')

    // Do not check syntax errors if already done.
    if (!syntaxChecked) {
      // Check for extra space.
      if (realPath.indexOf(' ') !== -1) {
        throw new SyntaxError(`path "${currentPath}" is not valid`)
      }
      // Check if key is not defined (ex: []).
      if (realPath.indexOf('[]') !== -1) {
        throw new SyntaxError(`missing array index or object attribute in "${currentPath}"`)
      }
      // Check for missing object attribute.
      if (dotIndex + 1 === realPath.length) {
        throw new SyntaxError(`missing object attribute in "${currentPath}"`)
      }

      const closingBrackets = realPath.split(']').length
      const openingBrackets = realPath.split('[').length

      // Check for missing opening bracket.
      if (openingBrackets < closingBrackets) {
        throw new SyntaxError(`missing opening bracket "[" in "${currentPath}"`)
      }
      // Check for missing closing bracket.
      if (closingBrackets < openingBrackets) {
        throw new SyntaxError(`missing closing bracket "]" in "${currentPath}"`)
      }
    }

    let propName = realPath
    let subPath

    // Resolve dot path (ex: obj.attr).
    if (dotIndex !== -1 && (bracketIndex === -1 || dotIndex < bracketIndex)) {
      // ex: "object.field"
      // => propName: "object", subPath: "field"
      propName = realPath.substring(0, dotIndex)
      subPath = realPath.substring(dotIndex + 1)
    }

    // Resolve brackets path (ex: obj[attr]).
    if (bracketIndex !== -1 && (dotIndex === -1 || bracketIndex < dotIndex)) {
      // ex: "[a].field"
      // => propName: "[a]", subPath: "field"
      if (bracketIndex === 0) {
        // Removes surrounding brackets.
        // => propName: "a"
        propName = realPath.substring(bracketIndex + 1, bracketEnd)
        // Resolve "field" instead of ".field" if array is followed by a dot.
        // => subPath: field
        subPath = realPath.substring(bracketEnd + (
          realPath.substring(bracketEnd + 1, bracketEnd + 2) === '.' ? 2 : 1
        ))
      } else {
        // ex: "array[a].field"
        // => propName: "array", subPath: "[a].field"
        propName = realPath.substring(0, bracketIndex)
        subPath = realPath.substring(bracketIndex)
      }
    }

    const properties = this.attributes.properties
    const items = this.attributes.items

    if (typeof subPath === 'string' && subPath.length > 0) {
      // Resolve nested property
      if (properties && properties[propName] != null) {
        return new JSONSchema(properties[propName]).resolveProperty(subPath, true)
      }
      // Resolve nested item
      if (items) {
        return new JSONSchema(items).resolveProperty(subPath, true)
      }
    } else if (propName === '') {
      // Return schema attributes
      return this.attributes as unknown as PA
    } else if (properties && properties[propName] != null) {
      // Return property
      return properties[propName] as unknown as PA
    } else if (items && items.properties && items.properties[propName] != null) {
      // Return item property
      return items.properties[propName] as unknown as PA
    }
    throw new InvalidPathError(currentPath)
  }

  /**
   * Returns schema as JSON object.
   */
  toJSON (): A {
    return deepExtend({}, this.attributes)
  }

  /**
   * Validates a value against the schema.
   * @param value
   * @param options
   */
  validate (value: unknown, options?: ValidateOptions): ValidationErrors<(keyof A['properties'] & string) | string> | null {
    const opts: ValidateOptions = {
      throwOnError: true,
      ...options
    }

    const throwOnError = opts.throwOnError ?? false
    const path = opts.path ?? ''
    const attrs = this.attributes
    let errors: ValidationErrors

    errors = {
      ...validate(() => {
        if (attrs.required != null) {
          checkRequired(attrs.required, value, path)
        }
      }, throwOnError),

      ...validate(() => {
        if (attrs.type != null) {
          checkType(attrs.type, value, path)
        }
      }, throwOnError)
    }

    // Ignore next checks if value is null or undefined
    if (value == null) {
      return errors
    }

    // Special values
    errors = {
      ...errors,

      ...validate(() => {
        if (attrs.enum != null) {
          checkEnum(attrs.enum, value, path)
        }
      }, throwOnError),

      ...validate(() => {
        if (attrs.denied != null) {
          checkDenied(attrs.denied, value, path)
        }
      }, throwOnError)
    }

    // Array
    if (value instanceof Array) {
      errors = {
        ...errors,

        ...validate(() => {
          if (attrs.items != null) {
            checkItems(attrs.items, value, path, throwOnError)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.minItems != null) {
            checkMinItems(attrs.minItems, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.maxItems != null) {
            checkMaxItems(attrs.maxItems, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.uniqueItems === true) {
            checkUniqueItems(value, path)
          }
        }, throwOnError)
      }
    }

    // Number
    if (typeof value === 'number') {
      errors = {
        ...errors,

        ...validate(() => {
          if (attrs.exclusiveMinimum != null) {
            checkExclusiveMinimum(attrs.exclusiveMinimum, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.exclusiveMaximum != null) {
            checkExclusiveMaximum(attrs.exclusiveMaximum, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.minimum != null) {
            checkMinimum(attrs.minimum, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.maximum != null) {
            checkMaximum(attrs.maximum, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.multipleOf != null) {
            checkMultipleOf(attrs.multipleOf, value, path)
          }
        }, throwOnError)
      }
    }

    // String
    if (typeof value === 'string') {
      errors = {
        ...errors,

        ...validate(() => {
          if (attrs.format != null) {
            checkFormat(attrs.format, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.minWords != null) {
            checkMinWords(attrs.minWords, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.maxWords != null) {
            checkMaxWords(attrs.maxWords, value, path)
          }
        }, throwOnError),

        ...validate(() => {
          if (attrs.pattern != null) {
            checkPattern(attrs.pattern, value, path)
          }
        }, throwOnError)
      }
    }

    // Length
    errors = {
      ...errors,

      ...validate(() => {
        if (attrs.length != null) {
          checkLength(attrs.length, value, path)
        }
      }, throwOnError),

      ...validate(() => {
        if (attrs.minLength != null) {
          checkMinLength(attrs.minLength, value, path)
        }
      }, throwOnError),

      ...validate(() => {
        if (attrs.maxLength != null) {
          checkMaxLength(attrs.maxLength, value, path)
        }
      }, throwOnError)
    }

    // Object
    if (typeof value === 'object') {
      errors = {
        ...errors,

        ...validate(() => {
          checkProperties(attrs.properties, value as any, path, throwOnError)
        }, throwOnError),

        ...validate(() => {
          checkPatternProperties(attrs.patternProperties, value as any, path, throwOnError)
        }, throwOnError),

        ...validate(() => {
          checkAdditionalProperties(attrs.additionalProperties, attrs.properties, value as any, path, throwOnError)
        }, throwOnError)
      }
    }

    const hasError = Object.keys(errors).length > 0
    return hasError ? errors : null
  }
}

export default JSONSchema
