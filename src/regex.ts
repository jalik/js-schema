/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

/**
 * Date pattern.
 */
export const DateRegExp = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/

/**
 * Date and time pattern.
 */
export const DateTimeRegExp = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{1,3})?(?:Z|[+-](0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]))?$/

/**
 * Duration pattern (ISO 8601).
 * Format: P[nY][nM][nD][T[nH][nM][nS]]
 * Examples: P1Y, P1M, P1D, PT1H, PT1M, PT1S, P1Y1M1DT1H1M1.5S
 */
export const DurationRegExp = /^P(?!$)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+(\.\d+)?S)?)?$/

/**
 * Email pattern.
 */
export const EmailRegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

/**
 * Hostname pattern.
 */
export const HostnameRegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

/**
 * IDN Email pattern (Internationalized Domain Name email).
 * This is a simplified pattern that allows Unicode characters in the local and domain parts.
 */
export const IDNEmailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * IDN Hostname pattern (Internationalized Domain Name).
 * This is a simplified pattern that allows Unicode characters in domain names.
 */
export const IDNHostnameRegExp = /^[^\s.]+(?:\.[^\s.]+)+$/

/**
 * IPv4 network address pattern.
 */
export const IPv4RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

/**
 * IPv6 network address pattern.
 */
export const IPv6RegExp = /^([0-9A-Fa-f]{1,4})?::?([0-9A-Fa-f]{1,4})?(:[0-9A-Fa-f]{1,4}){0,7}$/

/**
 * IRI pattern (Internationalized Resource Identifier).
 * This is a simplified pattern that allows Unicode characters in URIs.
 */
export const IRIRegExp = /^[^\s]+:\/\/[^\s]+$/

/**
 * IRI Reference pattern (Internationalized Resource Identifier Reference).
 * This is a simplified pattern that allows Unicode characters in URI references.
 */
export const IRIReferenceRegExp = /^[^\s]*$/

/**
 * JSON pointer pattern.
 */
export const JSONPointerRegExp = /^(\/[0-9A-Za-z_-]+)+$/

/**
 * Regular expression pattern.
 * Validates if a string is a valid regular expression by attempting to create a RegExp object.
 * This is checked in the validator function, not with a regex pattern.
 */
export const RegexRegExp = /^.*$/

/**
 * Relative JSON pointer pattern.
 */
export const RelativeJSONPointerRegExp = /^(\/[0-9A-Za-z_-]+)+$/

/**
 * Time pattern.
 */
export const TimeRegExp = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{1,3})?(?:Z|[+-](0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]))$/

/**
 * URI pattern.
 */
export const URIRegExp = /^(mailto:|news:|tel:|urn:|[^ :/?#\r\n]+:\/\/)([^ /?#\r\n]+)([^ ?#\r\n]*)(\?[^ #\r\n]*)?(#(.*))?$/

/**
 * URI Reference pattern.
 * A URI Reference can be a URI or a relative reference.
 */
export const URIReferenceRegExp = /^(([^:/?#\s]+):)?(\/\/([^/?#\s]*))?([^?#\s]*)(\?([^#\s]*))?(#([^\s]*))?$/

/**
 * URI Template pattern (RFC 6570).
 * This is a simplified pattern that checks for the presence of template expressions {}.
 */
export const URITemplateRegExp = /^(?:[^{}]|{[^{}]+})*$/

/**
 * UUID pattern.
 */
export const UUIDRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
