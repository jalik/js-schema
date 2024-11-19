/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { Computable } from './checks'
import deepExtend from '@jalik/deep-extend'
import Schema from './Schema'

/**
 * Returns the value of the object.
 * @param value
 * @param context
 */
export function computeValue<T> (value?: Computable<T>, context?: Record<string, unknown>): T {
  return typeof value === 'function'
    // fixme TS2349: This expression is not callable.
    // @ts-ignore
    ? value(context)
    : value
}

/**
 * Joins parts of a field path.
 * @param paths
 */
export function joinPath (...paths: string[]): string {
  return paths
    .filter((path: string) => (path && path.length > 0))
    .join('.')
    .replace('.[', '[')
}

/**
 * Returns a clean copy of the object using a schema.
 * @param values
 * @param schema
 * @param options
 */
export function clean<T> (
  values: Record<string, unknown>,
  schema: Schema,
  options?: { removeUnknown?: boolean }
): T {
  const opts = {
    removeUnknown: true,
    ...options
  }

  const clone = deepExtend({}, values)

  Object.keys(clone).forEach((name) => {
    if (typeof schema.fields[name] !== 'undefined') {
      clone[name] = clean(clone[name], schema, options)
    } else if (opts.removeUnknown) {
      delete clone[name]
    }
  })
  return clone
}

/**
 * Returns a copy of the object with all fields parsed.
 * todo remove in v5
 * @param values
 * @param schema
 */
export function parse<T> (values: Record<string, unknown>, schema: Schema): T {
  const clone = deepExtend({}, values)

  Object.keys(clone).forEach((name) => {
    if (schema.fields[name] != null) {
      clone[name] = schema.fields[name].parse(clone[name])
    }
  })
  return clone
}

/**
 * Returns a copy of the object without unknown fields.
 * @param values
 * @param schema
 */
export function removeUnknownFields<T> (values: Record<string, unknown>, schema: Schema): T {
  if (values == null) {
    return values
  }
  const clone = deepExtend({}, values)

  Object.keys(clone).forEach((name) => {
    const field = schema.fields[name]

    if (typeof field === 'undefined') {
      delete clone[name]
    } else {
      const type = field.getType()
      const itemsType = field.getItems()?.type

      if (type instanceof Schema) {
        clone[name] = removeUnknownFields(clone[name], type)
      } else if (itemsType instanceof Schema) {
        if (clone[name] instanceof Array) {
          clone[name] = clone[name].map((item) => (
            removeUnknownFields(item, itemsType)
          ))
        }
      }
    }
  })
  return clone
}
