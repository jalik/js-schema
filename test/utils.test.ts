/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import { computeValue, joinPath } from '../src/utils'

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
