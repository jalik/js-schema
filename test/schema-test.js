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
var chai = require('chai');
var Schema = require('../dist/jk-schema.min').Schema;

const FALSE = false;
const TRUE = true;
const FLOAT = 9.99;
const INTEGER = 100;
const STRING = "HelloWorld";
const ARRAY_EMPTY = [];
const ARRAY_INT = [0, 1];
const ARRAY_FLOAT = [0.1, 0.2];
const ARRAY_STRING = ['a', 'b'];

describe(`Schema`, function () {

    var StringSchema = new Schema({
        string: {
            type: String,
            required: true
        }
    });

    var TestSchema = new Schema({
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

    /**
     * getField()
     */
    describe(`getField()`, function () {
        it(`should return field properties`, function () {
            var fields = {text: {type: String}};
            var schema = new Schema(fields);
            console.log(schema.getField("text"));
            chai.assert.doesNotThrow(function () {
                var test = schema.getField("text").type === String;
            });
        });
    });

    /**
     * getFields()
     */
    describe(`getFields()`, function () {
        it(`should return all fields`, function () {
            var fields = {field: {type: Array}};
            chai.assert.equal(new Schema(fields).getFields(), fields);
        });
    });

    /**
     * extend()
     */
    describe(`extend()`, function () {
        it(`should create an extended version of the schema`, function () {
            var parent = new Schema({fieldA: {type: String}});
            var child = parent.extend({fieldB: {type: Number}});
            var fields = child.getFields();
            chai.assert.equal(fields.hasOwnProperty("fieldA") && fields.hasOwnProperty("fieldB"), true);
        });
    });

    describe(`validate()`, function () {
        /**
         * ignoreMissing option
         */
        describe(`ignoreMissing = true`, function () {
            it(`should not throw an error for missing fields`, function () {
                chai.assert.doesNotThrow(function () {
                    TestSchema.validate({string: "abc"}, {
                        ignoreMissing: true
                    });
                }, Error);
            });
        });
        describe(`ignoreMissing = false`, function () {
            it(`should throw an error for missing fields`, function () {
                chai.assert.throw(function () {
                    TestSchema.validate({string: "abc"}, {
                        ignoreMissing: false
                    });
                }, Error);
            });
        });
        /**
         * ignoreUnknown option
         */
        describe(`ignoreUnknown = true`, function () {
            it(`should not throw an error for unknown fields`, function () {
                chai.assert.doesNotThrow(function () {
                    StringSchema.validate({string: "abc", xxx: null}, {
                        ignoreUnknown: true
                    });
                }, Error);
            });
        });
        describe(`ignoreUnknown = false`, function () {
            it(`should throw an error for unknown fields`, function () {
                chai.assert.throw(function () {
                    StringSchema.validate({string: "abc", xxx: null}, {
                        ignoreUnknown: false
                    });
                }, Error);
            });
        });
        /**
         * removeUnknown option
         */
        describe(`removeUnknown = true`, function () {
            it(`should remove unknown fields`, function () {
                var obj = {string: "abc", xxx: null};
                StringSchema.validate(obj, {
                    clean: true,
                    ignoreUnknown: true,
                    removeUnknown: true
                });
                chai.assert.equal(obj.hasOwnProperty("xxx"), false);
            });
        });
        describe(`removeUnknown = false`, function () {
            it(`should not remove unknown fields`, function () {
                var obj = {string: "abc", xxx: null};
                StringSchema.validate(obj, {
                    clean: true,
                    ignoreUnknown: true,
                    removeUnknown: false
                });
                chai.assert.equal(obj.hasOwnProperty("xxx"), true);
            });
        });
    });

    /**
     * NULL ARRAY
     */
    describe(`Array field with null value`, function () {
        it(`should throw an Error`, function () {
            chai.assert.throws(function () {
                new Schema({field: {type: Array}}).validate({field: null});
            }, Error);
        });
    });

    /**
     * NULLABLE ARRAY
     */
    describe(`Nullable Array field with null value`, function () {
        it(`should not throw an Error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: Array, nullable: true}}).validate({field: null});
            }, Error);
        });
    });

    /**
     * BOOLEAN
     */
    describe(`Boolean field containing ${TRUE}`, function () {
        it(`should not throw an error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: Boolean}}).validate({field: true});
            }, Error);
        });
    });

    describe(`Boolean field containing ${FALSE}`, function () {
        it(`should not throw an error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: Boolean}}).validate({field: false});
            }, Error);
        });
    });

    /**
     * FLOAT
     */
    describe(`Float field containing ${FLOAT}`, function () {
        it(`should not throw an error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: Number, decimal: true}}).validate({field: FLOAT});
            }, Error);
        });
    });

    describe(`Float field containing ${INTEGER}`, function () {
        it(`should throw an Error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: Number, decimal: true}}).validate({field: INTEGER});
            }, Error);
        });
    });

    /**
     * INTEGER
     */
    describe(`Integer field containing ${INTEGER}`, function () {
        it(`should not throw an error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: Number, decimal: false}}).validate({field: INTEGER});
            }, Error);
        });
    });

    describe(`Integer field containing ${FLOAT}`, function () {
        it(`should throw an Error`, function () {
            chai.assert.throws(function () {
                new Schema({field: {type: Number, decimal: false}}).validate({field: FLOAT});
            }, Error);
        });
    });

    /**
     * STRING
     */
    describe(`String field containing ${STRING}`, function () {
        it(`should not throw an error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: String}}).validate({field: STRING});
            }, Error);
        });
    });

    describe(`String field containing ${FLOAT}`, function () {
        it(`should throw an Error`, function () {
            chai.assert.throws(function () {
                new Schema({field: {type: String}}).validate({field: FLOAT});
            }, Error);
        });
    });

    describe(`String field containing more than max length`, function () {
        it(`should throw an Error`, function () {
            chai.assert.throws(function () {
                new Schema({field: {type: String, length: [0, 5]}}).validate({field: "1234567"});
            }, Error);
        });
    });

    describe(`String field containing less than max length`, function () {
        it(`should not throw an Error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: String, length: [0, 5]}}).validate({field: "123"});
            }, Error);
        });
    });

    describe(`String field containing more than min length`, function () {
        it(`should not throw an Error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: String, length: [3]}}).validate({field: "1234"});
            }, Error);
        });
    });

    describe(`String field containing less than min length`, function () {
        it(`should throw an Error`, function () {
            chai.assert.throws(function () {
                new Schema({field: {type: String, length: [3]}}).validate({field: "1"});
            }, Error);
        });
    });

    describe(`String field having a denied length`, function () {
        it(`should throw an Error`, function () {
            chai.assert.throws(function () {
                new Schema({field: {type: String, length: 3}}).validate({field: "1"});
            }, Error);
        });
    });

    describe(`String field having the exact allowed length`, function () {
        it(`should not throw an Error`, function () {
            chai.assert.doesNotThrow(function () {
                new Schema({field: {type: String, length: 3}}).validate({field: "123"});
            }, Error);
        });
    });
});
