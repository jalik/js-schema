/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import additionalPropertiesTests from './draft2020-12/additionalProperties.json'
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
import patternTests from './draft2020-12/pattern.json'
import patternPropertiesTests from './draft2020-12/patternProperties.json'
import prefixItemsTests from './draft2020-12/prefixItems.json'
import propertiesTests from './draft2020-12/properties.json'
import propertyNamesTests from './draft2020-12/propertyNames.json'
import refTests from './draft2020-12/ref.json'
import requiredTests from './draft2020-12/required.json'
import typeTests from './draft2020-12/type.json'
import uniqueItemsTests from './draft2020-12/uniqueItems.json'
import JSONSchema from '../src/JSONSchema'
import draft202012 from '../src/schemas/draft-2020-12.json'

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
  // allOfTests, // todo
  // anchorTests, // todo
  // anyOfTests, // todo
  // booleanSchemaTests, // todo
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
  multipleOfTests, // fixme
  // notTests, // todo
  // oneOfTests, // todo
  patternTests,
  patternPropertiesTests,
  prefixItemsTests,
  propertiesTests,
  propertyNamesTests,
  refTests, // todo
  // refRemoteTests, // todo
  requiredTests,
  typeTests,
  // unevaluatedItemsTests, // todo
  // unevaluatedPropertiesTests, // todo
  uniqueItemsTests, // fixme
  // vocabularyTests // todo
]

for (const suites of list) {
  for (const suite of suites) {
    describe(suite.description, () => {
      for (const test of suite.tests) {
        it(test.description, () => {
          expect(new JSONSchema(suite.schema, {
            schemas: {
              'https://json-schema.org/draft/2020-12/schema': new JSONSchema(draft202012)
            }
          }).isValid(test.data))
            .toBe(test.valid)
        })
      }
    })
  }
}