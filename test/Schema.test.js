/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
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

import FieldRequiredError from '../src/errors/FieldRequiredError';
import FieldUnknownError from '../src/errors/FieldUnknownError';
import ValidationError from '../src/errors/ValidationError';
import Schema from '../src/Schema';

describe('Schema', () => {
  const StringSchema = new Schema({
    string: {
      type: 'string',
      required: true,
    },
  });

  const BaseSchema = new Schema({
    array: {
      type: ['number'],
      nullable: false,
      required: true,
      defaultValue: [],
    },
    boolean: {
      type: 'boolean',
    },
    date: {
      type: Date,
      parse(value) {
        const [year, month, day] = value.split('-');
        return new Date(year, parseInt(month, 10) - 1, day);
      },
    },
    embedded: {
      type: StringSchema,
    },
    number: {
      type: 'number',
      required: true,
    },
    string: {
      type: 'string',
      required: true,
    },
  });

  it('should be importable from package', () => {
    expect(typeof Schema).toEqual('function');
  });

  describe('clone()', () => {
    it('should create a copy of the schema', () => {
      expect(BaseSchema.clone()).not.toBe(BaseSchema);
      expect(BaseSchema.clone()).toMatchObject(BaseSchema);
    });
  });

  describe('extend(schema)', () => {
    const ExtendedSchema = BaseSchema.extend({ extended: {} });

    it('should create an extended version of the schema', () => {
      expect(typeof ExtendedSchema.getField('array')).not.toBeUndefined();
      expect(typeof ExtendedSchema.getField('extended')).not.toBeUndefined();
    });

    it('should not modify parent schema', () => {
      expect(() => BaseSchema.getField('extended')).toThrow();
    });
  });

  describe('getErrors(object, options)', () => {
    describe('with valid object', () => {
      const object = { number: 1, string: 'string' };
      const errors = BaseSchema.getErrors(object);

      it('should return no errors', () => {
        expect(errors).toStrictEqual({});
      });

      it('should not throw an error', () => {
        expect(() => BaseSchema.getErrors(object)).not.toThrow();
      });
    });
    describe('with invalid object', () => {
      const object = {};
      const errors = BaseSchema.getErrors(object);

      it('should return errors', () => {
        expect(errors.number).toBeInstanceOf(FieldRequiredError);
        expect(errors.string).toBeInstanceOf(FieldRequiredError);
      });

      it('should not throw an error', () => {
        expect(() => BaseSchema.getErrors(object)).not.toThrow();
      });
    });
  });

  describe('getField(name)', () => {
    describe('with valid field name', () => {
      it('should return field properties', () => {
        expect(() => BaseSchema.getField('string').getType()).not.toThrow();
      });
    });

    describe('with invalid field name', () => {
      it('should throw an error', () => {
        expect(() => BaseSchema.getField('unknown').getType()).toThrow();
      });
    });
  });

  describe('getFields()', () => {
    it('should return all fields', () => {
      expect(BaseSchema.getFields()).toMatchObject(BaseSchema.fields);
    });
  });

  describe('parse(object)', () => {
    it('should parse boolean fields', () => {
      expect(BaseSchema.parse({ boolean: 'true' })).toEqual({ boolean: true });
      expect(BaseSchema.parse({ boolean: 'FALSE' })).toEqual({ boolean: false });
      expect(BaseSchema.parse({ boolean: 'TRUE' })).toEqual({ boolean: true });
    });

    it('should parse number fields', () => {
      expect(BaseSchema.parse({ number: '01010' })).toEqual({ number: 1010 });
      expect(BaseSchema.parse({ number: '12345' })).toEqual({ number: 12345 });
      expect(BaseSchema.parse({ number: '99.99' })).toEqual({ number: 99.99 });
    });

    it('should parse fields using custom function if present', () => {
      const object = { date: '2018-04-05' };
      const result = { date: new Date(2018, 3, 5) };
      expect(BaseSchema.parse(object)).toMatchObject(result);
    });
  });

  describe('removeUnknownFields(object)', () => {
    it('should remove unknown fields', () => {
      const object = { string: 'test', unknown: true };
      const result = { string: object.string };
      expect(BaseSchema.removeUnknownFields(object)).toMatchObject(result);
    });

    it('should remove nested unknown fields', () => {
      const object = { string: 'test', embedded: { string: 'test', unknown: true } };
      const result = { string: 'test', embedded: { string: 'test' } };
      expect(BaseSchema.removeUnknownFields(object)).toMatchObject(result);
    });
  });

  describe('resolveField(name)', () => {
    const PhoneSchema = new Schema({
      number: { type: 'string' },
    });
    const ChildSchema = new Schema({
      phones: { type: 'array', items: { type: PhoneSchema } },
    });
    const ParentSchema = new Schema({
      child: { type: 'array', items: { type: ChildSchema } },
    });
    const EmailSchema = new Schema({
      address: { type: 'string' },
    });
    const UserSchema = new Schema({
      emails: { type: 'array', items: { type: EmailSchema } },
    });

    it('should return field properties with dot syntax', () => {
      expect(() => {
        UserSchema.resolveField('emails[0].address').getType();
      }).not.toThrow();
    });

    it('should return field properties with dot syntax', () => {
      expect(() => {
        ParentSchema.resolveField('child.phones.number').getType();
        ParentSchema.resolveField('child.phones[0].number').getType();
      }).not.toThrow();
    });

    it('should return field properties with bracket syntax', () => {
      expect(() => {
        ParentSchema.resolveField('child[phones][number]').getType();
        ParentSchema.resolveField('child[phones][0][number]').getType();
      }).not.toThrow();
    });

    it('should return field properties with mixed syntax (dot + bracket)', () => {
      expect(() => {
        ParentSchema.resolveField('child.phones[number]').getType();
        ParentSchema.resolveField('child.phones[0][number]').getType();
      }).not.toThrow();
    });
  });

  describe('validate(object, options)', () => {
    describe('with invalid object', () => {
      it('should throw a ValidationError with errors details', () => {
        try {
          BaseSchema.validate({ embedded: {} });
        } catch (e) {
          expect(e.errors).not.toBeUndefined();
          expect(e.errors.number).toBeInstanceOf(FieldRequiredError);
          expect(e.errors.string).toBeInstanceOf(FieldRequiredError);
          expect(e.errors['embedded.string']).toBeInstanceOf(FieldRequiredError);
          expect(e.errors['embedded.string'].path).toBe('embedded.string');
        }
      });
    });

    describe('with ignoreMissing: Boolean', () => {
      describe('ignoreMissing: true', () => {
        it('should not throw an error for missing fields', () => {
          expect(() => {
            BaseSchema.validate({ string: 'abc' }, { ignoreMissing: true });
          }).not.toThrow();
        });

        it('should not use default value for undefined fields', () => {
          const obj = { number: 1 };
          BaseSchema.validate(obj, { ignoreMissing: true });
          expect(obj).toEqual({ number: 1 });
        });
      });

      describe('ignoreMissing: false', () => {
        it('should throw SchemaError', () => {
          expect(() => { BaseSchema.validate({}, { ignoreMissing: false }); })
            .toThrow(ValidationError);
        });

        it('should use default value for undefined fields', () => {
          const obj = { number: 1, string: 'a' };
          const result = BaseSchema.validate(obj, { ignoreMissing: false });
          expect(result).toEqual({ array: [], number: 1, string: 'a' });
        });

        it('should use default value for null fields', () => {
          const obj = { array: null, number: 1, string: 'a' };
          const result = BaseSchema.validate(obj, { ignoreMissing: false });
          expect(result).toEqual({ array: [], number: 1, string: 'a' });
        });
      });
    });

    describe('with ignoreUnknown: Boolean', () => {
      describe('ignoreUnknown: true', () => {
        it('should not throw FieldUnknownError', () => {
          const obj = { string: 'abc', xxx: null };
          expect(() => {
            StringSchema.validate(obj, { ignoreUnknown: true });
          }).not.toThrow(FieldUnknownError);
        });
        // todo check nested unknown fields
      });

      describe('ignoreUnknown: false', () => {
        it('should throw FieldUnknownError', () => {
          const obj = { string: 'abc', xxx: null };
          expect(() => { StringSchema.validate(obj, { ignoreUnknown: false }); })
            .toThrow(FieldUnknownError);
        });
        // todo check nested unknown fields
      });
    });

    describe('with removeUnknown: Boolean', () => {
      describe('removeUnknown: true', () => {
        it('should remove unknown fields', () => {
          const obj = { string: 'abc', xxx: null };
          const result = StringSchema.validate(obj, { removeUnknown: true });
          expect(result.xxx).toBeUndefined();
        });
        // todo check nested unknown fields
      });

      describe('removeUnknown: false', () => {
        it('should not remove unknown fields', () => {
          const obj = { string: 'abc', xxx: null };
          const result = StringSchema.validate(obj, {
            ignoreUnknown: true,
            removeUnknown: false,
          });
          expect(result.xxx).not.toBeUndefined();
        });
        // todo check nested unknown fields
      });
    });
  });

  describe('without(fieldNames)', () => {
    const NewSchema = BaseSchema.without(['string']);

    it('should return a schema without excluded fields', () => {
      expect(() => { NewSchema.getField('string'); }).toThrow();
    });

    it('should not modify parent schema', () => {
      expect(() => BaseSchema.getField('string')).not.toThrow();
    });
  });
});
