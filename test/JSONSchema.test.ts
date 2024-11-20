/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import FieldRequiredError from '../src/errors/FieldRequiredError'
import ValidationError from '../src/errors/ValidationError'
import JSONSchema, { JSON_SCHEMA_DRAFT_2020_12, SchemaAttributes } from '../src/JSONSchema'
import InvalidPathError from '../src/errors/InvalidPathError'
import { ERROR_FIELD_TYPE } from '../src'
import FieldTypeError from '../src/errors/FieldTypeError'
import FieldAdditionalPropertiesError from '../src/errors/FieldAdditionalPropertiesError'
import FieldEnumError from '../src/errors/FieldEnumError'
import FieldDeniedError from '../src/errors/FieldDeniedError'
import FieldLengthError from '../src/errors/FieldLengthError'
import FieldFormatError from '../src/errors/FieldFormatError'
import FieldMaximumError from '../src/errors/FieldMaximumError'
import FieldMaxItemsError from '../src/errors/FieldMaxItemsError'
import FieldMaxLengthError from '../src/errors/FieldMaxLengthError'
import FieldMaxWordsError from '../src/errors/FieldMaxWordsError'
import FieldMinimumError from '../src/errors/FieldMinimumError'
import FieldMinItemsError from '../src/errors/FieldMinItemsError'
import FieldMinLengthError from '../src/errors/FieldMinLengthError'
import FieldMinWordsError from '../src/errors/FieldMinWordsError'
import FieldMultipleOfError from '../src/errors/FieldMultipleOfError'
import FieldPatternError from '../src/errors/FieldPatternError'
import FieldUniqueItemsError from '../src/errors/FieldUniqueItemsError'
import FieldExclusiveMaximumError from '../src/errors/FieldExclusiveMaxError'
import FieldExclusiveMinimumError from '../src/errors/FieldExclusiveMinError'
import SchemaError from '../src/errors/SchemaError'

it('should be importable from package', () => {
  expect(typeof JSONSchema).toEqual('function')
})

describe('constructor(attributes)', () => {
  describe('with unknown attributes', () => {
    it('should not throw', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new JSONSchema({
          type: 'string',
          unknown: true
        })
      }).not.toThrow()
    })
  })
})

describe('clone()', () => {
  it('should create a copy of the schema', () => {
    const schema = new JSONSchema({
      type: 'object',
      properties: {
        a: { type: 'string' }
      }
    })
    expect(schema.clone()).not.toBe(schema)
    expect(schema.clone().toJSON()).toMatchObject(schema.toJSON())
  })
})

describe('extend(attributes)', () => {
  const schema = new JSONSchema({
    type: 'object',
    properties: {
      a: { type: 'string' }
    }
  })
  const extendedSchema = schema.extend({
    additionalProperties: false,
    properties: {
      b: { type: 'string' }
    }
  })

  it('should contain existing props', () => {
    expect(extendedSchema.getType()).toBe(schema.getType())
  })

  it('should contain new props', () => {
    expect(extendedSchema.getAdditionalProperties()).toBe(false)
    expect(extendedSchema.getProperty('b')).toBeDefined()
  })

  it('should replace existing props', () => {
    expect(extendedSchema.getProperty(
      // @ts-expect-error key is not defined
      'a'
    )).toBeUndefined()
  })

  it('should not modify parent schema', () => {
    expect(schema.getProperty(
      // @ts-expect-error key not defined
      'b'
    )).toBeUndefined()
  })
})

// todo extendProperties(properties) tests

describe('getAdditionalProperties()', () => {
  describe('with additionalProperties = false', () => {
    it('should return the false', () => {
      const schema = new JSONSchema({ additionalProperties: false })
      expect(schema.getAdditionalProperties()).toBe(false)
    })
  })
  describe('with additionalProperties = object', () => {
    it('should return the object', () => {
      const schema = new JSONSchema({ additionalProperties: { type: 'string' } })
      expect(schema.getAdditionalProperties()).toStrictEqual({ type: 'string' })
    })
  })
  describe('with additionalProperties = undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getAdditionalProperties()).toBeUndefined()
    })
  })
})

describe('getDenied()', () => {
  describe('with denied: Array', () => {
    it('should return an array', () => {
      const schema = new JSONSchema({ denied: [1, 0] })
      expect(schema.getDenied()).toStrictEqual([1, 0])
    })
  })

  describe('with denied: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getDenied()).toBeUndefined()
    })
  })
})

describe('getEnum()', () => {
  describe('with enum = Array', () => {
    it('should return the array', () => {
      const schema = new JSONSchema({ enum: [1, 0] })
      expect(schema.getEnum()).toStrictEqual([1, 0])
    })
  })

  describe('with enum = undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getEnum()).toBeUndefined()
    })
  })
})

describe('getExclusiveMaximum()', () => {
  describe('with exclusiveMaximum = number', () => {
    it('should return exclusiveMaximum', () => {
      const schema = new JSONSchema({ exclusiveMaximum: 30 })
      expect(schema.getExclusiveMaximum()).toBe(30)
    })
  })

  describe('with exclusiveMaximum = undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getExclusiveMaximum()).toBeUndefined()
    })
  })
})

describe('getExclusiveMinimum()', () => {
  describe('with exclusiveMinimum = number', () => {
    it('should return exclusiveMinimum', () => {
      const schema = new JSONSchema({ exclusiveMinimum: 0 })
      expect(schema.getExclusiveMinimum()).toBe(0)
    })
  })

  describe('with exclusiveMinimum = undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getExclusiveMinimum()).toBeUndefined()
    })
  })
})

describe('getFormat()', () => {
  describe('with format: String', () => {
    it('should return format', () => {
      const schema = new JSONSchema({ format: 'date' })
      expect(schema.getFormat()).toEqual('date')
    })
  })

  describe('with format: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getFormat()).toBeUndefined()
    })
  })
})

describe('getItems()', () => {
  describe('with items: Object', () => {
    it('should return items', () => {
      const schema = new JSONSchema({ items: {} })
      expect(schema.getItems()).toEqual({})
    })
  })

  describe('with items: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getItems()).toBeUndefined()
    })
  })
})

describe('getLength()', () => {
  describe('with length: Number', () => {
    it('should return a number', () => {
      const schema = new JSONSchema({ length: 30 })
      expect(schema.getLength()).toBe(30)
    })
  })

  describe('with length: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getLength()).toBeUndefined()
    })
  })
})

describe('getMaxLength()', () => {
  describe('with maxLength: Number', () => {
    it('should return a number', () => {
      const schema = new JSONSchema({ maxLength: 30 })
      expect(schema.getMaxLength()).toBe(30)
    })
  })

  describe('with maxLength: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getMaxLength()).toBeUndefined()
    })
  })
})

describe('getMaximum()', () => {
  describe('with maximum = number', () => {
    it('should return maximum', () => {
      const schema = new JSONSchema({ maximum: 30 })
      expect(schema.getMaximum()).toBe(30)
    })
  })

  describe('with maximum = undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getMaximum()).toBeUndefined()
    })
  })
})

describe('getMaxWords()', () => {
  describe('with maxWords: Number', () => {
    it('should return a number', () => {
      const schema = new JSONSchema({ maxWords: 30 })
      expect(schema.getMaxWords()).toBe(30)
    })
  })

  describe('with maxWords: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getMaxWords()).toBeUndefined()
    })
  })
})

describe('getMinLength()', () => {
  describe('with minLength: Number', () => {
    it('should return a number', () => {
      const schema = new JSONSchema({ minLength: 30 })
      expect(schema.getMinLength()).toBe(30)
    })
  })

  describe('with minLength: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getMinLength()).toBeUndefined()
    })
  })
})

describe('getMinimum()', () => {
  describe('with minimum = number', () => {
    it('should return a number', () => {
      const schema = new JSONSchema({ minimum: 30 })
      expect(schema.getMinimum()).toBe(30)
    })
  })

  describe('with minimum = undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getMinimum()).toBeUndefined()
    })
  })
})

describe('getMinWords()', () => {
  describe('with minWords: Number', () => {
    it('should return a number', () => {
      const schema = new JSONSchema({ minWords: 30 })
      expect(schema.getMinWords()).toBe(30)
    })
  })

  describe('with minWords: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getMinWords()).toBeUndefined()
    })
  })
})

describe('getPattern()', () => {
  describe('with pattern = string', () => {
    it('should return the pattern', () => {
      const pattern = '^[0-9]+$'
      const schema = new JSONSchema({ pattern })
      expect(schema.getPattern()).toBe(pattern)
    })
  })

  describe('with pattern: undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getPattern()).toBeUndefined()
    })
  })
})

describe('getProperty()', () => {
  const schema = new JSONSchema({
    properties: {
      a: { type: 'string' }
    }
  })
  describe('with valid property name', () => {
    it('should return property definition', () => {
      expect(schema.getProperty('a')).toBeDefined()
    })
  })

  describe('with invalid property name', () => {
    it('should not throw', () => {
      expect(() => schema.getProperty(
        // @ts-expect-error key not defined
        'unknown'
      )).not.toThrow()
    })
  })
})

describe('getProperties()', () => {
  describe('with properties = object', () => {
    it('should return the object', () => {
      const schema = new JSONSchema({ properties: { a: { type: 'string' } } })
      expect(schema.getProperties()).toEqual({ a: { type: 'string' } })
    })
  })

  describe('with properties = undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getProperties()).toBeUndefined()
    })
  })
})

describe('getTitle()', () => {
  describe('with title = string', () => {
    it('should return title', () => {
      const schema = new JSONSchema({ title: 'My Field' })
      expect(schema.getTitle()).toEqual('My Field')
    })
  })

  describe('with title = undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getTitle()).toBeUndefined()
    })
  })
})

describe('getType()', () => {
  describe('with type defined', () => {
    it('should return the type', () => {
      expect(new JSONSchema({ type: 'array' }).getType()).toBe('array')
      expect(new JSONSchema({ type: 'boolean' }).getType()).toBe('boolean')
      expect(new JSONSchema({ type: 'integer' }).getType()).toBe('integer')
      expect(new JSONSchema({ type: 'null' }).getType()).toBe('null')
      expect(new JSONSchema({ type: 'number' }).getType()).toBe('number')
      expect(new JSONSchema({ type: 'object' }).getType()).toBe('object')
      expect(new JSONSchema({ type: 'string' }).getType()).toBe('string')
    })
  })

  describe('with type undefined', () => {
    it('should return undefined', () => {
      const schema = new JSONSchema({})
      expect(schema.getType()).toBeUndefined()
    })
  })
})

describe('isPropertyRequired(name)', () => {
  describe('with required = array', () => {
    const schema = new JSONSchema({
      properties: {
        a: { type: 'string' },
        b: { type: 'string' }
      },
      required: ['a']
    })

    describe('with property in required', () => {
      it('should return true', () => {
        expect(schema.isPropertyRequired('a')).toBe(true)
      })
    })
    describe('with property not in required', () => {
      it('should return false', () => {
        expect(schema.isPropertyRequired('b')).toBe(false)
      })
    })
  })

  describe('with required: undefined', () => {
    it('should return false', () => {
      const schema = new JSONSchema({
        properties: {
          a: { type: 'string' },
          b: { type: 'string' }
        }
      })
      expect(schema.isPropertyRequired('a')).toBe(false)
      expect(schema.isPropertyRequired('b')).toBe(false)
    })
  })
})

describe('isValid(value, options)', () => {
  const schema = new JSONSchema({ type: 'number' })

  describe('with valid object', () => {
    it('should return true', () => {
      expect(schema.isValid(1)).toEqual(true)
    })
  })
  describe('with invalid object', () => {
    it('should return false', () => {
      expect(schema.isValid('1')).toEqual(false)
    })
  })
})

describe('omitProperties(keys)', () => {
  const schema = new JSONSchema({
    additionalProperties: false,
    properties: {
      a: { type: 'string' },
      b: { type: 'boolean' },
      c: { type: 'number' }
    }
  })
  const newSchema = schema.omitProperties(['a', 'b'])

  it('should return a schema without excluded fields', () => {
    expect(newSchema.getProperty(
      // @ts-expect-error key not defined
      'a'
    )).toBeUndefined()
    expect(newSchema.getProperty(
      // @ts-expect-error key not defined
      'b'
    )).toBeUndefined()
  })

  it('should return a schema with non excluded fields', () => {
    expect(newSchema.toJSON().properties.c).toBeDefined()
  })

  it('should not modify parent schema', () => {
    expect(schema.getProperty('a')).toBeDefined()
    expect(schema.getProperty('b')).toBeDefined()
    expect(schema.getProperty('c')).toBeDefined()
  })
})

describe('partial()', () => {
  const schema = new JSONSchema({
    properties: {
      a: { type: 'string' },
      b: { type: 'string' }
    },
    required: ['a', 'b']
  })
  const partialSchema = schema.partial()

  it('should return a schema without required attribute', () => {
    // @ts-expect-error key is not defined
    expect(partialSchema.toJSON().required).toBeUndefined()
  })

  it('should return a schema without required properties', () => {
    expect(partialSchema.isPropertyRequired('a')).toBeFalsy()
    expect(partialSchema.isPropertyRequired('b')).toBeFalsy()
  })

  it('should not modify parent schema', () => {
    expect(schema.isPropertyRequired('a')).toBeTruthy()
    expect(schema.isPropertyRequired('b')).toBeTruthy()
  })
})

describe('pickProperties(keys)', () => {
  const schema = new JSONSchema({
    properties: {
      a: { type: 'string' },
      b: { type: 'boolean' },
      c: { type: 'number' }
    }
  })
  const newSchema = schema.pickProperties(['a', 'b'])

  it('should return a schema with selected properties', () => {
    expect(newSchema.getProperty('a')).toBeDefined()
    expect(newSchema.getProperty('b')).toBeDefined()
  })

  it('should return a schema without other fields', () => {
    expect(newSchema.getProperty(
      // @ts-expect-error key is undefined
      'c'
    )).toBeUndefined()
  })

  it('should not modify parent schema', () => {
    expect(schema.getProperty('a')).toBeDefined()
    expect(schema.getProperty('b')).toBeDefined()
    expect(schema.getProperty('c')).toBeDefined()
  })
})

describe('removeUnknownProperties(value)', () => {
  const addressSchema = new JSONSchema({
    properties: {
      street: { type: 'string' }
    }
  })
  const phoneSchema = new JSONSchema({
    properties: {
      number: { type: 'string' }
    }
  })
  const userSchema = new JSONSchema({
    properties: {
      name: { type: 'string' },
      address: addressSchema.toJSON(),
      phones: {
        type: 'array',
        items: phoneSchema.toJSON()
      }
    }
  })

  it('should remove unknown properties', () => {
    expect(userSchema.removeUnknownProperties({
      name: 'test',
      unknown: true
    })).toStrictEqual({
      name: 'test'
    })
  })

  it('should remove unknown nested properties', () => {
    expect(userSchema.removeUnknownProperties({
      address: { street: 'somewhere', unknown: true }
    }))
      .toStrictEqual({
        address: { street: 'somewhere' }
      })
  })

  it('should remove unknown nested properties in arrays', () => {
    expect(userSchema.removeUnknownProperties({
      phones: [{ number: '000000', unknown: true }]
    }))
      .toStrictEqual({
        phones: [{ number: '000000' }]
      })
  })
})

describe('required()', () => {
  const schema = new JSONSchema({
    properties: {
      a: { type: 'string' },
      b: { type: 'string' }
    }
  })
  const required = schema.required()

  it('should return a schema with "required" attribute defined', () => {
    expect(required.toJSON().required).toBeDefined()
  })

  it('should return a schema with all properties required', () => {
    expect(required.isPropertyRequired('a')).toBeTruthy()
    expect(required.isPropertyRequired('b')).toBeTruthy()
  })

  it('should not modify parent schema', () => {
    expect(schema.isPropertyRequired('a')).toBeFalsy()
    expect(schema.isPropertyRequired('b')).toBeFalsy()
  })
})

describe('resolveProperty(name)', () => {
  const addressSchema = new JSONSchema({
    properties: {
      street: { type: 'string' }
    }
  })
  const phoneSchema = new JSONSchema({
    properties: {
      number: { type: 'string' }
    }
  })
  const userSchema = new JSONSchema({
    properties: {
      address: addressSchema.toJSON(),
      phones: {
        type: 'array',
        items: phoneSchema.toJSON()
      }
    }
  })

  describe('with valid path', () => {
    it('should not throw', () => {
      expect(() => {
        userSchema.resolveProperty('address')
        userSchema.resolveProperty('phones')
        userSchema.resolveProperty('address.street')
        userSchema.resolveProperty('address[street]')
        userSchema.resolveProperty('phones[0].number')
        userSchema.resolveProperty('phones[0][number]')
        userSchema.resolveProperty('phones[0]')
        userSchema.resolveProperty('phones.number')
      }).not.toThrow()
    })

    describe('with property', () => {
      it('should return the property', () => {
        expect(userSchema.resolveProperty('address'))
          .toStrictEqual(userSchema.getProperty('address'))
        expect(userSchema.resolveProperty('phones'))
          .toStrictEqual(userSchema.getProperty('phones'))
      })
    })

    describe('with nested property', () => {
      it('should return the nested property', () => {
        expect(userSchema.resolveProperty('address.street'))
          .toStrictEqual(addressSchema.getProperty('street'))
        expect(userSchema.resolveProperty('address[street]'))
          .toStrictEqual(addressSchema.getProperty('street'))
      })
    })

    describe('with nested items property', () => {
      it('should return the nested items property', () => {
        expect(userSchema.resolveProperty('phones[0].number'))
          .toStrictEqual(phoneSchema.getProperty('number'))
        expect(userSchema.resolveProperty('phones[0][number]'))
          .toStrictEqual(phoneSchema.getProperty('number'))
      })
    })

    describe('with nested items shortcut', () => {
      it('should return the nested items property', () => {
        expect(userSchema.resolveProperty('phones.number'))
          .toStrictEqual(phoneSchema.getProperty('number'))
      })
    })

    describe('with indexed property', () => {
      it('should return the property', () => {
        expect(userSchema.resolveProperty('phones[0]'))
          .toStrictEqual(new JSONSchema(userSchema.getProperty('phones') as SchemaAttributes).toJSON())
      })
    })
  })

  describe('with invalid path', () => {
    it('should throw a InvalidPathError', () => {
      expect(() => {
        userSchema.resolveProperty('unknown')
      }).toThrow(InvalidPathError)
      expect(() => {
        userSchema.resolveProperty('address.unknown')
      }).toThrow(InvalidPathError)
      expect(() => {
        userSchema.resolveProperty('phones[0].unknown')
      }).toThrow(InvalidPathError)
      expect(() => {
        userSchema.resolveProperty('phones.unknown')
      }).toThrow(InvalidPathError)
    })
  })
})

describe('toJSON()', () => {
  it('should return a JSON object', () => {
    const p: SchemaAttributes = {
      title: 'field',
      type: 'string'
    }
    expect(new JSONSchema(p).toJSON())
      .toStrictEqual({ $schema: JSON_SCHEMA_DRAFT_2020_12, ...p } as SchemaAttributes)
  })

  it('should return $schema in the JSON object', () => {
    const p: SchemaAttributes = {
      title: 'field',
      type: 'string'
    }
    expect(new JSONSchema(p).toJSON().$schema)
      .toBe(JSON_SCHEMA_DRAFT_2020_12)
  })
})

describe('validate(value, options)', () => {
  describe('with incorrect value', () => {
    const schema = new JSONSchema({ type: 'string' })
    let error: any

    try {
      schema.validate(123)
    } catch (e) {
      error = e
    }

    it('should throw a SchemaError', () => {
      expect(error).toBeInstanceOf(ValidationError)
    })

    it('should throw a SchemaError with a "path" attribute', () => {
      expect(error.path).toBe('')
    })

    it('should throw a SchemaError with a "reason" attribute', () => {
      expect(error.reason).toBe(ERROR_FIELD_TYPE)
    })
  })

  describe('with additionalProperties', () => {
    describe('additionalProperties = object', () => {
      const schema = new JSONSchema({
        additionalProperties: { type: 'string' }
      })

      describe('with valid additional properties', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({ other: 'ok' })
          }).not.toThrow()
        })
      })

      describe('with invalid additional properties', () => {
        it('should check additional properties', () => {
          expect(() => {
            schema.validate({ other: 123 })
          }).toThrow(FieldTypeError)
          expect(() => {
            schema.validate({ other: true })
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('additionalProperties = false', () => {
      const schema = new JSONSchema({
        additionalProperties: false
      })

      describe('with additional prop', () => {
        it('should throw FieldAdditionalPropertiesError', () => {
          expect(() => {
            schema.validate({ other: 123 })
          }).toThrow(FieldAdditionalPropertiesError)
        })
      })
    })
  })

  describe('with enum', () => {
    describe('enum = Array', () => {
      const schema = new JSONSchema({ enum: ['off', 'on'] })

      describe('with Array', () => {
        describe('with enum values', () => {
          it('should not throw FieldAllowedError', () => {
            expect(() => {
              schema.validate(['on'])
            }).not.toThrow()
          })
        })

        describe('without enum values', () => {
          it('should throw FieldAllowedError', () => {
            expect(() => {
              schema.validate(['yes'])
            }).toThrow(FieldEnumError)
          })
        })
      })
    })
  })

  describe('with denied', () => {
    describe('denied: Array', () => {
      const schema = new JSONSchema({ denied: ['off', 'on'] })

      describe('with denied values', () => {
        it('should throw FieldDeniedError', () => {
          expect(() => {
            schema.validate(['on'])
          }).toThrow(FieldDeniedError)
        })
      })

      describe('without denied values', () => {
        it('should not throw FieldDeniedError', () => {
          expect(() => {
            schema.validate(['yes'])
          }).not.toThrow()
        })
      })
    })
  })

  describe('with enum and denied', () => {
    it('should throw SchemaError', () => {
      expect(() => (
        new JSONSchema({
          enum: ['red'],
          denied: ['blue']
        })
      )).toThrow(SchemaError)
    })
  })

  describe('with exclusiveMaximum', () => {
    describe('exclusiveMaximum = number', () => {
      const schema = new JSONSchema({ exclusiveMaximum: 100 })

      describe('with number', () => {
        describe('with value greater than maximum', () => {
          it('should throw FieldExclusiveMaximumError', () => {
            expect(() => {
              schema.validate(101)
            }).toThrow(FieldExclusiveMaximumError)
          })
        })
        describe('with value equal to maximum', () => {
          it('should throw FieldExclusiveMaximumError', () => {
            expect(() => {
              schema.validate(100)
            }).toThrow(FieldExclusiveMaximumError)
          })
        })
        describe('with value lesser than maximum', () => {
          it('should not throw', () => {
            expect(() => {
              schema.validate(99)
            }).not.toThrow()
          })
        })
      })
    })
  })

  describe('with exclusiveMinimum', () => {
    describe('exclusiveMinimum = number', () => {
      const schema = new JSONSchema({ exclusiveMinimum: 0 })

      describe('with number', () => {
        describe('with value lesser than minimum', () => {
          it('should throw FieldExclusiveMinimumError', () => {
            expect(() => {
              schema.validate(-1)
            }).toThrow(FieldExclusiveMinimumError)
          })
        })
        describe('with value equal to minimum', () => {
          it('should throw FieldExclusiveMinimumError', () => {
            expect(() => {
              schema.validate(0)
            }).toThrow(FieldExclusiveMinimumError)
          })
        })
        describe('with value greater than minimum', () => {
          it('should not throw', () => {
            expect(() => {
              schema.validate(1)
            }).not.toThrow()
          })
        })
      })
    })
  })

  describe('with format', () => {
    describe('format: "date"', () => {
      const schema = new JSONSchema({ format: 'date' })

      describe('with string of correct format', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2020-05-13')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2020/05/13')
          }).toThrow(FieldFormatError)
        })
      })
    })

    describe('format: "datetime"', () => {
      const schema = new JSONSchema({ format: 'datetime' })

      describe('with string not containing fraction of seconds and timezone offset', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2021-01-30T08:00:00')
          }).not.toThrow()
        })
      })

      describe('with string containing fraction of seconds and not timezone offset', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2020-05-13T10:00:00.000')
          }).not.toThrow()
        })
      })

      describe('with string containing timezone offset and no fraction of seconds', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2020-05-13T10:00:00-10:00')
          }).not.toThrow()
        })
      })

      describe('with string containing timezone offset and fraction of seconds', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2020-05-13T23:59:59.999-10:00')
          }).not.toThrow()
        })
      })

      describe('with string of correct format containing Z offset', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2020-05-13T10:00:00Z')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2020-05-13 10:00:00')
          }).toThrow(FieldFormatError)
        })
      })
    })

    describe('format: "date-time"', () => {
      const schema = new JSONSchema({ format: 'date-time' })

      describe('with string containing no timezone offset', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2021-01-30T08:00:00')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('2020-05-13 10:00:00')
          }).toThrow(FieldFormatError)
        })
      })
    })

    describe('format: "email"', () => {
      const schema = new JSONSchema({ format: 'email' })

      describe('with string of correct format', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('valid.address@mail.com')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('invalid@mail')
          }).toThrow(FieldFormatError)
        })
      })
    })

    describe('format: "hostname"', () => {
      const schema = new JSONSchema({ format: 'hostname' })

      describe('with string of correct format', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('www.host.com')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('www.invalid_host.com')
          }).toThrow(FieldFormatError)
        })
      })
    })

    describe('format: "ipv4"', () => {
      const schema = new JSONSchema({ format: 'ipv4' })

      describe('with string of correct format', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('192.168.1.0')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('256.255.255.255')
          }).toThrow(FieldFormatError)
        })
      })
    })

    describe('format: "ipv6"', () => {
      const schema = new JSONSchema({ format: 'ipv6' })

      describe('with string of correct format', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('ff:ff:ff:ff:ff:ff:ff:ff')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('gf:ff:ff:ff:ff:ff:ff:ff')
          }).toThrow(FieldFormatError)
        })
      })
    })

    describe('format: "time"', () => {
      const schema = new JSONSchema({ format: 'time' })

      describe('with string of correct format', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('12:30:42-10:00')
          }).not.toThrow()
        })
      })

      describe('with string of correct format containing second fraction', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('12:30:42.000-10:00')
          }).not.toThrow()
        })
      })

      describe('with string of correct format containing Z offset', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('12:30:42Z')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('12:30:42')
          }).toThrow(FieldFormatError)
        })
      })
    })

    describe('format: "uri"', () => {
      const schema = new JSONSchema({ format: 'uri' })

      describe('with string of correct format', () => {
        it('should not throw FieldFormatError', () => {
          expect(() => {
            schema.validate('ftp://ftp.is.co.za/rfc/rfc1808.txt')
          }).not.toThrow()
        })
      })

      describe('with string of incorrect format', () => {
        it('should throw FieldFormatError', () => {
          expect(() => {
            schema.validate('https://www.ietf.org/rfc/ rfc2396.txt')
          }).toThrow(FieldFormatError)
        })
      })
    })
  })

  describe('with items', () => {
    describe('items.type: "boolean"', () => {
      const schema = new JSONSchema({
        items: { type: 'boolean' }
      })

      describe('with boolean values', () => {
        it('should not throw ValidationError', () => {
          expect(() => {
            schema.validate([true, false])
          }).not.toThrow()
        })
      })

      describe('with mixed values', () => {
        it('should throw ValidationError', () => {
          expect(() => {
            schema.validate([true, 100, 'false'])
          }).toThrow(ValidationError)
        })
      })
    })

    describe('items.type: "number"', () => {
      const schema = new JSONSchema({
        items: { type: 'number' }
      })

      describe('with number values', () => {
        it('should not throw ValidationError', () => {
          expect(() => {
            schema.validate([0, 1])
          }).not.toThrow()
        })
      })

      describe('with mixed values', () => {
        it('should throw ValidationError', () => {
          expect(() => {
            schema.validate([true, 100, 'false'])
          }).toThrow(ValidationError)
        })
      })
    })

    describe('items.type: "object"', () => {
      const schema = new JSONSchema({
        items: { type: 'object' }
      })

      describe('with objects', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate([{}, new Date()])
          }).not.toThrow()
        })
      })

      describe('with mixed values', () => {
        it('should throw ValidationError', () => {
          expect(() => {
            schema.validate([true, 100, 'false'])
          }).toThrow(ValidationError)
        })
      })
    })

    describe('items.type: "string"', () => {
      const schema = new JSONSchema({
        items: { type: 'string' }
      })

      describe('with string values', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(['a', 'b'])
          }).not.toThrow()
        })
      })

      describe('with mixed values', () => {
        it('should throw ValidationError', () => {
          expect(() => {
            schema.validate([true])
          }).toThrow(ValidationError)
          expect(() => {
            schema.validate([123])
          }).toThrow(ValidationError)
        })
      })
    })
  })

  describe('with length', () => {
    const schema = new JSONSchema({ length: 2 })

    describe('length: Number', () => {
      describe('with array of correct length', () => {
        it('should not throw FieldLengthError', () => {
          expect(() => {
            schema.validate([1, 2])
          }).not.toThrow()
        })
      })

      describe('with array of incorrect length', () => {
        it('should throw FieldLengthError', () => {
          expect(() => {
            schema.validate([1])
          }).toThrow(FieldLengthError)
        })
      })

      describe('with object of incorrect length', () => {
        it('should throw FieldLengthError', () => {
          expect(() => {
            schema.validate({ length: 1 })
          }).toThrow(FieldLengthError)
        })
      })

      describe('with object of correct length', () => {
        it('should not throw FieldLengthError', () => {
          expect(() => {
            schema.validate({ length: 2 })
          }).not.toThrow()
        })
      })

      describe('with string of incorrect length', () => {
        it('should throw FieldLengthError', () => {
          expect(() => {
            schema.validate('x')
          }).toThrow(FieldLengthError)
        })
      })

      describe('with string of correct length', () => {
        it('should not throw FieldLengthError', () => {
          expect(() => {
            schema.validate('xx')
          }).not.toThrow()
        })
      })
    })
  })

  describe('with maximum', () => {
    describe('maximum: number', () => {
      const schema = new JSONSchema({ maximum: 0 })

      describe('with number', () => {
        describe('with value higher than maximum', () => {
          it('should throw FieldMaximumError', () => {
            expect(() => {
              schema.validate(10)
            }).toThrow(FieldMaximumError)
          })
        })

        describe('with value equal to maximum', () => {
          it('should not throw FieldMaximumError', () => {
            expect(() => {
              schema.validate(0)
            }).not.toThrow()
          })
        })

        describe('with value lower than maximum', () => {
          it('should not throw FieldMaximumError', () => {
            expect(() => {
              schema.validate(-10)
            }).not.toThrow()
          })
        })
      })
    })
  })

  describe('with maxItems', () => {
    describe('maxItems: 1', () => {
      const schema = new JSONSchema({
        maxItems: 1
      })

      describe('with null value', () => {
        it('should not throw Error', () => {
          expect(() => {
            schema.validate(null)
          }).not.toThrow()
        })
      })
      describe('with items <= maxItems', () => {
        it('should not throw Error', () => {
          expect(() => {
            schema.validate([])
          }).not.toThrow()
          expect(() => {
            schema.validate([1])
          }).not.toThrow()
        })
      })
      describe('with items > maxItems', () => {
        it('should throw FieldMaxItemsError', () => {
          expect(() => {
            schema.validate([1, 2])
          }).toThrow(FieldMaxItemsError)
        })
      })
    })
  })

  describe('with maxLength', () => {
    describe('maxLength: Number', () => {
      const schema = new JSONSchema({ maxLength: 5 })

      describe('with string', () => {
        describe('with length higher than maxLength', () => {
          it('should throw FieldMaxLengthError', () => {
            expect(() => {
              schema.validate('000000')
            }).toThrow(FieldMaxLengthError)
          })
        })

        describe('with length equal to maxLength', () => {
          it('should not throw FieldMaxLengthError', () => {
            expect(() => {
              schema.validate('00000')
            }).not.toThrow()
          })
        })

        describe('with length lower than maxLength', () => {
          it('should not throw FieldMaxLengthError', () => {
            expect(() => {
              schema.validate('')
            }).not.toThrow()
          })
        })
      })

      describe('with array', () => {
        describe('with length higher than maxLength', () => {
          it('should throw FieldMaxLengthError', () => {
            expect(() => {
              schema.validate([0, 0, 0, 0, 0, 0])
            }).toThrow(FieldMaxLengthError)
          })
        })

        describe('with length equal to maxLength', () => {
          it('should not throw FieldMaxLengthError', () => {
            expect(() => {
              schema.validate([0, 0, 0, 0, 0])
            }).not.toThrow()
          })
        })

        describe('with length lower than maxLength', () => {
          it('should not throw FieldMaxLengthError', () => {
            expect(() => {
              schema.validate([])
            }).not.toThrow()
          })
        })
      })
    })
  })

  describe('with maxWords', () => {
    describe('maxWords: Number', () => {
      const schema = new JSONSchema({ maxWords: 5 })

      describe('with length higher than maxWords', () => {
        it('should throw FieldMaxWordsError', () => {
          expect(() => {
            schema.validate('0 0 0 0 0 0')
          }).toThrow(FieldMaxWordsError)
        })
      })

      describe('with length equal to maxWords', () => {
        it('should not throw FieldMaxWordsError', () => {
          expect(() => {
            schema.validate('0 0 0 0 0')
          }).not.toThrow()
        })
      })

      describe('with length lower than maxWords', () => {
        it('should not throw FieldMaxWordsError', () => {
          expect(() => {
            schema.validate('')
          }).not.toThrow()
        })
      })
    })
  })

  describe('with minimum', () => {
    describe('minimum = number', () => {
      const schema = new JSONSchema({ minimum: 0 })

      describe('with number', () => {
        describe('with value lower than minimum', () => {
          it('should throw FieldMinimumError', () => {
            expect(() => {
              schema.validate(-10)
            }).toThrow(FieldMinimumError)
          })
        })

        describe('with value equal to minimum', () => {
          it('should not throw FieldMinimumError', () => {
            expect(() => {
              schema.validate(0)
            }).not.toThrow()
          })
        })

        describe('with value higher than minimum', () => {
          it('should not throw FieldMinimumError', () => {
            expect(() => {
              schema.validate(10)
            }).not.toThrow()
          })
        })
      })
    })

    describe('minimum = Date', () => {
      const date = new Date()
      const schema = new JSONSchema({ minimum: date.getTime() })

      describe('with date lower than minimum', () => {
        it('should throw FieldMinimumError', () => {
          expect(() => {
            schema.validate(new Date(date.getTime() - 1000).getTime())
          }).toThrow(FieldMinimumError)
        })
      })

      describe('with date equal to minimum', () => {
        it('should not throw FieldMinimumError', () => {
          expect(() => {
            schema.validate(date)
          }).not.toThrow()
        })
      })

      describe('with date higher than minimum', () => {
        it('should not throw FieldMinimumError', () => {
          expect(() => {
            schema.validate(new Date(date.getTime() + 1000).getTime())
          }).not.toThrow()
        })
      })
    })
  })

  describe('with minItems', () => {
    describe('minItems: 1', () => {
      const schema = new JSONSchema({
        minItems: 1
      })

      describe('with null value', () => {
        it('should not throw Error', () => {
          expect(() => {
            schema.validate(null)
          }).not.toThrow()
        })
      })
      describe('with items >= minItems', () => {
        it('should not throw Error', () => {
          expect(() => {
            schema.validate([1])
          }).not.toThrow()
          expect(() => {
            schema.validate([1, 2])
          }).not.toThrow()
        })
      })
      describe('with items < minItems', () => {
        it('should throw FielMinItemsError', () => {
          expect(() => {
            schema.validate([])
          }).toThrow(FieldMinItemsError)
        })
      })
    })
  })

  describe('with minLength', () => {
    describe('minLength: Number', () => {
      const schema = new JSONSchema({ minLength: 5 })

      describe('with string', () => {
        describe('with length lower than minLength', () => {
          it('should throw FieldMinLengthError', () => {
            expect(() => {
              schema.validate('')
            }).toThrow(FieldMinLengthError)
          })
        })

        describe('with length equal to minLength', () => {
          it('should not throw FieldMinLengthError', () => {
            expect(() => {
              schema.validate('00000')
            }).not.toThrow()
          })
        })

        describe('with length higher than minLength', () => {
          it('should not throw FieldMinLengthError', () => {
            expect(() => {
              schema.validate('000000')
            }).not.toThrow()
          })
        })
      })

      describe('with array', () => {
        describe('with length lower than minLength', () => {
          it('should throw FieldMinLengthError', () => {
            expect(() => {
              schema.validate([])
            }).toThrow(FieldMinLengthError)
          })
        })

        describe('with length equal to minLength', () => {
          it('should not throw FieldMinLengthError', () => {
            expect(() => {
              schema.validate([0, 0, 0, 0, 0])
            }).not.toThrow()
          })
        })

        describe('with length higher than minLength', () => {
          it('should not throw FieldMinLengthError', () => {
            expect(() => {
              schema.validate([0, 0, 0, 0, 0, 0])
            }).not.toThrow()
          })
        })
      })
    })
  })

  describe('with minWords', () => {
    describe('minWords: Number', () => {
      const schema = new JSONSchema({ minWords: 5 })

      describe('with length lower than minWords', () => {
        it('should throw FieldMinWordsError', () => {
          expect(() => {
            schema.validate('')
          }).toThrow(FieldMinWordsError)
        })
      })

      describe('with length equal to minWords', () => {
        it('should not throw FieldMinWordsError', () => {
          expect(() => {
            schema.validate('0 0 0 0 0')
          }).not.toThrow()
        })
      })

      describe('with length higher than minWords', () => {
        it('should throw FieldMinWordsError', () => {
          expect(() => {
            schema.validate('0 0 0 0 0 0')
          }).not.toThrow()
        })
      })
    })
  })

  describe('with multipleOf', () => {
    describe('multipleOf: 2', () => {
      const schema = new JSONSchema({
        multipleOf: 2
      })

      describe('with zero', () => {
        it('should not throw an Error', () => {
          expect(() => {
            schema.validate(0)
          }).not.toThrow()
        })
      })

      describe('with a value that is a multiple', () => {
        it('should not throw an Error', () => {
          expect(() => {
            schema.validate(2)
          }).not.toThrow()
          expect(() => {
            schema.validate(4)
          }).not.toThrow()
          expect(() => {
            schema.validate(6)
          }).not.toThrow()
          expect(() => {
            schema.validate(8)
          }).not.toThrow()
        })
      })

      describe('with a value that is not a multiple', () => {
        it('should throw a FieldMultipleOfError', () => {
          expect(() => {
            schema.validate(1)
          }).toThrow(FieldMultipleOfError)
          expect(() => {
            schema.validate(3)
          }).toThrow(FieldMultipleOfError)
          expect(() => {
            schema.validate(5)
          }).toThrow(FieldMultipleOfError)
          expect(() => {
            schema.validate(7)
          }).toThrow(FieldMultipleOfError)
        })
      })
    })
  })

  describe('with pattern', () => {
    describe('pattern: String', () => {
      const schema = new JSONSchema({
        pattern: '^[01]+$'
      })

      describe('with incorrect value', () => {
        it('should throw FieldPatternError', () => {
          expect(() => {
            schema.validate('12345')
          }).toThrow(FieldPatternError)
        })
      })

      describe('with correct value', () => {
        it('should not throw FieldPatternError', () => {
          expect(() => {
            schema.validate('01101')
          }).not.toThrow()
        })
      })

      describe('with undefined', () => {
        it('should not throw FieldPatternError', () => {
          expect(() => {
            schema.validate(undefined)
          }).not.toThrow()
        })
      })
    })

    describe('pattern: RegExp', () => {
      const schema = new JSONSchema({
        pattern: '^0+'
      })

      describe('with incorrect value', () => {
        it('should throw FieldPatternError', () => {
          expect(() => {
            schema.validate('12345')
          }).toThrow(FieldPatternError)
        })
      })

      describe('with correct value', () => {
        it('should not throw FieldPatternError', () => {
          expect(() => {
            schema.validate('01101')
          }).not.toThrow()
        })
      })

      describe('with undefined', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(undefined)
          }).not.toThrow()
        })
      })
    })
  })

  describe('with patternProperties', () => {
    describe('patternProperties = object', () => {
      const schema = new JSONSchema({
        patternProperties: {
          '^S_': { type: 'string' },
          '^N_': { type: 'number', maximum: 999 }
        }
      })

      describe('with property matching pattern', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({ S_other: 'ok' })
            schema.validate({ N_other: 123 })
          }).not.toThrow()
        })
      })

      describe('with property not matching pattern', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({ other: 'ok' })
          }).not.toThrow()
        })
      })

      it('should check pattern prop constraints', () => {
        expect(() => {
          schema.validate({ N_other: 1000 })
        }).toThrow(FieldMaximumError)
        expect(() => {
          schema.validate({ N_other: true })
        }).toThrow(FieldTypeError)
      })
    })

    describe('patternProperties = undefined', () => {
      const schema = new JSONSchema({})

      it('should not throw', () => {
        expect(() => {
          schema.validate({ other: 123 })
        }).not.toThrow()
      })
    })
  })

  describe('with properties', () => {
    describe('properties = object', () => {
      const schema = new JSONSchema({
        properties: {
          age: { type: 'number', minimum: 18 },
          name: { type: 'string' }
        }
      })

      describe('with undefined', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(undefined)
          }).not.toThrow()
        })
      })

      describe('with correct value', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({
              age: 36,
              name: 'Karl'
            })
          }).not.toThrow()
          expect(() => {
            schema.validate({ age: 36 })
          }).not.toThrow()
        })
      })

      describe('with additional properties', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({
              name: 'Karl',
              extraField: 'xxx'
            })
          }).not.toThrow()
        })
      })

      describe('with incorrect value', () => {
        it('should throw', () => {
          expect(() => {
            schema.validate({
              age: '123'
            })
          }).toThrow(FieldTypeError)
          expect(() => {
            schema.validate({
              name: 123
            })
          }).toThrow(FieldTypeError)
        })
      })

      it('should check properties constraints', () => {
        expect(() => {
          schema.validate({ age: 15 })
        }).toThrow(FieldMinimumError)
        expect(() => {
          schema.validate({ age: '15' })
        }).toThrow(FieldTypeError)
      })
    })
  })

  describe('with required', () => {
    describe('required = array', () => {
      const schema = new JSONSchema({
        required: ['a']
      })

      describe('with an object containing required properties', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({ a: true })
          }).not.toThrow()
        })
      })
      describe('with an object not containing required properties', () => {
        it('should throw a FieldRequiredError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldRequiredError)
        })
      })
      describe('with undefined', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(undefined)
          }).not.toThrow()
        })
      })
      describe('with null', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(null)
          }).not.toThrow()
        })
      })
    })

    describe('required = undefined', () => {
      const schema = new JSONSchema({})

      describe('with an object containing properties', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({ a: true })
          }).not.toThrow()
        })
      })
      describe('with an empty object', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({})
          }).not.toThrow()
        })
      })
      describe('with undefined', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(undefined)
          }).not.toThrow()
        })
      })
      describe('with null', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(null)
          }).not.toThrow()
        })
      })
    })
  })

  describe('with type', () => {
    describe('type: ["boolean"]', () => {
      const schema = new JSONSchema({
        type: ['boolean']
      })

      describe('with boolean', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(true)
            schema.validate(false)
          }).not.toThrow()
        })
      })

      describe('with null', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(null)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with number', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(123)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with object', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })
      describe('with string', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate('test')
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: ["number"]', () => {
      const schema = new JSONSchema({
        type: ['number']
      })

      describe('with number', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate(123)
          }).not.toThrow()
        })
      })

      describe('with boolean', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with null', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(null)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with object', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })
      describe('with string', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate('test')
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: ["object"]', () => {
      const schema = new JSONSchema({
        type: ['object']
      })

      describe('with object', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate({})
          }).not.toThrow()
        })
      })

      describe('with boolean', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with null', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(null)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with number', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(123)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with string', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate('test')
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: ["string"]', () => {
      const schema = new JSONSchema({
        type: ['string']
      })

      describe('with string', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate('test')
          }).not.toThrow()
        })
      })

      describe('with boolean', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with null', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(null)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with number', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(123)
          }).toThrow(FieldTypeError)
        })
      })
      describe('with object', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: ["string","number"]', () => {
      const schema = new JSONSchema({
        type: ['string', 'number']
      })

      describe('with correct values', () => {
        it('should not throw', () => {
          const result = () => {
            schema.validate('test')
            schema.validate(123)
          }
          expect(result).not.toThrow()
        })
      })

      describe('with incorrect values', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: "array"', () => {
      const schema = new JSONSchema({
        type: 'array'
      })

      describe('with array', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate([])
          }).not.toThrow()

          const field1 = new JSONSchema({
            type: 'array',
            items: { type: 'number' }
          })
          expect(() => {
            field1.validate([0, 1])
          }).not.toThrow()
        })
      })

      describe('with boolean', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with number', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(1337)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with object', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })

      describe('with string', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate('abc')
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: "boolean"', () => {
      const schema = new JSONSchema({
        type: 'boolean'
      })

      describe('with boolean', () => {
        it('should not throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).not.toThrow()
        })
      })

      describe('with array', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate([])
          }).toThrow(FieldTypeError)
        })
      })

      describe('with number', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(1337)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with object', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })

      describe('with string', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate('abc')
          })
            .toThrow(FieldTypeError)
        })
      })
    })

    describe('type: "integer"', () => {
      const schema = new JSONSchema({
        type: 'integer'
      })

      describe('with integer', () => {
        it('should not throw FieldTypeError', () => {
          expect(() => {
            schema.validate(1337)
          }).not.toThrow()
        })
      })

      describe('with float', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(99.99)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with array', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate([])
          }).toThrow(FieldTypeError)
        })
      })

      describe('with boolean', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with object', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })

      describe('with string', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate('abc')
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: "number"', () => {
      const schema = new JSONSchema({
        type: 'number'
      })

      describe('with integer', () => {
        it('should not throw FieldTypeError', () => {
          expect(() => {
            schema.validate(1337)
          }).not.toThrow()
        })
      })

      describe('with float', () => {
        it('should not throw FieldTypeError', () => {
          expect(() => {
            schema.validate(99.99)
          }).not.toThrow()
        })
      })

      describe('with array', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate([])
          }).toThrow(FieldTypeError)
        })
      })

      describe('with boolean', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with object', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })

      describe('with string', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate('abc')
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: "object"', () => {
      const schema = new JSONSchema({
        type: 'object'
      })

      describe('with null', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(null)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with object', () => {
        it('should not throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).not.toThrow()
        })
      })

      describe('with array', () => {
        it('should not throw FieldTypeError', () => {
          expect(() => {
            schema.validate([])
          }).toThrow()
        })
      })

      describe('with boolean', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with number', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(1337)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with string', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate('abc')
          }).toThrow(FieldTypeError)
        })
      })
    })

    describe('type: "string"', () => {
      const schema = new JSONSchema({
        type: 'string'
      })

      describe('with string', () => {
        it('should not throw FieldTypeError', () => {
          expect(() => {
            schema.validate('abc')
          }).not.toThrow()
        })
      })

      describe('with array', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate([])
          }).toThrow(FieldTypeError)
        })
      })

      describe('with boolean', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(true)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with number', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate(1337)
          }).toThrow(FieldTypeError)
        })
      })

      describe('with object', () => {
        it('should throw FieldTypeError', () => {
          expect(() => {
            schema.validate({})
          }).toThrow(FieldTypeError)
        })
      })
    })
  })

  describe('with uniqueItems', () => {
    describe('uniqueItems: true', () => {
      const schema = new JSONSchema({
        uniqueItems: true
      })

      describe('with unique items', () => {
        it('should not throw SchemaError', () => {
          expect(() => {
            schema.validate([1, 2, 3])
          }).not.toThrow()
        })
      })

      describe('with duplicate items', () => {
        it('should throw FieldUniqueItemsError', () => {
          expect(() => {
            schema.validate([1, 2, 2])
          }).toThrow(FieldUniqueItemsError)
        })
      })

      describe('with non array value', () => {
        it('should not throw Error', () => {
          expect(() => {
            schema.validate(123)
          }).not.toThrow()
          expect(() => {
            schema.validate('test')
          }).not.toThrow()
          expect(() => {
            schema.validate(true)
          }).not.toThrow()
          expect(() => {
            schema.validate({})
          }).not.toThrow()
          expect(() => {
            schema.validate(null)
          }).not.toThrow()
        })
      })
    })

    describe('uniqueItems: false', () => {
      const schema = new JSONSchema({
        uniqueItems: false
      })

      describe('with unique items', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate([1, 2, 3])
          }).not.toThrow()
        })
      })

      describe('with duplicate items', () => {
        it('should not throw', () => {
          expect(() => {
            schema.validate([1, 2, 2])
          }).not.toThrow()
        })
      })
    })
  })

  describe('with options.thrownOnError = false', () => {
    const schema = new JSONSchema({
      additionalProperties: false,
      properties: {
        number: { type: 'number' },
        string: { type: 'string' },
        object: {
          additionalProperties: false,
          properties: {
            boolean: { type: 'boolean' }
          }
        },
        numbers: {
          items: {
            type: 'number'
          }
        }
      }
    })

    describe('with correct value', () => {
      const value = {
        number: 1,
        string: 'string'
      }

      it('should return undefined', () => {
        expect(schema.validate(value, { throwOnError: false }))
          .toBeNull()
      })

      it('should not throw', () => {
        expect(() => schema.validate(value, { throwOnError: false }))
          .not.toThrow()
      })
    })

    describe('with incorrect value', () => {
      const value = {
        number: '123',
        string: 123,
        object: {
          boolean: 'true',
          unknown: true
        },
        other: true,
        numbers: ['test']
      }

      it('should return errors', () => {
        const errors = schema.validate(value, { throwOnError: false })
        expect(errors).toBeDefined()
        expect(errors?.number).toBeDefined()
        expect(errors?.string).toBeDefined()
        expect(errors?.['numbers[0]']).toBeDefined()
        expect(errors?.['object.boolean']).toBeDefined()
      })
    })
  })
})
