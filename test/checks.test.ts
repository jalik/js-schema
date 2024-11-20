/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import { checkEnum, checkExclusiveMaximum, checkExclusiveMinimum, checkType } from '../src/checks'
import FieldEnumError from '../src/errors/FieldEnumError'
import FieldTypeError from '../src/errors/FieldTypeError'
import FieldExclusiveMinimumError from '../src/errors/FieldExclusiveMinError'
import FieldExclusiveMaximumError from '../src/errors/FieldExclusiveMaxError'

describe('checkEnum', () => {
  describe('with value in enum', () => {
    it('should not throw an Error', () => {
      expect(() => {
        checkEnum([0, 1], 1, '')
      }).not.toThrow()
    })
  })
  describe('with value not in enum', () => {
    it('should throw a FieldEnumError', () => {
      expect(() => {
        checkEnum([0, 1], 2, '')
      }).toThrow(FieldEnumError)
    })
  })
})

describe('checkExclusiveMaximum', () => {
  describe('with exclusiveMaximum = number', () => {
    describe('with value < exclusiveMaximum', () => {
      it('should not throw an Error', () => {
        expect(() => {
          checkExclusiveMaximum(100, 99, '')
          checkExclusiveMaximum(100, 98, '')
        }).not.toThrow()
      })
    })
    describe('with value >= exclusiveMaximum', () => {
      it('should throw an Error', () => {
        expect(() => {
          checkExclusiveMaximum(100, 100, '')
        }).toThrow(FieldExclusiveMaximumError)
        expect(() => {
          checkExclusiveMaximum(100, 101, '')
        }).toThrow(FieldExclusiveMaximumError)
      })
    })
  })
})

describe('checkExclusiveMinimum', () => {
  describe('with exclusiveMinimum = number', () => {
    describe('with value > exclusiveMinimum', () => {
      it('should not throw an Error', () => {
        expect(() => {
          checkExclusiveMinimum(0, 1, '')
          checkExclusiveMinimum(0, 2, '')
        }).not.toThrow()
      })
    })
    describe('with value <= exclusiveMinimum', () => {
      it('should throw an Error', () => {
        expect(() => {
          checkExclusiveMinimum(0, 0, '')
        }).toThrow(FieldExclusiveMinimumError)
        expect(() => {
          checkExclusiveMinimum(0, -1, '')
        }).toThrow(FieldExclusiveMinimumError)
      })
    })
  })
})

describe('checkType', () => {
  describe('with type = "null"', () => {
    describe('with value = null', () => {
      it('should not throw an Error', () => {
        expect(() => {
          checkType('null', null, '')
        }).not.toThrow()
      })
    })
    describe('with value !== null', () => {
      it('should throw a FieldTypeError', () => {
        expect(() => {
          checkType('null', 'null', '')
        }).toThrow(FieldTypeError)
      })
    })
  })
})
