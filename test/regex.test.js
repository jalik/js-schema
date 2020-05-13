/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
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

import {
  DateRegExp,
  DateTimeRegExp,
  EmailRegExp,
  HostnameRegExp,
  IPv4RegExp,
  TimeRegExp,
} from '../src/regex';

describe('DateRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(DateRegExp.test('2019-04-11')).toBeTruthy();
    });
  });

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(DateRegExp.test('2019-13-11')).toBeFalsy();
      expect(DateRegExp.test('2019-04-32')).toBeFalsy();
    });
  });
});

describe('DateTimeRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(DateTimeRegExp.test('2019-04-11T00:00:00+00:00')).toBeTruthy();
      expect(DateTimeRegExp.test('2019-04-11T07:00:00-10:00')).toBeTruthy();
    });
  });

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(DateTimeRegExp.test('2019-13-11T07:00:00-10:00')).toBeFalsy();
      expect(DateTimeRegExp.test('2019-04-32T07:00:00-10:00')).toBeFalsy();
      expect(DateTimeRegExp.test('2019-04-11T24:00:00-10:00')).toBeFalsy();
      expect(DateTimeRegExp.test('2019-04-11T00:60:00-10:00')).toBeFalsy();
    });
  });
});

describe('EmailRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(EmailRegExp.test('quick-test.1337@domain.com')).toBeTruthy();
    });
  });

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(EmailRegExp.test('aa_aa@ bb.cc')).toBeFalsy();
    });
  });
});

describe('HostnameRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(HostnameRegExp.test('a.bcd-ef.ghi')).toBeTruthy();
    });
  });

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(HostnameRegExp.test('a.bcd_ef.ghi')).toBeFalsy();
    });
  });
});

describe('IPv4RegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(IPv4RegExp.test('192.168.0.1')).toBeTruthy();
    });
  });

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(IPv4RegExp.test('256.256.256.256')).toBeFalsy();
    });
  });
});

describe('TimeRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(TimeRegExp.test('00:00:00+00:00')).toBeTruthy();
      expect(TimeRegExp.test('19:10:00+00:00')).toBeTruthy();
      expect(TimeRegExp.test('21:10:00-10:00')).toBeTruthy();
    });
  });

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(TimeRegExp.test('24:00:00+00:00')).toBeFalsy();
      expect(TimeRegExp.test('00:60:00+00:00')).toBeFalsy();
      expect(TimeRegExp.test('00:00:60+00:00')).toBeFalsy();
      expect(TimeRegExp.test('00:00:00+24:00')).toBeFalsy();
      expect(TimeRegExp.test('00:00:00+00:60')).toBeFalsy();
    });
  });
});
