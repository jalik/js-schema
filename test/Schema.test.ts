/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import FieldRequiredError from '../src/errors/FieldRequiredError'
import FieldUnknownError from '../src/errors/FieldUnknownError'
import ValidationError from '../src/errors/ValidationError'
import Schema from '../src/Schema'
import FieldResolutionError from '../src/errors/FieldResolutionError'

describe('Schema', () => {
  const StringSchema = new Schema({
    string: {
      type: 'string',
      required: true
    }
  })

  const BaseSchema = new Schema({
    array: {
      type: ['number'],
      required: true
    },
    boolean: {
      type: 'boolean'
    },
    date: {
      type: 'function',
      parse (value) {
        const [year, month, day] = value.split('-')
        return new Date(year, parseInt(month, 10) - 1, day)
      }
    },
    embedded: {
      type: StringSchema
    },
    embeddedArray: {
      type: 'array',
      items: { type: StringSchema }
    },
    number: {
      type: 'number',
      required: true
    },
    string: {
      type: 'string',
      required: true
    }
  })

  it('should be importable from package', () => {
    expect(typeof Schema).toEqual('function')
  })

  describe('clone()', () => {
    it('should create a copy of the schema', () => {
      expect(BaseSchema.clone()).not.toBe(BaseSchema)
      expect(BaseSchema.clone().getFields()).toMatchObject(BaseSchema.getFields())
    })
  })

  describe('extend(schema)', () => {
    const NewSchema = new Schema({
      a: { type: 'string' }
    })
    const ExtendedSchema = NewSchema.extend({
      b: { type: 'string' }
    })

    it('should create an extended version of the schema', () => {
      expect(ExtendedSchema.getField('a')).toBeDefined()
      expect(ExtendedSchema.getField('b')).toBeDefined()
    })

    it('should not modify parent schema', () => {
      expect(BaseSchema.getField(
        // @ts-expect-error key not defined
        'b'
      )).toBeUndefined()
    })
  })

  describe('getErrors(object, options)', () => {
    describe('with valid object', () => {
      const object = {
        number: 1,
        string: 'string'
      }
      const errors = BaseSchema.getErrors(object)

      it('should return nothing', () => {
        expect(errors).toBeUndefined()
      })

      it('should not throw an error', () => {
        expect(() => BaseSchema.getErrors(object)).not.toThrow()
      })
    })
    describe('with invalid object', () => {
      const object = {}
      const errors = BaseSchema.getErrors(object)

      it('should return errors', () => {
        expect(errors).toBeDefined()
        expect(errors?.number).toBeInstanceOf(FieldRequiredError)
        expect(errors?.string).toBeInstanceOf(FieldRequiredError)
      })

      it('should not throw an error', () => {
        expect(() => BaseSchema.getErrors(object)).not.toThrow()
      })
    })
  })

  describe('getField(name)', () => {
    describe('with valid field name', () => {
      it('should return field properties', () => {
        expect(() => BaseSchema.getField('string').getType()).not.toThrow()
      })
    })

    describe('with invalid field name', () => {
      it('should throw an error', () => {
        expect(() => BaseSchema.getField(
          // @ts-expect-error key not defined
          'unknown'
        ).getType()).toThrow()
      })
    })
  })

  describe('getFields()', () => {
    it('should return all fields', () => {
      expect(BaseSchema.getFields()).toMatchObject(BaseSchema.fields)
    })
  })

  describe('parse(object)', () => {
    it('should parse boolean fields', () => {
      expect(BaseSchema.parse({ boolean: 'true' })).toEqual({ boolean: true })
      expect(BaseSchema.parse({ boolean: 'FALSE' })).toEqual({ boolean: false })
      expect(BaseSchema.parse({ boolean: 'TRUE' })).toEqual({ boolean: true })
    })

    it('should parse number fields', () => {
      expect(BaseSchema.parse({ number: '01010' })).toEqual({ number: 1010 })
      expect(BaseSchema.parse({ number: '12345' })).toEqual({ number: 12345 })
      expect(BaseSchema.parse({ number: '99.99' })).toEqual({ number: 99.99 })
    })

    it('should parse fields using custom function if present', () => {
      const object = { date: '2018-04-05' }
      const result = { date: new Date(2018, 3, 5) }
      expect(BaseSchema.parse(object)).toMatchObject(result)
    })
  })

  describe('removeUnknownFields(object)', () => {
    it('should remove unknown fields', () => {
      const object = {
        string: 'test',
        unknown: true
      }
      const result = {
        string: object.string
      }
      expect(BaseSchema.removeUnknownFields(object)).toMatchObject(result)
    })

    it('should remove nested unknown fields', () => {
      const object = {
        string: 'test',
        embedded: {
          string: 'test',
          unknown: true
        }
      }
      const result = {
        string: 'test',
        embedded: { string: 'test' }
      }
      expect(BaseSchema.removeUnknownFields(object)).toMatchObject(result)
    })

    it('should remove nested unknown fields in arrays', () => {
      const object = {
        embeddedArray: [{
          string: 'test',
          unknown: true
        }]
      }
      const result = {
        embeddedArray: [{ string: 'test' }]
      }
      expect(BaseSchema.removeUnknownFields(object)).toMatchObject(result)
    })
  })

  describe('resolveField(name)', () => {
    const PhoneSchema = new Schema({
      number: { type: 'string' }
    })
    const ChildSchema = new Schema({
      phones: {
        type: 'array',
        items: { type: PhoneSchema }
      }
    })
    const ParentSchema = new Schema({
      child: {
        type: 'array',
        items: { type: ChildSchema }
      }
    })
    const EmailSchema = new Schema({
      address: { type: 'string' }
    })
    const UserSchema = new Schema({
      emails: {
        type: 'array',
        items: { type: EmailSchema }
      }
    })

    it('should return field properties with dot syntax', () => {
      expect(() => {
        UserSchema.resolveField('emails[0].address').getType()
      }).not.toThrow()

      expect(() => {
        ParentSchema.resolveField('child.phones.number').getType()
        ParentSchema.resolveField('child.phones[0].number').getType()
      }).not.toThrow()
    })

    it('should return field properties with bracket syntax', () => {
      expect(() => {
        ParentSchema.resolveField('child[phones][number]').getType()
        ParentSchema.resolveField('child[phones][0][number]').getType()
      }).not.toThrow()
    })

    it('should return field properties with mixed syntax (dot + bracket)', () => {
      expect(() => {
        ParentSchema.resolveField('child.phones[number]').getType()
        ParentSchema.resolveField('child.phones[0][number]').getType()
      }).not.toThrow()
    })

    describe('with invalid path', () => {
      it('should throw a FieldResolutionError', () => {
        expect(() => {
          ParentSchema.resolveField('child.unknown')
        }).toThrow(FieldResolutionError)
        expect(() => {
          ParentSchema.resolveField('child.phones[0].unknown')
        }).toThrow(FieldResolutionError)
      })
    })
  })

  describe('isValid()', () => {
    describe('with valid object', () => {
      it('should return true', () => {
        const result = BaseSchema.isValid({
          array: [],
          number: 1,
          string: ''
        })
        expect(result).toEqual(true)
      })
    })
    describe('with invalid object', () => {
      it('should return false', () => {
        const result = BaseSchema.isValid({})
        expect(result).toEqual(false)
      })
    })
  })

  describe('validate(object, options)', () => {
    describe('with invalid object', () => {
      it('should throw a ValidationError with errors details', () => {
        let error: any
        try {
          BaseSchema.validate({ embedded: {} })
        } catch (e) {
          error = e
        }
        expect(error).toBeInstanceOf(ValidationError)
        expect(error.errors).not.toBeUndefined()
        expect(error.errors.number).toBeInstanceOf(FieldRequiredError)
        expect(error.errors.string).toBeInstanceOf(FieldRequiredError)
        expect(error.errors['embedded.string']).toBeInstanceOf(FieldRequiredError)
        expect(error.errors['embedded.string'].path).toBe('embedded.string')
      })
    })

    describe('with ignoreMissing: Boolean', () => {
      describe('ignoreMissing: true', () => {
        it('should not throw an error for missing fields', () => {
          expect(() => {
            BaseSchema.validate({ string: 'abc' }, { ignoreMissing: true })
          }).not.toThrow()
        })

        it('should not use default value for undefined fields', () => {
          const obj = { number: 1 }
          BaseSchema.validate(obj, { ignoreMissing: true })
          expect(obj).toEqual({ number: 1 })
        })
      })

      describe('ignoreMissing: false', () => {
        it('should throw SchemaError', () => {
          expect(() => {
            BaseSchema.validate({}, { ignoreMissing: false })
          })
            .toThrow(ValidationError)
        })

        it('should use default value for undefined fields', () => {
          const obj = {
            number: 1,
            string: 'a'
          }
          const result = BaseSchema.validate(obj, { ignoreMissing: false })
          expect(result).toEqual({
            array: [],
            number: 1,
            string: 'a'
          })
        })

        it('should use default value for null fields', () => {
          const obj = {
            array: null,
            number: 1,
            string: 'a'
          }
          const result = BaseSchema.validate(obj, { ignoreMissing: false })
          expect(result).toEqual({
            array: [],
            number: 1,
            string: 'a'
          })
        })
      })
    })

    describe('with ignoreUnknown: Boolean', () => {
      describe('ignoreUnknown: true', () => {
        it('should not throw FieldUnknownError', () => {
          const obj = {
            string: 'abc',
            xxx: null
          }
          expect(() => {
            StringSchema.validate(obj, { ignoreUnknown: true })
          }).not.toThrow()
        })
        // todo check nested unknown fields
      })

      describe('ignoreUnknown: false', () => {
        it('should throw FieldUnknownError', () => {
          const obj = {
            string: 'abc',
            xxx: null
          }
          expect(() => {
            StringSchema.validate(obj, { ignoreUnknown: false })
          })
            .toThrow(FieldUnknownError)
        })
        // todo check nested unknown fields
      })
    })

    describe('with removeUnknown: Boolean', () => {
      describe('removeUnknown: true', () => {
        it('should remove unknown fields', () => {
          const obj = {
            string: 'abc',
            xxx: null
          }
          const result = StringSchema.validate(obj, { removeUnknown: true })
          expect(
            // @ts-ignore
            result.xxx
          ).toBeUndefined()
        })
        // todo check nested unknown fields
      })

      describe('removeUnknown: false', () => {
        it('should not remove unknown fields', () => {
          const obj = {
            string: 'abc',
            xxx: null
          }
          const result = StringSchema.validate(obj, {
            ignoreUnknown: true,
            removeUnknown: false
          })
          expect(
            // @ts-ignore
            result.xxx
          ).not.toBeUndefined()
        })
        // todo check nested unknown fields
      })
    })

    describe('with optional nested Schema containing required attributes', () => {
      const AddressSchema = new Schema({
        street: {
          type: 'string',
          required: true
        }
      })
      const PlaceSchema = new Schema({
        address: {
          type: AddressSchema
        }
      })

      describe('with nested object', () => {
        describe('containing required attributes', () => {
          it('should not throw an error', () => {
            expect(() => {
              PlaceSchema.validate({ address: { street: 'Paradise St.' } })
            }).not.toThrow()
          })
        })
        describe('not containing required attributes', () => {
          it('should throw an error', () => {
            expect(() => {
              PlaceSchema.validate({ address: { street: null } })
            }).toThrow()
            expect(() => {
              PlaceSchema.validate({ address: {} })
            }).toThrow()
          })
        })
      })

      describe('with nested object = null', () => {
        it('should not throw an error', () => {
          expect(() => {
            PlaceSchema.validate({ address: null }, { removeUnknown: true })
          }).not.toThrow()
        })
      })

      describe('without nested object', () => {
        it('should not throw an error', () => {
          expect(() => {
            PlaceSchema.validate({})
          }).not.toThrow()
        })
      })
    })
  })

  describe('omit(fieldNames)', () => {
    const NewSchema = new Schema({
      a: { type: 'string' },
      b: { type: 'boolean' },
      c: { type: 'number' }
    }).omit(['a', 'b'])

    it('should return a schema without excluded fields', () => {
      expect(NewSchema.getField(
        // @ts-expect-error key not defined
        'a'
      )).toBeUndefined()
      expect(NewSchema.getField(
        // @ts-expect-error key not defined
        'b'
      )).toBeUndefined()
    })

    it('should return a schema with non excluded fields', () => {
      expect(NewSchema.getField('c')).toBeDefined()
    })

    it('should not modify parent schema', () => {
      expect(() => BaseSchema.getField('string')).not.toThrow()
    })
  })

  describe('partial()', () => {
    const schema = new Schema({
      a: {
        type: 'string',
        required: true
      },
      b: {
        type: 'string',
        required: true
      }
    })
    const partial = schema.partial()

    it('should return a schema without required fields', () => {
      expect(partial.getField('a').isRequired()).toBeFalsy()
      expect(partial.getField('b').isRequired()).toBeFalsy()
    })

    it('should not modify parent schema', () => {
      expect(schema.getField('a').isRequired()).toBe(true)
    })
  })

  describe('required()', () => {
    const schema = new Schema({
      a: {
        type: 'string',
        required: false
      },
      b: {
        type: 'string'
      }
    })
    const required = schema.required()

    it('should return a schema with all fields required', () => {
      expect(required.getField('a').isRequired()).toBe(true)
      expect(required.getField('b').isRequired()).toBe(true)
    })

    it('should not modify parent schema', () => {
      expect(schema.getField('a').isRequired()).toBeFalsy()
      expect(schema.getField('a').isRequired()).toBeFalsy()
    })
  })
})
