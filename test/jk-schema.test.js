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
const chai = require('chai');
const Schema = require('../dist/jk-schema').Schema;
const RegEx = require('../dist/jk-schema').RegEx;

const FLOAT = 9.99;
const INTEGER = 100;
const STRING = "HelloWorld";
const ARRAY_EMPTY = [];
const ARRAY_INT = [0, 1];
const ARRAY_FLOAT = [0.1, 0.2];
const ARRAY_STRING = ['a', 'b'];

describe(`Schema`, function () {

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

    /**
     * clone()
     */
    describe(`clone()`, function () {
        it(`should create a copy of the schema`, function () {
            const schema = new Schema({fieldA: {type: String}});
            chai.assert.deepEqual(schema.clone(), schema);
        });
    });

    /**
     * extend()
     */
    describe(`extend()`, function () {
        it(`should create an extended version of the schema`, function () {
            const parent = new Schema({fieldA: {type: String}});
            const child = parent.extend({fieldB: {type: Number}});
            const fields = child.getFields();
            chai.assert.equal(fields.hasOwnProperty("fieldA") && fields.hasOwnProperty("fieldB"), true);
        });
    });

    /**
     * getField()
     */
    describe(`getField()`, function () {
        it(`should return field properties`, function () {
            const fields = {text: {type: String}};
            const schema = new Schema(fields);
            chai.assert.doesNotThrow(function () {
                const test = schema.getField("text").type === String;
            });
        });
    });

    /**
     * getFields()
     */
    describe(`getFields()`, function () {
        it(`should return all fields`, function () {
            const schema = new Schema({field: {type: Array}});
            chai.assert.equal(schema.getFields() !== null, true);
        });
    });

    /**
     * resolveField()
     */
    describe(`resolveField()`, function () {
        it(`should return field properties`, function () {
            const PhoneSchema = new Schema({
                number: {type: String}
            });
            const ChildSchema = new Schema({
                phones: {type: [PhoneSchema]}
            });
            const ParentSchema = new Schema({
                child: {type: ChildSchema}
            });
            chai.assert.doesNotThrow(function () {
                return ParentSchema.resolveField("child[phones][number]").type === String
                    && ParentSchema.resolveField("child[phones][0][number]").type === String;
            });
        });
    });

    /**
     * update()
     */
    describe(`update()`, function () {
        it(`should modify the schema`, function () {
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
            chai.assert.equal(PersonSchema.getField("name").required, true);
            chai.assert.equal(PersonSchema.getField("phone[number]").required, false);
            chai.assert.equal(PhoneSchema.getField("number").required, true);
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
        describe(`removeUnknown is true`, function () {
            it(`should remove unknown fields`, function () {
                const obj = {string: "abc", xxx: null};
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
                const obj = {string: "abc", xxx: null};
                StringSchema.validate(obj, {
                    clean: true,
                    ignoreUnknown: true,
                    removeUnknown: false
                });
                chai.assert.equal(obj.hasOwnProperty("xxx"), true);
            });
        });

        /**
         * FIELD.ALLOWED
         */
        describe(`Field.allowed (Array|Func)`, function () {
            const CheckSchema = new Schema({
                numbers: {
                    type: [Number],
                    nullable: false,
                    required: false,
                    allowed: [0, 1]
                },
                string: {
                    type: String,
                    nullable: false,
                    required: false,
                    allowed: ["off", "on"]
                }
            });
            describe(`Array field with a value not allowed`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        CheckSchema.validate({numbers: [0, 1, 0, 3]});
                    }, Error);
                });
            });
            describe(`Array field with an allowed value`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        CheckSchema.validate({numbers: [0, 1, 1, 0]});
                    }, Error);
                });
            });
            describe(`String field with a value not allowed`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        CheckSchema.validate({string: "toggle"});
                    }, Error);
                });
            });
            describe(`String field with an allowed value`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        CheckSchema.validate({string: "on"});
                    }, Error);
                });
            });
        });

        /**
         * FIELD.CHECK
         */
        describe(`Field.check (Func)`, function () {
            const CheckSchema = new Schema({
                array: {
                    type: [Number],
                    nullable: false,
                    required: false,
                    check: function (value) {
                        for (var i = 0; i < value.length; i += 1) {
                            if (value[i] % 2 === 1) {
                                return false;
                            }
                        }
                        return true;
                    }
                },
                number: {
                    type: Number,
                    nullable: false,
                    required: false,
                    check: function (value) {
                        return value % 2 === 0;
                    }
                }
            });
            describe(`Check field with bad value`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        CheckSchema.validate({number: 1});
                    }, Error);
                });
            });
            describe(`Check array field with bad values`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        CheckSchema.validate({array: [1, 2, 4, 5, 6, 8]});
                    }, Error);
                });
            });
            describe(`Check field with good value`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        CheckSchema.validate({number: 8});
                    }, Error);
                });
            });
            describe(`Check array field with good values`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        CheckSchema.validate({array: [2, 4, 6, 8, 10]});
                    }, Error);
                });
            });
        });

        /**
         * FIELD.DENIED
         */
        describe(`Field.denied (Array|Func)`, function () {
            const CheckSchema = new Schema({
                numbers: {
                    type: [Number],
                    nullable: false,
                    required: false,
                    denied: [0, 1]
                },
                string: {
                    type: String,
                    nullable: false,
                    required: false,
                    denied: ["yes", "no"]
                }
            });
            describe(`Array field with a denied value`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        CheckSchema.validate({numbers: [2, 1, 5, 9]});
                    }, Error);
                });
            });
            describe(`Array field with a value not denied`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        CheckSchema.validate({numbers: [3, 4, 6]});
                    }, Error);
                });
            });
            describe(`String field with a denied value`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        CheckSchema.validate({string: "yes"});
                    }, Error);
                });
            });
            describe(`String field with a value not denied`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        CheckSchema.validate({string: "maybe"});
                    }, Error);
                });
            });
        });

        /**
         * FIELD.LENGTH
         */
        describe(`Field.length (bool)`, function () {
            const FixedLengthSchema = new Schema({
                array: {
                    type: Array,
                    required: false,
                    length: 3
                },
                object: {
                    type: Object,
                    required: false,
                    length: 22
                },
                string: {
                    type: String,
                    required: false,
                    length: 5
                }
            });
            const LimitedLengthSchema = new Schema({
                array: {
                    type: Array,
                    required: false,
                    length: [3, 6]
                },
                object: {
                    type: Object,
                    required: false,
                    length: [5, 10]
                },
                string: {
                    type: String,
                    required: false,
                    length: [5, 10]
                }
            });

            describe(`Fixed length`, function () {
                describe(`Array field with a wrong length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            FixedLengthSchema.validate({array: [1]});
                        }, Error);
                    });
                });
                describe(`Array field with the exact length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            LimitedLengthSchema.validate({array: [1, 2, 3]});
                        }, Error);
                    });
                });
                describe(`Object field with a wrong length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            FixedLengthSchema.validate({object: {length: 8}});
                        }, Error);
                    });
                });
                describe(`Object field with the exact length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            FixedLengthSchema.validate({object: {length: 22}});
                        }, Error);
                    });
                });
                describe(`String field with a wrong length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            FixedLengthSchema.validate({string: "xx"});
                        }, Error);
                    });
                });
                describe(`String field with the exact length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            LimitedLengthSchema.validate({string: "aaaaa"});
                        }, Error);
                    });
                });
            });

            describe(`Minimal length`, function () {
                describe(`Array field with length < min length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            LimitedLengthSchema.validate({array: [1]});
                        }, Error);
                    });
                });
                describe(`Array field with length > min length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            LimitedLengthSchema.validate({array: [1, 2, 3, 4]});
                        }, Error);
                    });
                });
                describe(`Object field with length < min length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            LimitedLengthSchema.validate({object: {length: 0}});
                        }, Error);
                    });
                });
                describe(`Object field with length > min length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            LimitedLengthSchema.validate({object: {length: 5}});
                        }, Error);
                    });
                });
                describe(`String field with length < min length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            LimitedLengthSchema.validate({string: "shor"});
                        }, Error);
                    });
                });
                describe(`String field with length > min length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            LimitedLengthSchema.validate({string: "123456"});
                        }, Error);
                    });
                });
            });

            describe(`Maximal length`, function () {
                describe(`Array field with length > max length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            LimitedLengthSchema.validate({array: [1, 2, 3, 4, 5, 6, 7, 8]});
                        }, Error);
                    });
                });
                describe(`Array field with length < max length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            LimitedLengthSchema.validate({array: [1, 2, 3]});
                        }, Error);
                    });
                });
                describe(`Object field with length > max length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            LimitedLengthSchema.validate({object: {length: 99}});
                        }, Error);
                    });
                });
                describe(`Object field with length < max length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            LimitedLengthSchema.validate({object: {length: 6}});
                        }, Error);
                    });
                });
                describe(`String field with length > max length`, function () {
                    it(`should throw an Error`, function () {
                        chai.assert.throws(function () {
                            LimitedLengthSchema.validate({string: "loooooooooong"});
                        }, Error);
                    });
                });
                describe(`String field with length < max length`, function () {
                    it(`should not throw an Error`, function () {
                        chai.assert.doesNotThrow(function () {
                            LimitedLengthSchema.validate({string: "1234567"});
                        }, Error);
                    });
                });
            });
        });

        /**
         * FIELD.MAX
         */
        describe(`Field.max (Number|Date)`, function () {
            const MaxSchema = new Schema({
                array: {
                    type: Array,
                    required: false,
                    max: 10
                },
                date: {
                    type: Date,
                    required: false,
                    max: new Date()
                },
                number: {
                    type: Number,
                    required: false,
                    max: 10
                }
            });

            describe(`Array field with values higher than max`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        MaxSchema.validate({array: [99]});
                    }, Error);
                });
            });
            describe(`Array field with values lower than max`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        MaxSchema.validate({array: [9, 5, 0, -100]});
                    }, Error);
                });
            });

            describe(`Date field with value higher than max`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        MaxSchema.validate({date: new Date(Date.now() + 10000)});
                    }, Error);
                });
            });
            describe(`Date field with value lower than max`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        MaxSchema.validate({date: new Date(Date.now() - 10000)});
                    }, Error);
                });
            });
            describe(`Number field with value higher than max`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        MaxSchema.validate({number: 99});
                    }, Error);
                });
            });
            describe(`Number field with value lower than max`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        MaxSchema.validate({number: 5});
                    }, Error);
                });
            });
        });

        /**
         * FIELD.MIN
         */
        describe(`Field.min (Number|Date)`, function () {
            const MinSchema = new Schema({
                array: {
                    type: Array,
                    required: false,
                    min: 10
                },
                date: {
                    type: Date,
                    required: false,
                    min: new Date()
                },
                number: {
                    type: Number,
                    required: false,
                    min: 10
                }
            });

            describe(`Array field with values lower than min`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        MinSchema.validate({array: [-5]});
                    }, Error);
                });
            });
            describe(`Array field with values higher than min`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        MinSchema.validate({array: [20, 30, 40]});
                    }, Error);
                });
            });

            describe(`Date field with value lower than min`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        MinSchema.validate({date: new Date(Date.now() - 10000)});
                    }, Error);
                });
            });
            describe(`Date field with value higher than min`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        MinSchema.validate({date: new Date(Date.now() + 10000)});
                    }, Error);
                });
            });
            describe(`Number field with value lower than min`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        MinSchema.validate({number: 0});
                    }, Error);
                });
            });
            describe(`Number field with value higher than min`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        MinSchema.validate({number: 100});
                    }, Error);
                });
            });
        });

        /**
         * FIELD.NULLABLE
         */
        describe(`Field.nullable (bool)`, function () {
            describe(`Not nullable field with null value`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        new Schema({
                            text: {
                                type: String,
                                nullable: false,
                                required: false
                            }
                        }).validate({text: null});
                    }, Error);
                });
            });
            describe(`Nullable field with null value`, function () {
                it(`should not throw an Error`, function () {
                    chai.assert.doesNotThrow(function () {
                        new Schema({
                            text: {
                                type: String,
                                nullable: true,
                                required: false
                            }
                        }).validate({text: null});
                    }, Error);
                });
            });
        });

        /**
         * FIELD.REQUIRED
         */
        describe(`Field.required (bool)`, function () {
            const Address = new Schema({
                city: {
                    type: String,
                    length: [0, 30],
                    required: true,
                    nullable: true
                }
            });
            const Person = new Schema({
                address: {
                    type: Address,
                    required: true,
                    nullable: true
                },
                name: {
                    type: String,
                    required: true,
                    nullable: true
                }
            });
            const PostSchema = new Schema({
                text: {
                    type: String,
                    nullable: false,
                    required(context) {
                        return context.status === "published";
                    }
                },
                status: {
                    type: String,
                    required: true,
                    allowed: ["published", "draft"]
                }
            });

            describe(`Dynamically required field with undefined value`, function () {
                it(`should throw an error`, function () {
                    chai.assert.throws(function () {
                        PostSchema.validate({status: "published"});
                    }, Error);
                });
            });
            describe(`Dynamically not required field with undefined value`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        PostSchema.validate({status: "draft"});
                    }, Error);
                });
            });
            describe(`Required field with undefined value`, function () {
                it(`should throw an error`, function () {
                    chai.assert.throws(function () {
                        new Schema({
                            text: {
                                type: String,
                                required: true,
                                nullable: false
                            }
                        }).validate({});
                        Person.validate({
                            address: {},
                            name: "karl"
                        });
                    }, Error);
                });
            });
            describe(`Required field with null value`, function () {
                it(`should throw an error`, function () {
                    chai.assert.throws(function () {
                        new Schema({
                            text: {
                                type: String,
                                required: true,
                                nullable: false
                            }
                        }).validate({text: null});
                    }, Error);
                });
            });
            describe(`Required field with empty string`, function () {
                it(`should throw an error`, function () {
                    chai.assert.throws(function () {
                        new Schema({
                            text: {
                                type: String,
                                required: true,
                                nullable: false
                            }
                        }).validate({text: ""});
                    }, Error);
                });
            });
            describe(`Not required field with undefined value`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        new Schema({
                            text: {
                                type: String,
                                required: false,
                                nullable: true
                            }
                        }).validate({});
                    }, Error);
                });
            });
            describe(`Not required field with null value`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        new Schema({
                            text: {
                                type: String,
                                required: false,
                                nullable: true
                            }
                        }).validate({text: null});
                    }, Error);
                });
            });
            describe(`Not required field with string value`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        new Schema({
                            text: {
                                type: String,
                                required: false,
                                nullable: true
                            }
                        }).validate({text: "abc"});
                    }, Error);
                });
            });
        });

        /**
         * FIELD.TYPE
         */
        describe(`Field.type (Func)`, function () {

            /**
             * FIELD.TYPE = ARRAY
             */
            const ArraySchema = new Schema({
                booleans: {
                    type: [Boolean],
                    required: false
                },
                numbers: {
                    type: [Number],
                    required: false
                },
                strings: {
                    type: [String],
                    required: false
                }
            });
            describe(`Array of Boolean field with non boolean values`, function () {
                it(`should throw an error`, function () {
                    chai.assert.throws(function () {
                        ArraySchema.validate({booleans: [true, false, "true"]});
                    }, Error);
                });
            });
            describe(`Array of Boolean field with boolean values`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        ArraySchema.validate({booleans: [true, false]});
                    }, Error);
                });
            });
            describe(`Array of Number field with non numeric values`, function () {
                it(`should throw an error`, function () {
                    chai.assert.throws(function () {
                        ArraySchema.validate({numbers: [0, 1, "3"]});
                    }, Error);
                });
            });
            describe(`Array of Number field with numeric values`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        ArraySchema.validate({numbers: [0, 1]});
                    }, Error);
                });
            });
            describe(`Array of String field with non string values`, function () {
                it(`should throw an error`, function () {
                    chai.assert.throws(function () {
                        ArraySchema.validate({strings: ["a", "b", 5]});
                    }, Error);
                });
            });
            describe(`Array of String field with string values`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        ArraySchema.validate({strings: ["a", "b"]});
                    }, Error);
                });
            });

            /**
             * FIELD.TYPE = BOOLEAN
             */
            const BooleanSchema = new Schema({
                bool: {
                    type: Boolean,
                    required: true
                }
            });
            describe(`Boolean field with a non boolean value`, function () {
                it(`should throw an error`, function () {
                    chai.assert.throws(function () {
                        BooleanSchema.validate({bool: "text"});
                    }, Error);
                });
            });
            describe(`Boolean field with a boolean value`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        BooleanSchema.validate({bool: true});
                        BooleanSchema.validate({bool: false});
                    }, Error);
                });
            });

            /**
             * FIELD.TYPE = FLOAT
             */
            const FloatSchema = new Schema({
                float: {
                    type: Number,
                    required: true,
                    decimal: true
                }
            });
            describe(`Float field with a non number value`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        FloatSchema.validate({float: ""});
                    }, Error);
                });
            });
            describe(`Float field with a number value`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        FloatSchema.validate({float: 0.99});
                    }, Error);
                });
            });

            /**
             * FIELD.TYPE = INTEGER
             */
            const IntegerSchema = new Schema({
                integer: {
                    type: Number,
                    required: true,
                    decimal: false
                }
            });
            describe(`Integer field with a non number value`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        IntegerSchema.validate({integer: ""});
                    }, Error);
                });
            });
            describe(`Integer field with a float value`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        IntegerSchema.validate({integer: 0.567});
                    }, Error);
                });
            });
            describe(`Integer field with a number value`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        IntegerSchema.validate({integer: 1000});
                    }, Error);
                });
            });

            /**
             * FIELD.TYPE = STRING
             */
            const StringSchema = new Schema({
                string: {
                    type: String,
                    required: true
                }
            });
            describe(`String field with a non string value`, function () {
                it(`should throw an Error`, function () {
                    chai.assert.throws(function () {
                        StringSchema.validate({string: 99});
                    }, Error);
                });
            });
            describe(`String field with a string value`, function () {
                it(`should not throw an error`, function () {
                    chai.assert.doesNotThrow(function () {
                        StringSchema.validate({string: "hello"});
                    }, Error);
                });
            });
        });

    });

    /**
     * REGULAR EXPRESSIONS
     */
    describe(`RegEx`, function () {
        const invalidEmail = "aa_aa@ bb.cc";
        const validEmail = "quick-test.1337@domain.com";

        describe(`Valid Email "${validEmail}"`, function () {
            it(`should return true`, function () {
                chai.assert.equal(RegEx.Email.test(validEmail), true);
            });
        });

        describe(`Invalid Email "${invalidEmail}"`, function () {
            it(`should return false`, function () {
                chai.assert.equal(RegEx.Email.test(invalidEmail), false);
            });
        });

        const invalidFQDN = "a.bcd_ef.ghi";
        const validFQDN = "a.bcd-ef.ghi";

        describe(`Valid FQDN "${validFQDN}"`, function () {
            it(`should return true`, function () {
                chai.assert.equal(RegEx.FQDN.test(validFQDN), true);
            });
        });

        describe(`Invalid FQDN "${invalidEmail}"`, function () {
            it(`should return false`, function () {
                chai.assert.equal(RegEx.FQDN.test(invalidFQDN), false);
            });
        });
    });
});
