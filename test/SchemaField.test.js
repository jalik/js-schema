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

import FieldAllowedError from '../src/errors/FieldAllowedError';
import FieldDeniedError from '../src/errors/FieldDeniedError';
import FieldError from '../src/errors/FieldError';
import FieldLengthError from '../src/errors/FieldLengthError';
import FieldMaxError from '../src/errors/FieldMaxError';
import FieldMaxLengthError from '../src/errors/FieldMaxLengthError';
import FieldMinError from '../src/errors/FieldMinError';
import FieldMinLengthError from '../src/errors/FieldMinLengthError';
import FieldNullableError from '../src/errors/FieldNullableError';
import FieldRequiredError from '../src/errors/FieldRequiredError';
import FieldTypeError from '../src/errors/FieldTypeError';
import FieldValueTypesError from '../src/errors/FieldValueTypesError';
import Schema from '../src/Schema';
import SchemaField from '../src/SchemaField';

describe('SchemaField', () => {
  it('should be importable from package', () => {
    expect(typeof SchemaField).toEqual('function');
  });
});

describe('getAllowedValues()', () => {
  it('should return allowed values', () => {
    const field = new SchemaField('quantity', {
      type: 'number',
      allowed: [10, 20],
    });
    expect(field.getAllowedValues()).toEqual([10, 20]);
  });
});

describe('getDefaultValue()', () => {
  it('should return default value', () => {
    const field = new SchemaField('quantity', {
      type: 'number',
      defaultValue: 99,
    });
    expect(field.getDefaultValue()).toEqual(99);
  });
});

describe('getDeniedValues()', () => {
  it('should return denied values', () => {
    const field = new SchemaField('quantity', {
      type: 'number',
      denied: [5, 15],
    });
    expect(field.getDeniedValues()).toEqual([5, 15]);
  });
});

describe('getLabel()', () => {
  it('should return label', () => {
    const field = new SchemaField('name', {
      type: 'string',
      label: 'Name',
    });
    expect(field.getLabel()).toEqual('Name');
  });
});

describe('getLength()', () => {
  it('should return length', () => {
    const field = new SchemaField('name', {
      type: 'string',
      length: 10,
    });
    expect(field.getLength()).toEqual(10);
  });
});

describe('getMaxLength()', () => {
  it('should return max length', () => {
    const field = new SchemaField('text', {
      type: 'string',
      maxLength: 25,
    });
    expect(field.getMaxLength()).toEqual(25);
  });
});

describe('getMaxValue()', () => {
  it('should return max value', () => {
    const field = new SchemaField('num', {
      type: 'number',
      max: 100,
    });
    expect(field.getMaxValue()).toEqual(100);
  });
});

describe('getMaxWords()', () => {
  it('should return max words', () => {
    const field = new SchemaField('text', {
      type: 'string',
      maxWords: 30,
    });
    expect(field.getMaxWords()).toEqual(30);
  });
});

describe('getMinLength()', () => {
  it('should return min length', () => {
    const field = new SchemaField('text', {
      type: 'string',
      minLength: 25,
    });
    expect(field.getMinLength()).toEqual(25);
  });
});

describe('getMinValue()', () => {
  it('should return min value', () => {
    const field = new SchemaField('num', {
      type: 'number',
      min: 100,
    });
    expect(field.getMinValue()).toEqual(100);
  });
});

describe('getMinWords()', () => {
  it('should return min words', () => {
    const field = new SchemaField('text', {
      type: 'string',
      minWords: 30,
    });
    expect(field.getMinWords()).toEqual(30);
  });
});

describe('getName()', () => {
  it('should return field name', () => {
    const field = new SchemaField('text', {
      type: 'string',
    });
    expect(field.getName()).toEqual('text');
  });
});

describe('isNullable()', () => {
  it('should return a boolean', () => {
    const field = new SchemaField('quantity', {
      type: 'number',
      nullable: false,
    });
    expect(field.isNullable()).toEqual(false);
  });
});

describe('isRequired()', () => {
  it('should return a boolean', () => {
    const field = new SchemaField('quantity', {
      type: 'number',
      nullable: true,
    });
    expect(field.isRequired()).toEqual(true);
  });
});

describe('parse(object)', () => {
  it('should parse boolean fields', () => {
    const field = new SchemaField('boolean', { type: 'boolean' });
    expect(field.parse('false')).toEqual(false);
    expect(field.parse('true')).toEqual(true);
    expect(field.parse('FALSE')).toEqual(false);
    expect(field.parse('TRUE')).toEqual(true);
    expect(field.parse('0')).toEqual(false);
    expect(field.parse('1')).toEqual(true);
  });

  it('should parse number fields', () => {
    const field = new SchemaField('number', { type: 'number' });
    expect(field.parse('01010')).toEqual(1010);
    expect(field.parse('12345')).toEqual(12345);
    expect(field.parse('99.99')).toEqual(99.99);
  });

  it('should parse fields using custom function if present', () => {
    const field = new SchemaField('date', {
      type: Date,
      parse(value) {
        const [year, month, day] = value.split('-');
        return new Date(year, parseInt(month, 10) - 1, day);
      },
    });
    expect(field.parse('2018-04-05')).toEqual(new Date(2018, 3, 5));
  });
});

// todo test SchemaField.validate()

// maxLength

describe('SchemaField({ maxLength })', () => {
  describe('SchemaField({ maxLength, type: "string" })', () => {
    it('should throw an error if length is above max length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'string',
          maxLength: 3,
        }).validate('1234');
      }).toThrow(FieldMaxLengthError);
    });

    it('should not throw an error if length is equal to max length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'string',
          maxLength: 3,
        }).validate('123');
      }).not.toThrow();
    });

    it('should not throw an error if length is below max length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'string',
          maxLength: 3,
        }).validate('12');
      }).not.toThrow();
    });
  });

  describe('SchemaField({ maxLength, type: "array" })', () => {
    it('should throw an error if length is above max length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'array',
          maxLength: 3,
        }).validate([1, 2, 3, 4]);
      }).toThrow(FieldMaxLengthError);
    });

    it('should not throw an error if length is equal to max length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'array',
          maxLength: 3,
        }).validate([1, 2, 3]);
      }).not.toThrow();
    });

    it('should not throw an error if length is below max length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'array',
          maxLength: 3,
        }).validate([1, 2]);
      }).not.toThrow();
    });
  });
});

// minLength

describe('SchemaField({ minLength })', () => {
  describe('SchemaField({ minLength, type: "string" })', () => {
    it('should throw an error if length is below min length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'string',
          minLength: 3,
        }).validate('12');
      }).toThrow(FieldMinLengthError);
    });

    it('should not throw an error if length is equal to min length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'string',
          minLength: 3,
        }).validate('123');
      }).not.toThrow();
    });

    it('should not throw an error if length is above min length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'string',
          minLength: 3,
        }).validate('1234');
      }).not.toThrow();
    });
  });

  describe('SchemaField({ minLength, type: "array" })', () => {
    it('should throw an error if length is below min length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'array',
          minLength: 3,
        }).validate([1, 2]);
      }).toThrow(FieldMinLengthError);
    });

    it('should not throw an error if length is equal to min length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'array',
          minLength: 3,
        }).validate([1, 2, 3]);
      }).not.toThrow();
    });

    it('should not throw an error if length is above min length', () => {
      expect(() => {
        new SchemaField('test', {
          type: 'array',
          minLength: 3,
        }).validate([1, 2, 3, 4]);
      }).not.toThrow();
    });
  });
});

// constructor({ ... })

describe('constructor(name, props)', () => {
  describe('allowed: (Array|Function)', () => {
    describe('allowed and denied are defined', () => {
      it('should throw an error', () => {
        expect(() => (
          new Schema({
            color: {
              type: 'string',
              allowed: ['red'],
              denied: ['blue'],
            },
          })
        )).toThrow();
      });
    });

    describe('allowed: Array', () => {
      const field = new SchemaField('strings', {
        type: ['string'],
        nullable: false,
        required: false,
        allowed: ['off', 'on'],
      });

      describe('allowed values', () => {
        it('should not throw an Error', () => {
          expect(() => {
            field.validate(['on', 'off']);
          }).not.toThrow();
        });
      });

      describe('not allowed values', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(['no', 'yes']);
          }).toThrow(FieldAllowedError);
        });
      });
    });

    describe('allowed: Function', () => {
      const field = new SchemaField('strings', {
        type: ['string'],
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
          }).not.toThrow();
        });
      });

      describe('not allowed values', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(['no', 'yes']);
          }).toThrow(FieldAllowedError);
        });
      });
    });
  });

  describe('check: Function', () => {
    describe('check on Array', () => {
      const field = new SchemaField('array', {
        type: ['number'],
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
          }).not.toThrow();
        });
      });

      describe('incorrect values', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate([1, 3, 6, 7]);
          }).toThrow(FieldError);
        });
      });
    });

    describe('check on Number', () => {
      const field = new SchemaField('number', {
        type: 'number',
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
          }).not.toThrow();
        });
      });

      describe('incorrect value', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(1);
          }).toThrow(FieldError);
        });
      });
    });
  });

  describe('clean: Function', () => {
    const field = new SchemaField('text', {
      type: 'string',
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
      type: 'string',
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
        type: 'string',
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
        type: ['number'],
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
        type: 'boolean',
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
        type: 'number',
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
        type: 'string',
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
        type: ['string'],
        nullable: false,
        required: false,
        denied: ['yes', 'no'],
      });

      describe('denied values', () => {
        it('should not throw an Error', () => {
          expect(() => {
            field.validate(['maybe', 'sometimes', 'often']);
          }).not.toThrow();
        });
      });

      describe('not denied values', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(['yes', 'maybe']);
          }).toThrow(FieldDeniedError);
        });
      });
    });

    describe('denied: Function', () => {
      const field = new SchemaField('numbers', {
        type: ['string'],
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
          }).not.toThrow();
        });
      });

      describe('not denied values', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(['yes', 'maybe']);
          }).toThrow(FieldDeniedError);
        });
      });
    });
  });

  describe('length: (Array|Number|Function)', () => {
    const FixedLengthSchema = new Schema({
      array: {
        type: 'array',
        required: false,
        length: 3,
      },
      object: {
        type: Object,
        required: false,
        length: 22,
      },
      string: {
        type: 'string',
        required: false,
        length: 5,
      },
    });

    const LimitedLengthSchema = new Schema({
      array: {
        type: 'array',
        required: false,
        length: [3, 6],
      },
      object: {
        type: Object,
        required: false,
        length: [5, 10],
      },
      string: {
        type: 'string',
        required: false,
        length: [5, 10],
      },
    });

    describe('Fixed length', () => {
      describe('Array field with a wrong length', () => {
        it('should throw an Error', () => {
          expect(() => {
            FixedLengthSchema.validate({ array: [1] });
          }).toThrow(FieldLengthError);
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
          }).toThrow(FieldLengthError);
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
          }).toThrow(FieldLengthError);
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
          }).toThrow(FieldMinLengthError);
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
          }).toThrow(FieldMinLengthError);
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
          }).toThrow(FieldMinLengthError);
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
          }).toThrow(FieldMaxLengthError);
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
          }).toThrow(FieldMaxLengthError);
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
          }).toThrow(FieldMaxLengthError);
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
        type: 'array',
        required: false,
        max: 10,
      },
      date: {
        type: Date,
        required: false,
        max: new Date(),
      },
      number: {
        type: 'number',
        required: false,
        max: 10,
      },
    });

    describe('Array field with values higher than max', () => {
      it('should throw an Error', () => {
        expect(() => {
          MaxSchema.validate({ array: [99] });
        }).toThrow(FieldMaxError);
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
        }).toThrow(FieldMaxError);
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
        }).toThrow(FieldMaxError);
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
        type: 'array',
        required: false,
        min: 10,
      },
      date: {
        type: Date,
        required: false,
        min: new Date(),
      },
      number: {
        type: 'number',
        required: false,
        min: 10,
      },
    });

    describe('Array field with values lower than min', () => {
      it('should throw an Error', () => {
        expect(() => {
          MinSchema.validate({ array: [-5] });
        }).toThrow(FieldMinError);
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
        }).toThrow(FieldMinError);
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
        }).toThrow(FieldMinError);
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
    it('should equals true by default', () => {
      expect(() => {
        new Schema({
          text: {
            type: 'string',
            required: false,
          },
        }).validate({ text: null });
      }).not.toThrow();
    });

    describe('Not nullable field with null value', () => {
      it('should throw an Error', () => {
        expect(() => {
          new Schema({
            text: {
              type: 'string',
              required: true,
              nullable: false,
            },
          }).validate({ text: null });
        }).toThrow(FieldNullableError);
      });
    });

    describe('Nullable field with null value', () => {
      it('should not throw an Error', () => {
        expect(() => {
          new Schema({
            text: {
              type: 'string',
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
        type: 'string',
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
        type: 'string',
        required: true,
        nullable: true,
      },
    });

    const PostSchema = new Schema({
      text: {
        type: 'string',
        nullable: false,
        required(context) {
          return context.status === 'published';
        },
      },
      status: {
        type: 'string',
        required: true,
        allowed: ['published', 'draft'],
      },
    });

    describe('Dynamically required field with undefined value', () => {
      it('should throw an error', () => {
        expect(() => {
          PostSchema.validate({ status: 'published' });
        }).toThrow(FieldRequiredError);
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
              type: 'string',
              required: true,
              nullable: false,
            },
          }).validate({});
          Person.validate({
            address: {},
            name: 'karl',
          });
        }).toThrow(FieldRequiredError);
      });
    });

    describe('Required field with null value', () => {
      it('should not throw an error', () => {
        expect(() => {
          new Schema({
            text: {
              type: 'string',
              required: true,
              nullable: true,
            },
          }).validate({ text: null });
        }).not.toThrow();
      });
    });

    describe('Required field with empty string', () => {
      it('should throw an error', () => {
        expect(() => {
          new Schema({
            text: {
              type: 'string',
              required: true,
              nullable: true,
            },
          }).validate({ text: '' });
        }).not.toThrow();
      });
    });

    describe('Not required field with undefined value', () => {
      it('should not throw an error', () => {
        expect(() => {
          new Schema({
            text: {
              type: 'string',
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
              type: 'string',
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
              type: 'string',
              required: false,
              nullable: true,
            },
          }).validate({ text: 'abc' });
        }).not.toThrow();
      });
    });
  });

  describe('type: (Array|Boolean|Number|Object|String)', () => {
    describe('type: ["boolean"]', () => {
      const field = new SchemaField('booleans', {
        type: ['boolean'],
        required: true,
      });

      describe('boolean values', () => {
        it('should not throw an error', () => {
          expect(() => {
            field.validate([true, false, false]);
          }).not.toThrow();
        });
      });

      describe('mixed values', () => {
        it('should throw an error', () => {
          expect(() => {
            field.validate([true, 100, 'false']);
          }).toThrow(FieldValueTypesError);
        });
      });
    });

    describe('type: ["number"]', () => {
      const field = new SchemaField('numbers', {
        type: ['number'],
        required: true,
      });

      describe('number values', () => {
        it('should not throw an error', () => {
          expect(() => {
            field.validate([0, 1, 2]);
          }).not.toThrow();
        });
      });

      describe('mixed values', () => {
        it('should throw an error', () => {
          expect(() => {
            field.validate([true, 100, 'false']);
          }).toThrow(FieldValueTypesError);
        });
      });
    });

    describe('type: ["object"]', () => {
      const field = new SchemaField('objects', {
        type: ['object'],
        required: true,
      });

      describe('with objects', () => {
        it('should not throw an error', () => {
          const result = () => { field.validate([{}, {}]); };
          expect(result).not.toThrow();
        });
      });

      describe('with mixed values', () => {
        it('should throw an error', () => {
          const result = () => { field.validate([{}, true, 100, 'false']); };
          expect(result).toThrow(FieldValueTypesError);
        });
      });
    });

    describe('type: ["string"]', () => {
      const field = new SchemaField('strings', {
        type: ['string'],
        required: true,
      });

      describe('with string values', () => {
        it('should not throw an error', () => {
          const result = () => { field.validate(['a', 'b', 'c']); };
          expect(result).not.toThrow();
        });
      });

      describe('with mixed values', () => {
        it('should throw an error', () => {
          const result = () => { field.validate([true, 100, 'false']); };
          expect(result).toThrow(FieldValueTypesError);
        });
      });
    });

    // todo allow to check several types in an array
    // describe('type: ["string", "number"]', () => {
    //   const field = new SchemaField('strings', {
    //     type: ['string', 'number'],
    //     required: true,
    //   });
    //
    //   describe('with string values', () => {
    //     it('should not throw an error', () => {
    //       const result = () => { field.validate(['a', 'b', 'c']); };
    //       expect(result).not.toThrow();
    //     });
    //   });
    //
    //   describe('with number values', () => {
    //     it('should not throw an error', () => {
    //       const result = () => { field.validate([1, 2, 3]); };
    //       expect(result).not.toThrow(FieldValueTypesError);
    //     });
    //   });
    //
    //   describe('with string and number values', () => {
    //     it('should not throw an error', () => {
    //       const result = () => { field.validate(['1', 2]); };
    //       expect(result).not.toThrow(FieldValueTypesError);
    //     });
    //   });
    // });

    describe('type: "boolean"', () => {
      const field = new SchemaField('bool', {
        type: 'boolean',
        required: true,
      });

      describe('boolean value', () => {
        it('should not throw an error', () => {
          expect(() => {
            field.validate(true);
          }).not.toThrow();
        });
      });

      describe('float value', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(13.37);
          }).toThrow(FieldTypeError);
        });
      });

      describe('integer value', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(100);
          }).toThrow(FieldTypeError);
        });
      });

      describe('string value', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate('hello');
          }).toThrow(FieldTypeError);
        });
      });
    });

    describe('type: "integer"', () => {
      const field = new SchemaField('integer', {
        type: 'integer',
        required: true,
      });

      describe('with integer value', () => {
        it('should not throw an error', () => {
          expect(() => { field.validate(100); })
            .not.toThrow();
        });
      });

      describe('with float value', () => {
        it('should throw an Error', () => {
          expect(() => { field.validate(13.37); })
            .toThrow(FieldTypeError);
        });
      });

      describe('with boolean value', () => {
        it('should throw an Error', () => {
          expect(() => { field.validate(true); })
            .toThrow(FieldTypeError);
        });
      });

      describe('with string value', () => {
        it('should throw an Error', () => {
          expect(() => { field.validate('20'); })
            .toThrow(FieldTypeError);
        });
      });
    });

    describe('type: "number"', () => {
      const field = new SchemaField('number', {
        type: 'number',
        required: true,
      });

      describe('with integer value', () => {
        it('should not throw an error', () => {
          expect(() => { field.validate(100); })
            .not.toThrow();
        });
      });

      describe('with float value', () => {
        it('should throw an Error', () => {
          expect(() => { field.validate(13.37); })
            .not.toThrow(FieldTypeError);
        });
      });

      describe('with boolean value', () => {
        it('should throw an Error', () => {
          expect(() => { field.validate(true); })
            .toThrow(FieldTypeError);
        });
      });

      describe('with string value', () => {
        it('should throw an Error', () => {
          expect(() => { field.validate('20'); })
            .toThrow(FieldTypeError);
        });
      });
    });

    describe('type: "object"', () => {
      const field = new SchemaField('obj', {
        type: 'object',
        required: true,
      });

      describe('with object', () => {
        it('should not throw an error', () => {
          const result = () => { field.validate({}); };
          expect(result).not.toThrow();
        });
      });

      describe('with boolean', () => {
        it('should throw an Error', () => {
          const result = () => { field.validate(true); };
          expect(result).toThrow(FieldTypeError);
        });
      });

      describe('with float', () => {
        it('should throw an Error', () => {
          const result = () => { field.validate(13.37); };
          expect(result).toThrow(FieldTypeError);
        });
      });

      describe('with integer', () => {
        it('should throw an Error', () => {
          const result = () => { field.validate(20); };
          expect(result).toThrow(FieldTypeError);
        });
      });
    });

    describe('type: "string"', () => {
      const field = new SchemaField('text', {
        type: 'string',
        required: true,
      });

      describe('string value', () => {
        it('should not throw an error', () => {
          expect(() => {
            field.validate('hello');
          }).not.toThrow();
        });
      });

      describe('boolean value', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(true);
          }).toThrow(FieldTypeError);
        });
      });

      describe('float value', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(13.37);
          }).toThrow(FieldTypeError);
        });
      });

      describe('integer value', () => {
        it('should throw an Error', () => {
          expect(() => {
            field.validate(20);
          }).toThrow(FieldTypeError);
        });
      });
    });
  });
});
