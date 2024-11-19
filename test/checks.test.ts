/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import { checkAllowed, checkType } from '../src/checks'
import FieldAllowedError from '../src/errors/FieldAllowedError'
import FieldTypeError from '../src/errors/FieldTypeError'

describe('checkAllowed', () => {
  describe('with value allowed', () => {
    it('should not throw an Error', () => {
      expect(() => {
        checkAllowed([0, 1], 1, 'number', 'numbers')
      }).not.toThrow()
    })
  })
  describe('with value not allowed', () => {
    it('should throw a FieldAllowedError', () => {
      expect(() => {
        checkAllowed([0, 1], 2, 'number', 'numbers')
      }).toThrow(FieldAllowedError)
    })
  })
})

describe('checkType', () => {
  describe('with type = "null"', () => {
    describe('with value = null', () => {
      it('should not throw an Error', () => {
        expect(() => {
          checkType('null', null, 'field', 'field')
        }).not.toThrow()
      })
    })
    describe('with value !== null', () => {
      it('should throw a FieldTypeError', () => {
        expect(() => {
          checkType('null', 'null', 'field', 'field')
        }).toThrow(FieldTypeError)
      })
    })
  })
})
