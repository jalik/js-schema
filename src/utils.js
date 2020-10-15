/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

/**
 * Returns the value of the object.
 * @param {*} value
 * @param {*} args
 * @return {*}
 */
export function computeValue(value, ...args) {
  return typeof value === 'function' ? value(...args) : value;
}

/**
 * Checks if value is in list
 * @param list
 * @param value
 * @return {boolean}
 */
export function contains(list, value) {
  let result = false;

  if (list instanceof Array) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i] === value) {
        result = true;
        break;
      }
    }
  }
  return result;
}
