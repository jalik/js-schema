/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Schema from '../src/schema';

describe('Schema', () => {
  const StringSchema = new Schema({
    string: {
      type: String,
      required: true,
    },
  });

  const TestSchema = new Schema({
    array: {
      type: [Number],
      nullable: false,
      required: true,
      defaultValue: [],
    },
    number: {
      type: Number,
      required: true,
    },
    string: {
      type: String,
      required: true,
    },
  });

  it('should be importable from package', () => {
    expect(typeof Schema).toEqual('function');
  });

  describe('addField(String, Object)', () => {
    it('should add a field of the schema', () => {
      const schema = new Schema({ a: { type: String } });
      schema.addField('b', { type: Number });
      expect(schema.getField('b').getType()).toEqual(Number);
    });
  });

  describe('clone()', () => {
    it('should create a copy of the schema', () => {
      const schema = new Schema({ fieldA: { type: String } });
      expect(schema.clone()).toEqual(schema);
    });
  });

  describe('extend(Object)', () => {
    it('should create an extended version of the schema', () => {
      const parent = new Schema({ fieldA: { type: String } });
      const child = parent.extend({ fieldB: { type: Number } });
      const fields = child.getFields();
      expect(typeof fields.fieldA !== 'undefined' && typeof fields.fieldB !== 'undefined').toEqual(true);
    });
  });

  describe('getField(String)', () => {
    it('should return field properties', () => {
      const fields = { text: { type: String } };
      const schema = new Schema(fields);
      expect(() => {
        // eslint-disable-next-line
        schema.getField('text').type === String;
      }).not.toThrow(Error);
    });
  });

  describe('getFields()', () => {
    it('should return all fields', () => {
      const schema = new Schema({ field: { type: Array } });
      expect(schema.getFields() !== null).toEqual(true);
    });
  });

  describe('parse(Object)', () => {
    it('should parse boolean fields', () => {
      const schema = new Schema({ boolean: { type: Boolean } });
      expect(schema.parse({ boolean: 'true' })).toEqual({ boolean: true });
      expect(schema.parse({ boolean: 'FALSE' })).toEqual({ boolean: false });
      expect(schema.parse({ boolean: 'TRUE' })).toEqual({ boolean: true });
      expect(schema.parse({ boolean: '0' })).toEqual({ boolean: false });
      expect(schema.parse({ boolean: '1' })).toEqual({ boolean: true });
    });

    it('should parse number fields', () => {
      const schema = new Schema({ number: { type: Number } });
      expect(schema.parse({ number: '01010' })).toEqual({ number: 1010 });
      expect(schema.parse({ number: '12345' })).toEqual({ number: 12345 });
      expect(schema.parse({ number: '99.99' })).toEqual({ number: 99.99 });
    });

    it('should parse fields using custom function if present', () => {
      const schema = new Schema({
        date: {
          type: Date,
          parse(value) {
            const [year, month, day] = value.split('-');
            return new Date(year, parseInt(month, 10) - 1, day);
          },
        },
      });
      expect(schema.parse({
        date: '2018-04-05',
      })).toEqual({
        date: new Date(2018, 3, 5),
      });
    });
  });

  describe('removeUnknownFields(Object)', () => {
    it('should remove unknown fields', () => {
      const schema = new Schema({ a: { type: Number } });
      expect(schema.removeUnknownFields({ a: 1, b: 2, c: 3 })).toEqual({ a: 1 });
    });
    it('should remove nested unknown fields', () => {
      const schema = new Schema({
        a: { type: Number },
        b: { type: new Schema({ b: { type: Number } }) },
      });
      expect(schema.removeUnknownFields({
        a: 1,
        b: {
          b: 2, d: 9,
        },
        c: 3,
      })).toEqual({
        a: 1,
        b: { b: 2 },
      });
    });
  });

  describe('resolveField(String)', () => {
    it('should return field properties', () => {
      const PhoneSchema = new Schema({
        number: { type: String },
      });
      const ChildSchema = new Schema({
        phones: { type: [PhoneSchema] },
      });
      const ParentSchema = new Schema({
        child: { type: ChildSchema },
      });
      expect(() => {
        ParentSchema.resolveField('child[phones][number]').getType();
        ParentSchema.resolveField('child[phones][0][number]').getType();
      }).not.toThrow(Error);
    });
  });

  describe('update(Object)', () => {
    it('should modify the schema', () => {
      const PhoneSchema = new Schema({
        number: {
          type: String,
          required: true,
        },
      });
      const PersonSchema = new Schema({
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: PhoneSchema.clone().update({
            number: { required: false },
          }),
          required: true,
        },
      });
      expect(PersonSchema.getField('name').isRequired()).toEqual(true);
      expect(PersonSchema.getField('phone[number]').isRequired()).toEqual(false);
      expect(PhoneSchema.getField('number').isRequired()).toEqual(true);
    });
  });

  describe('validate(Object, Object)', () => {
    describe('ignoreMissing: true', () => {
      it('should not throw an error for missing fields', () => {
        expect(() => {
          TestSchema.validate({ string: 'abc' }, {
            ignoreMissing: true,
          });
        }).not.toThrow(Error);
      });
      it('should not use default value for undefined fields', () => {
        const obj = { number: 1 };
        TestSchema.validate(obj, {
          ignoreMissing: true,
        });
        expect(obj).toEqual({ number: 1 });
      });
    });

    describe('ignoreMissing: false', () => {
      it('should throw an error for missing fields', () => {
        expect(() => {
          TestSchema.validate({ string: 'abc' }, {
            ignoreMissing: false,
          });
        }).toThrow(Error);
      });
      it('should use default value for undefined fields', () => {
        const obj = { number: 1, string: 'a' };
        TestSchema.validate(obj, {
          ignoreMissing: false,
        });
        expect(obj).toEqual({ array: [], number: 1, string: 'a' });
      });
      it('should use default value for null fields', () => {
        const obj = { array: null, number: 1, string: 'a' };
        TestSchema.validate(obj, {
          ignoreMissing: false,
        });
        expect(obj).toEqual({ array: [], number: 1, string: 'a' });
      });
    });

    describe('ignoreUnknown: true', () => {
      it('should not throw an error for unknown fields', () => {
        expect(() => {
          StringSchema.validate({ string: 'abc', xxx: null }, {
            ignoreUnknown: true,
          });
        }).not.toThrow(Error);
      });
    });

    describe('ignoreUnknown: false', () => {
      it('should throw an error for unknown fields', () => {
        expect(() => {
          StringSchema.validate({ string: 'abc', xxx: null }, {
            ignoreUnknown: false,
          });
        }).toThrow(Error);
      });
    });

    describe('removeUnknown: true', () => {
      it('should remove unknown fields', () => {
        const obj = { string: 'abc', xxx: null };
        StringSchema.validate(obj, {
          clean: true,
          ignoreUnknown: true,
          removeUnknown: true,
        });
        expect(typeof obj.xxx === 'undefined').toEqual(true);
      });
    });

    describe('removeUnknown: false', () => {
      it('should not remove unknown fields', () => {
        const obj = { string: 'abc', xxx: null };
        StringSchema.validate(obj, {
          clean: true,
          ignoreUnknown: true,
          removeUnknown: false,
        });
        expect(typeof obj.xxx !== 'undefined').toEqual(true);
      });
    });
  });
});
