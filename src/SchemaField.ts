/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import deepExtend from '@jalik/deep-extend'
import {
  checkAllowed,
  checkDenied,
  checkExclusiveMaximum,
  checkExclusiveMinimum,
  checkFieldProperties,
  checkFormat,
  checkLength,
  checkMax,
  checkMaxItems,
  checkMaxLength,
  checkMaxWords,
  checkMin,
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
import { computeValue, joinPath } from './utils'

type ValidateOptions = {
  clean?: boolean;
  context?: Record<string, unknown>;
  path?: string;
  rootOnly?: boolean;
}

export type FieldProperties = {
  allowed?: any[];
  check? (value: any, context?: Record<string, unknown>): boolean;
  clean? (value: any): any;
  denied?: any[];
  exclusiveMaximum?: FieldMinMax;
  exclusiveMinimum?: FieldMinMax;
  format?: FieldFormat;
  items?: FieldItems;
  label?: string;
  length?: number;
  max?: FieldMinMax;
  maxItems?: number;
  maxLength?: number;
  maxWords?: number;
  min?: FieldMinMax;
  minItems?: number;
  minLength?: number;
  minWords?: number;
  multipleOf?: number;
  parse? (value: any): any;
  pattern?: FieldPattern;
  prepare? (value: any, context?: Record<string, unknown>): any;
  required?: boolean;
  type?: FieldType;
  uniqueItems?: boolean;
}

class SchemaField<P extends FieldProperties> {
  public name: string
  public properties: P

  constructor (name: string, properties: P) {
    // Default properties
    const props: P = {
      ...properties,
      label: properties.label ?? name
    }

    checkFieldProperties(name, props)

    this.name = name
    this.properties = props
  }

  /**
   * Cleans a value.
   * @param value
   * @param options
   */
  clean (value?: any, options = {}): string | undefined {
    if (value == null) {
      return value
    }

    let newValue
    const props = this.properties

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
        newValue = props.type.clean(value, options)
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
   * Returns field's allowed values.
   */
  getAllowed (): P['allowed'] {
    return this.properties.allowed
  }

  /**
   * Returns field's denied values.
   */
  getDenied (): P['denied'] {
    return this.properties.denied
  }

  /**
   * Returns the field's exclusive maximum value.
   */
  getExclusiveMaximum (): P['exclusiveMaximum'] {
    return this.properties.exclusiveMaximum
  }

  /**
   * Returns the field's exclusive minimum value.
   */
  getExclusiveMinimum (): P['exclusiveMinimum'] {
    return this.properties.exclusiveMinimum
  }

  /**
   * Returns field's format.
   */
  getFormat (): P['format'] {
    return this.properties.format
  }

  /**
   * Returns field's items.
   */
  getItems (): P['items'] {
    return this.properties.items
  }

  /**
   * Returns field's label.
   */
  getLabel (): P['label'] {
    return this.properties.label
  }

  /**
   * Returns field's length.
   */
  getLength (): P['length'] {
    return this.properties.length
  }

  /**
   * Returns field's maximal value.
   */
  getMax (): P['max'] {
    return this.properties.max
  }

  /**
   * Returns field's maximal length.
   */
  getMaxLength (): P['maxLength'] {
    return this.properties.maxLength
  }

  /**
   * Returns field's maximal words.
   */
  getMaxWords (): P['maxWords'] {
    return this.properties.maxWords
  }

  /**
   * Returns field's minimal value.
   */
  getMin (): P['min'] {
    return this.properties.min
  }

  /**
   * Returns field's minimal length.
   */
  getMinLength (): P['minLength'] {
    return this.properties.minLength
  }

  /**
   * Returns field's minimal words.
   */
  getMinWords (): P['minWords'] {
    return this.properties.minWords
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
    return this.properties.pattern
  }

  /**
   * Returns a copy of the field's properties.
   */
  getProperties (): P {
    return deepExtend({}, this.properties)
  }

  /**
   * Returns field's type.
   */
  getType (): P['type'] {
    return this.properties.type
  }

  /**
   * Checks if field is required
   */
  isRequired (): P['required'] {
    return this.properties.required ?? false
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
   * @param value
   */
  parse<E> (value: any): E | null {
    if (value == null) {
      return null
    }

    let val
    const props = this.properties

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
    } else if (props.type instanceof Schema && typeof props.type?.parse === 'function') {
      // todo add test for this line
      val = props.type.parse(value)
    }
    return val
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
    const props = this.properties
    const label = props.label ?? this.name
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

    // Check that items are unique
    if (props.uniqueItems != null && newVal instanceof Array && computeValue(props.uniqueItems, context)) {
      checkUniqueItems(newVal, label, path)
    }
    // Check allowed values
    if (props.allowed != null) {
      checkAllowed(props.allowed, newVal, label, path)
    }
    // Check denied values
    if (props.denied != null) {
      checkDenied(props.denied, newVal, label, path)
    }
    // Check exclusive maximal value
    if (props.exclusiveMaximum != null) {
      checkExclusiveMaximum(props.exclusiveMaximum, newVal, label, path)
    }
    // Check exclusive minimal value
    if (props.exclusiveMinimum != null) {
      checkExclusiveMinimum(props.exclusiveMinimum, newVal, label, path)
    }
    // Check string format
    if (props.format != null) {
      checkFormat(props.format, newVal, label, path)
    }
    // Check length if value has the length attribute
    if (props.length != null) {
      checkLength(props.length, newVal, label, path)
    }
    // Check max items
    if (props.maxItems != null && newVal != null) {
      checkMaxItems(props.maxItems, newVal, label, path)
    }
    // Check min items
    if (props.minItems != null && newVal != null) {
      checkMinItems(props.minItems, newVal, label, path)
    }
    // Check maximal length
    if (props.maxLength != null) {
      checkMaxLength(props.maxLength, newVal, label, path)
    }
    // Check minimal length
    if (props.minLength != null) {
      checkMinLength(props.minLength, newVal, label, path)
    }
    // Check maximal words
    if (props.maxWords != null) {
      checkMaxWords(props.maxWords, newVal, label, path)
    }
    // Check minimal words
    if (props.minWords != null) {
      checkMinWords(props.minWords, newVal, label, path)
    }
    // Check maximal value
    if (props.max != null) {
      checkMax(props.max, newVal, label, path)
    }
    // Check minimal value
    if (props.min != null) {
      checkMin(props.min, newVal, label, path)
    }
    // Check if value is a multiple of a number.
    if (props.multipleOf != null) {
      checkMultipleOf(props.multipleOf, newVal, label, path)
    }
    // Test regular expression
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
