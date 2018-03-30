/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import RegEx from '../src/regex';

/**
 * REGULAR EXPRESSIONS
 */
describe('RegEx', () => {
  const invalidAlpha = 'aa .bbb';
  const validAlpha = 'abcDEF';

  describe('Valid alpha', () => {
    it('should return true', () => {
      expect(RegEx.Alpha.test(validAlpha)).toEqual(true);
    });
  });

  describe('Invalid alpha', () => {
    it('should return false', () => {
      expect(RegEx.Alpha.test(invalidAlpha)).toEqual(false);
    });
  });

  const invalidEmail = 'aa_aa@ bb.cc';
  const validEmail = 'quick-test.1337@domain.com';

  describe('Valid Email', () => {
    it('should return true', () => {
      expect(RegEx.Email.test(validEmail)).toEqual(true);
    });
  });

  describe('Invalid Email', () => {
    it('should return false', () => {
      expect(RegEx.Email.test(invalidEmail)).toEqual(false);
    });
  });

  const invalidFQDN = 'a.bcd_ef.ghi';
  const validFQDN = 'a.bcd-ef.ghi';

  describe('Valid FQDN', () => {
    it('should return true', () => {
      expect(RegEx.FQDN.test(validFQDN)).toEqual(true);
    });
  });

  describe('Invalid FQDN', () => {
    it('should return false', () => {
      expect(RegEx.FQDN.test(invalidFQDN)).toEqual(false);
    });
  });
});
