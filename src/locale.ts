/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import FieldError from './errors/FieldError';

export interface LocaleData {
  [key: string]: string;
}

const locales: { [key: string]: LocaleData } = {};

/**
 * Returns localized error message if available.
 * @param error
 * @param locale
 */
export function getErrorMessage(error: FieldError, locale: string): string {
  const messages: LocaleData = locales[locale];

  if (messages != null) {
    let message: string = messages[error.reason];

    if (message != null) {
      // Replace context variables in message.
      Object.entries(error).forEach(([key, value]): void => {
        message = message.replace(`{${key}}`, value);
      });
      return message;
    }
  }
  return error.message;
}

/**
 * Set errors translations for a locale.
 * @param locale
 * @param messages
 */
export function setLocaleMessages(locale: string, messages: LocaleData): void {
  locales[locale] = messages;
}
