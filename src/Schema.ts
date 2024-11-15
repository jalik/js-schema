/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import deepExtend from '@jalik/deep-extend'
import FieldError from './errors/FieldError'
import FieldUnknownError from './errors/FieldUnknownError'
import ValidationError, { FieldErrors } from './errors/ValidationError'
import SchemaField, { FieldProperties } from './SchemaField'
import FieldResolutionError from './errors/FieldResolutionError'

// todo allow type inference (autocomplete schema fields from fields definition)
interface FieldsDefinition {
  [key: string]: FieldProperties<unknown>;
}

interface ValidateOptions {
  clean?: boolean;
  context?: Record<string, unknown>,
  ignoreMissing?: boolean;
  ignoreUnknown?: boolean;
  parse?: boolean;
  path?: string;
  removeUnknown?: boolean;
}

class Schema {
  public fields: { [key: string]: SchemaField<unknown> }

  constructor (fields: FieldsDefinition) {
    this.fields = {}

    // Set fields.
    Object.keys(fields).forEach((name: string): void => {
      this.fields[name] = new SchemaField(name, fields[name])
    })
  }

  /**
   * Returns a clean copy of the object.
   * @param object
   * @param options
   */
  clean<T> (
    object: Record<string, unknown>,
    options?: { removeUnknown?: boolean }
  ): T {
    const opts = {
      removeUnknown: true,
      ...options
    }

    const clone = deepExtend({}, object)

    Object.keys(clone).forEach((name: string): void => {
      if (typeof this.fields[name] !== 'undefined') {
        clone[name] = this.fields[name].clean(clone[name])
      } else if (opts.removeUnknown) {
        delete clone[name]
      }
    })
    return clone
  }

  /**
   * Returns a clone of the schema.
   */
  clone (): Schema {
    return this.pick(Object.keys(this.fields))
  }

  /**
   * Returns a new schema based on current schema.
   * @param fields
   */
  extend (fields: FieldsDefinition): Schema {
    const fieldsDefinition: FieldsDefinition = {}

    Object.keys(this.fields).forEach((name: string): void => {
      fieldsDefinition[name] = this.fields[name].getProperties()
    })
    return new Schema(deepExtend({}, fieldsDefinition, fields))
  }

  /**
   * Returns fields errors without throwing an error.
   * @param object
   * @param options
   */
  getErrors (
    object: Record<string, unknown>,
    options?: {
      clean?: boolean
      parse?: boolean
      removeUnknown?: boolean
    }
  ): FieldErrors | undefined {
    let errors

    try {
      this.validate(object, {
        clean: false,
        path: '',
        parse: false,
        removeUnknown: false,
        ...options
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        errors = error.errors
      } else {
        throw error
      }
    }
    return errors
  }

  /**
   * Returns a field.
   * @param name
   */
  getField (name: string): SchemaField<unknown> {
    return this.resolveField(name)
  }

  /**
   * Returns all fields.
   */
  getFields (): { [key: string]: SchemaField<unknown> } {
    return this.fields
  }

  /**
   * Checks if an object is valid.
   * @param object
   * @param options
   */
  isValid (object: Record<string, unknown>, options?: ValidateOptions): boolean {
    try {
      this.validate(object, options)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Returns a sub schema without some fields.
   * @param fieldNames
   */
  omit (fieldNames: string[]): Schema {
    const fields: FieldsDefinition = {}

    Object.keys(this.fields).forEach((name: string): void => {
      if (fieldNames.indexOf(name) === -1) {
        fields[name] = this.fields[name].getProperties()
      }
    })
    return new Schema(deepExtend({}, fields))
  }

  /**
   * Returns a copy of the object with all fields parsed.
   * @param object
   */
  parse<T> (object: Record<string, unknown>): T {
    const clone = deepExtend({}, object)

    Object.keys(clone).forEach((name: string): void => {
      if (this.fields[name] != null) {
        clone[name] = this.fields[name].parse(clone[name])
      }
    })
    return clone
  }

  /**
   * Returns a copy of the schema where all fields are not required.
   */
  partial () {
    const fields: FieldsDefinition = {}

    Object.keys(this.fields).forEach((name: string): void => {
      fields[name] = this.fields[name].getProperties()
      fields[name].required = false
    })
    return new Schema(deepExtend({}, fields))
  }

  /**
   * Returns a sub schema from selected fields.
   * @param fieldNames
   */
  pick (fieldNames: string[]): Schema {
    const fields: FieldsDefinition = {}

    fieldNames.forEach((name: string): void => {
      if (typeof this.fields[name] !== 'undefined') {
        fields[name] = this.fields[name].getProperties()
      }
    })
    return new Schema(deepExtend({}, fields))
  }

  /**
   * Returns a copy of the object without unknown fields.
   * @param object
   */
  removeUnknownFields<T> (object: Record<string, unknown>): T {
    if (object == null) {
      return object
    }
    const clone = deepExtend({}, object)

    Object.keys(clone).forEach((name: string): void => {
      const field: SchemaField<unknown> = this.fields[name]

      if (typeof field === 'undefined') {
        delete clone[name]
      } else if (field.getType() instanceof Schema) {
        clone[name] = (field.getType() as Schema).removeUnknownFields(clone[name])
      } else if (field.getItems()?.type instanceof Schema) {
        if (clone[name] instanceof Array) {
          clone[name] = clone[name].map((item: any) => (
            (field.getItems().type as Schema).removeUnknownFields(item)
          ))
        }
      }
    })
    return clone
  }

  /**
   * Builds an object from a string (ex: [colors][0][code]).
   * @param path (ex: address[country][code])
   * @param syntaxChecked
   * @throws {SyntaxError|TypeError}
   */
  resolveField (path: string, syntaxChecked = false): SchemaField<unknown> {
    // Removes array indexes from path because we want to resolve field and not data.
    const realPath = path.replace(/\[\d+]/g, '')

    const bracketIndex = realPath.indexOf('[')
    const bracketEnd = realPath.indexOf(']')
    const dotIndex = realPath.indexOf('.')

    // Do not check syntax errors if already done.
    if (!syntaxChecked) {
      // Check for extra space.
      if (realPath.indexOf(' ') !== -1) {
        throw new SyntaxError(`path "${path}" is not valid`)
      }
      // Check if key is not defined (ex: []).
      if (realPath.indexOf('[]') !== -1) {
        throw new SyntaxError(`missing array index or object attribute in "${path}"`)
      }
      // Check for missing object attribute.
      if (dotIndex + 1 === realPath.length) {
        throw new SyntaxError(`missing object attribute in "${path}"`)
      }

      const closingBrackets = realPath.split(']').length
      const openingBrackets = realPath.split('[').length

      // Check for missing opening bracket.
      if (openingBrackets < closingBrackets) {
        throw new SyntaxError(`missing opening bracket "[" in "${path}"`)
      }
      // Check for missing closing bracket.
      if (closingBrackets < openingBrackets) {
        throw new SyntaxError(`missing closing bracket "]" in "${path}"`)
      }
    }

    let name = realPath
    let subPath

    // Resolve dot "." path.
    if (dotIndex !== -1 && (bracketIndex === -1 || dotIndex < bracketIndex)) {
      // ex: "object.field" => field: "object", subPath: "field"
      name = realPath.substring(0, dotIndex)
      subPath = realPath.substring(dotIndex + 1)
    }

    // Resolve brackets "[..]" path.
    if (bracketIndex !== -1 && (dotIndex === -1 || bracketIndex < dotIndex)) {
      // ex: "[a].field" => field: "[a]", subPath: "field"
      if (bracketIndex === 0) {
        name = realPath.substring(bracketIndex + 1, bracketEnd)
        // Resolve "field" instead of ".field" if array is followed by a dot.
        subPath = realPath.substring(bracketEnd + (
          realPath.substring(bracketEnd + 1, bracketEnd + 2) === '.' ? 2 : 1
        ))
      } else {
        // ex: "array[a].field" => field: "array", subPath: "[a].field"
        name = realPath.substring(0, bracketIndex)
        subPath = realPath.substring(bracketIndex)
      }
    }

    if (typeof this.fields[name] === 'undefined') {
      throw new FieldResolutionError(path)
    }

    let field: SchemaField<unknown> = this.fields[name]

    if (typeof subPath === 'string' && subPath.length > 0) {
      const type = field.getType()
      const props = field.getProperties()

      if (type instanceof Schema) {
        field = type.resolveField(subPath, true)
      } else if (typeof props.items !== 'undefined' &&
        typeof props.items.type !== 'undefined' &&
        props.items.type instanceof Schema) {
        field = props.items.type.resolveField(subPath, true)
      } else {
        throw new FieldResolutionError(path)
      }
    }
    return field
  }

  /**
   * Throws an error when an unknown field is found.
   * @param object
   * @param path
   * @throws {FieldUnknownError}
   */
  throwUnknownFields (object: Record<string, unknown>, path: string): void {
    Object.keys(object).forEach((name: string): void => {
      if (typeof this.fields[name] === 'undefined') {
        throw new FieldUnknownError(name, path)
      }
    })
  }

  /**
   * Validates an object.
   * @param object
   * @param options
   * @throws {ValidationError|FieldUnknownError}
   */
  validate<T> (object: Record<string, unknown>, options?: ValidateOptions): T {
    if (object == null) {
      throw new TypeError('cannot validate null object')
    }

    const opts: ValidateOptions = {
      clean: false,
      ignoreMissing: false,
      ignoreUnknown: false,
      parse: false,
      removeUnknown: false,
      ...options
    }

    // Checks conflicting options.
    if (opts.ignoreUnknown && opts.removeUnknown) {
      throw new Error('options "ignoreUnknown" and "removeUnknown" cannot be both true')
    }

    let clone = deepExtend({}, object)

    // Removes or throws unknown fields.
    if (opts.removeUnknown) {
      clone = this.removeUnknownFields(clone)
    } else if (!opts.ignoreUnknown) {
      this.throwUnknownFields(clone, opts.path || '') // fixme path is empty
    }

    // Parses values.
    if (opts.parse) {
      clone = this.parse(clone)
    }

    // Sets validation context.
    opts.context = clone

    const errors: FieldErrors = {}

    Object.keys(this.fields).forEach((name: string): void => {
      const value = clone[name]

      // Ignore missing field if allowed.
      if (typeof value !== 'undefined' || !opts.ignoreMissing) {
        try {
          clone[name] = this.fields[name].validate(value, opts)
        } catch (error) {
          if (error instanceof FieldError) {
            errors[error.path] = error
          } else if (error instanceof ValidationError) {
            Object.entries(error.errors).forEach(([path, fieldError]): void => {
              errors[path] = fieldError
            })
          } else {
            throw error
          }
        }
      }
    })

    // Throws schema errors.
    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
    return clone
  }

  /**
   * Returns a sub schema without some fields.
   * @deprecated use `omit()` instead
   * @param fieldNames
   */
  without (fieldNames: string[]): Schema {
    return this.omit(fieldNames)
  }
}

export default Schema
