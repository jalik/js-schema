/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import {
  DateRegExp,
  DateTimeRegExp,
  EmailRegExp,
  HostnameRegExp,
  IPv4RegExp,
  IPv6RegExp,
  JSONPointerRegExp,
  RelativeJSONPointerRegExp,
  TimeRegExp,
  URIRegExp,
  UUIDRegExp
} from './regex'

export type FormatValidator = (value: string) => boolean

/**
 * Returns a function that checks if a string matches a regular expression.
 * @param regExp
 */
function regExpValidator (regExp: RegExp): FormatValidator {
  return (value: string) => regExp.test(value)
}

const formats: Record<string, FormatValidator> = {
  date: regExpValidator(DateRegExp),
  'date-time': regExpValidator(DateTimeRegExp),
  email: regExpValidator(EmailRegExp),
  hostname: regExpValidator(HostnameRegExp),
  // todo idn-email
  // todo idn-hostname
  // todo iri
  // todo iri-reference
  ipv4: regExpValidator(IPv4RegExp),
  ipv6: regExpValidator(IPv6RegExp),
  'json-pointer': regExpValidator(JSONPointerRegExp),
  // todo regex
  'relative-json-pointer': regExpValidator(RelativeJSONPointerRegExp),
  time: regExpValidator(TimeRegExp),
  uri: regExpValidator(URIRegExp),
  // todo uri-reference
  // todo uri-template
  uuid: regExpValidator(UUIDRegExp)
}

export default formats
