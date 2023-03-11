/* 
 * The MIT License
 *
 * Copyright 2022 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
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


if (typeof globalNS === 'undefined') {
    globalNS = typeof window !== 'undefined' ? window :
            typeof global !== 'undefined' ? global :
            typeof self !== 'undefined' ? self : this;
}

if (typeof inBrowser === 'undefined') {
    inBrowser = typeof window !== 'undefined';
}


if (typeof isArray === 'undefined') {
    if (typeof Array.isArray === 'undefined') {
        Array.isArray = function(o) {
            return typeof o === '[object Array]';
        };
    }
    isArray = Array.isArray;
}

;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }
})(this, 'NSNode', function() {
    /**
     * <h3>Namespace node class</h3>
     * 
     * @class Namespace node (NSNode)
     * @returns {NSNode}
     */
    function NSNode() {}

    NSNode.__CLASS__ = NSNode.prototype.__CLASS__ = NSNode;

    NSNode.__CLASS_NAME__ = NSNode.prototype.__CLASS_NAME__ = "NSNode";
    
    return NSNode;

});

function isLengthAttrib(name) {
	return /(?:width|height|margin(?:-(?:top|left|bottom|right))?|padding(?:-(?:top|left|bottom|right))?|top|left|bottom|right|radius|font-size)$/.test(name);
}

function isAngleAttrib(name) {
	return /rotation$/i.test(name);
}

function getValAttrib(val, name) {
	var t;
	if ((t = typeof val) === 'number') {
		return isLengthAttrib(name) ? val + 'px' : 
			isAngleAttrib(name) ? val + 'deg' : '' + val;
	} else if (t === 'boolean') {
		return '' + val;
	} else if (t == 'string') {
		return /^\d+(?:\.\d+)?$/.test(val) ?  (isLengthAttrib(name) ? 
				val + 'px' : isAngleAttrib(name) ? (val + 'deg') : val) :
			val;
	} else {
		throw new Error('Not yet supported');
	}
}

var getAttribVal = getValAttrib;

function setAttrib(el, name, val) {
	el.setAttribute(name, getAttribVal(val, name));
}

function setAttribs(el, $) {
    var i, n = arguments.length, t;
	var name, val;
	if (n === 2) {
		if (isPlainObj($)) {
			for (name in $) {
				el.setAttribute(name, getAttribVal($[name], name));
			}
		}
	}
    if (!isArray($)) {
        $ = Array.prototype.slice.call(arguments, 1);
    }
    if (isArray($[0])) {
        $.forEach(function(a) {
            el.setAttribute(a[0], getAttribVal(a[1], a[0]));
        });
    } else {
        i = 0;
        n = Math.floor($.length/2);
        for (; i < n; i++) {
            el.setAttribute(name = $[2*i], getAttribVal($[2*i+1], name));
        }
    }
}

function removeAttribs(el, $) {    
    if (!isArray($)) {
        $ = Array.prototype.slice.call(arguments, 1);
    }
    $.forEach(function(name) {
        el.removeAttribute(name);
    });    
}

function getAttribs(e, $) {
    var result;
    var array = arguments[2];
    var last;
    if (!isArray($)) {
        $ = Array.prototype.slice.call(arguments, 1);
        if ($.length && (typeof $[last = $.length - 1] === 'boolean')) {
            array = $[last];
            $.splice(last, 1);
        } else {
            array = false;
        }
    }
    
    if (array) {
        result = [];
        $.forEach(function(name) {
            result.push(e.getAttribute(name));
        });
    } else {
        result = {};
        $.forEach(function(name) {
            result[name] = e.getAttribute(name);
        });
    }
    return result;
}

/**
 * 
 * Returns the first value of property not null and not undefined. If all 
 * values of the given properties are null or undefined, returns the default 
 * value if specified or return undefined.
 * @param {Object} o
 * @param {Array&lt;String&gt;} props  Property names
 * @param {type} defVal The default value
 * @returns {type}
 * @function
 */
globalNS.coalesce = globalNS.coalesceProp || function (o, props, defVal) {
    var v;
    for (var i = 0, n = props.length; i < n; i++) {
        v = o[props[i]];
        if (v !== undefined && v !== null)
            return v;
    }
    return defVal;
};
/**
 * 
 * @alias coalesce
 * @param {Object} o
 * @param {Array&lt;String&gt;} props
 * @param {type} defVal
 * @returns {type}
 * @function
 */
globalNS.cval = coalesce;

/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null)
 * @param {Object} opts
 * @param {Array&lt;String&gt;|String} props  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {type}
 */
function optionsValue(opts, props, lower) {
    if (typeof props === 'string') {
        props = props.trim().split(/\s*\|\s*/g);
    }
    var p, v, x;
    for (var i = 0, n = props.length; i < n; i++) {
        p = props[i];
        v = opts[p];
        if (v === undefined || (v === null)) {
            v = opts[((x = p[0].toUpperCase()) === p[0] ? x.toLowerCase() : x) + p.substring(1)];
            if (v !== undefined && (v !== null)) {
                return v;
            }
            if (lower) { 
                x = p.toLowerCase();
                if (x !== p) {
                    v = opts[x];
                    if (v !== undefined && (v !== null)) {
                        return v;
                    }
                }
                x = x[0].toUpperCase() + x.substring(1);
                if (x !== p) {
                    v = opts[x];
                    if (v !== undefined && (v !== null)) {
                        return v;
                    }
                }
            }
        } else {
            return v;
        }
    }
}

/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null)
 * @param {Object} options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {type}
 * @alias optionsValue
 */
var optsVal = optionsValue;
/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null)
 * @param {Object} options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {type}
 * @alias optionsValue
 */
var oVal = optionsValue;
/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null)
 * @param {Object} options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {type}
 * @alias optionsValue
 */
var oval = optionsValue;
/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null). If the result value is an instance of String it's converted to 
 * string primitive type.
 * @param {Object} opts Options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {String}
 * @alias optionsValue
 */
function optionsStringValue(opts, props, lower) {
    var v = optionsValue(opts, props, lower);
    return v instanceof String ? v.valueOf() : v;
}

var oSVal = optionsStringValue;
/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null). If the result value is an instance of String it's converted to 
 * string primitive type.
 * @param {Object} opts Options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {String}
 * @alias optionsStringValue
 */
var osVal = optionsStringValue;

function optionsNumValue(opts, props, lower) {
    var v = optionsValue(opts, props, lower);
    return v instanceof Number ? v.valueOf() : v;
}

function optionsBoolValue(opts, props, lower) {
    var v = optionsValue(opts, props, lower);
    return v instanceof Boolean ? v.valueOf() : v;
}


if (typeof SereniX === 'undefined') {
    ;(function(root, name, factory) {
        if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
            module.exports = factory();
        } else if (typeof define === 'function' && define.amd) {
            define([name], factory);
        } else {
            root[name] = factory();
        }
    })(this, 'SereniX', function() {
        return {
            act: {},
            color: {},
            calc: {},
            cookies: {},
            core: {},
            css: {},
            ui: {},
            utils: {},
            data: {},
            dnd: {},
            dom: {},
            email: {},
            emoticons: {},
            error: {},
            eval: {},
            font: {},
            grammar: {},
            html: {},
            ini: {},
            lang: {},
            locales: {},
            modules: {},
            msg: {},
            network: {},
            ns:{},
            parser: {},
            parsers: {},
            pdf: {},
            print: {},
            proc: {},
            re: {},
            sample: {},
            screen: {},
            styles: {},
            svg: {},
            types: {},
            unicode: {},
            icons: {},
            libs: {},
            NSNode: NSNode
        };
    });
} else {
    var modules = [
        'act',
        'color',
        'calc',
        'cookies',
        'core',
        'css',
        'ui',
        'utils',
        'data',
        'dnd',
        'dom',
        'email',
        'emoticons',
        'error',
        'eval',
        'font',
        'grammar',
        'html',
        'ini',
        'lang',
        'locales',
        'modules',
        'msg',
        'network',
        'ns',
        'parser',
        'parsers',
        'pdf',
        'print',
        'proc',
        're',
        'sample',
        'screen',
        'styles',
        'svg',
        'types',
        'unicode',
        'icons',
        'libs'
    ];
    if (typeof SereniX.Namespace === 'function' && typeof typeof SereniX.Namespace.ns === 'function') {
        modules.forEach(function(module){
            SereniX.Namespace.ns('SereniX.' + module);
        });
        
        SereniX.addChild(NSNode);
    } else {
         modules.forEach(function(module){
            SereniX[module] = {};
        });
        SereniX.NSNode = NSNode;
    }
}

globalNS.SrnX = SereniX;