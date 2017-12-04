/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {Schema} from "../src/schema";
import {SchemaField} from "../src/schema-field";

describe(`Schema`, () => {

    const StringSchema = new Schema({
        string: {
            type: String,
            required: true
        }
    });

    const TestSchema = new Schema({
        array: {
            type: Array,
            required: true
        },
        number: {
            type: Number,
            required: true
        },
        string: {
            type: String,
            required: true
        }
    });

    it(`should be importable from package`, () => {
        expect(typeof Schema).toEqual("function");
    });

    describe(`addField(String, Object)`, () => {
        it(`should add a field of the schema`, () => {
            const schema = new Schema({a: {type: String}});
            schema.addField("b", {type: Number});
            expect(schema.getField("b").getType()).toEqual(Number);
        });
    });

    describe(`clone()`, () => {
        it(`should create a copy of the schema`, () => {
            const schema = new Schema({fieldA: {type: String}});
            expect(schema.clone()).toEqual(schema);
        });
    });

    describe(`extend(Object)`, () => {
        it(`should create an extended version of the schema`, () => {
            const parent = new Schema({fieldA: {type: String}});
            const child = parent.extend({fieldB: {type: Number}});
            const fields = child.getFields();
            expect(fields.hasOwnProperty("fieldA") && fields.hasOwnProperty("fieldB")).toEqual(true);
        });
    });

    describe(`getField(String)`, () => {
        it(`should return field properties`, () => {
            const fields = {text: {type: String}};
            const schema = new Schema(fields);
            expect(() => {
                const test = schema.getField("text").type === String;
            }).not.toThrow(Error);
        });
    });

    describe(`getFields()`, () => {
        it(`should return all fields`, () => {
            const schema = new Schema({field: {type: Array}});
            expect(schema.getFields() !== null).toEqual(true);
        });
    });

    describe(`removeUnknownFields(Object)`, () => {
        it(`should remove unknown fields`, () => {
            const schema = new Schema({a: {type: Number}});
            expect(schema.removeUnknownFields({a: 1, b: 2, c: 3})).toEqual({a: 1});
        });
    });

    describe(`resolveField(String)`, () => {
        it(`should return field properties`, () => {
            const PhoneSchema = new Schema({
                number: {type: String}
            });
            const ChildSchema = new Schema({
                phones: {type: [PhoneSchema]}
            });
            const ParentSchema = new Schema({
                child: {type: ChildSchema}
            });
            expect(() => {
                return ParentSchema.resolveField("child[phones][number]").type === String
                    && ParentSchema.resolveField("child[phones][0][number]").type === String;
            }).not.toThrow(Error);
        });
    });

    describe(`update(Object)`, () => {
        it(`should modify the schema`, () => {
            const PhoneSchema = new Schema({
                number: {
                    type: String,
                    required: true
                }
            });
            const PersonSchema = new Schema({
                name: {
                    type: String,
                    required: true
                },
                phone: {
                    type: PhoneSchema.clone().update({
                        number: {required: false}
                    }),
                    required: true
                }
            });
            expect(PersonSchema.getField("name").required).toEqual(true);
            expect(PersonSchema.getField("phone[number]").required).toEqual(false);
            expect(PhoneSchema.getField("number").required).toEqual(true);
        });
    });

    describe(`validate(Object, Object)`, () => {

        describe(`ignoreMissing: true`, () => {
            it(`should not throw an error for missing fields`, () => {
                expect(() => {
                    TestSchema.validate({string: "abc"}, {
                        ignoreMissing: true
                    });
                }).not.toThrow(Error);
            });
        });

        describe(`ignoreMissing: false`, () => {
            it(`should throw an error for missing fields`, () => {
                expect(() => {
                    TestSchema.validate({string: "abc"}, {
                        ignoreMissing: false
                    });
                }).toThrow(Error);
            });
        });

        describe(`ignoreUnknown: true`, () => {
            it(`should not throw an error for unknown fields`, () => {
                expect(() => {
                    StringSchema.validate({string: "abc", xxx: null}, {
                        ignoreUnknown: true
                    });
                }).not.toThrow(Error);
            });
        });

        describe(`ignoreUnknown: false`, () => {
            it(`should throw an error for unknown fields`, () => {
                expect(() => {
                    StringSchema.validate({string: "abc", xxx: null}, {
                        ignoreUnknown: false
                    });
                }).toThrow(Error);
            });
        });

        describe(`removeUnknown: true`, () => {
            it(`should remove unknown fields`, () => {
                const obj = {string: "abc", xxx: null};
                StringSchema.validate(obj, {
                    clean: true,
                    ignoreUnknown: true,
                    removeUnknown: true
                });
                expect(obj.hasOwnProperty("xxx")).toEqual(false);
            });
        });

        describe(`removeUnknown: false`, () => {
            it(`should not remove unknown fields`, () => {
                const obj = {string: "abc", xxx: null};
                StringSchema.validate(obj, {
                    clean: true,
                    ignoreUnknown: true,
                    removeUnknown: false
                });
                expect(obj.hasOwnProperty("xxx")).toEqual(true);
            });
        });
    });
});
