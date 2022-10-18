/*
 * The MIT License (MIT)
 * Copyright (c) 2022 Karl STEIN
 */

/**
 * Returns the value of the object.
 * @param {*} value
 * @param {*} args
 * @return {*}
 */
// eslint-disable-next-line import/prefer-default-export
export function computeValue(value, ...args) {
  return typeof value === 'function' ? value(...args) : value;
}
