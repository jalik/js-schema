/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import JSONSchema from '../src/JSONSchema'
import draft202012 from '../src/schemas/draft-2020-12.json'

type Draft202012Test = {
  description: string;
  data: any;
  valid: boolean;
}

type JsonTestSuite = {
  description: string;
  schema: boolean | object;
  tests: Draft202012Test[]
}

const files = [
  'additionalProperties.json',
  'allOf.json',
  // 'anchor.json',
  'anyOf.json',
  'boolean_schema.json',
  'const.json',
  'contains.json',
  'content.json',
  'default.json',
  // 'defs.json', // todo after ref.json
  // 'dependentRequired.json',
  // 'dependentSchemas.json',
  // 'dynamicRef.json',
  'enum.json',
  'exclusiveMaximum.json',
  'exclusiveMinimum.json',
  'format.json',
  // 'if-then-else.json',
  'infinite-loop-detection.json',
  'items.json',
  'maxContains.json',
  'maximum.json',
  'maxItems.json',
  'maxLength.json',
  'maxProperties.json',
  'minContains.json',
  'minimum.json',
  'minItems.json',
  'minLength.json',
  'minProperties.json',
  'multipleOf.json',
  'not.json',
  'oneOf.json',
  'pattern.json',
  'patternProperties.json',
  'prefixItems.json',
  'properties.json',
  'propertyNames.json',
  // 'ref.json',
  // 'refRemote.json',
  'required.json',
  'type.json',
  // 'unevaluatedItems.json',
  // 'unevaluatedProperties.json',
  'uniqueItems.json',
  'vocabulary.json',

  // optional features
  // path.join('optional', 'format', 'date.json'),
  // path.join('optional', 'format', 'date-time.json')
  // path.join('optional', 'format', 'duration.json'),
  // path.join('optional', 'format', 'ecmascript-regex.json'),
  // path.join('optional', 'format', 'email.json'),
  // path.join('optional', 'format', 'hostname.json'),
  // path.join('optional', 'format', 'idn-email.json'),
  // path.join('optional', 'format', 'idn-hostname.json'),
  // path.join('optional', 'format', 'ipv4.json'),
  // path.join('optional', 'format', 'ipv6.json'),
  // path.join('optional', 'format', 'iri.json'),
  // path.join('optional', 'format', 'iri-reference.json'),
  // path.join('optional', 'format', 'json-pointer.json'),
  // path.join('optional', 'format', 'regex.json'),
  // path.join('optional', 'format', 'relative-json-pointer.json'),
  // path.join('optional', 'format', 'time.json'),
  // path.join('optional', 'format', 'unknown.json'),
  // path.join('optional', 'format', 'uri.json'),
  // path.join('optional', 'format', 'uri-reference.json'),
  // path.join('optional', 'format', 'uri-template.json'),
  // path.join('optional', 'format', 'uuid.json'),
  // path.join('optional', 'anchor.json'),
  path.join('optional', 'bignum.json')
  // path.join('optional', 'cross-draft.json'),
  // path.join('optional', 'dependencies-compatibility.json'),
  // path.join('optional', 'dynamicRef.json'),
  // path.join('optional', 'ecmascript-regex.json'),
  // path.join('optional', 'float-overflow.json'),
  // path.join('optional', 'format-assertion.json'),
  // path.join('optional', 'id.json'),
  // path.join('optional', 'no-schema.json'),
  // path.join('optional', 'non-bmp-regex.json'),
  // path.join('optional', 'refOfUnknownKeyword.json'),
  // path.join('optional', 'unknownKeyword.json'),
]

const schema = new JSONSchema(draft202012)
const dir = path.join(import.meta.dirname, 'draft2020-12')

for (const file of files) {
  const content = await fs.promises.readFile(path.join(dir, file), 'utf8')
  const suites = JSON.parse(content) as JsonTestSuite[]

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
            schemas: { 'https://json-schema.org/draft/2020-12/schema': schema }
          }).isValid(test.data)

          expect(isValid).toBe(test.valid)
        })
      }
    })
  }
}
