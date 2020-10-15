/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

const locales = {};

/**
 * Returns localized error message if available.
 * @param {FieldError} error
 * @param {string} locale
 * @return {string}
 */
export function getErrorMessage(error, locale) {
  if (typeof locales[locale] !== 'undefined' && typeof locales[locale][error.reason] !== 'undefined') {
    let message = locales[locale][error.reason];

    // Replace context variables in message.
    Object.keys(error).forEach((key) => {
      message = message.replace(`{${key}}`, error[key]);
    });
    return message;
  }
  return error.message;
}

/**
 * Adds translations for errors.
 * @param {string} locale
 * @param {Object} dict
 */
export function setLocale(locale, dict) {
  locales[locale] = dict;
}
