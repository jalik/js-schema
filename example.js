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
var RegEx = require("dist/regex").RegEx;
var Schema = require("dist/schema").Schema;

console.log(Schema);
console.log(RegEx);

const PrimitiveSchema = new Schema({
    array: {
        type: Array,
        length: [1, 2]
    },
    binaryArray: {
        type: [Number],
        allowed: [0, 1]
    },
    stringArray: {
        type: [String],
        allowed: ["a", "b", "c"]
    },
    status: {
        type: String,
        allowed: ["on", "off"]
    },
    boolean: {
        type: Boolean
    },
    date: {
        type: Date
    },
    error: {
        type: Error
    },
    email: {
        type: String,
        regEx: RegEx.Email
    },
    ipv4: {
        type: String,
        regEx: RegEx.IPv4
    },
    float: {
        type: Number,
        decimal: true
    },
    integer: {
        type: Number,
        decimal: false
    },
    method: {
        type: Function
    },
    number: {
        type: Number
    },
    object: {
        type: Object
    },
    string: {
        type: String,
        length: [1, 10]
        // regEx: /^[a-z-0-9]+$/i
    },
});

const ComplexSchema = new Schema({
    child: {
        type: PrimitiveSchema
    },
    children: {
        type: [PrimitiveSchema]
    },
    dates: {
        type: [Date]
    }
});

const DATA = {
    // intruder: "@#=*",
    array: [0, 1],
    binaryArray: [0, 1, 1, 0],
    stringArray: ["a", "b", "a"],
    status: "on",
    boolean: false,
    date: new Date(),
    email: "jalik26@mail.com",
    ipv4: "10.0.0.255",
    error: new TypeError(),
    float: 13.37,
    integer: 1337,
    method: function () {
    },
    number: 123,
    object: {a: "  1 ", b: 2},
    string: " hell0   "
};

const subSchema = PrimitiveSchema.pick(["number", "string"]);
subSchema.validate({
    number: 123,
    string: "  a "
});

PrimitiveSchema.validate(DATA);
ComplexSchema.validate({
    dates: [new Date()],
    child: DATA,
    children: [DATA]
});
