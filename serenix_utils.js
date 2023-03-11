/* 
 * The MIT License
 *
 * Copyright 2021 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if (typeof inBrowser === 'undefined') {
    var inBrowser = typeof window !== 'undefined';
}

if (typeof globalNS === 'undefined') {
    var globalNS;
    if (typeof window ==="undefined") {
        window=globalNS=typeof global!=="undefined" ? global : typeof self!=="undefined" ? self: this;
    } else {
        globalNS = window;
    }
} else if (typeof window ==="undefined") {
    window=globalNS;
}

if (Number.parseInt === undefined) {
    Number.parseInt = window.parseInt;
}

if (Number.parseFloat === undefined) {
    Number.parseFloat = window.parseFloat;
}
if (!globalNS.regex_nativ) {
    globalNS.regex_nativ = {
        exec: RegExp.prototype.exec,
        test: RegExp.prototype.test,
        match: String.prototype.match,
        replace: String.prototype.replace,
        split: String.prototype.split
    };
}

/**
 * 
 * @param {int} value
 * @returns {Boolean}
 */
Number.isSafeInteger = Number.isSafeInteger || function(value) {
  return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
};
//----------------------------------------------------------------------
// ES5 15.4 Array Objects
//----------------------------------------------------------------------
 
//
// ES5 15.4.3 Properties of the Array Constructor
//
 
 

if (!Array.isArray) {
    /**
     * 
     * @param {type} obj
     * @returns {Boolean}
     */
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
};

var isArray = Array.isArray;

/**
 * 
 * @param {type} value
 * @param {Number} startIndex
 * @returns {Number}
 */
Array.prototype.indexOf||(Array.prototype.indexOf=function(value,startIndex) {
    'use strict';
    if (this===null) {
        throw new TypeError('array.prototype.indexOf called on null or undefined');
    }
    var o = Object(this), l=o.length>>>0;
    if(l===0) return -1;
    var n=startIndex|0, k=Math.max(n>=0?n:l-Math.abs(n),0)-1;
    function sameOrNaN(a,b){
        return a===b||(typeof a==='number'&&typeof b==='number'&&isNaN(a)&&isNaN(b));
    }
    while(++k<l) {
        if(k in o && sameOrNaN(o[k],value)) {
            return k;
        }
    }
    return -1;
});

/*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
if (!String.fromCodePoint) {
  (function() {
    var defineProperty = (function() {
      // IE 8 only supports `Object.defineProperty` on DOM elements
      try {
        var object = {};
        var $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch(error) {}
      return result;
    }());
    var stringFromCharCode = String.fromCharCode;
    var floor = Math.floor;
    var fromCodePoint = function() {
      var MAX_SIZE = 0x4000;
      var codeUnits = [];
      var highSurrogate;
      var lowSurrogate;
      var index = -1;
      var length = arguments.length;
      if (!length) {
        return '';
      }
      var result = '';
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if (
          !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
          codePoint < 0 ||              // not a valid Unicode code point
          codePoint > 0x10FFFF ||       // not a valid Unicode code point
          floor(codePoint) != codePoint // not an integer
        ) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) { // BMP code point
          codeUnits.push(codePoint);
        } else { // Astral code point; split in surrogate halves
          // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
        if (index + 1 == length || codeUnits.length > MAX_SIZE) {
          result += stringFromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }
      }
      return result;
    };
    if (defineProperty) {
      defineProperty(String, 'fromCodePoint', {
        'value': fromCodePoint,
        'configurable': true,
        'writable': true
      });
    } else {
      String.fromCodePoint = fromCodePoint;
    }
  }());
}


/**
 * 
 * @param {type} obj
 * @returns {Boolean}
 */
function isObjectEmpty(obj) {
    if (Object.getOwnPropertyNames) {
        return Object.getOwnPropertyNames(obj).length === 0;
    } else {
        var k;
        for (k in obj) {
            if (hasOwnProp(obj, k)) {
                return false;
            }
        }
        return true;
    }
}
/**
 * Returns true when the two arguments are 
 * <ul>
 * <li>strictly equals (same value or same object)</li>
 * <li>are of type array and have each value at the same position are loose equal.</li>
 * <li>are of type plain objects, have the same number of keys, all the keys of 
 * the first object are in the keys of the second object,  and the value of 
 * each key in the first object is are loose equal to the value of the key in 
 * the second object.</li>
 * <li>The two values (arguments) have the same string representation</li>
 * </ul>
 * <p>Otherwise, returns false.</p>
 * @param {type} a
 * @param {type} b
 * @returns {Boolean}
 */
function areLooseEqual (a, b) {
    function isObj (o) {
        return o !== null && typeof o === 'object';
    };
    if (a === b) return true;
    // a is object?
    var aObj = isObj(a);
    // b is object?
    var bObj = isObj(b);
    if (aObj && bObj) {
        try {
            // a is array?
            var aArr = isArray(a);
            // b is array?
            var bArr = isArray(b);
            if (aArr && bArr) {
                return a.length === b.length && a.every(function(e, i){
                  return isLooseEqual(e, b[i]);
                });
            } else if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime();
            } else if (!aArr && !bArr) {
                var keys1 = Object.keys(a);
                var keys2 = Object.keys(b);
                return keys1.length === keys2.length && keys1.every(function(key) {
                  return isLooseEqual(a[key], b[key]);
                });
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else if (!aObj && !bObj) {
        return String(a) === String(b);
    } else {
        return false;
    }
}
/**
 * 
 * @param {type} a
 * @param {type} b
 * @returns {Boolean} * 
 * @see areLooseEqual
 * @alias areLooseEqual
 */
var looseEqual = areLooseEqual;
/**
 * Returns true when the two arguments are 
 * <ul>
 * <li>strictly equals (same value or same object)</li>
 * <li>are of type array and have each value at the same position are loose equal.</li>
 * <li>are of type plain objects, have the same number of keys, all the keys of 
 * the first object are in the keys of the second object,  and the value of 
 * each key in the first object is are loose equal to the value of the key in 
 * the second object.</li>
 * </ul>
 * <p>Otherwise, returns false.</p>
 * @param {type} a
 * @param {type} b
 * @returns {Boolean}
 */
function areEqual (a, b) {
    function isObj (o) {
        return o !== null && typeof o === 'object';
    };
    if (a === b) return true;
    // a is object?
    var aObj = isObj(a);
    // b is object?
    var bObj = isObj(b);
    if (aObj && bObj) {
        try {
            // a is array?
            var aArr = isArray(a);
            // b is array?
            var bArr = isArray(b);
            if (aArr && bArr) {
                return a.length === b.length && a.every(function(e, i){
                  return isEqual(e, b[i]);
                });
            } else if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime();
            } else if (!aArr && !bArr) {
                var keys1 = Object.keys(a);
                var keys2 = Object.keys(b);
                return keys1.length === keys2.length && keys1.every(function(key) {
                  return isEqual(a[key], b[key]);
                });
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 
 * @param {type} a
 * @param {type} b
 * @returns {Boolean} * 
 * @see areEqual
 * @alias areEqual
 */
var equal = areEqual;


//----------------------------------------------------------------------
// ES5 15.3 Function Objects
//----------------------------------------------------------------------
 
//
// ES5 15.3.4 Properties of the Function Prototype Object
//
 
// ES5 15.3.4.5 Function.prototype.bind ( thisArg [, arg1 [, arg2, ... ]] )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (o) {
        if (typeof this !== 'function') {
            throw TypeError("Bind must be called on a function");
        }
        var slice = [].slice,
            args = slice.call(arguments, 1),
            self = this,
            bound = function () {
                return self.apply(this instanceof nop ? this : o,
                    args.concat(slice.call(arguments)));
            };
 
        function nop() {}
        nop.prototype = self.prototype;
        bound.prototype = new nop();
        return bound;
    };
}
 

 
//
// ES5 15.4.4 Properties of the Array Prototype Object
//
 
// ES5 15.4.4.14 Array.prototype.indexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
 
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (isNaN(n)) {
                n = 0;
            }
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
 
        if (n >= len) {
            return -1;
        }
 
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
 
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}
 
// ES5 15.4.4.15 Array.prototype.lastIndexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
 
        var n = len;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n !== n) {
                n = 0;
            }
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
 
        var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);
 
        for (; k >= 0; k--) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}
 
// ES5 15.4.4.16 Array.prototype.every ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function (fun /*, thisp */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw TypeError();
        }
 
        var thisp = arguments[1],
            i;
        for (i = 0; i < len; i++) {
            if (i in t && !fun.call(thisp, t[i], i, t)) {
                return false;
            }
        }
 
        return true;
    };
}
 
// ES5 15.4.4.17 Array.prototype.some ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function (fun /*, thisp */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw TypeError();
        }
 
        var thisp = arguments[1],
            i;
        for (i = 0; i < len; i++) {
            if (i in t && fun.call(thisp, t[i], i, t)) {
                return true;
            }
        }
 
        return false;
    };
}
 
// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fun /*, thisp */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw TypeError();
        }
 
        var thisp = arguments[1],
            i;
        for (i = 0; i < len; i++) {
            if (i in t) {
                fun.call(thisp, t[i], i, t);
            }
        }
    };
}
 
 
// ES5 15.4.4.19 Array.prototype.map ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Map
if (!Array.prototype.map) {
    Array.prototype.map = function (fun /*, thisp */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw TypeError();
        }
 
        var res = [];
        res.length = len;
        var thisp = arguments[1],
            i;
        for (i = 0; i < len; i++) {
            if (i in t) {
                res[i] = fun.call(thisp, t[i], i, t);
            }
        }
 
        return res;
    };
}
 
// ES5 15.4.4.20 Array.prototype.filter ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisp */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw TypeError();
        }
 
        var res = [];
        var thisp = arguments[1],
            i;
        for (i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t)) {
                    res.push(val);
                }
            }
        }
 
        return res;
    };
}
 
 
// ES5 15.4.4.21 Array.prototype.reduce ( callbackfn [ , initialValue ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (fun /*, initialValue */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw TypeError();
        }
 
        // no value to return if no initial value and an empty array
        if (len === 0 && arguments.length === 1) {
            throw TypeError();
        }
 
        var k = 0;
        var accumulator;
        if (arguments.length >= 2) {
            accumulator = arguments[1];
        }
        else {
            do {
                if (k in t) {
                    accumulator = t[k++];
                    break;
                }
 
                // if array contains no values, no initial value to return
                if (++k >= len) {
                    throw TypeError();
                }
            }
            while (true);
        }
 
        while (k < len) {
            if (k in t) {
                accumulator = fun.call(undefined, accumulator, t[k], k, t);
            }
            k++;
        }
 
        return accumulator;
    };
}
 
 
// ES5 15.4.4.22 Array.prototype.reduceRight ( callbackfn [, initialValue ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function (callbackfn /*, initialValue */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof callbackfn !== "function") {
            throw TypeError();
        }
 
        // no value to return if no initial value, empty array
        if (len === 0 && arguments.length === 1) {
            throw TypeError();
        }
 
        var k = len - 1;
        var accumulator;
        if (arguments.length >= 2) {
            accumulator = arguments[1];
        }
        else {
            do {
                if (k in this) {
                    accumulator = this[k--];
                    break;
                }
 
                // if array contains no values, no initial value to return
                if (--k < 0) {
                    throw TypeError();
                }
            }
            while (true);
        }
 
        while (k >= 0) {
            if (k in t) {
                accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);
            }
            k--;
        }
 
        return accumulator;
    };
}



        
if (!String.prototype.ltrim) {
    /**
     * 
     * @returns {String}
     */
    String.prototype.ltrim = function() {
        return this.toString().replace(/^\s+/g,''); 
    };
}
if (!String.prototype.rtrim) {
    /**
     * 
     * @returns {String}
     */
    String.prototype.rtrim = function() {
        return this.toString().replace(/\s+$/g,''); 
    };
}
if (!String.prototype.trim) {
    /**
     * 
     * @returns {String}
     */
    String.prototype.trim = function() {
        return this.toString().replace(/^\s+|\s+$/g,''); 
    };
}

// Polyfill Number.isNaN(value)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
Number.isNaN = Number.isNaN || function(value) {
    if (value instanceof Date) {
        value = value.getTime();
    }
    return typeof value === 'number' && value !== value;
};

if (!globalNS.isNaN) {
    globalNS.isNaN = Number.isNaN;
}

if (!Date.prototype.isValid) {
    Date.prototype.isValid = function () {
        return isNaN(this.getTime());
    };
    
    Date.prototype.isValidDate = Date.prototype.isValid;
}
/**
 * 
 * @param {type} d
 * @returns {Boolean|Date}
 */
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}
/**
 * ES 15.9.4 Properties of the Date Constructor
 *

 * ES5 15.9.4.4 Date.now ( )
 * From https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Date/now
 */
if (!Date.now) {
    /**
     * 
     * @returns {Number}
     */
    Date.now = function now() {
        return Number(new Date());
    };
}

//
// ES5 15.9.5 Properties of the Date Prototype Object
//
 
// ES5 15.9.4.43 Date.prototype.toISOString ( )
// Inspired by http://www.json.org/json2.js
if (!Date.prototype.toISOString) {
    /**
     * 
     * @returns {String}
     */
    Date.prototype.toISOString = function () {
        function pad2(n) {
            return ('00' + n).slice(-2);
        }
 
        function pad3(n) {
            return ('000' + n).slice(-3);
        }
 
        return this.getUTCFullYear() + '-' +
            pad2(this.getUTCMonth() + 1) + '-' +
            pad2(this.getUTCDate()) + 'T' +
            pad2(this.getUTCHours()) + ':' +
            pad2(this.getUTCMinutes()) + ':' +
            pad2(this.getUTCSeconds()) + '.' +
            pad3(this.getUTCMilliseconds()) + 'Z';
    };
}
/**
 * Check if a value is a plain object.
 *
 * @private
 * @param {*} val
 * @returns {Boolean}
 */
function isPlainObject(val) {
    return typeof val === 'object' 
            && Object.prototype.toString.call(val) === '[object Object]';
}
/**
 * Returns true if it is a DOM node
 * @param {type} o
 * @returns {Boolean}
 */
function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}
/**
 * Returns true if it is a DOM node
 * @param {type} o
 * @returns {Boolean}
 */
var isDOMNode = isNode;

/**
 * Returns true if it is a DOM element
 * @param {type} o
 * @returns {Boolean}
 */   
function isElement(o){
    try {
        return (
          typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
          o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    } catch (e) {
        return element instanceof Element || element instanceof HTMLDocument;  
    }
}
/**
 * Returns true if it is a DOM element
 * @param {type} o
 * @returns {Boolean}
 */  
var isDOMElement = isElement;
/**
 * Returns true if it is a DOM element
 * @param {type} o
 * @returns {Boolean}
 */  
var isDOMElt = isElement;
/**
 * 
 * @param {String} id
 * @returns {Element}
 */
function $id(id) {
    return document.getElementById(id);
}
/**
 * 
 * @returns {Element}
 */
function $body() {
    return document.getElementsByTagName('body')[0];
}
/**
 * The syntax : 
 * <p>mergeObjects(Object o1, Object o2, ..., Object on [ , Array&lt;String&gt; exclusions ])</p>
 * 
 * @returns {unresolved}
 */
function mergeObjects() {
    
    var n = arguments.length, ex = false;
    if (n > 2 && isArray(arguments[n - 1])) {
        n--;
        if (n < 2) {
            throw "At least three arguments expected";
        }
        ex = arguments[n - 1];
    } else if (n < 2) {
        throw "At least two arguments expected";
    }
    var o1 = arguments[0], o2;
    if (ex) {
        for (var i = 1; i < n; i++) {
            o2 = arguments[i];
            for (var k in o2) {
                if (o2.hasOwnProperty(k) && ex.indexOf(k) <0) {
                    o1[k] = o2[k];
                }
            }
        }
    } else {
        for (var i = 1; i < n; i++) {
            o2 = arguments[i];
            for (var k in o2) {
                if (o2.hasOwnProperty(k)) {
                    o1[k] = o2[k];
                }
            }
        }
    }
    return o1;
}
var mergeObjs = mergeObjects;

/**
 * Returns true if the date is valid; otherwise, returns false.
 * @returns {Boolean}
 */Date.prototype.isDate = function (){
    return (this !== "Invalid Date" && !isNaN(this)) ? true : false;
};
/**
 * Returns true if the argument is an instance of Date and it's a valid date; 
 * otherwise, returns false.
 * @param {type} o
 * @returns {Boolean}
 */
Date.isDate = function (o){
    if (!(o instanceof Date)) {
        return false;
    }
    return o.isDate();
};

/**
   * Check if a value is a plain object.
   *
   * @private
   * @param {*} val
   * @returns {Boolean}
   */
function isPlainObject(val) {
    return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]';
}
var isPlainObj = isPlainObject;

function isNoVal(v) {
    return v === undefined || v === null;
}

function isVal(v) {
    return v !== undefined && v !== null;
}

if (!globalNS["SereniX"]) {
    globalNS["SereniX"] = { __NAMESPACE_NAME__ : "SereniX", __NAME__ : "SereniX"};
}

if (!String.prototype.equals) {
    String.prototype.equals = function(s) {
        if (s instanceof String) {
            return this.toString() === s.toString();
        }
        if (typeof s !== 'string') {
            return false;
        }
        return this.toString() === s;
    };
}

if (!SereniX.isPlainObject) {
    SereniX.isPlainObject = isPlainObject;
}

if (!SereniX.isValidDate) {
    /**
     * Returns true if the argument is an instance of Date and it's a valid date
     * ; otherwise, returns false.
     * @param {type} o
     * @returns {Boolean}
     */
    SereniX.isValidDate = function(o) {
        return Date.isDate(o);
    };
}

if (!SereniX.isDate) {
    /**
     * Returns true if the argument is an instance of Date ; otherwise, returns 
     * false.
     * @param {type} o
     * @returns {Date}
     */
    SereniX.isDate = function(o) {
        return o instanceof Date;
    };
}

if (!globalNS["$isDate"]) {
    globalNS["$isDate"] = SereniX.isDate;
}

if (!globalNS["$isValidDate"]) {
    globalNS["$isValidDate"] = SereniX.isValidDate;
}

if (!SereniX.isInteger) {
    /**
     * Returns true if the value of the argument is a number and a non floating 
     * point number, otherwise returns false.
     * @param {type} v
     * @returns {Boolean}
     */
    SereniX.isInteger = function(v) {
        return typeof v === 'number' && 
            isFinite(v) && 
            Math.floor(v) === v;
    };
}

if (!globalNS["$isInteger"]) {
    /**
     * Returns true if the value of the argument is a number and a non floating 
     * point number, otherwise returns false.
     * @param {type} o
     * @returns {Boolean}
     */
    globalNS["$isInteger"] = SereniX.isInteger;
}

if (!globalNS["isInteger"]) {
    /**
     * Returns true if the value of the argument is a number and a non floating 
     * point number, otherwise returns false.
     * @param {type} o
     * @returns {Boolean}
     */
    globalNS["isInteger"] = SereniX.isInteger;
}
/**
 * 
 */
if (!SereniX.isJSFloat) {
    /**
     * 
     * @param {Object} o
     * @param {Boolean} strict  The strict parameter is optional.
     * @returns {Boolean}
     */
    SereniX.isJSFloat = function(o, strict) {
        if (arguments.length === 1) {
            strict = false;
        }
        if (typeof o !== 'number') {
            return false;
        }
        var str = "" + o;
        return strict ? str.indexOf(".") >= 0 : true;
    };
}

if (!globalNS["$isJSFloat"]) {
    globalNS["$isJSFloat"] = SereniX.isJSFloat;
}


/**
* 
* @param {type} v
* @returns {Boolean|Number}
*/
SereniX.isLInteger = function (v) {
   if (!Number.isInteger(v)) {
       return false;
   } 
   return v >= -2147483648 && v <= 2147483647;
};
/**
* 
* @param {type} v
* @returns {unresolved}
*/
SereniX.isLong = function (v) {
   return Number.isInteger(v) && v >= -9223372036854775808 && v <= 9223372036854775807;
};
/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isShort = function (v) {
   if (!Number.isInteger(v)) {
       return false;
   }
   return v >= -32767 && v < +32767;
};
/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isByte = function (v) {
   if (!Number.isInteger(v)) {
       return false;
   }
   return v >= -128 && v < 128;
};
/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isBit = function (v) {
   return v === 0 || v === 1;
};

/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isFloat = function (v) {
    if (typeof v!== 'number') {
        return false;
    }
    return v >= 3.4e-38 && v < 3.4e+38;
};
/**
 * Returns true when the argument is a number and it's value is between 
 * <b>-2147483648</b> and <b>2147483647</b>.
 * @param {type} v
 * @returns {Boolean}
 */
SereniX.isInt = function(v) {
    if (!Number.isInteger(v)) {
        return false;
    }
    return v >= -2147483648 && v <= 2147483647;
};
/**
 * Returns true when the argument is a number and it's value is between 
 * <b>-2147483648</b> and <b>2147483647</b>.
 * @param {type} v
 * @returns {Boolean|Number}
 */
$isInt = SereniX.isInt;
/**
* 
* @param {type} v
* @returns {unresolved}
*/
SereniX.isJSDouble = function (v) {
   return Number.isFloat(v);
};
/**
* 
* @param {type} v
* @returns {unresolved}
*/
SereniX.isLongDouble = function (v) {
   return Number.isFloat(v);
};
/**
* 
* @param {type} v
* @returns {unresolved}
*/
SereniX.isDouble = function (v) {
   return v >= 1.7e-308 && v < 1.7e+308;
};

/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isUnsignedShort = function (v) {
   if (!Number.isInteger(v)) {
       return false;
   }
   return v >= 0 || v <= 65535;
};
/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isUnsignedLong = function (v) {
   if (!Number.isInteger(v)) {
       return false;
   }
   return v >= 0 && v <= +18446744073709551615;
};
/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isUnsignedByte = function (v) {
   return v >= 0 && v < 256;
};
/**
* 
* @param {type} v
* @returns {undefined}
*/
SereniX.isUnsignedFloat = function (v) {
   return v >= 0 && v < 6.8e+38;
};
/**
* 
* @param {type} v
* @returns {undefined}
*/
SereniX.isUnsignedDouble = function (v) {
   return v >= 0 && v < 3.14e+308;
};
/**
* 
* @param {type} v
* @returns {undefined}
*/
SereniX.isUnsignedLongDouble = function (v) {
   return SereniX.Number.isNumber(v) && v >= 0;
};
/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isUnsignedInt = function(v) {
   return SereniX.Number.isNumber(v) && v >= 0 && v <= 4294967295;
};

/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isNan = function (v) {
   return Number.isNaN(v);
};
/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isNaN = function (v) {
   return Number.isNaN(v);
}; 
/**
* Returns true if the argument is a positive number, returns false when it's a 
* negative number, otherwise returns null when the argument is not a number, .
* @param {Number|Object} v
* @returns {Boolean}
*/
SereniX.isPositive = function(v) {
    if (typeof v !== 'number') {
        return null;
    }
    return v > 0;
};
/**
* 
* @param {Number} v
* @returns {Boolean}
*/
SereniX.isPositiveOrZero = function(v) {
   return v >= 0;
};
/**
* 
* @param {Number} v
* @returns {Boolean}
*/
SereniX.isPositiveOrNul = function(v) {
   return v >= 0;
};
/**
* 
* @param {type} v
* @returns {Boolean}
*/
SereniX.isNegative = function(v) {
   return v < 0;
};
/**
 * 
 * @param {type} v
 * @returns {Boolean}
 */
SereniX.isNegativeOrZero = function(v) {
   return v <= 0;
};

/**
 * 
 * @param {type} v
 * @returns {Boolean}
 */
SereniX.isUnsignedShort = function (v) {
    if (!Number.isInteger(v)) {
        return false;
    }
    return v >= 0 || v <= 65535;
};
/**
 * 
 * @param {type} v
 * @returns {Boolean}
 */
SereniX.isUnsignedLong = function (v) {
    if (!Number.isInteger(v)) {
        return false;
    }
    return v >= 0 && v <= +18446744073709551615;
};
/**
 * 
 * @param {type} v
 * @returns {Boolean}
 */
SereniX.isUnsignedByte = function (v) {
    return v >= 0 && v < 256;
};
/**
 * 
 * @param {type} v
 * @returns {undefined}
 */
SereniX.isUnsignedFloat = function (v) {
    return v >= 0 && v < 6.8e+38;
};
/**
 * 
 * @param {type} v
 * @returns {undefined}
 */
SereniX.isUnsignedDouble = function (v) {
    return v >= 0 && v < 3.14e+308;
};
/**
 * 
 * @param {type} v
 * @returns {undefined}
 */
SereniX.isUnsignedLongDouble = function (v) {
    return SereniX.Number.isNumber(v) && v >= 0;
};
/**
 * 
 * @param {type} v
 * @returns {Boolean}
 */
SereniX.isUnsignedInt = function(v) {
    return SereniX.Number.isNumber(v) && v >= 0 && v <= 4294967295;
};



if (!SereniX.getObjectClassName) {
    SereniX.getObjectClassName = function(obj) {
        if (typeof obj === "undefined") return "undefined";
        if (obj === null) return "null";
        return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
        /*if (obj.constructor && obj.constructor.name) {
            return obj.constructor.name;
        }*/
    };
    
    SereniX.getClassName = function(Cls) {
        if (typeof Cls.__CLASS_NAME__ === 'string') {
            return Cls.__CLASS_NAME__;
        }
        if (!typeof Cls !== 'function') {
            throw "The argument is not a class";
        }
        if (typeof Cls.__NAME__ === 'string') {
            return Cls.__NAME__;
        }
        try {
            return SereniX.getObjectClassName(new Cls());
        } catch (e) {

        }
    };
    SereniX.getObjClassName = SereniX.getObjectClassName;
    globalNS["$oclass"] = SereniX.getObjectClassName;
    globalNS["$ocname"] = SereniX.getObjectClassName;
    globalNS["$objClassName"] = SereniX.getObjectClassName;
    globalNS["$ocn"] = SereniX.getObjectClassName;
    globalNS["$cn"] = SereniX.getClassName;
}


if (!globalNS["getElementById"]) {
    globalNS["getElementById"] = function(id) {
        if (document.getElementById) return document.getElementById(id);
        elts = document.all||document.layers;
        return elts[id];
    };
}

if (!globalNS["$el"]) {
    globalNS["$el"] = getElementById;
}

if (!globalNS["$elt"]) {
    globalNS["$elt"] = getElementById;
}

if (!globalNS["$eltById"]) {
    globalNS["$eltById"] = getElementById;
}

if (!document.getElementById) {
    document.getElementById = globalNS["getElementById"];
}

if (!globalNS["getElementsByClassName"]) {
    globalNS["getElementsByClassName"] = function(cname, owner) {
        var elt;
        if (arguments.length > 1) {
            elt = typeof owner === 'string' ? getElementById(owner) : owner;
            if (!elt) {
                elt = document;
            }
        }
        return elt.getElementsByClassName(cname);
    };
}

if (!globalNS["getElementsByClassName"]) {
    globalNS["getElementsByClassName"] = function(cname, owner) {
        var elt;
        if (arguments.length > 1) {
            elt = typeof owner === 'string' ? getElementById(owner) : owner;
            if (!elt) {
                elt = document;
            }
        }
        return elt.getElementsByClassName(cname);
    };
}

if (!window['getElementsByTagName']) {
    window['getElementsByTagName'] = function(tag, owner) {
        var elt;
        if (arguments.length > 1) {
            elt = typeof owner === 'string' ? getElementById(owner) : owner;
            if (!elt) {
                elt = document;
            }
        }
        return elt.getElementsByTagName(tag);
    };
}

if (!globalNS["$bytag"]) {
    /**
     * 
     * @param {type} ns
     * @param {type} tag
     * @param {type} owner
     * @returns {unresolved}
     */
    globalNS["$bytag"] = getElementsByTagName;
}

if (!globalNS["$byTag"]) {
    /**
     * 
     * @param {type} ns
     * @param {type} tag
     * @param {type} owner
     * @returns {unresolved}
     */
    globalNS["$byTag"] = getElementsByTagName;
}


if (!window['getElementsByTagNameNS']) {
    /**
     * 
     * @param {type} ns
     * @param {type} tag
     * @param {type} owner
     * @returns {unresolved}
     */
    window['getElementsByTagNameNS'] = function(ns, tag, owner) {
        var elt;
        if (arguments.length > 1) {
            elt = typeof owner === 'string' ? getElementById(owner) : owner;
            if (!elt) {
                elt = document;
            }
        }
        return elt.getElementsByTagNameNS(ns, tag);
    };
}

if (!globalNS["$elBytns"]) {
    globalNS["$elByTns"] = getElementsByTagNameNS;
}

if (!globalNS["$etns"]) {
    /**
     * 
     * @param {type} ns
     * @param {type} tag
     * @param {type} owner
     * @returns {unresolved}
     */
    globalNS["$etns"] = getElementsByTagNameNS;
}

if (!globalNS["$bytns"]) {
    /**
     * 
     * @param {type} ns
     * @param {type} tag
     * @param {type} owner
     * @returns {unresolved}
     */
    globalNS["$bytns"] = getElementsByTagNameNS;
}

if (!globalNS["$byTNS"]) {
    /**
     * 
     * @param {type} ns
     * @param {type} tag
     * @param {type} owner
     * @returns {unresolved}
     */
    globalNS["$byTNS"] = getElementsByTagNameNS;
}
if (!globalNS["$ebyTNS"]) {
    /**
     * 
     * @param {type} ns
     * @param {type} tag
     * @param {type} owner
     * @returns {unresolved}
     */
    globalNS["$ebyTNS"] = getElementsByTagNameNS;
}

if (!globalNS["$ebytns"]) {
    /**
     * 
     * @param {type} ns
     * @param {type} tag
     * @param {type} owner
     * @returns {unresolved}
     */
    globalNS["$ebytns"] = getElementsByTagNameNS;
}

/**
 * 
 * @param {type} $str
 * @returns {unresolved}
 */
var jqEscape = function($str) {
    return $str.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
};
/**
 * 
 * @param {type} $str
 * @returns {unresolved}
 */
var jq_escape = function($str) {
    return $str.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
};

/**
 * 
 * @param {type} $str
 * @returns {unresolved}
 */
var jqescape = function($str) {
    return $str.replace( /!|"|#|\$|%|&|'|\(|\)|\*|\+|,|\.|\/|:|;|<|=|>|\?|@|\[|\\|\]|\^|`|\{\|\}~/g, "\\$1" );
};

function escapeRegExp(string){
  // $& correspond à la chaîne correspondante
  // dans son intégralité
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
 * 
 * @param {type} $str
 * @returns {unresolved}
 */
var $jqe = jq_escape;

/**
 * 
 * @param {type} $str
 * @returns {unresolved}
 */
var $jqesc = jq_escape;
/**
 * 
 * @param {type} id
 * @returns {String}
 */
$jqId = function(id) {
    return '#' + jq_escape(id);
};
/**
 * 
 * @param {type} id
 * @returns {String}
 */
$jqid = function(id) {
    return '#' + jq_escape(id);
};
/**
 * 
 * @param {type} id
 * @returns {String}
 */
$jq_id = function(id) {
    return '#' + jq_escape(id);
};



/**
 * 
 * @type Array&lt;String&gt;
 */
SereniX.STRING_TRUE_VALUES = ['true', '1', 'on', 'yes', 'y', 't', 'oui', 'ok', 'o'];
/**
 * 
 * @type Array&lt;String&gt;
 */
SereniX.STRING_FALSE_VALUES = ['false', '0', 'off', 'no', 'n', 'f', 'non', 'ko', 'nok'];
/**
 * Returns the first boolean value (true or false) of the given field names arguments.
 * <p>Syntax:</p>
 * <p>getBoolean \( ( Object o, Array&lt;String&gt; names) | (Object o, (String name)+ \)</p>
 * @returns {Boolean}
 */
SereniX.coalesceBoolean = function() {
    var n = arguments.length;
    if (n < 2) {
        throw new Error("At leat two arguments expected");
    }
    var e = arguments[0], s, b;
    for (var i = 1; i < n; i++) {
        s = e[arguments[i]];
        if (typeof s === 'boolean') {
            return s;
        }
        if (s === 0) {
            return false;
        }
        if (!(typeof s === 'undefined' || i === null || i === '')) {
            b = toBoolean(s);
            if (b !== null) return b;
        }
    }
    return null;
};

var coalesceBoolean = SereniX.coalesceBoolean;

/**
 * 
 * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
 *     string, anumber or a boolean <b>This parameter is mandatory</b>
 * @param {Boolean|Number|String} defVal The default value to substitute null, 
 *     undefined, empty string or non matching string boolean values. <b>This
 *     parameter is optional</b>
 * @returns {Boolean} The returned values are <b color="blue">true</b>, 
 *     <b color="blue">false</b> or <b color="blue">null</b>.
 */
SereniX.toBoolean = function(b, defVal) {
    if ((typeof b === 'undefined') || (b === null) || (b === '')) {
        if (arguments.length > 1) {
            defVal = arguments[1];
            if (typeof defVal === 'boolean') {
                return defVal;
            }
            if (typeof defVal === 'number') {
                return defVal === 0 ? false : true;
            }
            if (typeof defVal === 'string') {
                defVal = defVal.toLowerCase();
                if (SereniX.STRING_TRUE_VALUES.indexOf(defVal) >= 0) {
                    return true;
                }
                if (SereniX.STRING_FALSE_VALUES.indexOf(defVal) >= 0) {
                    return false;
                }
            }
        }
        return null;
    }
    var type = typeof b;
    if (type === 'boolean') {
        return b;
    }
    if (type === 'number' ) {
        return b === 0 ? false : true;
    }
    if (type !== 'string' ) {
        throw "Incorrect argument";
    }
    var s = b.toLowerCase();
    if (SereniX.STRING_TRUE_VALUES.indexOf(s) >= 0) {
        return true;
    }
    if (SereniX.STRING_FALSE_VALUES.indexOf(s) >= 0) {
        return false;
    }
    return null;
};

/**
 * 
 * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
 *     string, anumber or a boolean <b>This parameter is mandatory</b>
 * @returns {Boolean} The returned values are <b color="blue">true</b> or  
 *     <b color="blue">false</b>.
 */
SereniX.toBool = function(b) {
    if (b === null || b === '' || b === undefined) {
        if (arguments.length > 1) {
            var defVal = arguments[1];
            if (typeof defVal === 'boolean') {
                return defVal;
            }
            if (typeof defVal === 'string') {
                defVal = defVal.toLowerCase();
                if (SereniX.STRING_TRUE_VALUES.indexOf(defVal) >= 0) {
                    return true;
                }
                if (SereniX.STRING_FALSE_VALUES.indexOf(defVal) >= 0) {
                    return false;
                }
            }
        }
        return false;
    }
    var type = typeof b;
    if (type === 'boolean') {
        return b;
    }
    if (type === 'number' ) {
        return b === 0 ? false : true;
    }
    if (type === 'undefined') {
        return false;
    }
    if (type !== 'string' ) {
        throw "Incorrect argument";
    }
    var s = b.toLowerCase();
    if (SereniX.STRING_TRUE_VALUES.indexOf(s) >= 0) {
        return true;
    }
    if (SereniX.STRING_FALSE_VALUES.indexOf(s) >= 0) {
        return false;
    }
};


/**
 * 
 * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
 *     string, anumber or a boolean <b>This parameter is mandatory</b>
 * @param {Boolean|Number|String} defVal The default value to substitute null, 
 *     undefined, empty string or non matching string boolean values. <b>This
 *     parameter is optional</b>
 * @returns {Boolean} The returned values are <b color="blue">true</b>, 
 *     <b color="blue">false</b> or <b color="blue">null</b>.
 */
var toBoolean = SereniX.toBoolean;
/**
 * 
 * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
 *     string, anumber or a boolean <b>This parameter is mandatory</b>
 * @param {Boolean|Number|String} defVal The default value to substitute null, 
 *     undefined, empty string or non matching string boolean values. <b>This
 *     parameter is optional</b>
 * @returns {Boolean} The returned values are <b color="blue">true</b>, 
 *     <b color="blue">false</b> or <b color="blue">null</b>.
 */
SereniX.boolean = SereniX.toBoolean;

/**
 * 
 * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
 *     string, anumber or a boolean <b>This parameter is mandatory</b>
 * @param {Boolean|Number|String} defVal The default value to substitute null, 
 *     undefined, empty string or non matching string boolean values. <b>This
 *     parameter is optional</b>
 * @returns {Boolean} The returned values are <b color="blue">true</b>, 
 *     <b color="blue">false</b> or <b color="blue">null</b>.
 */
$boolean = SereniX.toBoolean;
/**
 * 
 * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
 *     string, anumber or a boolean <b>This parameter is mandatory</b>
 * @param {Boolean|Number|String} defVal The default value to substitute null, 
 *     undefined, empty string or non matching string boolean values. <b>This
 *     parameter is optional</b>
 * @returns {Boolean} The returned values are <b color="blue">true</b>, 
 *     <b color="blue">false</b> or <b color="blue">null</b>.
 */
var $toBoolean = SereniX.toBoolean;
/**
 * 
 * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
 *     string, anumber or a boolean <b>This parameter is mandatory</b>
 * @returns {Boolean} The returned values are <b color="blue">true</b> or  
 *     <b color="blue">false</b>.
 */
var toBool = SereniX.toBool;
/**
 * 
 * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
 *     string, anumber or a boolean <b>This parameter is mandatory</b>
 * @returns {Boolean} The returned values are <b color="blue">true</b> or  
 *     <b color="blue">false</b>.
 */
SereniX.bool = SereniX.toBool;

var $bool = SereniX.toBool;

var $toBool = SereniX.toBool;
/**
 * Create global variables with the '$' prefix and set their values respectively with the corresponding value 
 * from the given global variable names.
 * <p>The syntax is : <b color="green">setVarAliases</b> 
 * <b color="green">(</b> <i><b>&lt;arg&gt;</b></i> ( ,  <i><b>&lt;arg&gt;</b></i> )<b>*</b> 
 * <b color="green">)</b>
 * @returns {undefined}
 */
function setVarAliases() {
    var args = arguments;
    while (args.length === 1  && isArray(args[0])) {
        args = args[0];
    }
    if (!globalNS["__SERENIX_ALIASES___"]) {
        globalNS["__SERENIX_ALIASES___"] = {};
    }
    var n = args.length, v, varName, alias, arg;
    
    for (var i = 0; i < n; i++) {
        arg = args[i];
        if (isArray(arg)) {
            setVarAliases(arg);
        } else {
            varName = arg;
            v = window[varName];
            if (typeof v !== 'undefined') {
                globalNS["__SERENIX_ALIASES___"][varName] = alias;
                alias = "$" + varName;
                window[alias] =  v;
            }
        }
    }
}
/**
 * 
 * @returns {undefined}
 */
var $aliases = setVarAliases;
/**
 * Returned the variable alias value if setted or otherwise, return global 
 * value corresponding to the given variable name.
 * @param {String} varName
 * @returns {type}
 */
function getVarAliasValue(varName) {
    if (globalNS["__SERENIX_ALIASES___"]) {
       return globalNS["__SERENIX_ALIASES___"][varName];
    }
    return window[varName];
}

var $value = getVarAliasValue;

var $avalue = getVarAliasValue;

var $aval = getVarAliasValue;

var $$val = getVarAliasValue;


var $addEvent = function(ev, elt, func) {
    if (typeof elt === 'string') {
        var e = getElementById(elt);
        if (!e) {
            throw "No element with the id '" + elt + "'";
        }
        elt = e;
    }
    try {
        ev = ev.toLowerCase();
        if( elt.addEventListener ){
            elt.addEventListener( ev.startsWith('on') ? ev.substring(2) : ev, func, false );
        } else if( elt.attachEvent ){
            elt.attachEvent( ev.startsWith('on') ? ev : "on" + ev, func );
        }
        // Browser don't support W3C or MSFT model, go on with traditional
        else {
            if (!ev.startsWith('on'))
                ev = 'on'+ev;
            if(typeof elt[ev] === 'function'){
                // Object already has a function on traditional
                // Let's wrap it with our own function inside another function
                func = (function(f1,f2){
                    return function(){
                        var args = [].slice.call(arguments);
                        f1.apply(this,args);
                        f2.apply(this,args);
                    };
                })(elt[ev], func);
            }
            elt[ev] = func;
        }
        return true;
    }catch( e ){
        return false;
    }   
};

var addEvent = $addEvent;

var $addEvt = $addEvent;

var $event = $addEvent;

var $evt = $addEvent;

if (typeof addEvt === 'undefined') {
    addEvt = $addEvent;
}

var $removeEvent = function(elt, ev, callback){
    ev = ev.toLowerCase();
    if (elt.removeEventListener){
        elt.removeEventListener(ev.startsWith('on') ? ev.substring(2) : ev, callback, false);
    } else if (elt.detachEvent) {
        elt.detachEvent(ev.startsWith("on") ? ev : "on" + ev, callback);
    } else {
        if (!ev.startsWith('on'))
            ev = 'on'+ev;
        var lsnrs;
        if ((lsnrs = elt[ev+"Listeners"])) {
            var i = lsnrs.indexOf(callback);
            if (i >= 0) {
                lsnrs.splice(i, 1);
            }
        } else if (elt[ev] === callback) {
            elt[ev] = undefined;
        }
    }
    return true;
};

var $removeEvt = $removeEvent;

if (typeof removeEvt === 'undefined') {
    removeEvt = $removeEvt;
}

function preventDefault(ev) {
    if(ev.preventDefault) ev.preventDefault();
    else ev.returnValue = false;
    if(ev.stopPropagation) ev.stopPropagation();
    if(ev.cancelBubble) ev.cancelBubble = true;
}

var stopPropagation = preventDefault;

if (typeof bindAction === 'undefined') {
	function bindAction(el, fn, keys) {
		var onKey;
		if (isArray(fn)) {
			function fire(ev) {
				ev = ev||window.event;
				fire.__actions.forEach(function(f) {
					f.call(this, ev);
				});
			}
			fire.__actions = fn;
			fn = fire;
		}
		addEvt('click', el, fn);
		onKey = isArray(keys) ? function __onKey(ev) {
			var which;
			ev = ev||window.event;
			which = ev.which;
			if (which === undefined || which === null)
				which = ev.keyCode;
			if (__onKey.keys.indexOf(which) >= 0) {
				__onKey.__action__.call(this, ev);
				preventDefault(ev);
			}
		} : function __onKey(ev) {
			var which;
			ev = ev||window.event;
			which = ev.which;
			if (which === undefined || which === null)
				which = ev.keyCode;
			if (which === 13) {
				__onKey.__action__.call(this, ev);
				preventDefault(ev);
			}        
		};
		onKey.__action__ = fn;
		onKey.keys = keys;
		addEvt('keydown', el, onKey);
		
		el.__$$action$$__ =  fn;
		el.__$$onClick$$__ = fn;
		el.__$$onKeydown$$__ = onKey;
	}
}


var Evt;
if (!SereniX.Event) {
    SereniX.Event = {};
}

Evt = SereniX.Event;
SereniX.Evt = Evt;

Evt.preventDefault = Evt.stopPropagation =  preventDefault;

var eventExt = (function() {
    function which(ev) {
        var w =(ev = ev||window.event).which;
        return w === undefined || w === null ? ev.keyCode : w;
    }
    
    function event(ev) {
        return ev||window.event;
    }
    
    function bind(e) {
        e.which = which;
        e.keyCode = which;
        e.keycode = which;
        e.event = event;
        e.evt = event;
        e.ev = event;
    }

    if (typeof addEvt === 'function') {
        bind(addEvt);
    }
    
    if (typeof $addEvt === 'function') {
        bind($addEvt);
    }
    
    if (typeof addEvent === 'function') {
        bind(addEvent);
    }
    
    if (typeof $addEvent === 'function') {
        bind($addEvent);
    }
    
    if (typeof SereniX.Event === 'function') {
        bind(SereniX.Event);
        SereniX.Event.bind = bind;
    }
    
    if (SereniX.evt && (typeof SereniX.evt.Event === 'function')) {
        bind(SereniX.evt.Event);
        SereniX.evt.Event.bind = bind;
    }
    return bind;
})();

/**
 * Computes the checkum.
 * <p><b>This algorithm is not intended to be a cryptographically secure hash 
 * function; it was designed to protect against accidental errors, not 
 * malicious attacks. Most credit cards and many government identification 
 * numbers use the algorithm as a simple method of distinguishing valid numbers 
 * from mistyped or otherwise incorrect numbers.</b></p>
 * @param {type} number
 * @see {@link https://en.wikipedia.org/wiki/Luhn_algorithm}
 * @returns {Boolean}
 */
function luhnCheck(number) {
    number = String(number);

    var sum = parseInt(number.charAt(number.length - 1));

    for (var i = 0; i < number.length - 1; i++) {
        var value = parseInt(number.charAt(i));

        if (i % 2 === 0) {
            value *= 2;
        }

        if (value > 9) {
            value -= 9;
        }

        sum += value;
    }

    return sum % 10 === 0;
}
/**
 * 
 * @param {Object} o  The object
 * @param {String} n  Property name
 * @returns {Boolean}
 */
function hasOwnProp(o, n) {
    return Object.prototype.hasOwnProperty.call(o, n);
}
/**
 * 
 * @param {Object} obj
 * @returns {Boolean}
 */
function isObjectEmpty(obj) {
    if (Object.getOwnPropertyNames) {
        return Object.getOwnPropertyNames(obj).length === 0;
    } else {
        var k;
        for (k in obj) {
            if (hasOwnProp(obj, k)) {
                return false;
            }
        }
        return true;
    }
}
 if (!Object.keys) {
    Object.keys = function (obj) {
        var i,
            res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
 }
 
 if (!window._nullishCoalescing) {
    function _nullishCoalescing(v, nvl) {
        if (typeof v === 'undefined' || v === null) {
            return nvl;
        } else {
            return v;
        }
    }
}

if (!window.nullishCoalescing) {
    window.nullishCoalescing = _nullishCoalescing;
}

if (!window.nullCoalescing) {
    window.nullCoalescing = _nullishCoalescing;
}

if (!window.nullCoalesce) {
    window.nullCoalesce = _nullishCoalescing;
}

if (!window._nvl) {
    window._nvl = _nullishCoalescing;
}

if (!String.prototype.codePointAt) {
  String.prototype.codePointAt = function(index) {
    if (index >= this.length)
      return NaN;

    var code = this.charCodeAt(index);

    if (0xD800 <= code && code <= 0xDBFF) {
      var surr = this.charCodeAt(index + 1);

      if (!isNaN(surr) && 0xDC00 <= surr && surr <= 0xDFFF)
        code = 0x10000 + ((code - 0xD800) << 10) + (surr - 0xDC00);
    }

    return code;
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {
      // Steps 1-2.
      if (this == null)
        throw new TypeError('this is null or not defined');

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}


function toLines(text) {
    var n = text.length;
    if (n === 0) {
        return [];
    }
    var lines = [], ch, sep, i, o = 0;
    for (i = 0;i < n; i++) {
        if ((ch = text[i]) === '\n') {
            sep = '\n';
            lines[0] = text.substring(o, i);
            o = i + 1;
            break;
        } else if (ch === '\r') {
            lines[0] = text.substring(o, i);
            if (i + 1 < n && text[i + 1] === '\n') {
                sep = "\r\n";
                o = i + 2;
            } else {
                sep = "\r";
                o = i + 1;
            }
            
            break;
        }
    }
    if (i === n) {
        return [text];
    }
    n =1;
    var slen = sep.length;
    while ((i = text.indexOf(sep, o)) > 0) {
        lines[n++] = text.substring(o, i);
        o = i + slen;
    }
    lines[n] = text.substring(o);
    return lines;
}

/**
 * 
 * @param {Array} arr
 * @returns {Object}
 */
function arryaToObj(arr) {
    var n = arr.length, obj = {};
    n = (n - (n%2))/2;
    for (var i = 0; i < n; i++) {
        obj[arr[2*i]] = obj[2*i+1];
    }
    return obj;
}

function arrayPairsToObj(pairs) {
    var n = pairs.length, obj = {}, p;
    for (var i = 0; i < n; i++) {
        p = [pairs[i]];
        obj[p[0]] = p[1];
    }
    return obj;
};
var pairsToObj = arrayPairsToObj;
/**
 * 
 * @param {type} props
 * @returns {undefined}
 */
function objectDual(props) {
    var d = {};
    for (var k in props) {
        d[props[k]] = k;
    }
}

var odual = objectDual;

var toDual = objectDual;

function object() {
    var a, obj = {}, n = arguments.length;
    function fromPairs(a) {
        var n = a.length;
        var p;
        for (var i = 0; i < n; i++) {
            p = [a[i]];
            obj[p[0]] = p[1];
        }
    }
    if (n === 1) {
        a = arguments[0];
        if (isArray(a)) {
            if (isArray(a[0])) {
                fromPairs(a);
            } else {
                var n = a.length, obj = {};
                n = (n - (n%2))/2;
                for (var i = 0; i < n; i++) {
                    obj[a[2*i]] = obj[2*i+1];
                }
            }
        } else if (isPlainObject(a)) {
            for (var k in a) {
                obj[k] = a[k];
            }
        }        
    } else if (n > 0) {
        for (var i = 0; i < n; i++) {
            a = arguments[i];
            if (isArray(a)) {
                if (a.length === 2 && ['string', 'number'].indexOf(typeof a)>=0) { //it(s a pair
                    obj[a[0]] = a[1];
                } else if (isArray(a[0])) { //array of pairs
                    fromPairs(a);
                } else {
                    var len = a.length, obj = {};
                    len = (len - (len%2))/2;
                    for (var k = 0; k < len; k++) {
                        obj[a[2*k]] = obj[2*k+1];
                    }
                }
            } else if (isPlainObject(a)) {
                for (var k in a) {
                    obj[k] = a[k];
                }
            }
        }
    }
    return obj;
}

var reverseObject = objectDual;

var reverseObj = objectDual;

var rObject = objectDual;

var robject = objectDual;
/**
 * 
 * @param {type} corpus
 * @returns {Object}
 */
function wordFrequencies(corpus) {
    if (corpus instanceof String) {
        corpus = corpus.valueOf();
    }
    if (typeof corpus === 'string') {
        corpus = corpus.split(/\s+/g);
    } else if (!isArray(corpus)) {
        throw new TypeError("Incorrect argument");
    }
    var freqs = {}, word;
    
    for (var i in corpus) {
        word = corpus[i];
        if (freqs[word]) {
            freqs[word]++;
        } else {
            freqs[word] = 1;
        }
    }
    return freqs; 
}
/**
 * Returns the value of the first property that has a value 
 * not <b color="blue">null</b> and different of <b color="blue">undefined</b> 
 * if such property exists; other returns the default value if it's specified or 
 * <b color="blue">undefined</b>.
 * <div class="syntax">
 * <h4>Syntaxes</h4>
 * <ul>
 * <li><b><i>coalesceProp</i></b>(obj: Object, property1: String, property2: String, ... , propertyN: String)
 * <p></p>
 * </li>
 * <li><b><i>coalesceProp(obj: Object, properties: Array&lt;String&gt;[ , defaultValue: type])</i></b>
 * <p></p>
 * </li>
 * </ul>
 * </div>
 * @returns {type}
 */
function coalesceProp() {
    var a = Array.prototype.slice.call(arguments), o = a[0], n = a.length, i = 1, v, defaultVal, props;
    if (isArray(a[1])) {
        if (a.length >= 3) {
            defaultVal = a[2];
        } 
        a = a[1];
        i = 0;
        n = a.length;  
        props = true;
    } else if (typeof a[1] === 'string' && typeof a[2] !== 'string') {
        defaultVal = a[2];
        a = a[1].split(/\s*\|\s*/g);
        i = 0;
		n = a.length;
    }
    var prop;
    for (; i < n; i++) {
        if (typeof (prop = a[i]) !== 'string' || !prop) {
            if (props) { //if properties defined as an array
                throw new Error("Expected string in the properties argument at index " + i);
            }
            return prop;
        }
        v = o[prop];
        if (typeof v !== 'undefined' && v !== null) {
            return v;
        }
    }
    return defaultVal;
}

var wordFreqs = wordFrequencies;

if (!globalNS["getContainer"]) {
    /**
     * 
     * @param {type} id The container id
     * @param {HTMLElement|String} owner This parameter is optional.
     * @returns {HTMLElement}
     */
     globalNS["getContainer"] = function(id, owner) {
        var container;
        if (id) {
            container = getElementById(id);
            if (!container) {
                container = document.createElement("div");
                container.id = id;
                var b = owner||document.getElementsByTagName("body")[0];
                b.appendChild(container);
            }
        } else {
            container = document.createElement("div");
            var o = owner||document.getElementsByTagName("body")[0];
            o.appendChild(container);
        }
        return container;
    };
}

var $container = globalNS["getContainer"];



function escapeHTML(str) {
    'use strict';
    
    if (typeof str.escapeHTML === 'function') {
        return str.escapeHTML();
    }
    var escapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    return ('' + str).replace(/[&<>"'\/]/g, function(match) {
        return escapes[match];
    });
}

function escapeXML(s) { return typeof s === 'string' ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;') : ''; }
	
function unescapeXML(s) { return typeof s === 'string' ? s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'').replace(/&apos;/g, '\'').replace(/&#10;/g, '\n') : ''; }

/**
 * 
 * @param {type} o
 * @param {type} dest
 * @param {type} filter
 * @param {type} exclusions
 * @returns {undefined}
 */
function copyProps(o, dest, filter, exclusions) {
    if (isArray(filter)) {
        if (exclusions) {
            function _filter(name) {
                return _filter.exclusions.indexOf(name) < 0;
            }
            _filter.exclusions = filter;
            filter = _filter;
        } else {
            function _filter(name) {
                return _filter.names.indexOf(name) >= 0;
            }
            _filter.names = filter;
            filter = _filter;
        }
    } else if (typeof filter !== 'function') {
        filter = false;
    }
    if (filter) {
        for (var name in o) {
            if (hasOwnProp(o, name) && filter(name)) {
                dest[name]= o[name];
            }
        }
    } else {
        for (var name in o) {
            if (hasOwnProp(o, name)) {
                dest[name]= o[name];
            }
        }
    }
}

if (!String.prototype.startsWith) {
    /**
     * 
     * @param {type} str
     * @param {type} offset
     * @returns {Boolean}
     */
    String.prototype.startsWith = function(str, offset) {
        offset = offset||0;
        var n = offset + str.length;
        if (n > this.length) return false;
        for (var i = offset; i < n; i++) {
            if (str[i] !== this[i])
                return false;
        }
        return true;
    };
};
if (!String.prototype.endsWith) {
    /**
     * 
     * @param {type} str
     * @param {type} offset
     * @returns {Boolean}
     */
    String.prototype.endsWith = function(str, offset) {
        offset = offset||0;
        var n = this.length;
        if (offset + str.length <= n) {
            for (var i = n - str.length; i < n; i++) {
                if (str[i] !== this[i])
                    return false;
            }
            return true;
        }  
        return false;
    };
};

if (!String.prototype.lastIndexOf) {
    /**
     * 
     * @param {type} s
     * @returns {Number}
     */
    String.prototype.lastIndexOf=function(s) {
        var i, o = 0, p = -1;
        for (;;) {
            i = this.indexOf(s, o);
            if (i < 0)
                return p;
            p = i;
            o = i + s.length;
        }
    };
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @param {Function} func function to wrap
 * @param {Number} [wait=100] timeout in ms
 * @param {Boolean} [immediate=false] whether to execute at the beginning
 * @api public
 */
function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait || wait === undefined) wait = 100;
  

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  function debounced(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};


var isEmptyObject = isObjectEmpty;

var isEmptyObj = isObjectEmpty;

if (typeof SereniX === 'undefined') {
    SereniX =  {};
}

function isWindow(o){
    return o !== undefined && o !== null && o === o.window;
}

SereniX.isWindow = isWindow;

SereniX.isEmptyObject = isObjectEmpty;

SereniX.isEmptyObj = isObjectEmpty;

var jsBasicClassTypes = {};


var isArraylike = (function() {
    
    
    var isWin = isWindow;
    
    // Populate the 9javascript basic class types 9jsBasicClassTypes) map
    
    var names = 'Boolean Number String Function Array Date RegExp Object Error'.split(' '),
        i =0, n = names.length, nm;
    for (;i < n; i++) {
        jsBasicClassTypes[nm=names[i]] = nm.toLowerCase();
    }

    function _type( o ) {
        var t;
        if ( o === null  || o === undefined) {
                return o + "";
        }
        // Support: Android<4.0, iOS<6 (functionish RegExp)
        return (t = typeof o) === "object" || typeof o === "function" ?
            jsBasicClassTypes[ Object.prototype.toString.call(o) ] || "object" :
                t;
    }
    
    SereniX.typeOf = SereniX.typeof = _type;
    
    return SereniX.isArraylike = SereniX.isArrayLike = function isArraylike( o ) {

        // Support: iOS 8.2 (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var len = "length" in o && o.length,
                typ = _type( o );

        if ( typ === "function" || isWindow( o ) )
            return false;

        if ( o.nodeType === 1 && len )
            return true;

        return typ === "array" || len === 0 ||
                typeof len === "number" && len > 0 && ( len - 1 ) in o;
    };
    
})();



var isArrayLike = isArraylike;

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * <p>The result does not include comment or processing instruction nodes.</p>
 * @param {Array|Element|String|Number|Boolean|Function} e
 * @return {String}
 */
var getText = SereniX.getText = function( e ) {
    var node,
        txt = "",
        i = 0,
        nodeType;

    if (e === undefined || e === null)
        return '';
    if (['string', 'number', 'boolean', 'function'].indexOf(typeof e) >= 0 
            || e instanceof String || e instanceof Number 
            || e instanceof Boolean || e instanceof Function )
        return '' + e;

    if ( !(nodeType = e.nodeType) ) {
        try {
            // Assumes it's an array or an array like
            while ( (node = e[i++]) ) {
                // Do not traverse comment nodes
                txt += getText( node );
            }
        } catch (err) {}
    } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
        // Use textContent for elements
        // innerText usage removed for consistency of new lines (jQuery #11153)
        if ( typeof e.textContent === "string" ) {
            return e.textContent;
        } else {
            // Traverse its children
            for ( e = e.firstChild; e; e = e.nextSibling ) {
                txt += getText( e );
            }
        }
    } else if ( nodeType === 3 || nodeType === 4 ) {
        return e.nodeValue;
    }

    return txt;
};
function isEmail(str) {
    var re = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return re.test(str);
}

SereniX.emailAddressRegexp = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

SereniX.emailAddressRegex = SereniX.emailAddressRegexp;

SereniX.isEmail = isEmail;

SereniX.isEmailAddress = isEmail;

var isEmailAddress = isEmail;

SereniX.checkEmail = isEmail;

function isNumeric(v) {
    return (v - 0) == v && v.length > 0;
}

SereniX.isNumeric = isNumeric;
/**
 * Returns true if the given element is a XML node (non-HTML XML node). 
 * Otherwise, returns false.
 * @param {Element|Object} e Element or document
 * @returns {Boolean}
 */
var isXML = function( e ) {
    // documentElement is verified for cases where it doesn't yet exist
    // (such as loading iframes in IE - #4833)
    e = e && (e.ownerDocument || e).documentElement;
    return e ? e.nodeName !== "HTML" : false;
};
/**
 * Returns true if the given element is a XML node (non-HTML XML node). 
 * Otherwise, returns false.
 * @function
 * @memberOf SereniX
 * @param {Element|Object} e Element or document
 * @returns {Boolean}
 */
SereniX.isXML = isXML;

/**
 * Converts value instance of String, Number, Boolean or Function to it's 
 * primitive type value and keep other value the same.
 * @param {String|Number|Boolean|Function|Array|Object} val
 * @returns {unresolved}
 */
globalNS.unboxVal = function(val) {
    return val instanceof String || val instanceof Number 
            || val instanceof Boolean || val instanceof Function ? 
            val.valueOf() : val;
};