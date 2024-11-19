/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import { ERROR_FIELD_REQUIRED } from '../src/errors'
import FieldEnumError from '../src/errors/FieldEnumError'
import FieldDeniedError from '../src/errors/FieldDeniedError'
import FieldError from '../src/errors/FieldError'
import FieldFormatError from '../src/errors/FieldFormatError'
import FieldLengthError from '../src/errors/FieldLengthError'
import FieldMaxError from '../src/errors/FieldMaxError'
import FieldMaxLengthError from '../src/errors/FieldMaxLengthError'
import FieldMaxWordsError from '../src/errors/FieldMaxWordsError'
import FieldMinimumError from '../src/errors/FieldMinimumError'
import FieldMinLengthError from '../src/errors/FieldMinLengthError'
import FieldMinWordsError from '../src/errors/FieldMinWordsError'
import FieldPatternError from '../src/errors/FieldPatternError'
import FieldRequiredError from '../src/errors/FieldRequiredError'
import FieldTypeError from '../src/errors/FieldTypeError'
import ValidationError from '../src/errors/ValidationError'
import SchemaField, { FieldProperties } from '../src/SchemaField'
import FieldUniqueItemsError from '../src/errors/FieldUniqueItemsError'
import FieldMultipleOfError from '../src/errors/FieldMultipleOfError'
import FieldMinItemsError from '../src/errors/FieldMinItemsError'
import FieldMaxItemsError from '../src/errors/FieldMaxItemsError'

describe('SchemaField', () => {
  it('should be importable from package', () => {
    expect(typeof SchemaField).toEqual('function')
  })

  describe('clean(any)', () => {
    describe('with clean: Function', () => {
      const field = new SchemaField('field', {
        clean: (value) => value.trim()
      })

      it('should return the cleaned value', () => {
        expect(field.clean(' test ')).toBe('test')
      })
    })

    describe('with clean: undefined', () => {
      const field = new SchemaField('field', {})

      it('should return the same input value', () => {
        expect(field.clean(' test ')).toBe('test')
      })
    })
  })

  describe('getEnum()', () => {
    describe('with enum = Array', () => {
      it('should return the array', () => {
        const field = new SchemaField('field', { enum: [1, 0] })
        expect(field.getAllowed()).toStrictEqual([1, 0])
      })
    })

    describe('with enum = undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getAllowed()).toBeUndefined()
      })
    })
  })

  describe('getDenied()', () => {
    describe('with denied: Array', () => {
      it('should return an array', () => {
        const field = new SchemaField('field', { denied: [1, 0] })
        expect(field.getDenied()).toStrictEqual([1, 0])
      })
    })

    describe('with denied: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getDenied()).toBeUndefined()
      })
    })
  })

  describe('getExclusiveMaximum()', () => {
    describe('with exclusiveMaximum = number', () => {
      it('should return exclusiveMaximum', () => {
        const field = new SchemaField('field', { exclusiveMaximum: 30 })
        expect(field.getExclusiveMaximum()).toBe(30)
      })
    })

    describe('with exclusiveMaximum = undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getExclusiveMaximum()).toBeUndefined()
      })
    })
  })

  describe('getExclusiveMinimum()', () => {
    describe('with exclusiveMinimum = number', () => {
      it('should return exclusiveMinimum', () => {
        const field = new SchemaField('field', { exclusiveMinimum: 0 })
        expect(field.getExclusiveMinimum()).toBe(0)
      })
    })

    describe('with exclusiveMinimum = undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getExclusiveMinimum()).toBeUndefined()
      })
    })
  })

  describe('getFormat()', () => {
    describe('with format: String', () => {
      it('should return format', () => {
        const field = new SchemaField('field', { format: 'date' })
        expect(field.getFormat()).toEqual('date')
      })
    })

    describe('with format: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getFormat()).toBeUndefined()
      })
    })
  })

  describe('getItems()', () => {
    describe('with items: Object', () => {
      it('should return items', () => {
        const field = new SchemaField('field', { items: {} })
        expect(field.getItems()).toEqual({})
      })
    })

    describe('with items: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getItems()).toBeUndefined()
      })
    })
  })

  describe('getTitle()', () => {
    describe('with title = string', () => {
      it('should return title', () => {
        const field = new SchemaField('field', { title: 'My Field' })
        expect(field.getTitle()).toEqual('My Field')
      })
    })

    describe('with title = undefined', () => {
      it('should return field\'s name', () => {
        const field = new SchemaField('field', {})
        expect(field.getTitle()).toBe('field')
      })
    })
  })

  describe('getLength()', () => {
    describe('with length: Number', () => {
      it('should return a number', () => {
        const field = new SchemaField('field', { length: 30 })
        expect(field.getLength()).toBe(30)
      })
    })

    describe('with length: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getLength()).toBeUndefined()
      })
    })
  })

  describe('getMaxLength()', () => {
    describe('with maxLength: Number', () => {
      it('should return a number', () => {
        const field = new SchemaField('field', { maxLength: 30 })
        expect(field.getMaxLength()).toBe(30)
      })
    })

    describe('with maxLength: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getMaxLength()).toBeUndefined()
      })
    })
  })

  describe('getMaximum()', () => {
    describe('with maximum = number', () => {
      it('should return maximum', () => {
        const field = new SchemaField('field', { maximum: 30 })
        expect(field.getMaximum()).toBe(30)
      })
    })

    describe('with maximum = undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getMaximum()).toBeUndefined()
      })
    })
  })

  describe('getMaxWords()', () => {
    describe('with maxWords: Number', () => {
      it('should return a number', () => {
        const field = new SchemaField('field', { maxWords: 30 })
        expect(field.getMaxWords()).toBe(30)
      })
    })

    describe('with maxWords: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getMaxWords()).toBeUndefined()
      })
    })
  })

  describe('getMinLength()', () => {
    describe('with minLength: Number', () => {
      it('should return a number', () => {
        const field = new SchemaField('field', { minLength: 30 })
        expect(field.getMinLength()).toBe(30)
      })
    })

    describe('with minLength: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getMinLength()).toBeUndefined()
      })
    })
  })

  describe('getMinimum()', () => {
    describe('with minimum = number', () => {
      it('should return a number', () => {
        const field = new SchemaField('field', { minimum: 30 })
        expect(field.getMinimum()).toBe(30)
      })
    })

    describe('with minimum = undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getMinimum()).toBeUndefined()
      })
    })
  })

  describe('getMinWords()', () => {
    describe('with minWords: Number', () => {
      it('should return a number', () => {
        const field = new SchemaField('field', { minWords: 30 })
        expect(field.getMinWords()).toBe(30)
      })
    })

    describe('with minWords: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getMinWords()).toBeUndefined()
      })
    })
  })

  describe('getName()', () => {
    it('should return field name', () => {
      const field = new SchemaField('field', {})
      expect(field.getName()).toBe('field')
    })
  })

  describe('getPattern()', () => {
    describe('with pattern: RegExp', () => {
      it('should return a RegExp', () => {
        const field = new SchemaField('field', { pattern: /^[0-9]+$/ })
        expect(field.getPattern()).toBeInstanceOf(RegExp)
      })
    })

    describe('with pattern: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getPattern()).toBeUndefined()
      })
    })
  })

  describe('getType()', () => {
    describe('with type defined', () => {
      it('should return the type', () => {
        expect(new SchemaField('field', { type: 'array' }).getType()).toBe('array')
        expect(new SchemaField('field', { type: 'boolean' }).getType()).toBe('boolean')
        expect(new SchemaField('field', { type: 'integer' }).getType()).toBe('integer')
        expect(new SchemaField('field', { type: 'null' }).getType()).toBe('null')
        expect(new SchemaField('field', { type: 'number' }).getType()).toBe('number')
        expect(new SchemaField('field', { type: 'object' }).getType()).toBe('object')
        expect(new SchemaField('field', { type: 'string' }).getType()).toBe('string')
      })
    })

    describe('with type undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getType()).toBeUndefined()
      })
    })
  })

  describe('isRequired()', () => {
    describe('with required: true', () => {
      it('should return true', () => {
        const field = new SchemaField('field', { required: true })
        expect(field.isRequired()).toBe(true)
      })
    })

    describe('with required: false', () => {
      it('should return false', () => {
        const field = new SchemaField('field', { required: false })
        expect(field.isRequired()).toBe(false)
      })
    })

    describe('with required: undefined', () => {
      it('should return false', () => {
        const field = new SchemaField('field', {})
        expect(field.isRequired()).toBe(false)
      })
    })
  })

  describe('parse(any)', () => {
    describe('with type: "boolean"', () => {
      const field = new SchemaField('field', { type: 'boolean' })

      it('should return a boolean', () => {
        expect(field.parse('false')).toBe(false)
        expect(field.parse('true')).toBe(true)
        expect(field.parse('FALSE')).toBe(false)
        expect(field.parse('TRUE')).toBe(true)
      })
    })

    describe('with type: "integer"', () => {
      const field = new SchemaField('field', { type: 'integer' })

      it('should return an integer', () => {
        expect(field.parse('12478.395')).toBe(12478)
        expect(field.parse('3.14')).toBe(3)
      })
    })

    describe('with type: "number"', () => {
      const field = new SchemaField('field', { type: 'number' })

      it('should return a number', () => {
        expect(field.parse('01010')).toBe(1010)
        expect(field.parse('12345')).toBe(12345)
        expect(field.parse('99.99')).toBe(99.99)
      })
    })

    describe('without type', () => {
      const field = new SchemaField('date', {
        parse (value) {
          const [year, month, day] = value.split('-')
          return new Date(year, parseInt(month, 10) - 1, day)
        }
      })

      it('should return value using parse function', () => {
        expect(field.parse<Date>('2018-04-05')?.getTime())
          .toBe(new Date(2018, 3, 5).getTime())
      })
    })
  })

  describe('toJSON()', () => {
    it('should return field as JSON object', () => {
      const p: FieldProperties = {
        title: 'field',
        type: 'string',
        required: true
      }
      expect(new SchemaField('field', p).toJSON()).toEqual(p)
    })
  })

  describe('isValid()', () => {
    const field = new SchemaField('number', { type: 'number' })

    describe('with valid object', () => {
      it('should return true', () => {
        expect(field.isValid(1)).toEqual(true)
      })
    })
    describe('with invalid object', () => {
      it('should return false', () => {
        expect(field.isValid('1')).toEqual(false)
      })
    })
  })

  describe('validate()', () => {
    describe('with incorrect value', () => {
      const field = new SchemaField('field', { required: true })
      let error: any

      try {
        field.validate(undefined)
      } catch (e) {
        error = e
      }

      it('should throw FieldError', () => {
        expect(error).toBeInstanceOf(FieldRequiredError)
      })

      it('should throw a FieldError with a "field" attribute', () => {
        expect(error.field).toBe('field')
      })

      it('should throw a FieldError with a "path" attribute', () => {
        expect(error.path).toBe('field')
      })

      it('should throw a FieldError with a "reason" attribute', () => {
        expect(error.reason).toBe(ERROR_FIELD_REQUIRED)
      })
    })

    describe('with enum and denied', () => {
      it('should throw TypeError', () => {
        expect(() => (
          new SchemaField('field', {
            enum: ['red'],
            denied: ['blue']
          })
        )).toThrow(TypeError)
      })
    })

    describe('with enum', () => {
      describe('enum = Array', () => {
        const field = new SchemaField('field', { enum: ['off', 'on'] })

        describe('with Array', () => {
          describe('with enum values', () => {
            it('should not throw FieldAllowedError', () => {
              expect(() => {
                field.validate(['on'])
              })
                .not.toThrow()
            })
          })

          describe('without enum values', () => {
            it('should throw FieldAllowedError', () => {
              expect(() => {
                field.validate(['yes'])
              })
                .toThrow(FieldEnumError)
            })
          })
        })
      })
    })

    describe('with check', () => {
      describe('check: Function', () => {
        const field = new SchemaField('field', {
          check: (value) => value % 2 === 0
        })

        describe('with correct value', () => {
          it('should not throw FieldError', () => {
            expect(() => {
              field.validate(2)
            })
              .not.toThrow()
          })
        })

        describe('with incorrect value', () => {
          it('should throw FieldError', () => {
            expect(() => {
              field.validate(1)
            })
              .toThrow(FieldError)
          })
        })
      })
    })

    describe('with denied', () => {
      describe('denied: Array', () => {
        const field = new SchemaField('field', { denied: ['off', 'on'] })

        describe('with denied values', () => {
          it('should throw FieldDeniedError', () => {
            expect(() => {
              field.validate(['on'])
            })
              .toThrow(FieldDeniedError)
          })
        })

        describe('without denied values', () => {
          it('should not throw FieldDeniedError', () => {
            expect(() => {
              field.validate(['yes'])
            })
              .not.toThrow()
          })
        })
      })
    })

    describe('with items', () => {
      describe('items.type: "boolean"', () => {
        const field = new SchemaField('field', {
          items: { type: 'boolean' }
        })

        describe('with boolean values', () => {
          it('should not throw ValidationError', () => {
            expect(() => {
              field.validate([true, false])
            })
              .not.toThrow()
          })
        })

        describe('with mixed values', () => {
          it('should throw ValidationError', () => {
            expect(() => {
              field.validate([true, 100, 'false'])
            }).toThrow(ValidationError)
          })
        })
      })

      describe('items.type: "number"', () => {
        const field = new SchemaField('field', {
          items: { type: 'number' }
        })

        describe('with number values', () => {
          it('should not throw ValidationError', () => {
            expect(() => {
              field.validate([0, 1])
            })
              .not.toThrow()
          })
        })

        describe('with mixed values', () => {
          it('should throw ValidationError', () => {
            expect(() => {
              field.validate([true, 100, 'false'])
            }).toThrow(ValidationError)
          })
        })
      })

      describe('items.type: "object"', () => {
        const field = new SchemaField('field', {
          items: { type: 'object' }
        })

        describe('with objects', () => {
          it('should not throw ValidationError', () => {
            expect(() => {
              field.validate([{}, []])
            })
              .not.toThrow()
          })
        })

        describe('with mixed values', () => {
          it('should throw ValidationError', () => {
            expect(() => {
              field.validate([true, 100, 'false'])
            }).toThrow(ValidationError)
          })
        })
      })

      describe('items.type: "string"', () => {
        const field = new SchemaField('field', {
          items: { type: 'string' }
        })

        describe('with string values', () => {
          it('should not throw ValidationError', () => {
            expect(() => {
              field.validate(['a', 'b'])
            })
              .not.toThrow()
          })
        })

        describe('with mixed values', () => {
          it('should throw ValidationError', () => {
            expect(() => {
              field.validate([true, 100, 'false'])
            }).toThrow(ValidationError)
          })
        })
      })
    })

    describe('with length', () => {
      const field = new SchemaField('field', { length: 2 })

      describe('length: Number', () => {
        describe('with array of correct length', () => {
          it('should not throw FieldLengthError', () => {
            expect(() => {
              field.validate([1, 2])
            })
              .not.toThrow()
          })
        })

        describe('with array of incorrect length', () => {
          it('should throw FieldLengthError', () => {
            expect(() => {
              field.validate([1])
            })
              .toThrow(FieldLengthError)
          })
        })

        describe('with object of incorrect length', () => {
          it('should throw FieldLengthError', () => {
            expect(() => {
              field.validate({ length: 1 })
            })
              .toThrow(FieldLengthError)
          })
        })

        describe('with object of correct length', () => {
          it('should not throw FieldLengthError', () => {
            expect(() => {
              field.validate({ length: 2 })
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect length', () => {
          it('should throw FieldLengthError', () => {
            expect(() => {
              field.validate('x')
            })
              .toThrow(FieldLengthError)
          })
        })

        describe('with string of correct length', () => {
          it('should not throw FieldLengthError', () => {
            expect(() => {
              field.validate('xx')
            })
              .not.toThrow()
          })
        })
      })

      // todo add tests with length: Function
    })

    describe('with format', () => {
      describe('format: "date"', () => {
        const field = new SchemaField('field', { format: 'date' })

        describe('with string of correct format', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020/05/13')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      describe('format: "datetime"', () => {
        const field = new SchemaField('field', { format: 'datetime' })

        describe('with string not containing fraction of seconds and timezone offset', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2021-01-30T08:00:00')
            })
              .not.toThrow()
          })
        })

        describe('with string containing fraction of seconds and not timezone offset', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13T10:00:00.000')
            })
              .not.toThrow()
          })
        })

        describe('with string containing timezone offset and no fraction of seconds', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13T10:00:00-10:00')
            })
              .not.toThrow()
          })
        })

        describe('with string containing timezone offset and fraction of seconds', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13T23:59:59.999-10:00')
            })
              .not.toThrow()
          })
        })

        describe('with string of correct format containing Z offset', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13T10:00:00Z')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13 10:00:00')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      describe('format: "date-time"', () => {
        const field = new SchemaField('field', { format: 'date-time' })

        describe('with string containing no timezone offset', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2021-01-30T08:00:00')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13 10:00:00')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      describe('format: "email"', () => {
        const field = new SchemaField('field', { format: 'email' })

        describe('with string of correct format', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('valid.address@mail.com')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('invalid@mail')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      describe('format: "hostname"', () => {
        const field = new SchemaField('field', { format: 'hostname' })

        describe('with string of correct format', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('www.host.com')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('www.invalid_host.com')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      describe('format: "ipv4"', () => {
        const field = new SchemaField('field', { format: 'ipv4' })

        describe('with string of correct format', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('192.168.1.0')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('256.255.255.255')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      describe('format: "ipv6"', () => {
        const field = new SchemaField('field', { format: 'ipv6' })

        describe('with string of correct format', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('ff:ff:ff:ff:ff:ff:ff:ff')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('gf:ff:ff:ff:ff:ff:ff:ff')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      describe('format: "time"', () => {
        const field = new SchemaField('field', { format: 'time' })

        describe('with string of correct format', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('12:30:42-10:00')
            })
              .not.toThrow()
          })
        })

        describe('with string of correct format containing second fraction', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('12:30:42.000-10:00')
            })
              .not.toThrow()
          })
        })

        describe('with string of correct format containing Z offset', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('12:30:42Z')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('12:30:42')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      describe('format: "uri"', () => {
        const field = new SchemaField('field', { format: 'uri' })

        describe('with string of correct format', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('ftp://ftp.is.co.za/rfc/rfc1808.txt')
            })
              .not.toThrow()
          })
        })

        describe('with string of incorrect format', () => {
          it('should throw FieldFormatError', () => {
            expect(() => {
              field.validate('https://www.ietf.org/rfc/ rfc2396.txt')
            })
              .toThrow(FieldFormatError)
          })
        })
      })

      // todo add tests with format: Function
    })

    describe('with maximum', () => {
      describe('maximum: number', () => {
        const field = new SchemaField('field', { maximum: 0 })

        describe('with number', () => {
          describe('with value higher than maximum', () => {
            it('should throw FieldMaxError', () => {
              expect(() => {
                field.validate(10)
              })
                .toThrow(FieldMaxError)
            })
          })

          describe('with value equal to maximum', () => {
            it('should not throw FieldMaxError', () => {
              expect(() => {
                field.validate(0)
              })
                .not.toThrow()
            })
          })

          describe('with value lower than maximum', () => {
            it('should not throw FieldMaxError', () => {
              expect(() => {
                field.validate(-10)
              })
                .not.toThrow()
            })
          })
        })

        describe('with array', () => {
          describe('with values higher than maximum', () => {
            it('should throw FieldMaxError', () => {
              expect(() => {
                field.validate([10])
              })
                .toThrow(FieldMaxError)
            })
          })

          describe('with values equal to maximum', () => {
            it('should not throw FieldMaxError', () => {
              expect(() => {
                field.validate([0])
              })
                .not.toThrow()
            })
          })

          describe('with values lower than maximum', () => {
            it('should not throw FieldMaxError', () => {
              expect(() => {
                field.validate([-10])
              })
                .not.toThrow()
            })
          })
        })
      })

      describe('maximum: Date', () => {
        const date = new Date()
        const field = new SchemaField('field', { maximum: date })

        describe('with date higher than maximum', () => {
          it('should throw FieldMaxError', () => {
            expect(() => {
              field.validate(new Date(date.getTime() + 1000))
            })
              .toThrow(FieldMaxError)
          })
        })

        describe('with date equal to maximum', () => {
          it('should not throw FieldMaxError', () => {
            expect(() => {
              field.validate(date)
            })
              .not.toThrow()
          })
        })

        describe('with date lower than maximum', () => {
          it('should not throw FieldMaxError', () => {
            expect(() => {
              field.validate(new Date(date.getTime() - 1000))
            })
              .not.toThrow()
          })
        })
      })
    })

    describe('with maxItems', () => {
      describe('maxItems: 1', () => {
        const field = new SchemaField('field', {
          maxItems: 1
        })

        describe('with null value', () => {
          it('should not throw Error', () => {
            expect(() => {
              field.validate(null)
            }).not.toThrow()
          })
        })
        describe('with items <= maxItems', () => {
          it('should not throw Error', () => {
            expect(() => {
              field.validate([])
            }).not.toThrow()
            expect(() => {
              field.validate([1])
            }).not.toThrow()
          })
        })
        describe('with items > maxItems', () => {
          it('should throw FieldMaxItemsError', () => {
            expect(() => {
              field.validate([1, 2])
            }).toThrow(FieldMaxItemsError)
          })
        })
      })
    })

    describe('with maxLength', () => {
      describe('maxLength: Number', () => {
        const field = new SchemaField('field', { maxLength: 5 })

        describe('with string', () => {
          describe('with length higher than maxLength', () => {
            it('should throw FieldMaxLengthError', () => {
              expect(() => {
                field.validate('000000')
              })
                .toThrow(FieldMaxLengthError)
            })
          })

          describe('with length equal to maxLength', () => {
            it('should not throw FieldMaxLengthError', () => {
              expect(() => {
                field.validate('00000')
              })
                .not.toThrow()
            })
          })

          describe('with length lower than maxLength', () => {
            it('should not throw FieldMaxLengthError', () => {
              expect(() => {
                field.validate('')
              })
                .not.toThrow()
            })
          })
        })

        describe('with array', () => {
          describe('with length higher than maxLength', () => {
            it('should throw FieldMaxLengthError', () => {
              expect(() => {
                field.validate([0, 0, 0, 0, 0, 0])
              })
                .toThrow(FieldMaxLengthError)
            })
          })

          describe('with length equal to maxLength', () => {
            it('should not throw FieldMaxLengthError', () => {
              expect(() => {
                field.validate([0, 0, 0, 0, 0])
              })
                .not.toThrow()
            })
          })

          describe('with length lower than maxLength', () => {
            it('should not throw FieldMaxLengthError', () => {
              expect(() => {
                field.validate([])
              })
                .not.toThrow()
            })
          })
        })
      })

      // todo add tests with maxLength: Function
    })

    describe('with maxWords', () => {
      describe('maxWords: Number', () => {
        const field = new SchemaField('field', { maxWords: 5 })

        describe('with length higher than maxWords', () => {
          it('should throw FieldMaxWordsError', () => {
            expect(() => {
              field.validate('0 0 0 0 0 0')
            })
              .toThrow(FieldMaxWordsError)
          })
        })

        describe('with length equal to maxWords', () => {
          it('should not throw FieldMaxWordsError', () => {
            expect(() => {
              field.validate('0 0 0 0 0')
            })
              .not.toThrow()
          })
        })

        describe('with length lower than maxWords', () => {
          it('should not throw FieldMaxWordsError', () => {
            expect(() => {
              field.validate('')
            })
              .not.toThrow()
          })
        })
      })

      // todo add tests with maxWords: Function
    })

    describe('with minimum', () => {
      describe('minimum = number', () => {
        const field = new SchemaField('field', { minimum: 0 })

        describe('with number', () => {
          describe('with value lower than minimum', () => {
            it('should throw FieldMinError', () => {
              expect(() => {
                field.validate(-10)
              })
                .toThrow(FieldMinimumError)
            })
          })

          describe('with value equal to minimum', () => {
            it('should not throw FieldMinError', () => {
              expect(() => {
                field.validate(0)
              })
                .not.toThrow()
            })
          })

          describe('with value higher than minimum', () => {
            it('should not throw FieldMinError', () => {
              expect(() => {
                field.validate(10)
              })
                .not.toThrow()
            })
          })
        })

        describe('with array', () => {
          describe('with values lower than minimum', () => {
            it('should throw FieldMinError', () => {
              expect(() => {
                field.validate([-10])
              })
                .toThrow(FieldMinimumError)
            })
          })

          describe('with values equal to minimum', () => {
            it('should not throw FieldMinError', () => {
              expect(() => {
                field.validate([0])
              })
                .not.toThrow()
            })
          })

          describe('with values higher than minimum', () => {
            it('should not throw FieldMinError', () => {
              expect(() => {
                field.validate([10])
              })
                .not.toThrow()
            })
          })
        })
      })

      describe('minimum = Date', () => {
        const date = new Date()
        const field = new SchemaField('field', { minimum: date })

        describe('with date lower than minimum', () => {
          it('should throw FieldMinError', () => {
            expect(() => {
              field.validate(new Date(date.getTime() - 1000))
            })
              .toThrow(FieldMinimumError)
          })
        })

        describe('with date equal to minimum', () => {
          it('should not throw FieldMinError', () => {
            expect(() => {
              field.validate(date)
            })
              .not.toThrow()
          })
        })

        describe('with date higher than minimum', () => {
          it('should not throw FieldMinError', () => {
            expect(() => {
              field.validate(new Date(date.getTime() + 1000))
            })
              .not.toThrow()
          })
        })
      })
    })

    describe('with minItems', () => {
      describe('minItems: 1', () => {
        const field = new SchemaField('field', {
          minItems: 1
        })

        describe('with null value', () => {
          it('should not throw Error', () => {
            expect(() => {
              field.validate(null)
            }).not.toThrow()
          })
        })
        describe('with items >= minItems', () => {
          it('should not throw Error', () => {
            expect(() => {
              field.validate([1])
            }).not.toThrow()
            expect(() => {
              field.validate([1, 2])
            }).not.toThrow()
          })
        })
        describe('with items < minItems', () => {
          it('should throw FielMinItemsError', () => {
            expect(() => {
              field.validate([])
            }).toThrow(FieldMinItemsError)
          })
        })
      })
    })

    describe('with minLength', () => {
      describe('minLength: Number', () => {
        const field = new SchemaField('field', { minLength: 5 })

        describe('with string', () => {
          describe('with length lower than minLength', () => {
            it('should throw FieldMinLengthError', () => {
              expect(() => {
                field.validate('')
              })
                .toThrow(FieldMinLengthError)
            })
          })

          describe('with length equal to minLength', () => {
            it('should not throw FieldMinLengthError', () => {
              expect(() => {
                field.validate('00000')
              })
                .not.toThrow()
            })
          })

          describe('with length higher than minLength', () => {
            it('should not throw FieldMinLengthError', () => {
              expect(() => {
                field.validate('000000')
              })
                .not.toThrow()
            })
          })
        })

        describe('with array', () => {
          describe('with length lower than minLength', () => {
            it('should throw FieldMinLengthError', () => {
              expect(() => {
                field.validate([])
              })
                .toThrow(FieldMinLengthError)
            })
          })

          describe('with length equal to minLength', () => {
            it('should not throw FieldMinLengthError', () => {
              expect(() => {
                field.validate([0, 0, 0, 0, 0])
              })
                .not.toThrow()
            })
          })

          describe('with length higher than minLength', () => {
            it('should not throw FieldMinLengthError', () => {
              expect(() => {
                field.validate([0, 0, 0, 0, 0, 0])
              })
                .not.toThrow()
            })
          })
        })
      })

      // todo add tests with minLength: Function
    })

    describe('with minWords', () => {
      describe('minWords: Number', () => {
        const field = new SchemaField('field', { minWords: 5 })

        describe('with length lower than minWords', () => {
          it('should throw FieldMinWordsError', () => {
            expect(() => {
              field.validate('')
            }).toThrow(FieldMinWordsError)
          })
        })

        describe('with length equal to minWords', () => {
          it('should not throw FieldMinWordsError', () => {
            expect(() => {
              field.validate('0 0 0 0 0')
            }).not.toThrow()
          })
        })

        describe('with length higher than minWords', () => {
          it('should throw FieldMinWordsError', () => {
            expect(() => {
              field.validate('0 0 0 0 0 0')
            }).not.toThrow()
          })
        })
      })
    })

    describe('with multipleOf', () => {
      describe('multipleOf: 2', () => {
        const field = new SchemaField('field', {
          multipleOf: 2
        })

        describe('with zero', () => {
          it('should not throw an Error', () => {
            expect(() => {
              field.validate(0)
            }).not.toThrow()
          })
        })

        describe('with a value that is a multiple', () => {
          it('should not throw an Error', () => {
            expect(() => {
              field.validate(2)
            }).not.toThrow()
            expect(() => {
              field.validate(4)
            }).not.toThrow()
            expect(() => {
              field.validate(6)
            }).not.toThrow()
            expect(() => {
              field.validate(8)
            }).not.toThrow()
          })
        })

        describe('with a value that is not a multiple', () => {
          it('should throw a FieldMultipleOfError', () => {
            expect(() => {
              field.validate(1)
            }).toThrow(FieldMultipleOfError)
            expect(() => {
              field.validate(3)
            }).toThrow(FieldMultipleOfError)
            expect(() => {
              field.validate(5)
            }).toThrow(FieldMultipleOfError)
            expect(() => {
              field.validate(7)
            }).toThrow(FieldMultipleOfError)
          })
        })
      })
    })

    describe('with pattern', () => {
      describe('pattern: String', () => {
        const patternField = new SchemaField('field', {
          pattern: '^[01]+$'
        })

        describe('with incorrect value', () => {
          it('should throw FieldPatternError', () => {
            expect(() => {
              patternField.validate('12345')
            })
              .toThrow(FieldPatternError)
          })
        })

        describe('with correct value', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              patternField.validate('01101')
            })
              .not.toThrow()
          })
        })

        describe('with undefined', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              patternField.validate(undefined)
            })
              .not.toThrow()
          })
        })
      })

      describe('pattern: RegExp', () => {
        const patternField = new SchemaField('field', {
          pattern: /^[01]+$/
        })

        describe('with incorrect value', () => {
          it('should throw FieldPatternError', () => {
            expect(() => {
              patternField.validate('12345')
            })
              .toThrow(FieldPatternError)
          })
        })

        describe('with correct value', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              patternField.validate('01101')
            })
              .not.toThrow()
          })
        })

        describe('with undefined', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              patternField.validate(undefined)
            })
              .not.toThrow()
          })
        })
      })
    })

    describe('with required', () => {
      describe('required: true', () => {
        const requiredField = new SchemaField('field', {
          required: true
        })

        describe('with undefined', () => {
          it('should throw FieldRequiredError', () => {
            expect(() => {
              requiredField.validate(undefined)
            })
              .toThrow(FieldRequiredError)
          })
        })

        describe('with null', () => {
          it('should throw FieldRequiredError', () => {
            expect(() => {
              requiredField.validate(null)
            })
              .toThrow(FieldRequiredError)
          })
        })

        describe('with empty string', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              requiredField.validate('')
            })
              .not.toThrow()
          })
        })

        describe('with boolean', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              requiredField.validate(false)
            })
              .not.toThrow()
          })
        })

        describe('with number', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              requiredField.validate(1337)
            })
              .not.toThrow()
          })
        })
      })

      describe('required: false', () => {
        const optionalField = new SchemaField('field', {
          required: false
        })

        describe('with undefined', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              optionalField.validate(undefined)
            })
              .not.toThrow()
          })
        })

        describe('with null', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              optionalField.validate(null)
            })
              .not.toThrow()
          })
        })

        describe('with empty string', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              optionalField.validate('')
            })
              .not.toThrow()
          })
        })

        describe('with boolean', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              optionalField.validate(false)
            })
              .not.toThrow()
          })
        })

        describe('with number', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              optionalField.validate(1337)
            })
              .not.toThrow()
          })
        })
      })
    })

    describe('with type', () => {
      describe('type: ["boolean"]', () => {
        const booleanArrayField = new SchemaField('field', {
          type: ['boolean']
        })

        describe('with boolean values', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              booleanArrayField.validate([true, false, false])
            })
              .not.toThrow()
          })
        })

        describe('with mixed values', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              booleanArrayField.validate([true, 100, 'false'])
            }).toThrow(FieldTypeError)
          })
        })
      })

      describe('type: ["number"]', () => {
        const numberArrayField = new SchemaField('field', {
          type: ['number']
        })

        describe('with number values', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              numberArrayField.validate([0, 1, 2])
            })
              .not.toThrow()
          })
        })

        describe('with mixed values', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              numberArrayField.validate([true, 100, 'false'])
            })
              .toThrow(FieldTypeError)
          })
        })
      })

      describe('type: ["object"]', () => {
        const objectArrayField = new SchemaField('field', {
          type: ['object']
        })

        describe('with objects', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              objectArrayField.validate([{}, {}])
            })
              .not.toThrow()
          })
        })

        describe('with mixed values', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              objectArrayField.validate([{}, true, 100, 'false'])
            })
              .toThrow(FieldTypeError)
          })
        })
      })

      describe('type: ["string"]', () => {
        const stringArrayField = new SchemaField('field', {
          type: ['string']
        })

        describe('with string values', () => {
          it('should not throw FieldTypeError', () => {
            const result = () => {
              stringArrayField.validate(['a', 'b', 'c'])
            }
            expect(result).not.toThrow()
          })
        })

        describe('with mixed values', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              stringArrayField.validate([true, 100, 'false'])
            })
              .toThrow(FieldTypeError)
          })
        })
      })

      describe('type: "array"', () => {
        const arrayField = new SchemaField('field', {
          type: 'array'
        })

        describe('with array', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              arrayField.validate([])
            })
              .not.toThrow()

            const field1 = new SchemaField('field', {
              type: 'array',
              items: { type: 'number' }
            })
            expect(() => {
              field1.validate([0, 1])
            })
              .not.toThrow()
          })
        })

        describe('with boolean', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              arrayField.validate(true)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with number', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              arrayField.validate(1337)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with object', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              arrayField.validate({})
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with string', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              arrayField.validate('abc')
            })
              .toThrow(FieldTypeError)
          })
        })
      })

      describe('type: "boolean"', () => {
        const booleanField = new SchemaField('field', {
          type: 'boolean'
        })

        describe('with boolean', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              booleanField.validate(true)
            })
              .not.toThrow()
          })
        })

        describe('with array', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              booleanField.validate([])
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with number', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              booleanField.validate(1337)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with object', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              booleanField.validate({})
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with string', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              booleanField.validate('abc')
            })
              .toThrow(FieldTypeError)
          })
        })
      })

      describe('type: "integer"', () => {
        const integerField = new SchemaField('field', {
          type: 'integer'
        })

        describe('with integer', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              integerField.validate(1337)
            })
              .not.toThrow()
          })
        })

        describe('with float', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              integerField.validate(99.99)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with array', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              integerField.validate([])
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with boolean', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              integerField.validate(true)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with object', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              integerField.validate({})
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with string', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              integerField.validate('abc')
            })
              .toThrow(FieldTypeError)
          })
        })
      })

      describe('type: "number"', () => {
        const numberField = new SchemaField('field', {
          type: 'number'
        })

        describe('with integer', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              numberField.validate(1337)
            })
              .not.toThrow()
          })
        })

        describe('with float', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              numberField.validate(99.99)
            })
              .not.toThrow()
          })
        })

        describe('with array', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              numberField.validate([])
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with boolean', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              numberField.validate(true)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with object', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              numberField.validate({})
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with string', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              numberField.validate('abc')
            })
              .toThrow(FieldTypeError)
          })
        })
      })

      describe('type: "object"', () => {
        const objectField = new SchemaField('field', {
          type: 'object'
        })

        // todo v5: throw error
        // describe('with null', () => {
        //   it('should throw FieldTypeError', () => {
        //     expect(() => {
        //       objectField.validate(null)
        //     })
        //       .toThrow(FieldTypeError)
        //   })
        // })

        describe('with object', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              objectField.validate({})
            })
              .not.toThrow()
          })
        })

        describe('with array', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              objectField.validate([])
            })
              // todo v5: throw error
              .not.toThrow()
          })
        })

        describe('with boolean', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              objectField.validate(true)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with number', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              objectField.validate(1337)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with string', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              objectField.validate('abc')
            })
              .toThrow(FieldTypeError)
          })
        })
      })

      describe('type: "string"', () => {
        const stringField = new SchemaField('field', {
          type: 'string'
        })

        describe('with string', () => {
          it('should not throw FieldTypeError', () => {
            expect(() => {
              stringField.validate('abc')
            })
              .not.toThrow()
          })
        })

        describe('with array', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              stringField.validate([])
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with boolean', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              stringField.validate(true)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with number', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              stringField.validate(1337)
            })
              .toThrow(FieldTypeError)
          })
        })

        describe('with object', () => {
          it('should throw FieldTypeError', () => {
            expect(() => {
              stringField.validate({})
            })
              .toThrow(FieldTypeError)
          })
        })
      })
    })

    describe('with uniqueItems', () => {
      describe('uniqueItems: true', () => {
        const uniqueItemsField = new SchemaField('field', {
          uniqueItems: true
        })

        describe('with unique items', () => {
          it('should not throw FieldError', () => {
            expect(() => {
              uniqueItemsField.validate([1, 2, 3])
            })
              .not.toThrow()
          })
        })

        describe('with duplicate items', () => {
          it('should throw FieldError', () => {
            expect(() => {
              uniqueItemsField.validate([1, 2, 2])
            }).toThrow(FieldUniqueItemsError)
          })
        })

        describe('with non array value', () => {
          it('should not throw Error', () => {
            expect(() => {
              uniqueItemsField.validate(123)
            }).not.toThrow()
            expect(() => {
              uniqueItemsField.validate('test')
            }).not.toThrow()
            expect(() => {
              uniqueItemsField.validate(true)
            }).not.toThrow()
            expect(() => {
              uniqueItemsField.validate({})
            }).not.toThrow()
            expect(() => {
              uniqueItemsField.validate(null)
            }).not.toThrow()
          })
        })
      })

      describe('uniqueItems: false', () => {
        const uniqueItemsField = new SchemaField('field', {
          uniqueItems: false
        })

        describe('with unique items', () => {
          it('should not throw FieldError', () => {
            expect(() => {
              uniqueItemsField.validate([1, 2, 3])
            })
              .not.toThrow()
          })
        })

        describe('with duplicate items', () => {
          it('should not throw FieldError', () => {
            expect(() => {
              uniqueItemsField.validate([1, 2, 2])
            }).not.toThrow()
          })
        })
      })
    })

    // todo add tests to check rootOnly option
  })
})
