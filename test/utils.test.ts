/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import { computeValue, joinPath, parse, removeUnknownFields } from '../src/utils'
import Schema from '../src/Schema'

describe('computeValue()', () => {
  describe('with a boolean', () => {
    it('should return the boolean', () => {
      const bool = true
      expect(computeValue(bool)).toBe(bool)
    })
  })
  describe('with a number', () => {
    it('should return the number', () => {
      const num = 123
      expect(computeValue(num)).toBe(num)
    })
  })
  describe('with a string', () => {
    it('should return the string', () => {
      const str = 'test'
      expect(computeValue(str)).toBe(str)
    })
  })
  describe('with a function', () => {
    it('should return the function result', () => {
      const func = () => 'ok'
      expect(computeValue(func)).toBe(func())
    })
  })
})

describe('joinPath()', () => {
  describe('with "a", "b", "c"', () => {
    it('should return "a.b.c"', () => {
      expect(joinPath('a', 'b', 'c')).toBe('a.b.c')
    })
  })
  describe('with "a", "[b]", "c"', () => {
    it('should return "a[b].c"', () => {
      expect(joinPath('a', '[b]', 'c')).toBe('a[b].c')
    })
  })
  describe('with "a", "b", "[c]"', () => {
    it('should return "a.b[c]"', () => {
      expect(joinPath('a', 'b', '[c]')).toBe('a.b[c]')
    })
  })
})

describe('parse(object, schema)', () => {
  it('should parse boolean fields', () => {
    const schema = new Schema({
      boolean: { parse: (value: string) => /^true$/i.test(value) }
    })
    expect(parse({ boolean: 'true' }, schema)).toEqual({ boolean: true })
    expect(parse({ boolean: 'false' }, schema)).toEqual({ boolean: false })
  })

  it('should parse number fields', () => {
    const schema = new Schema({
      number: { parse: Number }
    })
    expect(parse({ number: '01010' }, schema)).toEqual({ number: 1010 })
    expect(parse({ number: '99.99' }, schema)).toEqual({ number: 99.99 })
  })

  it('should parse fields using custom function if present', () => {
    const schema = new Schema({
      date: {
        parse (value: string) {
          const [year, month, day] = value.split('-').map(Number)
          return new Date(year, month - 1, day)
        }
      }
    })
    expect(parse({ date: '2018-04-05' }, schema))
      .toMatchObject({ date: new Date(2018, 3, 5) })
  })
})

describe('removeUnknownFields(object, schema)', () => {
  const EmbeddedSchema = new Schema({
    num: { type: 'number' }
  })
  const BaseSchema = new Schema({
    string: { type: 'string' },
    embedded: { type: EmbeddedSchema },
    array: {
      type: 'array',
      items: { type: EmbeddedSchema }
    }
  })

  it('should remove unknown fields', () => {
    const values = {
      string: 'test',
      unknown: true
    }
    const result = {
      string: values.string
    }
    expect(removeUnknownFields(values, BaseSchema)).toMatchObject(result)
  })

  it('should remove nested unknown fields', () => {
    const values = {
      string: 'test',
      embedded: {
        num: 123,
        unknown: true
      }
    }
    const result = {
      string: 'test',
      embedded: { num: 123 }
    }
    expect(removeUnknownFields(values, BaseSchema)).toMatchObject(result)
  })

  it('should remove nested unknown fields in arrays', () => {
    const values = {
      array: [{
        num: 123,
        unknown: true
      }]
    }
    const result = {
      array: [{ num: 123 }]
    }
    expect(removeUnknownFields(values, BaseSchema)).toMatchObject(result)
  })
})
