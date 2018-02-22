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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export default {

    /**
     * Checks if value is in list
     * @param list
     * @param value
     * @return {boolean}
     */
    contains(list, value) {
        let result = false;

        if (list instanceof Array) {
            for (let i = 0; i < list.length; i += 1) {
                if (list[i] === value) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    },

    /**
     * Merge objects
     * @return {*}
     */
    extend() {
        const args = Array.prototype.slice.call(arguments);
        let recursive = false;
        let a = args.shift();

        if (typeof a === "boolean") {
            recursive = a;
            a = args.shift();
        }

        for (let i = 0; i < args.length; i += 1) {
            const b = args[i];

            if (typeof b === "object" && b !== null
                && typeof a === "object" && a !== null) {
                for (let key in b) {
                    if (b.hasOwnProperty(key)) {
                        if (recursive && typeof b[key] === "object" && b[key] !== null) {
                            a[key] = this.extend(a[key], b[key]);
                        } else {
                            a[key] = b[key];
                        }
                    }
                }
            } else if (b !== null && typeof b !== "undefined") {
                a = b;
            }
        }
        return a;
    }
};
