/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

/**
 * Date pattern.
 * @type {RegExp}
 */
export const DateRegExp = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;

/**
 * Date and time pattern.
 * @type {RegExp}
 */
export const DateTimeRegExp = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{1,3})?(?:Z|[+-](0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]))?$/;

/**
 * Email pattern.
 * @type {RegExp}
 */
export const EmailRegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

/**
 * Hostname pattern.
 * @type {RegExp}
 */
export const HostnameRegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

/**
 * IPv4 network address pattern.
 * @type {RegExp}
 */
export const IPv4RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * IPv6 network address pattern.
 * @type {RegExp}
 */
export const IPv6RegExp = /^([0-9A-Fa-f]{1,4})?::?([0-9A-Fa-f]{1,4})?(:[0-9A-Fa-f]{1,4}){0,7}$/;

/**
 * Time pattern.
 * @type {RegExp}
 */
export const TimeRegExp = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{1,3})?(?:Z|[+-](0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]))$/;

/**
 * URI pattern.
 * @type {RegExp}
 */
export const UriRegExp = /^(mailto:|news:|tel:|urn:|[^ :/?#\r\n]+:\/\/)([^ /?#\r\n]+)([^ ?#\r\n]*)(\?[^ #\r\n]*)?(#(.*))?$/;
