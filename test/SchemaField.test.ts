/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import { ERROR_FIELD_REQUIRED } from '../src/errors'
import FieldAllowedError from '../src/errors/FieldAllowedError'
import FieldDeniedError from '../src/errors/FieldDeniedError'
import FieldError from '../src/errors/FieldError'
import FieldFormatError from '../src/errors/FieldFormatError'
import FieldLengthError from '../src/errors/FieldLengthError'
import FieldMaxError from '../src/errors/FieldMaxError'
import FieldMaxLengthError from '../src/errors/FieldMaxLengthError'
import FieldMaxWordsError from '../src/errors/FieldMaxWordsError'
import FieldMinError from '../src/errors/FieldMinError'
import FieldMinLengthError from '../src/errors/FieldMinLengthError'
import FieldMinWordsError from '../src/errors/FieldMinWordsError'
import FieldPatternError from '../src/errors/FieldPatternError'
import FieldRequiredError from '../src/errors/FieldRequiredError'
import FieldTypeError from '../src/errors/FieldTypeError'
import ValidationError from '../src/errors/ValidationError'
import SchemaField from '../src/SchemaField'

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

  describe('getAllowed()', () => {
    describe('with allowed: Array', () => {
      it('should return an array', () => {
        const field = new SchemaField('field', { allowed: [1, 0] })
        expect(field.getAllowed()).toStrictEqual([1, 0])
      })
    })

    describe('with allowed: undefined', () => {
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

  describe('getLabel()', () => {
    describe('with label: String', () => {
      it('should return label', () => {
        const field = new SchemaField('field', { label: 'My Field' })
        expect(field.getLabel()).toEqual('My Field')
      })
    })

    describe('with label: undefined', () => {
      it('should return field\'s name', () => {
        const field = new SchemaField('field', {})
        expect(field.getLabel()).toBe('field')
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

  describe('getMax()', () => {
    describe('with max: Number', () => {
      it('should return a number', () => {
        const field = new SchemaField('field', { max: 30 })
        expect(field.getMax()).toBe(30)
      })
    })

    describe('with max: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getMax()).toBeUndefined()
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

  describe('getMin()', () => {
    describe('with min: Number', () => {
      it('should return a number', () => {
        const field = new SchemaField('field', { min: 30 })
        expect(field.getMin()).toBe(30)
      })
    })

    describe('with min: undefined', () => {
      it('should return undefined', () => {
        const field = new SchemaField('field', {})
        expect(field.getMin()).toBeUndefined()
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
    describe('with type: String', () => {
      it('should return a string', () => {
        const field = new SchemaField('field', { type: 'string' })
        expect(field.getType()).toBe('string')
      })
    })

    describe('with type: undefined', () => {
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
        expect(field.parse<Date>('2018-04-05').getTime())
          .toBe(new Date(2018, 3, 5).getTime())
      })
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

  describe('validate(object)', () => {
    describe('with incorrect value', () => {
      const field = new SchemaField('field', { required: true })
      let error

      try {
        field.validate(undefined)
      } catch (e) {
        error = e
      }

      it('should throw FieldError', () => {
        expect(error).toBeInstanceOf(FieldRequiredError)
        expect(error).not.toBeUndefined()
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

    describe('with allowed and denied', () => {
      it('should throw TypeError', () => {
        expect(() => (
          new SchemaField('field', {
            allowed: ['red'],
            denied: ['blue']
          })
        )).toThrow(TypeError)
      })
    })

    describe('with allowed: (Array|Function)', () => {
      describe('allowed: Array', () => {
        const field = new SchemaField('field', { allowed: ['off', 'on'] })

        describe('with Array', () => {
          describe('with allowed values', () => {
            it('should not throw FieldAllowedError', () => {
              expect(() => {
                field.validate(['on'])
              })
                .not.toThrow(FieldAllowedError)
            })
          })

          describe('without allowed values', () => {
            it('should throw FieldAllowedError', () => {
              expect(() => {
                field.validate(['yes'])
              })
                .toThrow(FieldAllowedError)
            })
          })
        })
      })

      describe('allowed: Function', () => {
        const field = new SchemaField('field', {
          allowed: () => (['off', 'on'])
        })

        describe('with allowed values', () => {
          it('should not throw FieldAllowedError', () => {
            expect(() => {
              field.validate(['on'])
            })
              .not.toThrow(FieldAllowedError)
          })
        })

        describe('without allowed values', () => {
          it('should throw FieldAllowedError', () => {
            expect(() => {
              field.validate(['yes'])
            })
              .toThrow(FieldAllowedError)
          })
        })
      })
    })

    describe('with check: Function', () => {
      describe('check: Function', () => {
        const field = new SchemaField('field', {
          check: (value) => value % 2 === 0
        })

        describe('with correct value', () => {
          it('should not throw FieldError', () => {
            expect(() => {
              field.validate(2)
            })
              .not.toThrow(FieldError)
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

    describe('with denied: (Array|Function)', () => {
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
              .not.toThrow(FieldDeniedError)
          })
        })
      })

      describe('denied: Function', () => {
        const field = new SchemaField('field', {
          denied: () => (['off', 'on'])
        })

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
              .not.toThrow(FieldDeniedError)
          })
        })
      })
    })

    describe('with items: (Object)', () => {
      describe('items.type: "boolean"', () => {
        const field = new SchemaField('field', {
          items: { type: 'boolean' }
        })

        describe('with boolean values', () => {
          it('should not throw ValidationError', () => {
            expect(() => {
              field.validate([true, false])
            })
              .not.toThrow(ValidationError)
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
              .not.toThrow(ValidationError)
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
              .not.toThrow(ValidationError)
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
              .not.toThrow(ValidationError)
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

    describe('with length: (Number|Function)', () => {
      const field = new SchemaField('field', { length: 2 })

      describe('length: Number', () => {
        describe('with array of correct length', () => {
          it('should not throw FieldLengthError', () => {
            expect(() => {
              field.validate([1, 2])
            })
              .not.toThrow(FieldLengthError)
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
              .not.toThrow(FieldLengthError)
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
              .not.toThrow(FieldLengthError)
          })
        })
      })

      // todo add tests with length: Function
    })

    describe('with format: (String)', () => {
      describe('format: "date"', () => {
        const field = new SchemaField('field', { format: 'date' })

        describe('with string of correct format', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13')
            })
              .not.toThrow(FieldFormatError)
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
              .not.toThrow(FieldFormatError)
          })
        })

        describe('with string containing fraction of seconds and not timezone offset', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13T10:00:00.000')
            })
              .not.toThrow(FieldFormatError)
          })
        })

        describe('with string containing timezone offset and no fraction of seconds', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13T10:00:00-10:00')
            })
              .not.toThrow(FieldFormatError)
          })
        })

        describe('with string containing timezone offset and fraction of seconds', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13T23:59:59.999-10:00')
            })
              .not.toThrow(FieldFormatError)
          })
        })

        describe('with string of correct format containing Z offset', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('2020-05-13T10:00:00Z')
            })
              .not.toThrow(FieldFormatError)
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
              .not.toThrow(FieldFormatError)
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
              .not.toThrow(FieldFormatError)
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
              .not.toThrow(FieldFormatError)
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
              .not.toThrow(FieldFormatError)
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
              .not.toThrow(FieldFormatError)
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
              .not.toThrow(FieldFormatError)
          })
        })

        describe('with string of correct format containing second fraction', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('12:30:42.000-10:00')
            })
              .not.toThrow(FieldFormatError)
          })
        })

        describe('with string of correct format containing Z offset', () => {
          it('should not throw FieldFormatError', () => {
            expect(() => {
              field.validate('12:30:42Z')
            })
              .not.toThrow(FieldFormatError)
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
              .not.toThrow(FieldFormatError)
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

    describe('with max: (Number|Date|Function)', () => {
      describe('max: Number', () => {
        const field = new SchemaField('field', { max: 0 })

        describe('with number', () => {
          describe('with value higher than max', () => {
            it('should throw FieldMaxError', () => {
              expect(() => {
                field.validate(10)
              })
                .toThrow(FieldMaxError)
            })
          })

          describe('with value equal to max', () => {
            it('should not throw FieldMaxError', () => {
              expect(() => {
                field.validate(0)
              })
                .not.toThrow(FieldMaxError)
            })
          })

          describe('with value lower than max', () => {
            it('should not throw FieldMaxError', () => {
              expect(() => {
                field.validate(-10)
              })
                .not.toThrow(FieldMaxError)
            })
          })
        })

        describe('with array', () => {
          describe('with values higher than max', () => {
            it('should throw FieldMaxError', () => {
              expect(() => {
                field.validate([10])
              })
                .toThrow(FieldMaxError)
            })
          })

          describe('with values equal to max', () => {
            it('should not throw FieldMaxError', () => {
              expect(() => {
                field.validate([0])
              })
                .not.toThrow(FieldMaxError)
            })
          })

          describe('with values lower than max', () => {
            it('should not throw FieldMaxError', () => {
              expect(() => {
                field.validate([-10])
              })
                .not.toThrow(FieldMaxError)
            })
          })
        })
      })

      describe('max: Date', () => {
        const date = new Date()
        const field = new SchemaField('field', { max: date })

        describe('with date higher than max', () => {
          it('should throw FieldMaxError', () => {
            expect(() => {
              field.validate(new Date(date.getTime() + 1000))
            })
              .toThrow(FieldMaxError)
          })
        })

        describe('with date equal to max', () => {
          it('should not throw FieldMaxError', () => {
            expect(() => {
              field.validate(date)
            })
              .not.toThrow(FieldMaxError)
          })
        })

        describe('with date lower than max', () => {
          it('should not throw FieldMaxError', () => {
            expect(() => {
              field.validate(new Date(date.getTime() - 1000))
            })
              .not.toThrow(FieldMaxError)
          })
        })
      })

      // todo add tests with max: Function
    })

    describe('with maxLength: (Number|Function)', () => {
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
                .not.toThrow(FieldMaxLengthError)
            })
          })

          describe('with length lower than maxLength', () => {
            it('should not throw FieldMaxLengthError', () => {
              expect(() => {
                field.validate('')
              })
                .not.toThrow(FieldMaxLengthError)
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
                .not.toThrow(FieldMaxLengthError)
            })
          })

          describe('with length lower than maxLength', () => {
            it('should not throw FieldMaxLengthError', () => {
              expect(() => {
                field.validate([])
              })
                .not.toThrow(FieldMaxLengthError)
            })
          })
        })
      })

      // todo add tests with maxLength: Function
    })

    describe('with maxWords: (Number|Function)', () => {
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
              .not.toThrow(FieldMaxWordsError)
          })
        })

        describe('with length lower than maxWords', () => {
          it('should not throw FieldMaxWordsError', () => {
            expect(() => {
              field.validate('')
            })
              .not.toThrow(FieldMaxWordsError)
          })
        })
      })

      // todo add tests with maxWords: Function
    })

    describe('with min: (Number|Date|Function)', () => {
      describe('min: Number', () => {
        const field = new SchemaField('field', { min: 0 })

        describe('with number', () => {
          describe('with value lower than min', () => {
            it('should throw FieldMinError', () => {
              expect(() => {
                field.validate(-10)
              })
                .toThrow(FieldMinError)
            })
          })

          describe('with value equal to min', () => {
            it('should not throw FieldMinError', () => {
              expect(() => {
                field.validate(0)
              })
                .not.toThrow(FieldMinError)
            })
          })

          describe('with value higher than min', () => {
            it('should not throw FieldMinError', () => {
              expect(() => {
                field.validate(10)
              })
                .not.toThrow(FieldMinError)
            })
          })
        })

        describe('with array', () => {
          describe('with values lower than min', () => {
            it('should throw FieldMinError', () => {
              expect(() => {
                field.validate([-10])
              })
                .toThrow(FieldMinError)
            })
          })

          describe('with values equal to min', () => {
            it('should not throw FieldMinError', () => {
              expect(() => {
                field.validate([0])
              })
                .not.toThrow(FieldMinError)
            })
          })

          describe('with values higher than min', () => {
            it('should not throw FieldMinError', () => {
              expect(() => {
                field.validate([10])
              })
                .not.toThrow(FieldMinError)
            })
          })
        })
      })

      describe('min: Date', () => {
        const date = new Date()
        const field = new SchemaField('field', { min: date })

        describe('with date lower than min', () => {
          it('should throw FieldMinError', () => {
            expect(() => {
              field.validate(new Date(date.getTime() - 1000))
            })
              .toThrow(FieldMinError)
          })
        })

        describe('with date equal to min', () => {
          it('should not throw FieldMinError', () => {
            expect(() => {
              field.validate(date)
            })
              .not.toThrow(FieldMinError)
          })
        })

        describe('with date higher than min', () => {
          it('should not throw FieldMinError', () => {
            expect(() => {
              field.validate(new Date(date.getTime() + 1000))
            })
              .not.toThrow(FieldMinError)
          })
        })
      })

      // todo add tests with min: Function
    })

    describe('with minLength: (Number|Function)', () => {
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
                .not.toThrow(FieldMinLengthError)
            })
          })

          describe('with length higher than minLength', () => {
            it('should not throw FieldMinLengthError', () => {
              expect(() => {
                field.validate('000000')
              })
                .not.toThrow(FieldMinLengthError)
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
                .not.toThrow(FieldMinLengthError)
            })
          })

          describe('with length higher than minLength', () => {
            it('should not throw FieldMinLengthError', () => {
              expect(() => {
                field.validate([0, 0, 0, 0, 0, 0])
              })
                .not.toThrow(FieldMinLengthError)
            })
          })
        })
      })

      // todo add tests with minLength: Function
    })

    describe('with minWords: (Number|Function)', () => {
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
            }).not.toThrow(FieldMinWordsError)
          })
        })

        describe('with length higher than minWords', () => {
          it('should throw FieldMinWordsError', () => {
            expect(() => {
              field.validate('0 0 0 0 0 0')
            }).not.toThrow(FieldMinWordsError)
          })
        })
      })

      describe('minWords: Function', () => {
        const field = new SchemaField('field', { minWords: () => 5 })

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
            }).not.toThrow(FieldMinWordsError)
          })
        })

        describe('with length higher than minWords', () => {
          it('should throw FieldMinWordsError', () => {
            expect(() => {
              field.validate('0 0 0 0 0 0')
            }).not.toThrow(FieldMinWordsError)
          })
        })
      })
    })

    describe('with pattern: (String|RegExp|Function)', () => {
      describe('pattern: String', () => {
        const field = new SchemaField('field', { pattern: '^[01]+$' })

        describe('with incorrect value', () => {
          it('should throw FieldPatternError', () => {
            expect(() => {
              field.validate('12345')
            })
              .toThrow(FieldPatternError)
          })
        })

        describe('with correct value', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              field.validate('01101')
            })
              .not.toThrow(FieldPatternError)
          })
        })

        describe('with undefined', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              field.validate(undefined)
            })
              .not.toThrow(FieldPatternError)
          })
        })
      })

      describe('pattern: RegExp', () => {
        const field = new SchemaField('field', { pattern: /^[01]+$/ })

        describe('with incorrect value', () => {
          it('should throw FieldPatternError', () => {
            expect(() => {
              field.validate('12345')
            })
              .toThrow(FieldPatternError)
          })
        })

        describe('with correct value', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              field.validate('01101')
            })
              .not.toThrow(FieldPatternError)
          })
        })

        describe('with undefined', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              field.validate(undefined)
            })
              .not.toThrow(FieldPatternError)
          })
        })
      })

      describe('pattern: Function', () => {
        const options = { context: { basic: true } }
        const field = new SchemaField('field', {
          pattern: (context) => (context.basic ? /^[a-z0-9]+$/ : /^[a-z0-9_-]+$/)
        })

        describe('with incorrect value', () => {
          it('should throw FieldPatternError', () => {
            expect(() => {
              field.validate('abc_123', options)
            })
              .toThrow(FieldPatternError)
          })
        })

        describe('with correct value', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              field.validate('abc123', options)
            })
              .not.toThrow(FieldPatternError)
          })
        })

        describe('with undefined', () => {
          it('should not throw FieldPatternError', () => {
            expect(() => {
              field.validate(undefined, options)
            })
              .not.toThrow(FieldPatternError)
          })
        })
      })
    })

    describe('with required: (Boolean|Function)', () => {
      describe('required: true', () => {
        const field = new SchemaField('field', { required: true })

        describe('with undefined', () => {
          it('should throw FieldRequiredError', () => {
            expect(() => {
              field.validate(undefined)
            })
              .toThrow(FieldRequiredError)
          })
        })

        describe('with null', () => {
          it('should throw FieldRequiredError', () => {
            expect(() => {
              field.validate(null)
            })
              .toThrow(FieldRequiredError)
          })
        })

        describe('with empty string', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              field.validate('')
            })
              .not.toThrow(FieldRequiredError)
          })
        })

        describe('with boolean', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              field.validate(false)
            })
              .not.toThrow(FieldRequiredError)
          })
        })

        describe('with number', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              field.validate(1337)
            })
              .not.toThrow(FieldRequiredError)
          })
        })
      })

      describe('required: false', () => {
        const field = new SchemaField('field', { required: false })

        describe('with undefined', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              field.validate(undefined)
            })
              .not.toThrow(FieldRequiredError)
          })
        })

        describe('with null', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              field.validate(null)
            })
              .not.toThrow(FieldRequiredError)
          })
        })

        describe('with empty string', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              field.validate('')
            })
              .not.toThrow(FieldRequiredError)
          })
        })

        describe('with boolean', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              field.validate(false)
            })
              .not.toThrow(FieldRequiredError)
          })
        })

        describe('with number', () => {
          it('should not throw FieldRequiredError', () => {
            expect(() => {
              field.validate(1337)
            })
              .not.toThrow(FieldRequiredError)
          })
        })
      })

      describe('required: Function', () => {
        const options = { context: { checked: true } }
        const field = new SchemaField('field', {
          required: (context) => context.checked === true
        })

        describe('with undefined', () => {
          it('should throw FieldRequiredError', () => {
            expect(() => {
              field.validate(undefined, options)
            })
              .toThrow(FieldRequiredError)
          })
        })

        describe('with null', () => {
          it('should throw FieldRequiredError', () => {
            expect(() => {
              field.validate(null, options)
            })
              .toThrow(FieldRequiredError)
          })
        })
      })
    })

    describe('with type: (Array|String)', () => {
      describe('type: Array', () => {
        describe('type: ["boolean"]', () => {
          const field = new SchemaField('field', { type: ['boolean'] })

          describe('with boolean values', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate([true, false, false])
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with mixed values', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate([true, 100, 'false'])
              }).toThrow(FieldTypeError)
            })
          })
        })

        describe('type: ["number"]', () => {
          const field = new SchemaField('field', { type: ['number'] })

          describe('with number values', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate([0, 1, 2])
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with mixed values', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate([true, 100, 'false'])
              })
                .toThrow(FieldTypeError)
            })
          })
        })

        describe('type: ["object"]', () => {
          const field = new SchemaField('field', { type: ['object'] })

          describe('with objects', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate([{}, {}])
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with mixed values', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate([{}, true, 100, 'false'])
              })
                .toThrow(FieldTypeError)
            })
          })
        })

        describe('type: ["string"]', () => {
          const field = new SchemaField('field', { type: ['string'] })

          describe('with string values', () => {
            it('should not throw FieldTypeError', () => {
              const result = () => {
                field.validate(['a', 'b', 'c'])
              }
              expect(result).not.toThrow(FieldTypeError)
            })
          })

          describe('with mixed values', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate([true, 100, 'false'])
              })
                .toThrow(FieldTypeError)
            })
          })
        })
      })

      describe('type: String', () => {
        describe('type: "array"', () => {
          const field = new SchemaField('field', { type: 'array' })

          describe('with array', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate([])
              })
                .not.toThrow(FieldTypeError)

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
                field.validate(true)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with number', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(1337)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with object', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate({})
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with string', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate('abc')
              })
                .toThrow(FieldTypeError)
            })
          })
        })

        describe('type: "boolean"', () => {
          const field = new SchemaField('field', { type: 'boolean' })

          describe('with boolean', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate(true)
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with array', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate([])
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with number', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(1337)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with object', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate({})
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with string', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate('abc')
              })
                .toThrow(FieldTypeError)
            })
          })
        })

        describe('type: "integer"', () => {
          const field = new SchemaField('field', { type: 'integer' })

          describe('with integer', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate(1337)
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with array', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate([])
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with boolean', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(true)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with float', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(99.99)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with object', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate({})
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with string', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate('abc')
              })
                .toThrow(FieldTypeError)
            })
          })
        })

        describe('type: "number"', () => {
          const field = new SchemaField('field', { type: 'number' })

          describe('with integer', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate(1337)
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with float', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate(99.99)
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with array', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate([])
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with boolean', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(true)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with object', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate({})
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with string', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate('abc')
              })
                .toThrow(FieldTypeError)
            })
          })
        })

        describe('type: "object"', () => {
          const field = new SchemaField('field', { type: 'object' })

          describe('with object', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate({})
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with array', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate([])
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with boolean', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(true)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with number', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(1337)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with string', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate('abc')
              })
                .toThrow(FieldTypeError)
            })
          })
        })

        describe('type: "string"', () => {
          const field = new SchemaField('field', { type: 'string' })

          describe('with string', () => {
            it('should not throw FieldTypeError', () => {
              expect(() => {
                field.validate('abc')
              })
                .not.toThrow(FieldTypeError)
            })
          })

          describe('with array', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate([])
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with boolean', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(true)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with number', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate(1337)
              })
                .toThrow(FieldTypeError)
            })
          })

          describe('with object', () => {
            it('should throw FieldTypeError', () => {
              expect(() => {
                field.validate({})
              })
                .toThrow(FieldTypeError)
            })
          })
        })
      })
    })

    // todo add tests to check rootOnly option
  })
})
