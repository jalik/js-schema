/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import {
  DateRegExp,
  DateTimeRegExp,
  EmailRegExp,
  HostnameRegExp,
  IPv4RegExp,
  IPv6RegExp,
  TimeRegExp,
  UriRegExp,
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
      expect(DateTimeRegExp.test('2019-04-11T07:00:00Z')).toBeTruthy();
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

describe('IPv6RegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(IPv6RegExp.test('1200:0000:AB00:1234:0000:2552:7577:1313')).toBeTruthy();
      expect(IPv6RegExp.test('FE80:0000:0000:0000:0202:B3FF:F31E:8329')).toBeTruthy();
      expect(IPv6RegExp.test('21DA:D3:0:2F3B:2AA:FF:FE28:9D5A')).toBeTruthy();
      expect(IPv6RegExp.test('1080:0:0:0:8:800:200C:417A')).toBeTruthy();
      expect(IPv6RegExp.test('FF01:0:0:0:0:0:0:101')).toBeTruthy();
      expect(IPv6RegExp.test('0:0:0:0:0:0:0:1')).toBeTruthy();
      expect(IPv6RegExp.test('1080::8:800:200C:417A')).toBeTruthy();
      expect(IPv6RegExp.test('FF01::101')).toBeTruthy();
      expect(IPv6RegExp.test('::1')).toBeTruthy();
      expect(IPv6RegExp.test('::')).toBeTruthy();
    });
  });

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(IPv6RegExp.test('1200:0000:AB00:1234:O000:2552:7777:1313')).toBeFalsy();
      expect(IPv6RegExp.test('GFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF')).toBeFalsy();
      expect(IPv6RegExp.test('256.256.256.256')).toBeFalsy();
    });
  });
});

describe('TimeRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(TimeRegExp.test('00:00:00+00:00')).toBeTruthy();
      expect(TimeRegExp.test('19:10:00+00:00')).toBeTruthy();
      expect(TimeRegExp.test('21:10:00-10:00')).toBeTruthy();
      expect(TimeRegExp.test('21:10:00Z')).toBeTruthy();
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

describe('UriRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(UriRegExp.test('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBeTruthy();
      expect(UriRegExp.test('https://www.ietf.org/rfc/rfc2396.txt')).toBeTruthy();
      expect(UriRegExp.test('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBeTruthy();
      expect(UriRegExp.test('telnet://192.0.2.16:80/')).toBeTruthy();
      expect(UriRegExp.test('ssh://user:pass@host:22')).toBeTruthy();
      expect(UriRegExp.test('mailto:user@mail.com')).toBeTruthy();
      expect(UriRegExp.test('news:comp.infosystems.www.servers.unix')).toBeTruthy();
      expect(UriRegExp.test('tel:+1-816-555-1212')).toBeTruthy();
      expect(UriRegExp.test('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBeTruthy();
    });
  });

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(UriRegExp.test('https://www.ietf.org/rfc/ rfc2396.txt')).toBeFalsy();
    });
  });
});
