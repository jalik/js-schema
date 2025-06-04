/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import {
  DateRegExp,
  DateTimeRegExp,
  EmailRegExp,
  HostnameRegExp,
  IDNEmailRegExp,
  IDNHostnameRegExp,
  IPv4RegExp,
  IPv6RegExp,
  IRIReferenceRegExp,
  IRIRegExp,
  RegexRegExp,
  TimeRegExp,
  URIReferenceRegExp,
  URIRegExp,
  URITemplateRegExp
} from '../src/regex'

describe('DateRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(DateRegExp.test('2019-04-11')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(DateRegExp.test('2019-13-11')).toBeFalsy()
      expect(DateRegExp.test('2019-04-32')).toBeFalsy()
    })
  })
})

describe('DateTimeRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(DateTimeRegExp.test('2019-04-11T00:00:00+00:00')).toBeTruthy()
      expect(DateTimeRegExp.test('2019-04-11T07:00:00-10:00')).toBeTruthy()
      expect(DateTimeRegExp.test('2019-04-11T07:00:00Z')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(DateTimeRegExp.test('2019-13-11T07:00:00-10:00')).toBeFalsy()
      expect(DateTimeRegExp.test('2019-04-32T07:00:00-10:00')).toBeFalsy()
      expect(DateTimeRegExp.test('2019-04-11T24:00:00-10:00')).toBeFalsy()
      expect(DateTimeRegExp.test('2019-04-11T00:60:00-10:00')).toBeFalsy()
    })
  })
})

describe('EmailRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(EmailRegExp.test('quick-test.1337@domain.com')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(EmailRegExp.test('aa_aa@ bb.cc')).toBeFalsy()
    })
  })
})

describe('HostnameRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(HostnameRegExp.test('a.bcd-ef.ghi')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(HostnameRegExp.test('a.bcd_ef.ghi')).toBeFalsy()
    })
  })
})

describe('IDNEmailRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(IDNEmailRegExp.test('user@example.com')).toBeTruthy()
      expect(IDNEmailRegExp.test('user@例子.测试')).toBeTruthy()
      expect(IDNEmailRegExp.test('用户@example.com')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(IDNEmailRegExp.test('user@')).toBeFalsy()
      expect(IDNEmailRegExp.test('user@domain@example')).toBeFalsy()
    })
  })
})

describe('IDNHostnameRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(IDNHostnameRegExp.test('example.com')).toBeTruthy()
      expect(IDNHostnameRegExp.test('例子.测试')).toBeTruthy()
      expect(IDNHostnameRegExp.test('sub.例子.测试')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(IDNHostnameRegExp.test('example')).toBeFalsy()
      expect(IDNHostnameRegExp.test('example.')).toBeFalsy()
    })
  })
})

describe('IPv4RegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(IPv4RegExp.test('192.168.0.1')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(IPv4RegExp.test('256.256.256.256')).toBeFalsy()
    })
  })
})

describe('IPv6RegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(IPv6RegExp.test('1200:0000:AB00:1234:0000:2552:7577:1313')).toBeTruthy()
      expect(IPv6RegExp.test('FE80:0000:0000:0000:0202:B3FF:F31E:8329')).toBeTruthy()
      expect(IPv6RegExp.test('21DA:D3:0:2F3B:2AA:FF:FE28:9D5A')).toBeTruthy()
      expect(IPv6RegExp.test('1080:0:0:0:8:800:200C:417A')).toBeTruthy()
      expect(IPv6RegExp.test('FF01:0:0:0:0:0:0:101')).toBeTruthy()
      expect(IPv6RegExp.test('0:0:0:0:0:0:0:1')).toBeTruthy()
      expect(IPv6RegExp.test('1080::8:800:200C:417A')).toBeTruthy()
      expect(IPv6RegExp.test('FF01::101')).toBeTruthy()
      expect(IPv6RegExp.test('::1')).toBeTruthy()
      expect(IPv6RegExp.test('::')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(IPv6RegExp.test('1200:0000:AB00:1234:O000:2552:7777:1313')).toBeFalsy()
      expect(IPv6RegExp.test('GFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF')).toBeFalsy()
      expect(IPv6RegExp.test('256.256.256.256')).toBeFalsy()
    })
  })
})

describe('IRIRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(IRIRegExp.test('https://example.com')).toBeTruthy()
      expect(IRIRegExp.test('https://例子.测试')).toBeTruthy()
      expect(IRIRegExp.test('https://example.com/路径')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(IRIRegExp.test('example.com')).toBeFalsy()
      expect(IRIRegExp.test('https:// example.com')).toBeFalsy()
    })
  })
})

describe('IRIReferenceRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(IRIReferenceRegExp.test('https://example.com')).toBeTruthy()
      expect(IRIReferenceRegExp.test('/路径/资源')).toBeTruthy()
      expect(IRIReferenceRegExp.test('#片段')).toBeTruthy()
      expect(IRIReferenceRegExp.test('')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(IRIReferenceRegExp.test('https://example.com\nwith-newline')).toBeFalsy()
    })
  })
})

describe('RegexRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      // RegexRegExp is a placeholder that matches any string
      // The actual validation is done in the validator function
      expect(RegexRegExp.test('^[a-z]+$')).toBeTruthy()
      expect(RegexRegExp.test('.*')).toBeTruthy()
      expect(RegexRegExp.test('[0-9]+')).toBeTruthy()
    })
  })
})

describe('TimeRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(TimeRegExp.test('00:00:00+00:00')).toBeTruthy()
      expect(TimeRegExp.test('19:10:00+00:00')).toBeTruthy()
      expect(TimeRegExp.test('21:10:00-10:00')).toBeTruthy()
      expect(TimeRegExp.test('21:10:00Z')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(TimeRegExp.test('24:00:00+00:00')).toBeFalsy()
      expect(TimeRegExp.test('00:60:00+00:00')).toBeFalsy()
      expect(TimeRegExp.test('00:00:60+00:00')).toBeFalsy()
      expect(TimeRegExp.test('00:00:00+24:00')).toBeFalsy()
      expect(TimeRegExp.test('00:00:00+00:60')).toBeFalsy()
    })
  })
})

describe('UriRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(URIRegExp.test('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBeTruthy()
      expect(URIRegExp.test('https://www.ietf.org/rfc/rfc2396.txt')).toBeTruthy()
      expect(URIRegExp.test('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBeTruthy()
      expect(URIRegExp.test('telnet://192.0.2.16:80/')).toBeTruthy()
      expect(URIRegExp.test('ssh://user:pass@host:22')).toBeTruthy()
      expect(URIRegExp.test('mailto:user@mail.com')).toBeTruthy()
      expect(URIRegExp.test('news:comp.infosystems.www.servers.unix')).toBeTruthy()
      expect(URIRegExp.test('tel:+1-816-555-1212')).toBeTruthy()
      expect(URIRegExp.test('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(URIRegExp.test('https://www.ietf.org/rfc/ rfc2396.txt')).toBeFalsy()
    })
  })
})

describe('URIReferenceRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(URIReferenceRegExp.test('https://example.com')).toBeTruthy()
      expect(URIReferenceRegExp.test('/path/to/resource')).toBeTruthy()
      expect(URIReferenceRegExp.test('path/to/resource')).toBeTruthy()
      expect(URIReferenceRegExp.test('../resource')).toBeTruthy()
      expect(URIReferenceRegExp.test('#fragment')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(URIReferenceRegExp.test('https://example.com with space')).toBeFalsy()
    })
  })
})

describe('URITemplateRegExp', () => {
  describe('with correct value', () => {
    it('should return true', () => {
      expect(URITemplateRegExp.test('https://example.com/users/{id}')).toBeTruthy()
      expect(URITemplateRegExp.test('https://example.com/{path}/resource')).toBeTruthy()
      expect(URITemplateRegExp.test('/users/{id}/profile')).toBeTruthy()
      expect(URITemplateRegExp.test('{scheme}://{host}{/path}{?query}')).toBeTruthy()
    })
  })

  describe('with incorrect value', () => {
    it('should return false', () => {
      expect(URITemplateRegExp.test('https://example.com/{unclosed')).toBeFalsy()
    })
  })
})
