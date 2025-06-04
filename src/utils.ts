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
 * Returns a decoded JSON pointer.
 * @see https://datatracker.ietf.org/doc/html/rfc6901
 * @param pointer
 */
export function decodeJSONPointer (pointer: string): string {
  return decodeURIComponent(pointer)
    // URI Fragment Identifier Representation
    .replaceAll('\\"', '"')
    .replaceAll('\\\\', '\\')
    // JSON String Representation
    .replaceAll('~0', '~')
    .replaceAll('~1', '/')
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
  const decodedRef = decodeJSONPointer(ref)
  const path = options.path ?? ''
  const root = options.root ?? schema
  const schemas = options.schemas ?? {}

  const $id = schema.get$Id()
  if ($id != null && !($id in schemas)) {
    schemas[$id] = schema
  }
  const root$id = root.get$Id()
  if (root$id != null && !(root$id in schemas)) {
    schemas[root$id] = root
  }
  const opts = { ...options, schemas }

  let attrs: undefined | boolean | SchemaAttributes

  if (decodedRef === '' || decodedRef === '#') {
    attrs = root.toJSON()
  } else if (decodedRef.startsWith('http')) {
    let uri = decodedRef

    if (decodedRef.startsWith('/')) {
      uri = (schema.getBaseURI() ?? '') + decodedRef
    }

    if (uri in schemas) {
      attrs = schemas[uri].toJSON()
    } else {
      throw new FieldRefError(path, ref)
    }
  } else if (decodedRef.startsWith('#/$defs/')) {
    const key = decodedRef.substring('#/$defs/'.length)
    const $defs = root.get$Defs()

    if ($defs != null && key in $defs) {
      attrs = new JSONSchema($defs[key], opts).toJSON()
    } else {
      throw new FieldRefError(path, ref)
    }
  } else if (decodedRef.startsWith('#/properties')) {
    const key = decodedRef.substring('#/properties'.length + 1)
    const properties = root.getProperties()

    if (properties != null && key in properties) {
      attrs = properties[key]
    } else {
      throw new FieldRefError(path, ref)
    }
  } else {
    const key = decodedRef
    const $defs = root.get$Defs()

    if (key.startsWith('/')) {
      // absolute path reference
      const rootUri = root.getRootURI()
      const uri = rootUri + '/' + key

      if (uri in schemas) {
        attrs = schemas[uri].toJSON()
      } else {
        throw new FieldRefError(path, ref)
      }
    } else if ($defs != null && key in $defs) {
      attrs = new JSONSchema($defs[key], opts).toJSON()
    } else if (key in schemas) {
      attrs = schemas[key].toJSON()
    } else if (root.getBaseURI() + '/' + key in schemas) {
      attrs = schemas[root.getBaseURI() + '/' + key].toJSON()
    } else {
      throw new FieldRefError(path, ref)
    }
  }

  // Resolve nested reference.
  if (typeof attrs === 'object' && attrs?.$ref != null) {
    attrs = { ...attrs, ...resolveRef(attrs.$ref, schema, opts) }
  }
  return typeof attrs === 'object'
    ? attrs
    : {}
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
