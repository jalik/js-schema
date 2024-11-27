/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
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
 * Email pattern.
 */
export const EmailRegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

/**
 * Hostname pattern.
 */
export const HostnameRegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

/**
 * IPv4 network address pattern.
 */
export const IPv4RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

/**
 * IPv6 network address pattern.
 */
export const IPv6RegExp = /^([0-9A-Fa-f]{1,4})?::?([0-9A-Fa-f]{1,4})?(:[0-9A-Fa-f]{1,4}){0,7}$/

/**
 * JSON pointer pattern.
 */
export const JSONPointerRegExp = /^(\/[0-9A-Za-z_-]+)+$/

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
 * UUID pattern.
 */
export const UUIDRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
