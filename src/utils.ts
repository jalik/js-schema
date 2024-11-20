/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import deepExtend from '@jalik/deep-extend'
import ValidationError from './errors/ValidationError'
import ValidateError, { ValidationErrors } from './errors/ValidateError'

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
