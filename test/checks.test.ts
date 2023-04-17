/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals';
import { checkAllowed } from '../src/checks';
import FieldAllowedError from '../src/errors/FieldAllowedError';

describe('checkAllowed', () => {
  describe('with value allowed', () => {
    it('should not throw an Error', () => {
      expect(() => {
        checkAllowed([0, 1], 1, 'number', 'numbers');
      }).not.toThrowError();
    });
  });
  describe('with value not allowed', () => {
    it('should throw a FieldAllowedError', () => {
      expect(() => {
        checkAllowed([0, 1], 2, 'number', 'numbers');
      }).toThrowError(FieldAllowedError);
    });
  });
});
