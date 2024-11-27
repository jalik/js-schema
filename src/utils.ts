/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import deepExtend from '@jalik/deep-extend'
import ValidationError from './errors/ValidationError'
import ValidateError, { ValidationErrors } from './errors/ValidateError'
import JSONSchema, { SchemaAttributes, ValidateOptions } from './JSONSchema'
import FieldRefError from './errors/FieldRefError'

/**
 * Cleans a value.
 * @param value
 * @param options
 */
export function clean (
  value: unknown,
  options?: {
    nullify?: boolean;
    trim?: boolean;
  }
): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value === 'string') {
    const str = options?.trim ? value.trim() : value
    return options?.nullify && str === '' ? null : str
  }

  if (typeof value === 'object') {
    if (value instanceof Array) {
      return value.map((item) => clean(item, options))
    }

    const copy: Record<string, unknown> = deepExtend({}, value)
    for (const key in copy) {
      copy[key] = clean(copy[key], options)
    }
    return copy
  }
}

/**
 * Returns true if values are equals.
 * @param a
 * @param b
 */
export function compare (a: unknown, b: unknown): boolean {
  if (typeof a === 'object' && a != null && typeof b === 'object' && b != null) {
    const newA = JSON.stringify(a instanceof Array ? a : sortProperties(a))
    const newB = JSON.stringify(b instanceof Array ? b : sortProperties(b))
    return newA === newB
  }
  return a === b
}

/**
 * Joins parts of a field path.
 * @param paths
 */
export function joinPath (...paths: string[]): string {
  return paths
    .filter((path) => (path != null && path.length > 0))
    .join('.')
    .replace('.[', '[')
}

/**
 * Returns attributes designed by a reference URI.
 * @param ref
 * @param schema
 * @param options
 */
export function resolveRef (
  ref: string,
  schema: JSONSchema<SchemaAttributes>,
  options: ValidateOptions): SchemaAttributes {
  let attrs: SchemaAttributes = {}

  const path = options.path ?? ''
  const root = options.root ?? schema
  const schemas = options.schemas ?? {}

  if (ref === '#') {
    attrs = deepExtend({}, attrs, root.toJSON())
  } else if (ref.startsWith('#/$defs')) {
    const key = decodeURIComponent(ref.substring('#/$defs'.length + 1))
    const $defs = root.get$Defs()

    if ($defs != null && key in $defs) {
      attrs = deepExtend({}, attrs, new JSONSchema($defs[key], options).toJSON())
    } else {
      throw new FieldRefError(path, ref)
    }
  } else if (ref.startsWith('#/properties')) {
    const key = ref.substring(12 + 1)

    if (attrs.properties != null && key in attrs.properties) {
      attrs = deepExtend({}, attrs, attrs.properties[key])
    } else {
      throw new FieldRefError(path, ref)
    }
  } else {
    let uri = ref

    if (ref.startsWith('/')) {
      uri = (schema.getBaseURI() ?? '') + ref
    }

    if (uri in schemas) {
      attrs = deepExtend({}, attrs, schemas[uri].toJSON())
    } else {
      throw new FieldRefError(path, ref)
    }
  }
  // Resolve nested reference.
  if (attrs.$ref != null) {
    attrs = { ...attrs, ...resolveRef(attrs.$ref, schema, options) }
  }
  return attrs
}

/**
 * Returns an object with properties sorted.
 * @param properties
 */
export function sortProperties (properties: Partial<Record<string, unknown>>): Record<string, unknown> {
  const sortedProperties: Record<string, unknown> = {}
  Object.keys(properties)
    .sort()
    .forEach((key) => {
      sortedProperties[key] = properties[key]
    })
  return sortedProperties
}

/**
 * Returns an errors object or throws an error if the function fails.
 * @param func
 * @param throwOnError
 */
export function validate (func: () => void, throwOnError = true): ValidationErrors | null {
  if (throwOnError) {
    func()
    return null
  }

  try {
    func()
  } catch (error) {
    if (error instanceof ValidationError) {
      return { [error.path]: error }
    }
    if (error instanceof ValidateError) {
      return error.errors
    }
    throw error
  }
  return null
}
