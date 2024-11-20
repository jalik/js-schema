/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import { clean, joinPath } from '../src/utils'

describe('clean(value, options)', () => {
  describe('with options.trim = true', () => {
    const options = { trim: true }
    describe('with value = string', () => {
      it('should return a clean string', () => {
        expect(clean(' test ', options))
          .toBe('test')
      })
    })

    describe('with value = array', () => {
      it('should return a clean array', () => {
        expect(clean([' a ', ' b '], options))
          .toStrictEqual(['a', 'b'])
      })
    })

    describe('with value = object', () => {
      it('should return a clean object', () => {
        expect(clean({ a: ' a ', b: ' b ' }, options))
          .toStrictEqual({ a: 'a', b: 'b' })
      })
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
