/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import deepExtend from '@jalik/deep-extend'
import {
  checkDenied,
  checkEnum,
  checkExclusiveMaximum,
  checkExclusiveMinimum,
  checkFieldProperties,
  checkFormat,
  checkLength,
  checkMax,
  checkMaxItems,
  checkMaxLength,
  checkMaxWords,
  checkMinimum,
  checkMinItems,
  checkMinLength,
  checkMinWords,
  checkMultipleOf,
  checkPattern,
  checkRequired,
  checkType,
  checkTypeArray,
  checkUniqueItems,
  FieldFormat,
  FieldItems,
  FieldMinMax,
  FieldPattern,
  FieldType
} from './checks'
import FieldError from './errors/FieldError'
import FieldTypeError from './errors/FieldTypeError'
import ValidationError, { FieldErrors } from './errors/ValidationError'
import Schema from './Schema'
import { clean, computeValue, joinPath, parse } from './utils'

type ValidateOptions = {
  clean?: boolean;
  context?: Record<string, unknown>;
  path?: string;
  rootOnly?: boolean;
}

// todo add contains https://json-schema.org/understanding-json-schema/reference/array#contains
// todo add maxContains https://json-schema.org/understanding-json-schema/reference/array#mincontains-maxcontains
// todo add minContains https://json-schema.org/understanding-json-schema/reference/array#mincontains-maxcontains
export type FieldProperties = {
  denied?: any[];
  // https://json-schema.org/understanding-json-schema/reference/enum#enumerated-values
  enum?: any[];
  // https://json-schema.org/understanding-json-schema/reference/numeric#range
  exclusiveMaximum?: FieldMinMax;
  exclusiveMinimum?: FieldMinMax;
  // https://json-schema.org/understanding-json-schema/reference/string#format
  format?: FieldFormat;
  // https://json-schema.org/understanding-json-schema/reference/array#items
  items?: FieldItems;
  // https://json-schema.org/understanding-json-schema/reference/string#length
  length?: number;
  // https://json-schema.org/understanding-json-schema/reference/numeric#range
  maximum?: FieldMinMax;
  // https://json-schema.org/understanding-json-schema/reference/array#length
  maxItems?: number;
  // https://json-schema.org/understanding-json-schema/reference/string#length
  maxLength?: number;
  maxWords?: number;
  // https://json-schema.org/understanding-json-schema/reference/numeric#range
  minimum?: FieldMinMax;
  // https://json-schema.org/understanding-json-schema/reference/array#length
  minItems?: number;
  // https://json-schema.org/understanding-json-schema/reference/string#length
  minLength?: number;
  minWords?: number;
  // https://json-schema.org/understanding-json-schema/reference/numeric#multiples
  multipleOf?: number;
  // https://json-schema.org/understanding-json-schema/reference/string#regexp
  pattern?: FieldPattern;
  required?: boolean;
  // https://json-schema.org/understanding-json-schema/reference/annotations
  title?: string;
  // https://json-schema.org/understanding-json-schema/reference/type
  type?: FieldType;
  // https://json-schema.org/understanding-json-schema/reference/array#uniqueItems
  uniqueItems?: boolean;
  check? (value: any, context?: Record<string, unknown>): boolean;
  clean? (value: any): any;
  prepare? (value: any, context?: Record<string, unknown>): any;
  parse? (value: any): any;
}

class SchemaField<P extends FieldProperties> {
  public name: string
  public props: P

  constructor (name: string, properties: P) {
    // Default properties
    const props: P = {
      ...properties,
      title: properties.title ?? name
    }

    checkFieldProperties(name, props)

    this.name = name
    this.props = props
  }

  /**
   * Cleans a value.
   * todo move to util functions
   * @param value
   * @param options
   */
  clean (value: any, options = {}): string | undefined {
    if (value == null) {
      return value
    }

    let newValue
    const props = this.props

    if (typeof value === 'string') {
      if (typeof props.clean === 'function') {
        newValue = props.clean.call(this, value)
      } else {
        newValue = value.trim()
      }
    } else if (typeof value === 'object') {
      // Cleans all values in the array.
      if (value instanceof Array) {
        newValue = value.map((key: number) => this.clean(value[key]))
      } else if (props.type instanceof Schema) {
        newValue = clean(value, props.type, options)
      }
    } else {
      if (typeof props.clean === 'function') {
        newValue = props.clean.call(this, value)
      }
    }

    // Return null instead of empty string.
    if (typeof newValue === 'string' && newValue.length === 0) {
      newValue = null
    }
    return newValue
  }

  /**
   * Returns field's enum values.
   */
  getAllowed (): P['enum'] {
    return this.props.enum
  }

  /**
   * Returns field's denied values.
   */
  getDenied (): P['denied'] {
    return this.props.denied
  }

  /**
   * Returns the field's exclusive maximum value.
   */
  getExclusiveMaximum (): P['exclusiveMaximum'] {
    return this.props.exclusiveMaximum
  }

  /**
   * Returns the field's exclusive minimum value.
   */
  getExclusiveMinimum (): P['exclusiveMinimum'] {
    return this.props.exclusiveMinimum
  }

  /**
   * Returns field's format.
   */
  getFormat (): P['format'] {
    return this.props.format
  }

  /**
   * Returns field's items.
   */
  getItems (): P['items'] {
    return this.props.items
  }

  /**
   * Returns field's length.
   */
  getLength (): P['length'] {
    return this.props.length
  }

  /**
   * Returns field's maximal value.
   */
  getMaximum (): P['maximum'] {
    return this.props.maximum
  }

  /**
   * Returns field's maximal length.
   */
  getMaxLength (): P['maxLength'] {
    return this.props.maxLength
  }

  /**
   * Returns field's maximal words.
   */
  getMaxWords (): P['maxWords'] {
    return this.props.maxWords
  }

  /**
   * Returns field's minimal value.
   */
  getMinimum (): P['minimum'] {
    return this.props.minimum
  }

  /**
   * Returns field's minimal length.
   */
  getMinLength (): P['minLength'] {
    return this.props.minLength
  }

  /**
   * Returns field's minimal words.
   */
  getMinWords (): P['minWords'] {
    return this.props.minWords
  }

  /**
   * Returns field name.
   */
  getName (): string {
    return this.name
  }

  /**
   * Returns field's pattern (regular expression).
   */
  getPattern (): P['pattern'] {
    return this.props.pattern
  }

  /**
   * Returns field's title.
   */
  getTitle (): P['title'] {
    return this.props.title
  }

  /**
   * Returns field's type.
   */
  getType (): P['type'] {
    return this.props.type
  }

  /**
   * Checks if field is required
   */
  isRequired (): P['required'] {
    return this.props.required ?? false
  }

  /**
   * Checks if a value is valid.
   * @param value
   * @param options
   */
  isValid (value: any, options?: ValidateOptions): boolean {
    try {
      this.validate(value, options)
      return true
    } catch {
      return false
    }
  }

  /**
   * Parses a value.
   * todo move to util functions
   * @param value
   */
  parse<E> (value: any): E | null {
    if (value == null) {
      return null
    }

    let val
    const props = this.props

    if (typeof value === 'string') {
      if (typeof props.parse === 'function') {
        val = props.parse.call(this, value)
      } else {
        switch (props.type) {
          case 'boolean':
            val = /^true$/i.test(value)
            break
          case 'integer':
            val = parseInt(value, 10)
            break
          case 'number':
            val = Number(value)
            break
        }
      }
    } else if (value instanceof Array) {
      // Parses all values in the array.
      val = value.map((key: number) => this.parse(value[key]))
    } else if (props.type instanceof Schema) {
      // todo add test for this line
      val = parse(value, props.type)
    }
    return val
  }

  /**
   * Returns field as JSON object.
   */
  toJSON (): P {
    return deepExtend({}, this.props)
  }

  /**
   * Validates a value.
   * @param value
   * @param options
   */
  validate (value: any, options?: ValidateOptions) {
    let newVal

    // Clone value.
    if (typeof value === 'object' && value !== null) {
      if (value instanceof Array) {
        newVal = deepExtend([], value)
      } else if (value instanceof Date) {
        newVal = new Date(value.getTime())
      } else {
        newVal = deepExtend({}, value)
      }
    } else {
      newVal = value
    }

    const opts = {
      clean: false,
      rootOnly: false,
      ...options,
      // Sets validation context.
      context: {
        ...options?.context,
        [this.name]: newVal
      },
      // Sets validation path.
      path: options?.path ? joinPath(options?.path, this.name) : this.name
    }

    const {
      context,
      path
    } = opts
    const props = this.props
    const label = props.title ?? this.name
    const isRequired: boolean = props.required ?? false
    const isArray: boolean = props.type === 'array' || props.type instanceof Array

    // Prepare value
    if (typeof props.prepare === 'function') {
      newVal = props.prepare.call(this, newVal, context)
    }

    // Clean value
    if (opts.clean) {
      newVal = this.clean(newVal)
    }

    // Use default value
    if (isRequired && (typeof newVal === 'undefined' || newVal === null)) {
      // Use empty array for required non-null array field
      if (isArray && (newVal === null || typeof newVal === 'undefined')) {
        newVal = []
      }
    }

    // Check if value is missing
    checkRequired(isRequired, newVal, label, path)

    // Ignore empty value
    if (typeof newVal === 'undefined' || newVal === null) {
      return newVal
    }

    // Check type
    if (props.type != null) {
      // Validate sub-schema.
      if (props.type instanceof Schema) {
        if (!opts.rootOnly) {
          props.type.validate(newVal, {
            ...opts,
            context,
            path
          })
        }
      } else if (typeof props.type === 'function') {
        // todo remove in v5
        // Check if value is an instance of the function.
        if (!(newVal instanceof props.type)) {
          throw new FieldTypeError(label,
            // @ts-ignore
            props.type.name,
            path)
        }
      } else if (props.type instanceof Array) {
        // Check different types (ex: ['string', 'number'])
        checkTypeArray(props.type, newVal, label, path)
        // todo check in array if there is a type that is instance of schema
      } else {
        checkType(props.type, newVal, label, path)
      }
    }

    // Check items
    if (typeof props.items !== 'undefined') {
      if (isRequired && !(newVal instanceof Array)) {
        throw new FieldTypeError(label, 'array', path)
      }
      const errors: FieldErrors = {}

      // Validate all values of the array.
      for (let i = 0; i < newVal.length; i += 1) {
        const itemPath = `${path}[${i}]`
        if (props.items.type != null) {
          try {
            checkType(props.items.type, newVal[i], label, itemPath)
          } catch (error) {
            if (error instanceof FieldError) {
              errors[error.path] = error
            } else if (error instanceof ValidationError) {
              Object.entries(error.errors).forEach(([fieldPath, fieldError]) => {
                errors[fieldPath] = fieldError
              })
            } else {
              throw error
            }
          }
        }
      }
      if (Object.keys(errors).length > 0) {
        throw new ValidationError(errors)
      }
    }

    // Check uniqueItems
    if (props.uniqueItems != null && newVal instanceof Array && computeValue(props.uniqueItems, context)) {
      checkUniqueItems(newVal, label, path)
    }
    // Check enum
    if (props.enum != null) {
      checkEnum(props.enum, newVal, label, path)
    }
    // Check denied
    if (props.denied != null) {
      checkDenied(props.denied, newVal, label, path)
    }
    // Check exclusiveMaximum
    if (props.exclusiveMaximum != null) {
      checkExclusiveMaximum(props.exclusiveMaximum, newVal, label, path)
    }
    // Check exclusiveMinimum
    if (props.exclusiveMinimum != null) {
      checkExclusiveMinimum(props.exclusiveMinimum, newVal, label, path)
    }
    // Check format
    if (props.format != null) {
      checkFormat(props.format, newVal, label, path)
    }
    // Check length
    if (props.length != null) {
      checkLength(props.length, newVal, label, path)
    }
    // Check maxItems
    if (props.maxItems != null && newVal != null) {
      checkMaxItems(props.maxItems, newVal, label, path)
    }
    // Check minItems
    if (props.minItems != null && newVal != null) {
      checkMinItems(props.minItems, newVal, label, path)
    }
    // Check maxLength
    if (props.maxLength != null) {
      checkMaxLength(props.maxLength, newVal, label, path)
    }
    // Check minLength
    if (props.minLength != null) {
      checkMinLength(props.minLength, newVal, label, path)
    }
    // Check maxWords
    if (props.maxWords != null) {
      checkMaxWords(props.maxWords, newVal, label, path)
    }
    // Check minWords
    if (props.minWords != null) {
      checkMinWords(props.minWords, newVal, label, path)
    }
    // Check maximum
    if (props.maximum != null) {
      checkMax(props.maximum, newVal, label, path)
    }
    // Check minimum
    if (props.minimum != null) {
      checkMinimum(props.minimum, newVal, label, path)
    }
    // Check multipleOf
    if (props.multipleOf != null) {
      checkMultipleOf(props.multipleOf, newVal, label, path)
    }
    // Test pattern (regexp)
    if (props.pattern != null) {
      checkPattern(props.pattern, newVal, label, path)
    }
    // Execute custom checks
    if (props.check != null && !props.check.call(this, newVal, context)) {
      throw new FieldError(label, path)
    }
    return newVal
  }
}

export default SchemaField
