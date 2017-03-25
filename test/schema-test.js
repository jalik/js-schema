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
const ARRAY_EMPTY = [];
const ARRAY_INT = [0, 1];
const ARRAY_FLOAT = [0.1, 0.2];
const ARRAY_STRING = ['a', 'b'];

describe(`Schema`, function () {

    /**
     * ARRAY
     */
    describe(`Array field`, function () {
        it(`should throw an Error`, function () {
            chai.assert.throws(function () {
                new Schema({field: {type: Array}}).validate({field: null});
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
});
