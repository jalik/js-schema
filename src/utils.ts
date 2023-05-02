/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { Computable } from './checks'

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
