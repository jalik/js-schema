/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import additionalPropertiesTests from './draft2020-12/additionalProperties.json'
import allOfTests from './draft2020-12/allOf.json'
import anchorTests from './draft2020-12/anchor.json'
import anyOfTests from './draft2020-12/anyOf.json'
import booleanSchemaTests from './draft2020-12/boolean_schema.json'
import constTests from './draft2020-12/const.json'
import containsTests from './draft2020-12/contains.json'
import contentTests from './draft2020-12/content.json'
import defsTests from './draft2020-12/defs.json'
import dependentRequiredTests from './draft2020-12/dependentRequired.json'
import dependentSchemasTests from './draft2020-12/dependentSchemas.json'
import dynamicRefTests from './draft2020-12/dynamicRef.json'
import enumTests from './draft2020-12/enum.json'
import exclusiveMaximumTests from './draft2020-12/exclusiveMaximum.json'
import exclusiveMinimumTests from './draft2020-12/exclusiveMinimum.json'
import formatTests from './draft2020-12/format.json'
import ifThenElseTests from './draft2020-12/if-then-else.json'
import itemsTests from './draft2020-12/items.json'
import maxContainsTests from './draft2020-12/maxContains.json'
import maximumTests from './draft2020-12/maximum.json'
import maxItemsTests from './draft2020-12/maxItems.json'
import maxLengthTests from './draft2020-12/maxLength.json'
import maxPropertiesTests from './draft2020-12/maxProperties.json'
import minContainsTests from './draft2020-12/minContains.json'
import minimumTests from './draft2020-12/minimum.json'
import minItemsTests from './draft2020-12/minItems.json'
import minLengthTests from './draft2020-12/minLength.json'
import minPropertiesTests from './draft2020-12/minProperties.json'
import multipleOfTests from './draft2020-12/multipleOf.json'
import notTests from './draft2020-12/not.json'
import oneOfTests from './draft2020-12/oneOf.json'
import patternTests from './draft2020-12/pattern.json'
import patternPropertiesTests from './draft2020-12/patternProperties.json'
import prefixItemsTests from './draft2020-12/prefixItems.json'
import propertiesTests from './draft2020-12/properties.json'
import propertyNamesTests from './draft2020-12/propertyNames.json'
import refTests from './draft2020-12/ref.json'
import refRemoteTests from './draft2020-12/refRemote.json'
import requiredTests from './draft2020-12/required.json'
import typeTests from './draft2020-12/type.json'
import unevaluatedItemsTests from './draft2020-12/unevaluatedItems.json'
import unevaluatedPropertiesTests from './draft2020-12/unevaluatedProperties.json'
import uniqueItemsTests from './draft2020-12/uniqueItems.json'
import vocabularyTests from './draft2020-12/vocabulary.json'
import JSONSchema from '../src/JSONSchema'

type JsonTest = {
  description: string;
  data: any;
  valid: boolean;
}

type JsonTestSuite = {
  description: string;
  schema: object;
  tests: JsonTest[]
}

const list: JsonTestSuite[][] = [
  additionalPropertiesTests,
  allOfTests,
  anchorTests,
  anyOfTests,
  booleanSchemaTests,
  constTests,
  containsTests,
  contentTests,
  defsTests,
  dependentRequiredTests,
  dependentSchemasTests,
  dynamicRefTests,
  enumTests,
  exclusiveMaximumTests,
  exclusiveMinimumTests,
  formatTests,
  ifThenElseTests,
  itemsTests,
  maxContainsTests,
  maximumTests,
  maxItemsTests,
  maxLengthTests,
  maxPropertiesTests,
  minContainsTests,
  minimumTests,
  minItemsTests,
  minLengthTests,
  minPropertiesTests,
  multipleOfTests,
  notTests,
  oneOfTests,
  patternTests,
  patternPropertiesTests,
  prefixItemsTests,
  propertiesTests,
  propertyNamesTests,
  refTests,
  refRemoteTests,
  requiredTests,
  typeTests,
  unevaluatedItemsTests,
  unevaluatedPropertiesTests,
  uniqueItemsTests,
  vocabularyTests
]

for (const suites of list) {
  for (const suite of suites) {
    describe(suite.description, () => {
      for (const test of suite.tests) {
        it(test.description, () => {
          expect(new JSONSchema(suite.schema).isValid(test.data))
            .toBe(test.valid)
        })
      }
    })
  }
}
