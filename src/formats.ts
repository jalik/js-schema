/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import {
  DateRegExp,
  DateTimeRegExp,
  DurationRegExp,
  EmailRegExp,
  HostnameRegExp,
  IDNEmailRegExp,
  IDNHostnameRegExp,
  IPv4RegExp,
  IPv6RegExp,
  IRIReferenceRegExp,
  IRIRegExp,
  JSONPointerRegExp,
  RelativeJSONPointerRegExp,
  TimeRegExp,
  URIReferenceRegExp,
  URIRegExp,
  URITemplateRegExp,
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
  duration: regExpValidator(DurationRegExp),
  email: regExpValidator(EmailRegExp),
  hostname: regExpValidator(HostnameRegExp),
  'idn-email': regExpValidator(IDNEmailRegExp),
  'idn-hostname': regExpValidator(IDNHostnameRegExp),
  iri: regExpValidator(IRIRegExp),
  'iri-reference': regExpValidator(IRIReferenceRegExp),
  ipv4: regExpValidator(IPv4RegExp),
  ipv6: regExpValidator(IPv6RegExp),
  'json-pointer': regExpValidator(JSONPointerRegExp),
  regex: (value: string) => {
    try {
      // Try to create a RegExp object to validate the pattern
      // eslint-disable-next-line no-new
      new RegExp(value)
      return true
    } catch {
      return false
    }
  },
  'relative-json-pointer': regExpValidator(RelativeJSONPointerRegExp),
  time: regExpValidator(TimeRegExp),
  uri: regExpValidator(URIRegExp),
  'uri-reference': regExpValidator(URIReferenceRegExp),
  'uri-template': regExpValidator(URITemplateRegExp),
  uuid: regExpValidator(UUIDRegExp)
}

export default formats
