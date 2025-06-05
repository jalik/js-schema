/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import additionalPropertiesTests from './draft2020-12/additionalProperties.json'
import allOfTests from './draft2020-12/allOf.json'
import anyOfTests from './draft2020-12/anyOf.json'
import booleanSchemaTests from './latest/boolean_schema.json'
import constTests from './draft2020-12/const.json'
import containsTests from './draft2020-12/contains.json'
import contentTests from './draft2020-12/content.json'
import defsTests from './draft2020-12/defs.json'
import enumTests from './draft2020-12/enum.json'
import exclusiveMaximumTests from './draft2020-12/exclusiveMaximum.json'
import exclusiveMinimumTests from './draft2020-12/exclusiveMinimum.json'
import formatTests from './draft2020-12/format.json'
import itemsTests from './draft2020-12/items.json'
import maximumTests from './draft2020-12/maximum.json'
import maxContainsTests from './draft2020-12/maxContains.json'
import maxItemsTests from './draft2020-12/maxItems.json'
import maxLengthTests from './draft2020-12/maxLength.json'
import maxPropertiesTests from './draft2020-12/maxProperties.json'
import minimumTests from './draft2020-12/minimum.json'
import minContainsTests from './draft2020-12/minContains.json'
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
import requiredTests from './draft2020-12/required.json'
import typeTests from './draft2020-12/type.json'
// import unevaluatedPropertiesTests from './draft2020-12/unevaluatedProperties.json' // todo - implementation needs more work
import uniqueItemsTests from './draft2020-12/uniqueItems.json'
import vocabularyTests from './draft2020-12/vocabulary.json'
import JSONSchema from '../src/JSONSchema'
import draft202012 from '../src/schemas/draft-2020-12.json'

type JsonTest = {
  description: string;
  data: any;
  valid: boolean;
}

type JsonTestSuite = {
  description: string;
  schema: boolean | object;
  tests: JsonTest[]
}

const list: JsonTestSuite[][] = [
  additionalPropertiesTests,
  allOfTests,
  // anchorTests, // todo
  anyOfTests,
  booleanSchemaTests,
  constTests,
  containsTests,
  contentTests, // todo
  defsTests, // fixme
  // dependentRequiredTests, // todo
  // dependentSchemasTests, // todo
  // dynamicRefTests, // todo
  enumTests,
  exclusiveMaximumTests,
  exclusiveMinimumTests,
  formatTests, // fixme
  // ifThenElseTests, // todo
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
  // refTests, // todo
  // refRemoteTests, // todo
  requiredTests,
  typeTests,
  // unevaluatedItemsTests, // todo
  // unevaluatedPropertiesTests, // todo
  uniqueItemsTests,
  vocabularyTests // todo
]

for (const suites of list) {
  for (const suite of suites) {
    describe(`${suite.description}`, () => {
      for (const test of suite.tests) {
        it(`${test.description}`, () => {
          // Handle boolean schemas
          if (typeof suite.schema === 'boolean') {
            // For boolean schema 'true', all values are valid
            // For boolean schema 'false', all values are invalid
            expect(suite.schema).toBe(test.valid)
            return
          }

          const isValid = new JSONSchema(suite.schema, {
            schemas: {
              'https://json-schema.org/draft/2020-12/schema': new JSONSchema(draft202012)
            }
          }).isValid(test.data)

          expect(isValid).toBe(test.valid)
        })
      }
    })
  }
}
