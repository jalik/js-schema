/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import deepExtend from '@jalik/deep-extend'
import {
  checkAllowed,
  checkDenied,
  checkFieldProperties,
  checkFormat,
  checkLength,
  checkMax,
  checkMaxLength,
  checkMaxWords,
  checkMin,
  checkMinLength,
  checkMinWords,
  checkPattern,
  checkRequired,
  checkType,
  checkTypeArray,
  checkUniqueItems,
  Computable,
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

interface ValidateOptions {
  clean?: boolean;
  context?: Record<string, unknown>;
  path?: string;
  rootOnly?: boolean;
}

export interface FieldProperties<T> {
  allowed?: Computable<any[]>;

  check? (value: any, context?: Record<string, unknown>): boolean;

  clean? (value: any): any;

  denied?: Computable<any[]>;
  format?: Computable<FieldFormat>;
  items?: FieldItems<T>;
  label?: Computable<string>;
  length?: Computable<number>;
  max?: Computable<FieldMinMax>;
  maxLength?: Computable<number>;
  maxWords?: Computable<number>;
  min?: Computable<FieldMinMax>;
  minLength?: Computable<number>;
  minWords?: Computable<number>;

  parse? (value: any): any;

  pattern?: Computable<FieldPattern>;

  prepare? (value: any, context?: Record<string, unknown>): any;

  required?: Computable<boolean>;
  type?: Computable<FieldType<T>>;
  uniqueItems?: Computable<boolean>
}

class SchemaField<T> {
  public name: string

  public properties: FieldProperties<T>

  constructor (name: string, properties: FieldProperties<T>) {
    // Default properties
    const props: FieldProperties<T> = {
      label: name,
      ...properties
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
  clean (value?: any | any[] | Schema, options = {}): string | undefined {
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
   * @param context
   */
  getAllowed (context?: Record<string, unknown>): any[] {
    return computeValue<any[]>(this.properties.allowed, context)
  }

  /**
   * Returns field's denied values.
   * @param context
   */
  getDenied (context?: Record<string, unknown>): any[] {
    return computeValue<any[]>(this.properties.denied, context)
  }

  /**
   * Returns field's format.
   * @param context
   */
  getFormat (context?: Record<string, unknown>): FieldFormat {
    return computeValue<FieldFormat>(this.properties.format, context)
  }

  /**
   * Returns field's items.
   * @param context
   */
  getItems (context?: Record<string, unknown>): FieldItems<T> {
    return computeValue<FieldItems<T>>(this.properties.items, context)
  }

  /**
   * Returns field's label.
   * @param context
   */
  getLabel (context?: Record<string, unknown>): string {
    return computeValue<string>(this.properties.label, context)
  }

  /**
   * Returns field's length.
   * @param context
   */
  getLength (context?: Record<string, unknown>): number {
    return computeValue<number>(this.properties.length, context)
  }

  /**
   * Returns field's maximal value.
   * @param context
   */
  getMax (context?: Record<string, unknown>): FieldMinMax {
    return computeValue<FieldMinMax>(this.properties.max, context)
  }

  /**
   * Returns field's maximal length.
   * @param context
   */
  getMaxLength (context?: Record<string, unknown>): number {
    return computeValue<number>(this.properties.maxLength, context)
  }

  /**
   * Returns field's maximal words.
   * @param context
   */
  getMaxWords (context?: Record<string, unknown>): number {
    return computeValue<number>(this.properties.maxWords, context)
  }

  /**
   * Returns field's minimal value.
   * @param context
   */
  getMin (context?: Record<string, unknown>): FieldMinMax {
    return computeValue<FieldMinMax>(this.properties.min, context)
  }

  /**
   * Returns field's minimal length.
   * @param context
   */
  getMinLength (context?: Record<string, unknown>): number {
    return computeValue<number>(this.properties.minLength, context)
  }

  /**
   * Returns field's minimal words.
   * @param context
   */
  getMinWords (context?: Record<string, unknown>): number {
    return computeValue<number>(this.properties.minWords, context)
  }

  /**
   * Returns field name.
   */
  getName (): string {
    return computeValue<string>(this.properties.label) || this.name
  }

  /**
   * Returns field's pattern (regular expression).
   * @param context
   */
  getPattern (context?: Record<string, unknown>): FieldPattern {
    return computeValue<FieldPattern>(this.properties.pattern, context)
  }

  /**
   * Returns a copy of the field's properties.
   */
  getProperties (): FieldProperties<T> {
    return deepExtend({}, this.properties)
  }

  /**
   * Returns field's type.
   * @param context
   */
  getType (context?: Record<string, unknown>): FieldType<T> {
    return computeValue<FieldType<T>>(this.properties.type, context)
  }

  /**
   * Checks if field is required
   * @param context
   */
  isRequired (context?: Record<string, unknown>): boolean {
    return computeValue<boolean>(this.properties.required, context) || false
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
    } catch (error) {
      return false
    }
  }

  /**
   * Parses a value.
   * @param value
   */
  parse<E> (value: any): E {
    if (value == null) {
      return value
    }

    let val
    const props: FieldProperties<T> = this.properties

    if (typeof value === 'object') {
      // Parses all values in the array.
      if (value instanceof Array) {
        val = value.map((key: number) => this.parse(value[key]))
      } else if (props.type instanceof Schema && typeof props.type?.parse === 'function') {
        // todo test this line
        val = props.type.parse<T>(value)
      }
    } else if (typeof value === 'string') {
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
    const props: FieldProperties<T> = this.properties
    const label: string = computeValue<string>(props.label, context)
    const isRequired: boolean = computeValue<boolean>(props.required, context) || false
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
        // Check if value is an instance of the function.
        if (!(newVal instanceof props.type)) {
          throw new FieldTypeError(label, props.type.name, path)
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
        const field: SchemaField<unknown> = new SchemaField(`[${i}]`, props.items)
        try {
          field.validate(newVal[i], opts)
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
      checkAllowed(computeValue<any[]>(props.allowed, context), newVal, label, path)
    }

    // Check denied values
    if (props.denied != null) {
      checkDenied(computeValue<any[]>(props.denied, context), newVal, label, path)
    }

    // Check string format
    if (props.format != null) {
      checkFormat(computeValue<FieldFormat>(props.format, context), newVal, label, path)
    }

    // Check length if value has the length attribute
    if (props.length != null) {
      checkLength(computeValue<number>(props.length, context), newVal, label, path)
    }

    // Check maximal length
    if (props.maxLength != null) {
      checkMaxLength(computeValue<number>(props.maxLength, context), newVal, label, path)
    }

    // Check minimal length
    if (props.minLength != null) {
      checkMinLength(computeValue<number>(props.minLength, context), newVal, label, path)
    }

    // Check maximal words
    if (props.maxWords != null) {
      checkMaxWords(computeValue<number>(props.maxWords, context), newVal, label, path)
    }

    // Check minimal words
    if (props.minWords != null) {
      checkMinWords(computeValue<number>(props.minWords, context), newVal, label, path)
    }

    // Check maximal value
    if (props.max != null) {
      checkMax(computeValue<FieldMinMax>(props.max, context), newVal, label, path)
    }

    // Check minimal value
    if (props.min != null) {
      checkMin(computeValue<FieldMinMax>(props.min, context), newVal, label, path)
    }

    // Test regular expression
    if (props.pattern != null) {
      checkPattern(computeValue<FieldPattern>(props.pattern, context), newVal, label, path)
    }

    // Execute custom checks
    if (props.check != null && !props.check.call(this, newVal, context)) {
      throw new FieldError(label, path)
    }
    return newVal
  }
}

export default SchemaField
