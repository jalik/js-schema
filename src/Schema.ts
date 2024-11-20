/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import JSONSchema, { SchemaAttributes } from './JSONSchema'

class Schema<A extends SchemaAttributes> extends JSONSchema<A> {
  constructor (properties: A['properties'], others?: A) {
    super({ ...others, properties } as A)
  }
}

export default Schema
