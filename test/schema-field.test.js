/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
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
import SchemaField from '../src/schema-field';

describe('SchemaField', () => {
  it('should be importable from package', () => {
    expect(typeof SchemaField).toEqual('function');
  });

  describe('getAllowedValues()', () => {
    it('should return allowed values', () => {
      const field = new SchemaField('quantity', {
        type: Number,
        allowed: [10, 20],
      });
      expect(field.getAllowedValues()).toEqual([10, 20]);
    });
  });

  describe('getCheckFunction()', () => {
    it('should return check function', () => {
      const checkFunction = value => value > 10 && value < 20;
      const field = new SchemaField('quantity', {
        type: Number,
        check: checkFunction,
      });
      expect(field.getCheckFunction()).toEqual(checkFunction);
    });
  });

  describe('getCleanFunction()', () => {
    it('should return clean function', () => {
      const clean = value => value && value.trim();
      const field = new SchemaField('text', {
        type: String,
        clean,
      });
      expect(field.getCleanFunction()).toEqual(clean);
    });
  });

  describe('getDefaultValue()', () => {
    it('should return default value', () => {
      const field = new SchemaField('quantity', {
        type: Number,
        defaultValue: 99,
      });
      expect(field.getDefaultValue()).toEqual(99);
    });
  });

  describe('getDeniedValues()', () => {
    it('should return denied values', () => {
      const field = new SchemaField('quantity', {
        type: Number,
        denied: [5, 15],
      });
      expect(field.getDeniedValues()).toEqual([5, 15]);
    });
  });

  describe('getLabel()', () => {
    it('should return label', () => {
      const field = new SchemaField('name', {
        type: String,
        label: 'Name',
      });
      expect(field.getLabel()).toEqual('Name');
    });
  });

  describe('getLength()', () => {
    it('should return length', () => {
      const field = new SchemaField('name', {
        type: String,
        length: 10,
      });
      expect(field.getLength()).toEqual(10);
    });
  });

  describe('getMaxValue()', () => {
    it('should return max value', () => {
      const field = new SchemaField('num', {
        type: Number,
        max: 100,
      });
      expect(field.getMaxValue()).toEqual(100);
    });
  });

  describe('getMaxWords()', () => {
    it('should return max words', () => {
      const field = new SchemaField('text', {
        type: String,
        maxWords: 30,
      });
      expect(field.getMaxWords()).toEqual(30);
    });
  });

  describe('getMinValue()', () => {
    it('should return min value', () => {
      const field = new SchemaField('num', {
        type: Number,
        min: 100,
      });
      expect(field.getMinValue()).toEqual(100);
    });
  });

  describe('getMinWords()', () => {
    it('should return min words', () => {
      const field = new SchemaField('text', {
        type: String,
        minWords: 30,
      });
      expect(field.getMinWords()).toEqual(30);
    });
  });

  describe('getName()', () => {
    it('should return field name', () => {
      const field = new SchemaField('text', {
        type: String,
      });
      expect(field.getName()).toEqual('text');
    });
  });

  describe('getPrepareFunction()', () => {
    it('should return prepare function', () => {
      const prepareFunction = value => String(value);
      const field = new SchemaField('text', {
        type: String,
        prepare: prepareFunction,
      });
      expect(field.getPrepareFunction()).toEqual(prepareFunction);
    });
  });

  describe('isDecimal()', () => {
    it('should return a boolean', () => {
      const field = new SchemaField('quantity', {
        type: Number,
        decimal: false,
      });
      expect(field.isDecimal()).toEqual(false);
    });
  });

  describe('isNullable()', () => {
    it('should return a boolean', () => {
      const field = new SchemaField('quantity', {
        type: Number,
        nullable: false,
      });
      expect(field.isNullable()).toEqual(false);
    });
  });

  describe('isRequired()', () => {
    it('should return a boolean', () => {
      const field = new SchemaField('quantity', {
        type: Number,
        nullable: true,
      });
      expect(field.isRequired()).toEqual(true);
    });
  });

  describe('constructor(name, props)', () => {
    describe('allowed: (Array|Function)', () => {
      describe('allowed: Array', () => {
        const field = new SchemaField('strings', {
          type: [String],
          nullable: false,
          required: false,
          allowed: ['off', 'on'],
        });

        describe('allowed values', () => {
          it('should not throw an Error', () => {
            expect(() => {
              field.validate(['on', 'off']);
            }).not.toThrow(Error);
          });
        });

        describe('not allowed values', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(['no', 'yes']);
            }).toThrow(Error);
          });
        });
      });

      describe('allowed: Function', () => {
        const field = new SchemaField('strings', {
          type: [String],
          nullable: false,
          required: false,
          allowed() {
            return ['off', 'on'];
          },
        });

        describe('allowed values', () => {
          it('should not throw an Error', () => {
            expect(() => {
              field.validate(['on', 'off']);
            }).not.toThrow(Error);
          });
        });

        describe('not allowed values', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(['no', 'yes']);
            }).toThrow(Error);
          });
        });
      });
    });

    describe('check: Function', () => {
      describe('check on Array', () => {
        const field = new SchemaField('array', {
          type: [Number],
          nullable: false,
          required: false,
          check(value) {
            for (let i = 0; i < value.length; i += 1) {
              if (value[i] % 2 === 1) {
                return false;
              }
            }
            return true;
          },
        });

        describe('correct values', () => {
          it('should not throw an Error', () => {
            expect(() => {
              field.validate([2, 4, 6, 8, 10]);
            }).not.toThrow(Error);
          });
        });

        describe('incorrect values', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate([1, 3, 6, 7]);
            }).toThrow(Error);
          });
        });
      });

      describe('check on Number', () => {
        const field = new SchemaField('number', {
          type: Number,
          nullable: false,
          required: false,
          check(value) {
            return value % 2 === 0;
          },
        });

        describe('correct value', () => {
          it('should not throw an Error', () => {
            expect(() => {
              field.validate(2);
              field.validate(4);
              field.validate(6);
              field.validate(8);
            }).not.toThrow(Error);
          });
        });

        describe('incorrect value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(1);
            }).toThrow(Error);
          });
        });
      });
    });

    describe('clean: Function', () => {
      const field = new SchemaField('text', {
        type: String,
        nullable: false,
        required: false,
        clean(value) {
          return value && value.length ? value.trim().toLowerCase() : value;
        },
      });

      it('should execute function on field value', () => {
        expect(field.validate(' HELLO  ', { clean: true })).toEqual('hello');
      });
    });

    describe('prepare: Function', () => {
      const field = new SchemaField('price', {
        type: String,
        prepare(value) {
          return `${value}F`;
        },
      });

      it('should execute function on field value', () => {
        expect(field.validate(1000)).toEqual('1000F');
      });
    });

    describe('defaultValue: (*|Function)', () => {
      describe('defaultValue: String', () => {
        const field = new SchemaField('optional', {
          type: String,
          nullable: true,
          required: false,
          defaultValue: 'test',
        });

        describe('default value', () => {
          it('should not be returned when field is not required and can be null', () => {
            expect(field.validate(null)).toEqual(null);
            expect(field.validate(undefined)).toEqual(undefined);
          });
        });
      });

      describe('defaultValue: [Number]', () => {
        const field = new SchemaField('numbers', {
          type: [Number],
          nullable: false,
          required: true,
          defaultValue: [0, 2],
        });

        describe('empty array', () => {
          it('should return default values', () => {
            expect(field.validate(undefined)).toEqual([0, 2]);
            expect(field.validate(null)).toEqual([0, 2]);
          });
        });

        describe('filled array', () => {
          it('should not be replaced with default value', () => {
            expect(field.validate([1, 3])).toEqual([1, 3]);
          });
        });
      });

      describe('defaultValue: Boolean', () => {
        const field = new SchemaField('bool', {
          type: Boolean,
          nullable: false,
          required: true,
          defaultValue: true,
        });

        describe('empty value', () => {
          it('should return default value', () => {
            expect(field.validate(undefined)).toEqual(field.getDefaultValue());
          });
        });

        describe('filled value', () => {
          it('should not be replaced with default value', () => {
            expect(field.validate(false)).toEqual(false);
          });
        });
      });

      describe('defaultValue: Function', () => {
        let date = null;

        const field = new SchemaField('text', {
          type: Date,
          nullable: false,
          required: true,
          defaultValue() {
            date = new Date();
            return date;
          },
        });

        describe('empty value', () => {
          it('should return default value', () => {
            expect(field.validate(undefined)).toEqual(date);
          });
        });

        describe('filled value', () => {
          it('should not be replaced with default value', () => {
            const now = new Date();
            expect(field.validate(now)).toEqual(now);
          });
        });
      });

      describe('defaultValue: Number', () => {
        const field = new SchemaField('number', {
          type: Number,
          nullable: false,
          required: true,
          defaultValue: 100,
        });

        describe('empty value', () => {
          it('should return default value', () => {
            expect(field.validate(undefined)).toEqual(field.getDefaultValue());
          });
        });

        describe('filled value', () => {
          it('should not be replaced with default value', () => {
            expect(field.validate(50)).toEqual(50);
          });
        });
      });

      describe('defaultValue: String', () => {
        const field = new SchemaField('text', {
          type: String,
          nullable: false,
          required: true,
          defaultValue: 'default',
        });

        describe('empty value', () => {
          it('should return default value', () => {
            expect(field.validate(undefined)).toEqual(field.getDefaultValue());
          });
        });

        describe('filled value', () => {
          it('should not be replaced with default value', () => {
            expect(field.validate('karl')).toEqual('karl');
          });
        });
      });
    });

    describe('denied: (Array|Function)', () => {
      describe('denied: Array', () => {
        const field = new SchemaField('string', {
          type: [String],
          nullable: false,
          required: false,
          denied: ['yes', 'no'],
        });

        describe('denied values', () => {
          it('should not throw an Error', () => {
            expect(() => {
              field.validate(['maybe', 'sometimes', 'often']);
            }).not.toThrow(Error);
          });
        });

        describe('not denied values', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(['yes', 'maybe']);
            }).toThrow(Error);
          });
        });
      });

      describe('denied: Function', () => {
        const field = new SchemaField('numbers', {
          type: [String],
          nullable: false,
          required: false,
          denied() {
            return ['yes', 'no'];
          },
        });

        describe('denied values', () => {
          it('should not throw an Error', () => {
            expect(() => {
              field.validate(['maybe', 'sometimes', 'often']);
            }).not.toThrow(Error);
          });
        });

        describe('not denied values', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(['yes', 'maybe']);
            }).toThrow(Error);
          });
        });
      });
    });

    describe('length: (Array|Number|Function)', () => {
      const FixedLengthSchema = new Schema({
        array: {
          type: Array,
          required: false,
          length: 3,
        },
        object: {
          type: Object,
          required: false,
          length: 22,
        },
        string: {
          type: String,
          required: false,
          length: 5,
        },
      });

      const LimitedLengthSchema = new Schema({
        array: {
          type: Array,
          required: false,
          length: [3, 6],
        },
        object: {
          type: Object,
          required: false,
          length: [5, 10],
        },
        string: {
          type: String,
          required: false,
          length: [5, 10],
        },
      });

      describe('Fixed length', () => {
        describe('Array field with a wrong length', () => {
          it('should throw an Error', () => {
            expect(() => {
              FixedLengthSchema.validate({ array: [1] });
            }).toThrow();
          });
        });

        describe('Array field with the exact length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ array: [1, 2, 3] });
            }).not.toThrow();
          });
        });

        describe('Object field with a wrong length', () => {
          it('should throw an Error', () => {
            expect(() => {
              FixedLengthSchema.validate({ object: { length: 8 } });
            }).toThrow();
          });
        });

        describe('Object field with the exact length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              FixedLengthSchema.validate({ object: { length: 22 } });
            }).not.toThrow();
          });
        });

        describe('String field with a wrong length', () => {
          it('should throw an Error', () => {
            expect(() => {
              FixedLengthSchema.validate({ string: 'xx' });
            }).toThrow();
          });
        });

        describe('String field with the exact length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ string: 'aaaaa' });
            }).not.toThrow();
          });
        });
      });

      describe('Minimal length', () => {
        describe('Array field with length < min length', () => {
          it('should throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ array: [1] });
            }).toThrow();
          });
        });

        describe('Array field with length > min length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ array: [1, 2, 3, 4] });
            }).not.toThrow();
          });
        });

        describe('Object field with length < min length', () => {
          it('should throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ object: { length: 0 } });
            }).toThrow();
          });
        });
        describe('Object field with length > min length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ object: { length: 5 } });
            }).not.toThrow();
          });
        });

        describe('String field with length < min length', () => {
          it('should throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ string: 'shor' });
            }).toThrow();
          });
        });

        describe('String field with length > min length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ string: '123456' });
            }).not.toThrow();
          });
        });
      });

      describe('Maximal length', () => {
        describe('Array field with length > max length', () => {
          it('should throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ array: [1, 2, 3, 4, 5, 6, 7, 8] });
            }).toThrow();
          });
        });

        describe('Array field with length < max length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ array: [1, 2, 3] });
            }).not.toThrow();
          });
        });

        describe('Object field with length > max length', () => {
          it('should throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ object: { length: 99 } });
            }).toThrow();
          });
        });

        describe('Object field with length < max length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ object: { length: 6 } });
            }).not.toThrow();
          });
        });

        describe('String field with length > max length', () => {
          it('should throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ string: 'loooooooooong' });
            }).toThrow();
          });
        });

        describe('String field with length < max length', () => {
          it('should not throw an Error', () => {
            expect(() => {
              LimitedLengthSchema.validate({ string: '1234567' });
            }).not.toThrow();
          });
        });
      });
    });

    describe('max: (Number|Date|Function)', () => {
      const MaxSchema = new Schema({
        array: {
          type: Array,
          required: false,
          max: 10,
        },
        date: {
          type: Date,
          required: false,
          max: new Date(),
        },
        number: {
          type: Number,
          required: false,
          max: 10,
        },
      });

      describe('Array field with values higher than max', () => {
        it('should throw an Error', () => {
          expect(() => {
            MaxSchema.validate({ array: [99] });
          }).toThrow();
        });
      });

      describe('Array field with values lower than max', () => {
        it('should not throw an Error', () => {
          expect(() => {
            MaxSchema.validate({ array: [9, 5, 0, -100] });
          }).not.toThrow();
        });
      });

      describe('Date field with value higher than max', () => {
        it('should throw an Error', () => {
          expect(() => {
            MaxSchema.validate({ date: new Date(Date.now() + 10000) });
          }).toThrow();
        });
      });

      describe('Date field with value lower than max', () => {
        it('should not throw an Error', () => {
          expect(() => {
            MaxSchema.validate({ date: new Date(Date.now() - 10000) });
          }).not.toThrow();
        });
      });

      describe('Number field with value higher than max', () => {
        it('should throw an Error', () => {
          expect(() => {
            MaxSchema.validate({ number: 99 });
          }).toThrow();
        });
      });

      describe('Number field with value lower than max', () => {
        it('should not throw an Error', () => {
          expect(() => {
            MaxSchema.validate({ number: 5 });
          }).not.toThrow();
        });
      });
    });

    describe('min: (Number|Date|Function)', () => {
      const MinSchema = new Schema({
        array: {
          type: Array,
          required: false,
          min: 10,
        },
        date: {
          type: Date,
          required: false,
          min: new Date(),
        },
        number: {
          type: Number,
          required: false,
          min: 10,
        },
      });

      describe('Array field with values lower than min', () => {
        it('should throw an Error', () => {
          expect(() => {
            MinSchema.validate({ array: [-5] });
          }).toThrow();
        });
      });

      describe('Array field with values higher than min', () => {
        it('should not throw an Error', () => {
          expect(() => {
            MinSchema.validate({ array: [20, 30, 40] });
          }).not.toThrow();
        });
      });

      describe('Date field with value lower than min', () => {
        it('should throw an Error', () => {
          expect(() => {
            MinSchema.validate({ date: new Date(Date.now() - 10000) });
          }).toThrow();
        });
      });

      describe('Date field with value higher than min', () => {
        it('should not throw an Error', () => {
          expect(() => {
            MinSchema.validate({ date: new Date(Date.now() + 10000) });
          }).not.toThrow();
        });
      });

      describe('Number field with value lower than min', () => {
        it('should throw an Error', () => {
          expect(() => {
            MinSchema.validate({ number: 0 });
          }).toThrow();
        });
      });

      describe('Number field with value higher than min', () => {
        it('should not throw an Error', () => {
          expect(() => {
            MinSchema.validate({ number: 100 });
          }).not.toThrow();
        });
      });
    });

    describe('nullable: (Boolean|Function)', () => {
      describe('Not nullable field with null value', () => {
        it('should throw an Error', () => {
          expect(() => {
            new Schema({
              text: {
                type: String,
                nullable: false,
                required: false,
              },
            }).validate({ text: null });
          }).toThrow();
        });
      });

      describe('Nullable field with null value', () => {
        it('should not throw an Error', () => {
          expect(() => {
            new Schema({
              text: {
                type: String,
                nullable: true,
                required: false,
              },
            }).validate({ text: null });
          }).not.toThrow();
        });
      });
    });

    describe('required: (Boolean|Function)', () => {
      const Address = new Schema({
        city: {
          type: String,
          length: [0, 30],
          required: true,
          nullable: true,
        },
      });

      const Person = new Schema({
        address: {
          type: Address,
          required: true,
          nullable: true,
        },
        name: {
          type: String,
          required: true,
          nullable: true,
        },
      });

      const PostSchema = new Schema({
        text: {
          type: String,
          nullable: false,
          required(context) {
            return context.status === 'published';
          },
        },
        status: {
          type: String,
          required: true,
          allowed: ['published', 'draft'],
        },
      });

      describe('Dynamically required field with undefined value', () => {
        it('should throw an error', () => {
          expect(() => {
            PostSchema.validate({ status: 'published' });
          }).toThrow();
        });
      });

      describe('Dynamically not required field with undefined value', () => {
        it('should not throw an error', () => {
          expect(() => {
            PostSchema.validate({ status: 'draft' });
          }).not.toThrow();
        });
      });

      describe('Required field with undefined value', () => {
        it('should throw an error', () => {
          expect(() => {
            new Schema({
              text: {
                type: String,
                required: true,
                nullable: false,
              },
            }).validate({});
            Person.validate({
              address: {},
              name: 'karl',
            });
          }).toThrow();
        });
      });

      describe('Required field with null value', () => {
        it('should throw an error', () => {
          expect(() => {
            new Schema({
              text: {
                type: String,
                required: true,
                nullable: false,
              },
            }).validate({ text: null });
          }).toThrow();
        });
      });

      describe('Required field with empty string', () => {
        it('should throw an error', () => {
          expect(() => {
            new Schema({
              text: {
                type: String,
                required: true,
                nullable: false,
              },
            }).validate({ text: '' });
          }).toThrow();
        });
      });

      describe('Not required field with undefined value', () => {
        it('should not throw an error', () => {
          expect(() => {
            new Schema({
              text: {
                type: String,
                required: false,
                nullable: true,
              },
            }).validate({});
          }).not.toThrow();
        });
      });

      describe('Not required field with null value', () => {
        it('should not throw an error', () => {
          expect(() => {
            new Schema({
              text: {
                type: String,
                required: false,
                nullable: true,
              },
            }).validate({ text: null });
          }).not.toThrow();
        });
      });

      describe('Not required field with string value', () => {
        it('should not throw an error', () => {
          expect(() => {
            new Schema({
              text: {
                type: String,
                required: false,
                nullable: true,
              },
            }).validate({ text: 'abc' });
          }).not.toThrow();
        });
      });
    });

    describe('type: (Array|Boolean|Number|Object|String)', () => {
      describe('type: [Boolean]', () => {
        const field = new SchemaField('booleans', {
          type: [Boolean],
          required: true,
        });

        describe('boolean values', () => {
          it('should not throw an error', () => {
            expect(() => {
              field.validate([true, false, false]);
            }).not.toThrow(Error);
          });
        });

        describe('mixed values', () => {
          it('should throw an error', () => {
            expect(() => {
              field.validate([true, 100, 'false']);
            }).toThrow(Error);
          });
        });
      });

      describe('type: [Number]', () => {
        const field = new SchemaField('numbers', {
          type: [Number],
          required: true,
        });

        describe('number values', () => {
          it('should not throw an error', () => {
            expect(() => {
              field.validate([0, 1, 2]);
            }).not.toThrow(Error);
          });
        });

        describe('mixed values', () => {
          it('should throw an error', () => {
            expect(() => {
              field.validate([true, 100, 'false']);
            }).toThrow(Error);
          });
        });
      });

      describe('type: [String]', () => {
        const field = new SchemaField('strings', {
          type: [String],
          required: true,
        });

        describe('string values', () => {
          it('should not throw an error', () => {
            expect(() => {
              field.validate(['a', 'b', 'c']);
            }).not.toThrow(Error);
          });
        });

        describe('mixed values', () => {
          it('should throw an error', () => {
            expect(() => {
              field.validate([true, 100, 'false']);
            }).toThrow(Error);
          });
        });
      });

      describe('type: Boolean', () => {
        const field = new SchemaField('bool', {
          type: Boolean,
          required: true,
        });

        describe('boolean value', () => {
          it('should not throw an error', () => {
            expect(() => {
              field.validate(true);
            }).not.toThrow(Error);
          });
        });

        describe('float value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(13.37);
            }).toThrow(Error);
          });
        });

        describe('integer value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(100);
            }).toThrow(Error);
          });
        });

        describe('string value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate('hello');
            }).toThrow(Error);
          });
        });
      });

      describe('type: Number (float)', () => {
        const field = new SchemaField('float', {
          type: Number,
          required: true,
          decimal: true,
        });

        describe('float value', () => {
          it('should not throw an error', () => {
            expect(() => {
              field.validate(13.37);
            }).not.toThrow(Error);
          });
        });

        describe('integer value', () => {
          it('should not throw an error', () => {
            expect(() => {
              field.validate(100);
            }).not.toThrow(Error);
          });
        });

        describe('boolean value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(true);
            }).toThrow(Error);
          });
        });

        describe('string value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate('20');
            }).toThrow(Error);
          });
        });
      });

      describe('type: Number (integer)', () => {
        const field = new SchemaField('int', {
          type: Number,
          required: true,
          decimal: false,
        });

        describe('integer value', () => {
          it('should not throw an error', () => {
            expect(() => {
              field.validate(100);
            }).not.toThrow(Error);
          });
        });

        describe('float value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(13.37);
            }).toThrow(Error);
          });
        });

        describe('boolean value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(true);
            }).toThrow(Error);
          });
        });

        describe('string value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate('20');
            }).toThrow(Error);
          });
        });
      });

      describe('type: String', () => {
        const field = new SchemaField('text', {
          type: String,
          required: true,
        });

        describe('string value', () => {
          it('should not throw an error', () => {
            expect(() => {
              field.validate('hello');
            }).not.toThrow(Error);
          });
        });

        describe('boolean value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(true);
            }).toThrow(Error);
          });
        });

        describe('float value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(13.37);
            }).toThrow(Error);
          });
        });

        describe('integer value', () => {
          it('should throw an Error', () => {
            expect(() => {
              field.validate(20);
            }).toThrow(Error);
          });
        });
      });
    });
  });
});
