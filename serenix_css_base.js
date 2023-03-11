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
    inBrowser = typeof window !== 'undefined';
}

if (typeof globalNS ==="undefined") {
    if (typeof window ==="undefined") {
        window=globalNS=typeof global!=="undefined" ? global : typeof self!=="undefined" ? self: this;
    } else {
        globalNS = window;
    }
} else if (typeof window ==="undefined") {
    window=globalNS;
}


/**
 * Returns the major version of Internet Explorer if the browser is Internet 
 * Explorer. If not Internet Explorer browser, returns false.
 */
function ieVersion() {
  var ua = window.navigator.userAgent.toLowerCase();

  // Use cases: …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  
  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
  
  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
  
  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('msie ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser or not in browser
  return false;
}

var CSS_POSITIONS = [
    "static", //this is the default value. The element is rendered following the order of the HTML.
    "absolute", //used to define the exact position the element needs to be in. This position is always related to the closest ancestor in a relative position (not static). Do you know what happens if you don’t define the exact position of the element? You lose control over it! It is rendered randomly, completely disregarding the document flow. By default it’s displayed in the upper left corner.
    "relative", //used to position the element relative to its normal position (static). This position keeps the flow order of the document.
    "fixed" //used to position the element relative to the browser window, so it is always visible in the viewport.
];

if (!globalNS.CSS) {
    CSS = {};
}

CSS.POSITIONS = CSS_POSITIONS;
/**
 * This is the default value. The element is rendered following the order of the HTML.
 * @type String
 */
CSS.STATIC = 'static';
/**
 * Used to define the exact position the element needs to be in. This position is always related to the closest ancestor in a relative position (not static). Do you know what happens if you don’t define the exact position of the element? You lose control over it! It is rendered randomly, completely disregarding the document flow. By default it’s displayed in the upper left corner.
 * @type String
 */
CSS.ABSOLUTE = 'absolute';
/**
 * Used to position the element relative to its normal position (static). This position keeps the flow order of the document.
 * @type String
 */
CSS.RELATIVE = 'relative';
/**
 * Used to position the element relative to the browser window, so it is always visible in the viewport.
 * @type String
 */
CSS.FIXED = 'fixed';

var CSS_STATIC = 'static',
    CSS_ABSOLUTE = 'absolute',
    CSS_RELATIVE = 'relative',
    CSS_FIXED = 'fixed';

var CSS_BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];

var CSS_GLOBAL_VALUES = ['inherit', 'initial', 'unset'];

var CSS_REDEFINED_WIDTHS = ['thin', 'medium', 'thick'];
/**
 * 
 * @type Array&lt;String&gt;
 */
var CSS_UNIT_NAMES = [
    //length
    'px', //pixel
    'cm', //centimeter
    'mm', //milimeter
    'mozmm', //mozilla milimeter,
    'in', //inch
    'pt', //point
    'pc', //picas  
    'Q', //Quarter-millimeters 
    // angle
    'deg',
    'grad',
    'rad',
    'turn',
    // time
    's',
    'ms',
    // frequency
    'Hz',
    'kHz',
    // resolution
    'dpi',
    'dpcm',
    'dppx'
];

var CSS_RELATIVE_UNITS = ['em', 'ex', 'ch', 'rem', '%'];

var CSS_FONT_RELATIVE_UNITS = ['em', 'ex', 'ch', 'rem'];

var CSS_UNITS = {
    units: CSS_UNIT_NAMES,
    relativeUnits: CSS_RELATIVE_UNITS,
    relativeUnitRegex : /em|ex|ch|rem|%/i,
    fontRelativeUnits: CSS_FONT_RELATIVE_UNITS,
    fontRelativeUnitRegex : /em|ex|ch|rem/i,
    length : [
        'px',
        'cm',
        'mm',
        'in',
        'pt',
        'pc',
        'mozmm',
        'Q'
    ],
    angle: [
        'deg',
        'grad',
        'rad',
        'turn'
    ],
    time: [
        's',
        'ms'
    ],
    frequency: [
        'Hz',
        'kHz'
    ],
    resolution:[
        'dpi',
        'dpcm',
        'dppx'
    ],
    // length
    'px': { //conversion from source unit to px (piel) :the key of CSS_UNITS in this case represents the source unit
        'px': 1,
        'cm': 96.0/2.54,  //1cm equivant to 96.0/2.54 pixels 
        'mm': 96.0/25.4, //1mm equivant to 96.0/25.4 pixels 
        'mozmm': 95.673418/25.4, //1mozmm equivant to 95.673418/25.4 pixels 
        'in': 96,
        'pt': 96.0/72.0,
        'pc': 16
    },
    'cm': {
        'px': 2.54/96.0,
        'cm': 1,
        'mm': 0.1,
        'in': 2.54,
        'pt': 2.54/72.0,
        'pc': 2.54/6.0,
        'mozmm': 9.6/95.673418,
        'Q': 1/40
    },
    'mm': {//conversion from source unit to mm
        'px': 25.4/96.0,
        'cm': 10,
        'mm': 1,
        'in': 25.4,
        'pt': 25.4/72.0,
        'pc': 25.4/6.0,
        'mozmm': 95.673418/96.0,
        'Q': 0.1/40
    },
    mozmm: { //conversion from source unit to mozmm
        px: 25.4/95.673418,
        cm: 960.0/95.673418,
        mm: 96.0/95.673418,
        'in': (96.0/95.673418)*25.4,
        'pt': (96.0/95.673418)*25.4/72.0,
        'pc': (96.0/95.673418)*25.4/6.0,
        'mozmm': 1,
        'Q': 0.1/40/96.0/95.673418
    },
    'Q': {
        'px': 2.54/96.0/40.0,
        'cm': 40.0,
        'mm': 4.0,
        'in': 40.0*2.54,
        'pt': 40.0*2.54/72.0,
        'pc': 40.0*2.54/6.0,
        'mozmm': 40.0*9.6/95.673418,
        'Q': 1
    },
    'in': { //conversion from source unit to in
        'px': 1.0/96.0,
        'cm': 1.0/2.54,
        'mm': 1.0/25.4,
        'in': 1,
        'pt': 1.0/72.0,
        'pc': 1.0/6.0
    },
    'pt': { //conversion from source unit to pt
        'px': 0.75,
        'cm': 72.0/2.54,
        'mm': 72.0/25.4,
        'in': 72,
        'pt': 1,
        'pc': 12
    },
    'pc': { //conversion from source unit to pc
        'px': 6.0/96.0,
        'cm': 6.0/2.54,
        'mm': 6.0/25.4,
        'in': 6,
        'pt': 6.0/72.0,
        'pc': 1
    },    
    // angle
    'deg': { //conversion from source unit to deg
        'deg': 1,
        'grad': 0.9,
        'rad': 180/Math.PI,
        'turn': 360
    },
    'grad': { //conversion from source unit to grad
        'deg': 400/360,
        'grad': 1,
        'rad': 200/Math.PI,
        'turn': 400
    },
    'rad': { //conversion from source unit to rad
        'deg': Math.PI/180,
        'grad': Math.PI/200,
        'rad': 1,
        'turn': Math.PI*2
    },
    'turn': { //conversion from source unit to turn
        'deg': 1/360,
        'grad': 1/400,
        'rad': 0.5/Math.PI,
        'turn': 1
    },
    // time
    's': { //conversion from source unit to s
        's': 1,
        'ms': 1/1000
    },
    'ms': { //conversion from source unit to ms
        's': 1000,
        'ms': 1
    },
    // frequency
    'Hz': { //conversion from source unit to Hz
        'Hz': 1,
        'kHz': 1000
    },
    'kHz': {  //conversion from source unit to kHz
        'Hz': 1/1000,
        'kHz': 1
    },
    // resolution
    'dpi': { //conversion from source unit to dpi
        'dpi': 1,
        'dpcm': 1.0/2.54,
        'dppx': 1/96
    },
    'dpcm': { //conversion from source unit to dpcm
        'dpi': 2.54,
        'dpcm': 1,
        'dppx': 2.54/96.0
    },
    'dppx': { //conversion from source unit to dppx
        'dpi': 96,
        'dpcm': 96.0/2.54,
        'dppx': 1
    }
};
/**
 * Converts the given value expressed in the given source unit (from) to it's 
 * equivant in the given target unit (to).
 * @param {Number} value  The value to convert
 * @param {String} from source unit
 * @param {String} to target unit
 * @param {Number} precision
 * @returns {Number}
 */
function cssConvert(value, from, to, precision) {
    if (!CSS_UNIT_NAMES.indexOf(to) >= 0)
        throw new Error("Cannot convert to " + to);

    var units;
    if (!(units = CSS_UNITS[to]).hasOwnProperty(from))
        throw new Error("Cannot convert from " + from + " to " + to);
    
    var v = units[from] * value;
    
    if (precision !== false) {
        precision = Math.pow(10, parseInt(precision) || 5);
        return Math.round(v * precision) / precision;
    }
    
    return v;
};

CSS_UNITS.convert = cssConvert;

var css_convert = cssConvert;

var CSS_LENGTH_TO_PIXELS = {
    'px': 1.0,
    'mm': 1.0/25.4,
    'cm': 1.0/2.54,
    'pt': 1.0/72.0,
    'pc': 1.0/6.0,
    'in': 1.0/96.0
};

/**
 * 
 * @param {String} m The measure (width, height, resolution, ...)
 * @param {Array<&lt;String&gt;>} [units=CSS_UNIT_NAMES]
 * @returns {String}
 */
function getMeasureUnit(m, units) {
    if (arguments.length === 0) {
        throw new Error("[serenix_css_base.js:getMeasureUnit]: No argument");
    }
    if (m instanceof String) {
        m = m.valueOf();
    }
    if (typeof m !== 'string') {
        throw new Error("[serenix_css_base.js:getMeasureUnit]: Incorrect measure argument");
    }
    units = units||CSS_UNIT_NAMES;
    var u;
    for (var i =0, n = units.length; i < n; i++) {
        u = units[i];
        if (m.endsWith(u)) {
            return u;
        }
    }
    return "";
}
/**
 * 
 * @alias getMeasureUnit
 * @param {type} m
 * @param {type} units
 * @returns {String}
 */
var $unit = getMeasureUnit;
/**
 * 
 * @param {String} m The measure (width, height, resolution, ...)
 * @param {Array<&lt;String&gt;>} [units=CSS_UNIT_NAMES]
 * @param {Boolean} [number] Converts The first argument of the result to number ?
 * @returns {Array}
 */
function splitMeasure(m, units, number) {
    if (arguments.length === 0) {
        throw new Error("[serenix_css_base.js:splitMeasure]: No argument");
    }
    if (arguments.length === 2 && !isArray(units)) {
        number = !!units;
        units = CSS_UNIT_NAMES;
    } else {
        units = units||CSS_UNIT_NAMES;
    }
    if (m instanceof String) {
        m = m.valueOf();
    }
    if (typeof m !== 'string') {
        throw new Error("[serenix_css_base.js:splitMeasure]: Incorrect measure argument");
    }
    var u = "";
    for (var i =0, n = units.length; i < n; i++) {
        u = units[i];
        if (m.endsWith(u)) {
            break;
        }
    }
    m = m.substring(0, m.length - u.length);
    return [number ? parseFloat(m) : m, u];
}

//Here is a stand-alone version of curCSS from jQuery.

var curCSS;

var toPx;

(function() {
    "use strict";
    
    var convert;
    var computedValueBug;
    var docElement = document.documentElement;
    
    function preCompute() {
        convert = {};
        // create a test element
        var testElem = document.createElement('test'),
            defaultView = document.defaultView,
            getComputedStyle = defaultView && defaultView.getComputedStyle,
            conversions = [1/25.4, 1/2.54, 1/72, 1/6],
            units = ['mm', 'cm', 'pt', 'pc', 'in', 'mozmm'],
            i = 6; // units.length

        // add the test element to the dom
        docElement.appendChild(testElem);

        // test for the WebKit getComputedStyle bug
        // @see http://bugs.jquery.com/ticket/10639
        if (getComputedStyle) {
            // add a percentage margin and measure it
            testElem.style.marginTop = '1%';
            computedValueBug = getComputedStyle(testElem).marginTop === '1%';
        }

        // pre-calculate absolute unit conversions
        while(i--) {
            convert[units[i] + "toPx"] = conversions[i] ? conversions[i] * convert.inToPx : toPx('1' + units[i], testElem);
        }

        // remove the test element from the DOM and devare it
        docElement.removeChild(testElem);
        testElem = undefined;
    }
    /**
     * Get current CSS
     * @param {type} el
     * @param {String} prop
     * @param {Boolean} [force=false]
     * @returns {String|Number}
     */
    curCSS = function (el, prop, force) {
        if (!convert || force) {
            preCompute();
        }
        var value,
            pixel,
            unit,
            rvpos = /^top|bottom/,
            outerProp = ["paddingTop", "paddingBottom", "borderTop", "borderBottom"],
            innerHeight,
            parent,
            i = 4; // outerProp.length

        if (getComputedStyle) {
            // FireFox, Chrome/Safari, Opera and IE9+
            value = getComputedStyle(el)[prop];
        } else if ((pixel = el.style['pixel' + prop.charAt(0).toUpperCase() + prop.slice(1)])) {
            // IE and Opera support pixel shortcuts for top, bottom, left, right, height, width
            // WebKit supports pixel shortcuts only when an absolute unit is used
            value = pixel + 'px';
        } else if (prop === 'fontSize') {
            // correct IE issues with font-size
            // @see http://bugs.jquery.com/ticket/760
            value = toPx('1em', el, 'left', 1) + 'px';
        } else {
            // IE 8 and below return the specified style
            value = el.currentStyle[prop];
        }

        // check the unit
        unit = (value.match(/^(-?[\d+\.\-]+)([a-z]+|%)$/i)||[])[2];
        if (unit === '%' && computedValueBug) {
            // WebKit won't convert percentages for top, bottom, left, right, margin and text-indent
            if (rvpos.test(prop)) {
                // Top and bottom require measuring the innerHeight of the parent.
                innerHeight = (parent = el.parentNode || el).offsetHeight;
                while (i--) {
                  innerHeight -= parseFloat(curCSS(parent, outerProp[i]));
                }
                value = (parseFloat(value) / 100 * innerHeight) + 'px';
            } else {
                // This fixes margin, left, right and text-indent
                // @see https://bugs.webkit.org/show_bug.cgi?id=29084
                // @see http://bugs.jquery.com/ticket/10639
                value = toPx(value, el) + 'px';
            }
        } else if ((value === 'auto' || (unit && unit !== 'px')) && getComputedStyle) {
            // WebKit and Opera will return auto in some cases
            // Firefox will pass back an unaltered value when it can't be set, like top on a static element
            value = 0;
        } else if (unit && unit !== 'px' && !getComputedStyle) {
            // IE 8 and below won't convert units for us
            // try to convert using a prop that will return pixels
            // this will be accurate for everything (except font-size and some percentages)
            value = toPx(value, el) + 'px';
        }
        return value;
    };
    /**
     * Converts the value of the given size to the equivalent value in pixels.
     * <p>If a HTML DOM element and a property are provided, this function will 
     * also sets the converted value to style property of the element.</p>
     * <p>When the size ('width' or 'height' specified by the parameter prop) is 
     * in percent (has unit '%'), depends  of the dimensions of the screen. If 
     * the value in pixels of '1%'is not yet known, this function will first of 
     * all compute it.</p>
     * <p>To precompute is to compute/determine the value in pixel of '1%' size 
     * .</p>
     * <p><b>The first argument must be the CSS string value of the length to 
     *  convert</b>.</p>
     * @param {String} v  The value to convert to pixels int value
     * @param {HTMLElement} [e] The html/dom element to optionally set the 
     *      property when the unit is not a relative unit
     * @param {String} [prop]  The property
     * @param {Boolean} [force]  Force argument is used when the size is in 
     *      percent (has unit '%') to specify if the function precompute 
     *      whether or not it's already done. 
     * @returns {Number}
     */
    toPx = function (v, e, prop, force) {
        var width, unit;
        if (!(width = /(-?[\d+\.\-]+)([a-z]+|%)?$/i.exec(v))) {
            throw new Error("[serenix_css_base.js:toPx]: Incorrect length string value: '" + v + "'");
        }
        v = parseFloat(width[1]);
        switch(unit=width[2]||'px') {
            case 'px':
            case 'pt' :
            case 'pc' :
            case 'cm' :
            case 'mm' :
            case 'in' :
            case 'mozmm' :
            case 'Q':
                v *= CSS_LENGTH_TO_PIXELS[unit];
                break;
            case 'q':
                v *= CSS_LENGTH_TO_PIXELS['Q'];
                break;
            case "%" :
                if (!convert || force) {
                    preCompute();
                }
                var outerProp = ["paddingTop", "paddingBottom", "borderTop", "borderBottom"],
                    innerHeight,
                    parent,
                    i = 4; // outerProp.length
                if (computedValueBug) {
                    // WebKit won't convert percentages for top, bottom, left, right, margin and text-indent
                    if (/^top|bottom/.test(prop)) { //test if vertical position
                        // Top and bottom require measuring the innerHeight of the parent.
                        innerHeight = (parent = e.parentNode || e).offsetHeight;
                        while (i--) {
                          innerHeight -= parseFloat(curCSS(parent, outerProp[i]));
                        }
                        v /= 100 * innerHeight;
                    } else {
                        // This fixes margin, left, right and text-indent
                        // @see https://bugs.webkit.org/show_bug.cgi?id=29084
                        // @see http://bugs.jquery.com/ticket/10639
                        v = toPx(v, e);
                    }
                } else if ((v === 'auto' || (unit && unit !== 'px')) && getComputedStyle) {
                    // WebKit and Opera will return auto in some cases
                    // Firefox will pass back an unaltered value when it can't be set, like top on a static element
                    return 0;
                } else if (unit && unit !== 'px' && !getComputedStyle) {
                    // IE 8 and below won't convert units for us
                    // try to convert using a prop that will return pixels
                    // this will be accurate for everything (except font-size and some percentages)
                    v = toPx(v, e);
                }
                //TODO 
            default:
                // multiply the value by the conversion
                v = parseFloat(v) * parseFloat(curCSS(unit === 'rem' ? docElement : prop === 'fontSize' ? e.parentNode || e : e, 'fontSize'));
        }
        if (e && prop) {
            e.style[prop] = v + "px";
        }
        return v;
    };
    /**
     * 
     * @param {String|Number|Object} v
     * @param {String} to
     * @param {Number} precision
     * @returns {Number|CSS_UNITS|cssConvert.units}
     */
    CSS_UNITS.toVal = function (v, to, precision) {
        var width;
        if (isPlainObject(v)) {
            width = coalesceProp(v, ['value', 'Value', 'width', 'height', 'Width', 'Height', 'size', 'Size']);
            if (width instanceof Number || width instanceof String) {
                width = width.valueOf();
            }
            if (['string', 'number'].indexOf(typeof width) < 0) {
                throw new Error("[serenix_css_base.js:toPx]: Incorrect object value to convert");
            }
            width = [width, v.unit||v.Unit||""];
        } else {
            if (v instanceof String || v instanceof Number) {
                v = v.valueOf();
            }
            if (['string', 'number'].indexOf(typeof v) < 0) {
                throw new Error("Incorrect arguments");
            }


            if (!(width = /^(-?[\d+\.\-]+)([a-z]+)?$/i.exec(v="" + v))) {
                throw new Error("[serenix_css_base.js:toPx]: Incorrect length string value or percent value: '" + v + "'");
            }
        }
        return cssConvert(parseFloat(width[1]), width[2]||'px', to, precision);
    };
})();
/**
 * 
 * @param {String|Number} w
 * @param {HTMLElement} e
 * @returns {Number}
 */
var toPixels = toPx;

/**
 * 
 * @param {String|Number} w
 * @param {HTMLElement} e
 * @returns {Number}
 */
var toPixel = toPx;

CSS_UNITS.toPx = toPx;


/**
 * Return the widths in pixel of the border components ('top', 'bottom', 'left', 'right').
 * @param {HTMLElement} el
 * @returns {Object}
 */
function borderWidths(el) {
    var s = cssStyle(el), 
        fields = {'borderTop': 'top', 'borderBottom': 'bottom', 'borderLeft': 'left', 'borderRight': 'right'},
        b = {};
    var tok, v, re = /\d+(?:\.\d+)?(?:px|pt|pc|mm|cm|mozmm|Q|in|em|ex|ch|rem|lh|vw|vh|vmin|vmax)/;
    for (var k in fields) {
        b[fields[k]] = (function() {
            v = s[k];
            if (!v) return 0;
            var _b = v.split(/[ ]+(?=[^0-9])/);
            for (var i = 0, n = _b.length ; i < n; i++) {
                if (re.test(tok=_b[i])) {
                    return toPx(tok);
                }
            }
        })();
    }
    return b;
}
var CSS_LENGTH_UNITS_REGEXP = /px|pt|pc|mm|cm|mozmm|Q|in|em|ex|ch|rem|lh|vw|vh|vmin|vmax/;

var CSS_LENGTH_UNITS_STRING = "px|pt|pc|mm|cm|mozmm|Q|in|em|ex|ch|rem|lh|vw|vh|vmin|vmax";

var CSS_LENGTH_UNITS_REGEXP_FULL = /^(?:px|pt|pc|mm|cm|mozmm|Q|in|em|ex|ch|rem|lh|vw|vh|vmin|vmax)$/;
/**
 * Return the widths in pixel of the border components ('top', 'bottom', 'left', 'right').
 * @example
 *      For b = '<b>1px solid rgb(0, 0, 255)</b>', returns { top: 1, bottom: 1, left: 1, right: 1}     
 *      For b = '<b color="blue">1px solid blue</b> <b color="rgb(255, 0, 0)">solid rgb(255, 0, 0) 2px</b>', returns { top: 1, bottom: 1, left: 2, right: 2}
 *      For b = '<b color="blue">1px solid rgb(0, 0, 255)</b> <b color="orange">solid orange 2px</b> <b color="#131313">#131313 3px solid</b> <b color="green">solid rgb(255, 0, 0) 4px</b>', returns { top: 1, bottom: 3, left: 2, right: 4}
 * @param {String} b  The CSS border string : 1, 2, 4 tripvars of tokens. 
 *      Each tripvar repreenting width, style and color.
 * @returns {Object}
 */
function toBorderWidthComponents(b) {
    if (!b || !b.length) return  ;
     var tok, s = b.split(/[ ]+(?=[^0-9])/), re = /\d+(?:px|pt|pc|mm|cm|mozmm|Q|in|em|ex|ch|rem|lh|vw|vh|vmin|vmax)/;
     var n = s.length;
     var comps = ['top', 'left', 'bottom', 'right'], _b = {};
     if (n === 3) {
         for (var i = 0 ; i < n; i++) {
             if (re.test(tok=s[i])) {
                 _b.top = _b.left = _b.bottom = _b.right = toPx(tok);
                 break;
             }
         }
     } else if (n === 6) {
         var c = 0;
         for (var i = 0 ; i < n; i++) {
             if (re.test(tok=s[i])) {
                 _b[comps[c]] = _b[comps[c + 2]] = toPx(tok);
                 if (c) break;
                 c++;                    
             }
         }
     } else {
         var c = 0;
         for (var i = 0 ; i < n; i++) {
             if (re.test(tok=s[i])) {
                 _b[comps[c++]] = toPx(tok);
             }
         }
         if (n === 3) {
             _b[comps[3]] = _b[comps[1]];
         }
     }
     return _b;
 }

/**
 * /**
 * First of all, transforms the given value to convert in CSS string value an 
 * the converts the transformed value to pixels.
 * <p>The pixels function uses function toPx.</p>
 * @param {String|Number|Object} v
 * @param {HTMLElement} [e]
 * @param {String} [prop]
 * @param {Boolean} [force=false]
 * @returns {Number}
 */
function pixels(v, e, prop, force) {
    if (e instanceof String) {
        e = e.valueOf();
    }
    if (typeof e === 'string') {
        force = prop;
        prop = e;
        e = null;
    }
    var width;
    if (isPlainObject(v)) {
        width = coalesceProp(v, ['value', 'Value', 'width', 'height', 'Width', 'Height', 'size', 'Size']);
        if (width instanceof Number || width instanceof String) {
            width = width.valueOf();
        }
        if (['string', 'number'].indexOf(typeof width) < 0) {
            throw new Error("[serenix_css_base.js:toPx]: Incorrect object value to convert");
        }
        v = width + (v.unit||v.Unit||"");
    } else {
        if (v instanceof String || v instanceof Number) {
            v = v.valueOf();
        }
        if (['string', 'number'].indexOf(typeof v) < 0) {
            var x = v;
            v = e;
            e = x;
        }
        if (!prop) {
            prop = 'width';
        }
        if (typeof v === 'number') {
            return v;
        }
    }
    return toPx(v, e, prop, force);
}


/**
 * First of all, transforms the given value to convert in CSS string value an 
 * the converts the transformed value to pixels.
 * <p>The pixels function uses function toPx.</p>
 * @param {String|Number|Object} v
 * @param {type} e
 * @param {type} prop
 * @param {type} force
 * @returns {Number}
 */
CSS_UNITS.pixels = pixels;

var CSS_ANGLE_UNITS = [
        'deg',
        'grad',
        'rad',
        'turn'
    ];
var CSS_ANGLE_UNITS_REGEXP_FULL = /^(?:deg|grad|rad|turn)/;

var CSS_ANGLE_UNITS_REGEXP = /deg|grad|rad|turn/;

var CSS_ANGLE_UNITS_REGEXP_STRING = "deg|grad|rad|turn";
/**
 * 
 * @param {String} a
 * @returns {Number}
 */
function toDeg(a) {
    var from;
    for (var i = 0, n = CSS_ANGLE_UNITS.length; i < n; i++) {
        from = CSS_ANGLE_UNITS[i];
        if (a.endsWith(from)) {
            return CSS_UNITS[from]["deg"] * (parseFloat(a.substring(0, a.length - from.length))); 
        }
    }
} 
/**
 * 
 * @param {String} a
 * @returns {Number}
 */
CSS_UNITS.toDeg = toDeg;
/**
 * 
 * @param {String} a
 * @returns {Number}
 */
function toRad(a) {
    var from;
    for (var i = 0, n = CSS_ANGLE_UNITS.length; i < n; i++) {
        from = CSS_ANGLE_UNITS[i];
        if (a.endsWith(from)) {
            return CSS_UNITS[from]["rad"] * (parseFloat(a.substring(0, a.length - from.length))); 
        }
    }
}
/**
 * 
 * @param {String} a
 * @returns {Number}
 */
CSS_UNITS.toRad = toRad;
/**
 * 
 * @param {String} a
 * @returns {Number}
 */
function toGrad(a) {
    var from;
    for (var i = 0, n = CSS_ANGLE_UNITS.length; i < n; i++) {
        from = CSS_ANGLE_UNITS[i];
        if (a.endsWith(from)) {
            return CSS_UNITS[from]["grad"] * (parseFloat(a.substring(0, a.length - from.length))); 
        }
    }
}
/**
 * 
 * @param {String} a
 * @returns {Number}
 */
CSS_UNITS.toGrad = toGrad;
/**
 * 
 * @param {String} a
 * @returns {Number}
 */
function toTurn(a) {
    var from;
    for (var i = 0, n = CSS_ANGLE_UNITS.length; i < n; i++) {
        from = CSS_ANGLE_UNITS[i];
        if (a.endsWith(from)) {
            return CSS_UNITS[from]["turn"] * (parseFloat(a.substring(0, a.length - from.length))); 
        }
    }
}
/**
 * 
 * @param {String} a
 * @returns {Number}
 */
CSS_UNITS.toTurn = toTurn;
/**
 * Returns the value of the given property of the element.
 * @param {HTMLElement} el
 * @param {String} prop The name of the property to get value
 * @returns {Object|String}
 */
function getStyle(el, prop) {
    return (typeof getComputedStyle !== 'undefined' ?
        getComputedStyle(el, null) :
        el.currentStyle
    )[prop]; 
}
/**
 * When one argument, returns the current/computed style of the element.
 * Otherwise, returns the value of the given property of the given element.
 * @param {HTMLElement} el The element
 * @param {String|Array|Object} [opt]  The name of the property to get value
 *      when argument is string, the list of properties to get value when 
 *      argument is an array or the object to substitue properties values by 
 *      the ones defined in the CSS style of the given element when argument is 
 *      plain object
 * @returns {Object|String}
 */
function style(el, opt) {
    var n = arguments.length, 
        s = typeof getComputedStyle !== 'undefined' ?
        getComputedStyle(el, null) :
        el.currentStyle;
    if (isArray(opt)) {
        var p, v, result = {};
        for (var i = 0, len = opt.length; i < n; i++) {
            p = opt[i];
            result[p] = s[p];
        }
        return result;
    } else if (isPlainObject(opt)) {
        var keys = Object.keys(opt), k, v;
        for (var i = 0, len = keys.length; i < n; i++ ) {
            k = keys[i];
            if ((v = s[k]) !== undefined)
                opt[k] = v ;
        }
        return opt;
    }
    return n === 1? s : s[opt]; 
}

var cssStyle = style;

/**
 * getComputedStyle function for IE8
 * borrowed from:
 * http://missouristate.info/scripts/2013/common.js
 */
"getComputedStyle" in window || function() {
  function c(a, b, g, e) {
    var h = b[g];
    b = parseFloat(h);
    h = h.split(/\d/)[0];
    e = null !== e ? e : /%|em/.test(h) && a.parentElement ? c(a.parentElement, a.parentElement.currentStyle, 'fontSize', null) : 16;
    a = 'fontSize' == g ? e : /width/i.test(g) ? a.clientWidth : a.clientHeight;
    return 'em' == h ? b * e : 'in' == h ? 96 * b : 'pt' == h ? 96 * b / 72 : '%' == h ? b / 100 * a : b;
  }
  function a(a, c) {
    var b = 'border' == c ? 'Width' : '', e = c + 'Top' + b, h = c + 'Right' + b, l = c + 'Bottom' + b, b = c + 'Left' + b;
    a[c] = (a[e] == a[h] == a[l] == a[b] ? [a[e]] : a[e] == a[l] && a[b] == a[h] ? [a[e], a[h]] : a[b] == a[h] ? [a[e], a[h], a[l]] : [a[e], a[h], a[l], a[b]]).join(' ');
  }
  function b(b) {
    var d, g = b.currentStyle, e = c(b, g, 'fontSize', null);
    for (d in g) {
      /width|height|margin.|padding.|border.+W/.test(d) && "auto" !== this[d] ? this[d] = c(b, g, d, e) + "px" : "styleFloat" === d ? this["float"] = g[d] : this[d] = g[d];
    }
    a(this, "margin");
    a(this, "padding");
    a(this, 'border');
    this.fontSize = e + "px";
    return this;
  }
  b.prototype = {};
  window.getComputedStyle = function(a) {
    return new b(a);
  };
}();


/**
 * 
 * @param {type} el
 * @param {String} cls
 * @param {String} newClass
 * @returns {unresolved}
 */
replaceClass = function(el, cls, newClass) {
    if (!cls) {
        return el;
    }
    var classList = el.classList;
    if (classList) {
        var arr = cls.split(/\s/g);
        if (arr.length > 1) {
            arr.forEach(function(c) {
                classList.remove(c);
            });
            addCssClass(el, newClass);
        } else {
            classList.replace(cls, newClass);
        }
    } else {
        var c = el.className, p, ofs = 0, end;
        for (;;) {
            p = c.indexOf(ofs, cls);
            if (p < 0) {
                break;
            }
            end = p + cls.length;
            if ((ofs === 0 || " \t\b\0".indexOf(c.charAt(ofs - 1)) >= 0) &&
                    (end === c.length || " \t\b\0".indexOf(c.charAt(end)) >= 0)) {
                if (ofs > 0) {
                    if (end < c.length) {
                        el.className = c.substring(0, ofs).trim() + ' ' + newClass + ' ' + c.substring(end).trim();
                    } else {
                        el.className = c.substring(0, ofs).trim() + ' ' + newClass;
                    }
                } else {
                    if (end < c.length) {
                        el.className = newClass + ' ' + c.substring(end).trim();
                    } else {
                        el.className = newClass;
                    }
                }
                break;
            }
            ofs = end;
        }
    }
    
    return el;
};
/**
 * 
 * @param {type} el
 * @param {String} cls
 * @returns {unresolved}
 */
removeClass = function(el, cls) {
    if (!cls) {
        return el;
    }
    var classList = el.classList, tokens;
    if (classList) {
        cls.split(/\s+/).forEach(function(c) {
            classList.remove(c);
        });        
    } else {
        var c = el.className, p, ofs = 0, end;
        for (;;) {
            p = c.indexOf(ofs, cls);
            if (p < 0) {
                break;
            }
            end = p + cls.length;
            if ((ofs === 0 || " \t\b\0".indexOf(c.charAt(ofs - 1)) >= 0) &&
                    (end === c.length || " \t\b\0".indexOf(c.charAt(end)) >= 0)) {
                if (ofs === 0) {
                    c = c.substring(end).trim();
                } else if (end < c.length) {
                    c = c.substring(0, ofs).trim() + ' ' + 
                            c.substring(end).trim();
                } else {
                    c = c.substring(0, ofs).trim();
                }
            }
        }
    }
    return el;
};
/**
 * Adds CSS class name(s) to the given HTML element.
 * @param {HTMLElement} el
 * @param {String|Array&lt;String&gt;} cls
 * @returns {HTMLElement}
 */
addCss = function(el, cls) {
    if (cls instanceof String) {
        cls = cls.valueOf();
    }
    if (typeof cls === 'string') {
        cls = cls.trim();
        if (cls)
            cls = cls.replace(/[ \t\n\r]+/g, ' ').split(/[ ]/g);
    } else if (isArray(cls)) {
        var cList = [], s;
        for (var i = 0, n = cls.length; i < cls.length; i++) {
            s = cls[i].trim().replace(/[ \t\n\r]+/g, ' ').split(/[ ]/g);
            for (var j = 0, l = s.length; j < l; j++) {
                cList.push(s[j]);
            }
        }
        cls = cList;
    }
    if (!cls.length) {
        return el;
    }
    var classList = el.classList;
    
    if (classList) {
        for (var i = 0, n = cls.length; i< n; i++) {
            classList.add(cls[i]);
        }
    } else {
        var c = el.className||"", p, ofs = 0, end, _cls;
        for (var i = 0, n = cls.length; i< n; i++) {
            ofs = 0;
            _cls = cls[i];
            for (;;) {
                p = c.indexOf(ofs, _cls);
                if (p < 0) {
                    c += (c ? ' ' : '') + _cls;
                    break
                }
                end = p + _cls.length;
                if ((ofs === 0 || " \t\b\0".indexOf(c.charAt(ofs - 1)) >= 0) &&
                        (end === c.length || " \t\b\0".indexOf(c.charAt(end)) >= 0)) {
                    break;
                }
                ofs = end;
            }
        }
    }
    return el;
};

addCssClass = addCss;

var addClass = addCss;
/**
 * Returns true if the element has all the given class names
 * @param {HTMLElement} el
 * @param {String|Array&lt;String&gt;} cls Class names to check. 
 *      When the argument is a atring, separate class names using white space.
 * @returns {Boolean}
 */
function hasClass(el, cls) {
    var args = Array.prototype.slice.call(arguments, 1);
    var eClass = el.getAttribute('class');
    var i = 0, n;
    function _has(c) {
        return (new RegExp("(^|\\s)" + c + "(\\s|$)")).test(eClass);
    }
    if (args.length > 1) {
        cls = args;
    } else if (typeof cls === 'string' || cls instanceof String) {
        cls = cls.split(/\s+/);
    } else if (!isArray(cls)) {
        throw new TypeError('Incorrect argument');
    }
    for (n = cls.length; i < n; i++) {
        if (!_has(cls[i]))
            return false;
    };
    return true;
}
/**
 * Returns true if the element has at least one of the given class names
 * @param {HTMLElement} el
 * @param {String|Array&lt;String&gt;} cls Class names to check. 
 *      When the argument is a atring, separate class names using white space.
 * @returns {Boolean}
 */
function hasSomeClass(el, cls) {
    var args = Array.prototype.slice.call(arguments, 1);
    var eClass = el.getAttribute('class');
    var i = 0, n;
    function _has(c) {
        return (new RegExp("(^|\\s)" + c + "(\\s|$)")).test(eClass);
    }
    if (args.length > 1) {
        cls = args;
    } else if (typeof cls === 'string' || cls instanceof String) {
        cls = cls.split(/\s+/);
    } else if (!isArray(cls)) {
        throw new TypeError('Incorrect argument');
    }
    for (; i < n; i++) {
        if (_has(cls[i]))
            return true;
    };
    return false;
}
/**
 * 
 * @type Array&lt;String&gt;
 */
var CSS_BASIC_COLOR_NAMES = [
    "aqua", "black", "blue", "fuchsia", "gray", "green", 
    "lime", "maroon", "navy", "olive", "orange", "purple", 
    "red", "silver", "teal", "white", "yellow"
];

/**
 * 
 * @type Array&lt;String&gt;
 * @alias CSS_BASIC_COLOR_NAMES
 */
var CSS_COLOR_NAMES = CSS_BASIC_COLOR_NAMES;
/**
 * 
 * @type Array&lt;String&gt;
 * @alias CSS_BASIC_COLOR_NAMES
 */
var CSS_COLORS_LIST = CSS_BASIC_COLOR_NAMES;
/**
 * 
 * @type Object
 */
var CSS_BASIC_COLORS_MAP = {
    maroon: "#800000", 
    red: "#ff0000",
    orange: "#ffA500", 
    yellow: "#ffff00", 
    olive: "#808000",
    purple: "#800080", 
    fuchsia: "#ff00ff", 
    white: "#ffffff", 
    lime: "#00ff00", 
    green: "#008000",
    navy: "#000080", 
    blue: "#0000ff", 
    aqua: "#00ffff",
    teal: "#008080",
    black: "#000000",
    silver: "#c0c0c0", 
    gray: "#808080"
};


var CSS_BASIC_COLORS = CSS_BASIC_COLORS_MAP;

/**
 * 
 * @type Array&lt;String&gt;
 */
var CSS_EXT_COLOR_NAMES = [
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviovar",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviovar",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumviovarred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "pavarurquoise",
    "paleviovarred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "rebeccapurple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "viovar",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen"
];
/**
 * 
 * @type Array&lt;String&gt;
 * @alias CSS_EXT_COLOR_NAMES
 */
var CSS_FULL_COLOR_NAMES_LIST = CSS_EXT_COLOR_NAMES;
/**
 * 
 * @type Object
 */
var CSS_EXT_COLOR_NAMES_MAP = {
  "aliceblue": "#f0f8ff",
  "antiquewhite": "#faebd7",
  "aqua": "#00ffff",
  "aquamarine": "#7fffd4",
  "azure": "#f0ffff",
  "beige": "#f5f5dc",
  "bisque": "#ffe4c4",
  "black": "#000000",
  "blanchedalmond": "#ffebcd",
  "blue": "#0000ff",
  "blueviovar": "#8a2be2",
  "brown": "#a52a2a",
  "burlywood": "#deb887",
  "cadetblue": "#5f9ea0",
  "chartreuse": "#7fff00",
  "chocolate": "#d2691e",
  "coral": "#ff7f50",
  "cornflowerblue": "#6495ed",
  "cornsilk": "#fff8dc",
  "crimson": "#dc143c",
  "cyan": "#00ffff",
  "darkblue": "#00008b",
  "darkcyan": "#008b8b",
  "darkgoldenrod": "#b8860b",
  "darkgray": "#a9a9a9",
  "darkgreen": "#006400",
  "darkgrey": "#a9a9a9",
  "darkkhaki": "#bdb76b",
  "darkmagenta": "#8b008b",
  "darkolivegreen": "#556b2f",
  "darkorange": "#ff8c00",
  "darkorchid": "#9932cc",
  "darkred": "#8b0000",
  "darksalmon": "#e9967a",
  "darkseagreen": "#8fbc8f",
  "darkslateblue": "#483d8b",
  "darkslategray": "#2f4f4f",
  "darkslategrey": "#2f4f4f",
  "darkturquoise": "#00ced1",
  "darkviovar": "#9400d3",
  "deeppink": "#ff1493",
  "deepskyblue": "#00bfff",
  "dimgray": "#696969",
  "dimgrey": "#696969",
  "dodgerblue": "#1e90ff",
  "firebrick": "#b22222",
  "floralwhite": "#fffaf0",
  "forestgreen": "#228b22",
  "fuchsia": "#ff00ff",
  "gainsboro": "#dcdcdc",
  "ghostwhite": "#f8f8ff",
  "gold": "#ffd700",
  "goldenrod": "#daa520",
  "gray": "#808080",
  "green": "#008000",
  "greenyellow": "#adff2f",
  "grey": "#808080",
  "honeydew": "#f0fff0",
  "hotpink": "#ff69b4",
  "indianred": "#cd5c5c",
  "indigo": "#4b0082",
  "ivory": "#fffff0",
  "khaki": "#f0e68c",
  "lavender": "#e6e6fa",
  "lavenderblush": "#fff0f5",
  "lawngreen": "#7cfc00",
  "lemonchiffon": "#fffacd",
  "lightblue": "#add8e6",
  "lightcoral": "#f08080",
  "lightcyan": "#e0ffff",
  "lightgoldenrodyellow": "#fafad2",
  "lightgray": "#d3d3d3",
  "lightgreen": "#90ee90",
  "lightgrey": "#d3d3d3",
  "lightpink": "#ffb6c1",
  "lightsalmon": "#ffa07a",
  "lightseagreen": "#20b2aa",
  "lightskyblue": "#87cefa",
  "lightslategray": "#778899",
  "lightslategrey": "#778899",
  "lightsteelblue": "#b0c4de",
  "lightyellow": "#ffffe0",
  "lime": "#00ff00",
  "limegreen": "#32cd32",
  "linen": "#faf0e6",
  "magenta": "#ff00ff",
  "maroon": "#800000",
  "mediumaquamarine": "#66cdaa",
  "mediumblue": "#0000cd",
  "mediumorchid": "#ba55d3",
  "mediumpurple": "#9370db",
  "mediumseagreen": "#3cb371",
  "mediumslateblue": "#7b68ee",
  "mediumspringgreen": "#00fa9a",
  "mediumturquoise": "#48d1cc",
  "mediumviovarred": "#c71585",
  "midnightblue": "#191970",
  "mintcream": "#f5fffa",
  "mistyrose": "#ffe4e1",
  "moccasin": "#ffe4b5",
  "navajowhite": "#ffdead",
  "navy": "#000080",
  "oldlace": "#fdf5e6",
  "olive": "#808000",
  "olivedrab": "#6b8e23",
  "orange": "#ffa500",
  "orangered": "#ff4500",
  "orchid": "#da70d6",
  "palegoldenrod": "#eee8aa",
  "palegreen": "#98fb98",
  "pavarurquoise": "#afeeee",
  "paleviovarred": "#db7093",
  "papayawhip": "#ffefd5",
  "peachpuff": "#ffdab9",
  "peru": "#cd853f",
  "pink": "#ffc0cb",
  "plum": "#dda0dd",
  "powderblue": "#b0e0e6",
  "purple": "#800080",
  "rebeccapurple": "#663399",
  "red": "#ff0000",
  "rosybrown": "#bc8f8f",
  "royalblue": "#4169e1",
  "saddlebrown": "#8b4513",
  "salmon": "#fa8072",
  "sandybrown": "#f4a460",
  "seagreen": "#2e8b57",
  "seashell": "#fff5ee",
  "sienna": "#a0522d",
  "silver": "#c0c0c0",
  "skyblue": "#87ceeb",
  "slateblue": "#6a5acd",
  "slategray": "#708090",
  "slategrey": "#708090",
  "snow": "#fffafa",
  "springgreen": "#00ff7f",
  "steelblue": "#4682b4",
  "tan": "#d2b48c",
  "teal": "#008080",
  "thistle": "#d8bfd8",
  "tomato": "#ff6347",
  "turquoise": "#40e0d0",
  "viovar": "#ee82ee",
  "wheat": "#f5deb3",
  "white": "#ffffff",
  "whitesmoke": "#f5f5f5",
  "yellow": "#ffff00",
  "yellowgreen": "#9acd32"
};
/**
 * 
 * @type Object
 */
var CSS_FULL_COLOR_NAMES = CSS_EXT_COLOR_NAMES_MAP;
/**
 * 
 * @param {Element} el
 * @param {String} cls
 * @param {String} newCls
 * @returns {Element}
 */
function toggleClass(el, cls, newCls) {
    if (newCls) {
        if (cls) {
            replaceClass(el, cls, newCls);
        } else {
            addCssClass(el, newCls);
        }
    } else if (cls) {
        removeClass(el, cls);
    }
    return el;
}
/**
 * 
 * @param {String} key
 * @returns {String}
 */
function getStyleField(key) {
    if (key.indexOf('-') < 0) {
        return key;
    } else {
        return key.replace(/-+([a-zA-Z$_])/g, function($0, $1) {
            return $1.toUpperCase();
        });
    }
}
/**
 * 
 * @param {Number|String|Object} v
 * @returns {String}
 */
function getCssSize(v) {
    if (typeof v === 'string') {
        v = parseInt(v);
        if (!Number.isNaN(v)) {
            v = v + 'px';
        }
    } else if (typeof v === 'number') {
        v = Math.floor(v) + 'px';
    } else {
        return "";
    }
    return v;
}

function isSvgData(str) {
    return str.startsWith("data:image/svg+xml;");
}

function isSvgDataImageUrl(str) {
    return /^url\(["']data:image\/svg\+xml;/.test(str);
}

function isColor(str) {
    return str.startsWith('#') || str.startsWith('rgb(')  || str.startsWith('rgb (');
}
function getColor(str) {
    var c = str.replace(/[ \t\n\r]/g, "");
    return isColor(c) ? c : "";
}

function toCssBorder(bg) {
    var b = "";
    var v = bg.type||bg.Type;
    if (v) {
        b += v;
    }
    v = bg.color||bg.Color;
    if (v) {
        b += (b ? " ": "") + v;
    }
    v = bg.width||bg.With||bg.size||bg.Size;
    if (b) {
        b += " ";
        if (typeof v === 'number') {
            v = (Math.floor(v)||1) + 'px'; 
        } else{
            v = (!v || typeof v !== 'string'? 1 : parseInt(v)) + 'px';
        }
    } else if (typeof v === 'string') {
        v = parseInt(v);
        if (!Number.isNaN(v)) {
            b = "solid black " + v + 'px';
        }
    }
    return b;
}

function cssFloatingPointLengthTest() {
    var d = document.createElement('div'),
    b = document.getElementsByTagName('body')[0];
    b.appendChild(d);

    d.style.width = "1.54598px";
    var w = cssStyle(d).width;
    b.removeChild(d);
    return w ? w.indexOf(".") >= 0 : false;
}

if (typeof domReady === 'function') {
    domReady(function() {
        window.cssFloatingPointLength = cssFloatingPointLengthTest();
    });

}
/**
 * 
 * @param {String|Number|Object|Array} len
 * @returns {String}
 */
function toCssLength(len) {
    var t, match;
    if ((t=typeof len) === 'string') {
        var re = new RegExp("^(\\d+(\\.\\d+))(" + CSS_LENGTH_UNITS_STRING + ")?$");
        if (match = re.exec(len)) {
            if (!match[3]) {
                t = 'number';
                len = parseFloat(len);
            } else if (match[2]) {
                if (match[3] === 'px') {
                    len = parseFloat(match[1] +  match[2]);
                    t = 'number';
                } else {
                    return len;
                }
            } else {
                return len;
            }
        } else {
            throw new Error("Incorrect length: " + len);
        }
    } else if (t === 'object' && len) {
        var w = len.length||length.width||length.height||len.Length||length.Width||length.Height,
            u = len.unit||len.Unit;
        if (typeof w === 'number') {
            if (typeof u === 'string' && u) {
                if (CSS_LENGTH_UNITS_REGEXP_FULL.test(u)) {
                    return w + u;
                } else {
                    throw new Error("Incorrect length object");
                }
            } else if (u) {
                throw new Error("Incorrect length object");
            } else {
                t = 'number';
                len = w;
            }
        }
    } else if (isArray(len)) {
        var w = len[0], u = len[1];
        if (typeof w !== 'number') {
            throw new Error("Incorrect length object");
        } else if (!u || u === 'px') {
            len = w;
            t = 'number';
        } else if (typeof u === 'string') {
            if (CSS_LENGTH_UNITS_REGEXP_FULL.test(u)) {
                return w + u;
            } else {
                throw new Error("Incorrect length object");
            }
        }
    }
    if (t === 'number') {
        if (typeof cssFloatingPointLength === 'undefined') {
            cssFloatingPointLength = cssFloatingPointLengthTest();
        }
        return (Math.floor(len) === len || cssFloatingPointLength ? len : Math.round(len)) + 'px';
    } else {
        throw new Error("Length object not supported");
    }
}
var toCssWidth = toCssLength;

var toCssHeight = toCssLength;

function toCssAngle(ang) {
    var t, match;
    if ((t=typeof ang) === 'string') {
        var re = new RegExp("^(\\d+(\\.\\d+))(" + CSS_ANGLE_UNITS_STRING + ")?$");
        if (match = re.exec(ang)) {
            if (!match[3]) {
                t = 'number';
                ang = parseFloat(ang);
            } else if (match[2]) {
                if (match[3] === 'px') {
                    ang = parseFloat(match[1] +  match[2]);
                    t = 'number';
                } else {
                    return ang;
                }
            } else {
                return ang;
            }
        } else {
            throw new Error("Incorrect length: " + ang);
        }
    } else if (t === 'object' && ang) {
        var w = ang.length||length.width||length.height||ang.Length||length.Width||length.Height,
            u = ang.unit||ang.Unit;
        if (typeof w === 'number') {
            if (typeof u === 'string' && u) {
                if (CSS_LENGTH_UNITS_REGEXP_FULL.test(u)) {
                    return w + u;
                } else {
                    throw new Error("Incorrect length object");
                }
            } else if (u) {
                throw new Error("Incorrect length object");
            } else {
                t = 'number';
                ang = w;
            }
        }
    } else if (isArray(ang)) {
        var w = ang[0], u = ang[1];
        if (typeof w !== 'number') {
            throw new Error("Incorrect length object");
        } else if (!u || u === 'deg') {
            ang = w;
            t = 'number';
        } else if (typeof u === 'string') {
            if (CSS_ANGLE_UNITS_REGEXP_FULL.test(u)) {
                return w + u;
            } else {
                throw new Error("Incorrect length object");
            }
        }
    }
    if (t === 'number') {
        return ang + 'deg';
    } else {
        throw new Error("Length object not supported");
    }
}

function toCssColor(c) {
    if (c instanceof String) {
        c = c.valueOf();
    }
    if (!c) {
        return "";
    }
    if (typeof c === 'string') {
        if (/^#[0-9a-z]{3}(?:[0-9a-z]{3})?$/.test(c)) {
            return c;
        }
        var part = "[0-9]|[3-9][0-9]|[1][0-9]{1,2}|[2](?:[5][0-5]|[0-4][0-9])";
        var a = ',\\d+(?:\\.\\d+)?';
        var rgb = "rgb\\(" + part + "(?:," + part + "){2}\\)$";
        var color = new RegExp("^(?:" + rgb 
                +  /*rgba*/"|rgba\\(" + part + "(?:," + part + "){2}" + a + "\\)" 
                + ")$");
        if (color.test(c)) {
            return c;
        }
        var _c = c.toLowerCase();
        if (CSS_EXT_COLOR_NAMES.indexOf(_c) >= 0) {
            return _c;
        }
    } else if(isPlainObject(c)) {
        function rgbComp(v) {
            if (v instanceof Number || v instanceof String) {
                v = v.valueOf();
            }
            if (typeof v === 'string') {
                if (/^[0-9a-fA-F]+$/.test(v)) {
                    v = parseInt(v, 16);
                } else {
                    throw new Error("[serenix_css_base.js:toCssColor.rgbComp]: Incorrect rgb component value: '"+v+"'");
                }
            }
            if (typeof v === 'number') {
                if (v >=0 && v < 256 && Math.floor(v) === v) {
                    return v;
                }
                throw new Error("[serenix_css_base.js:toCssColor.rgbComp]: Incorrect rgb component value: "+v);
            } 
            throw new Error("[serenix_css_base.js:toCssColor.rgbComp]: Incorrect rgb component");
        }
        /**
         * 
         * @todo
         * @param {type} v
         * @returns {Number|Boolean}
         */
        function alpha(v) {
            if (v === undefined || v === null) {
                return false;
            }
            if (v instanceof Number || v instanceof String) {
                v = v.valueOf();
            }
            if (typeof v !== 'number') {
                throw new Error("[serenix_css_base.js:toCssColor.alpha]: Incorrect alpha component");
            }
            //TODO: check minimum and maximun values
            return v;
        }
        var r = rgbComp(c.red||c.Red||c.r||c.R),
            g = rgbComp(c.green||c.Green||c.g||c.G),
            b = rbgComp(c.blue||c.Blue||c.b||c.B),
            a = alpha(c.alpha||c.Alpha||c.a||c.A);
            var c = r + ',' + g + ',' + b;
            return (a!== false ? 'rgba(' + c + ',' + a : 'rgb(' + c ) + ')';
    }
    throw new Error("[serenix_css_base.js:toCssColor]: Incorrect color: '" + c + "'");
}


/**
 * 
 * @param {type} c
 * @returns {String}
 */
var toCssBackgroundColor = toCssColor;

/**
 * 
 * @param {type} c
 * @returns {String}
 */
var toCssBgColor = toCssColor;

/**
 * 
 * @param {type} c
 * @returns {String}
 */
var toBackgroundColor = toCssColor;

function toBackgroundImage(img) {
    if (img instanceof String) {
        img = img.valueOf();
    }
    if (!img) {
        return "";
    }
    if (typeof img === 'string') {
        if (isSvgData(img)) {
            return 'url(' + img + ')';
        }
        if (isSvgDataImageUrl(img)) {
            return img;
        }
    }
}

function toCssrepeat(r) {
    throw new Error("Not yet supported");
}

var toCssRepeat = toCssrepeat;

/**
 * @param {Element} el The element to set the style property
 * @param {String} name The name of the style property
 * @param {type} val The value of the style property * 
 * @returns {Boolean}
 */
function setCssValue(el, name, val) {
    if (!name) {
        return false;
    }
    if (val === undefined || val === null) {
        val = "";
    }
    var keys = ['left', 'top', 'right', 'bottom'];
    switch(name) {
        case 'width':
        case 'height':
            val = getCssSize(val);
            break;
        case 'background': {
            if (val instanceof String) {
                val = val.valueOf();
            } 
            if (isPlainObject(val)) {
                var v, props = false;
                if ((v = val.color||val.Color)) {
                    props = true;
                    el.style[getStyleField(name + '-color')] = toCssColor(v);
                }                
                if ((v = val.image||val.Image||val.img||val.Img)) {                    
                    props = true;
                    el.style[getStyleField(name + '-image')] = toBackgroundImage(v);
                }                
                if ((v = val.repeat||val.Repeat)) {
                    props = true;
                    el.style[getStyleField(name + '-color')] = toCssrepeat(v);
                }
                v = val.red||val.Red||val.r||val.R;
                if (v instanceof String) {
                    v = v.valueOf();
                }
                if (v) {
                    v = v.valueOf();
                    props = true;
                    el.style[getStyleField(name + '-color')] = toCssColor(v);
                }
                if (props) {
                    break;
                }
            } else if (typeof val === 'string' && val) {
                if (isSvgData(val)) {
                     el.style[getStyleField(name + '-image')] = 'url(' + val + ')';
                    break;
                } else if (isSvgDataImageUrl(val)) {
                    el.style[getStyleField(name + '-image')] = val;
                    break;
                }
            }
        }
        case 'background-color':        
            val = toBackgroundColor(val);
            break;
        case 'background-image':
            val = toBackgroundImg(val);
            break;
        case 'border': {
            if (isPlainObject(val)) {
                var k, props = false;
                for (var i = 0; i < 4; i++ ) {
                    k = keys[i];
                    if (hasOwnProp(val, k)) {
                        props = true;
                        el.style[getStyleField(name + '-' + k)] = getCssSize(val[k]);
                    }
                }
                if (props) {
                    return true;
                }
            }
        }        
        case 'border-left':
        case 'border-right':
        case 'border-top':
        case 'border-bottom':
            val = toCssBorder(val);
            break;
        case 'margin':
        case 'padding': {
            if (isPlainObject(val)) {
                var k, props;
                for (var i = 0; i < 4; i++ ) {
                    k = keys[i];
                    if (hasOwnProp(val, k)) {
                        props = true;
                        el.style[getStyleField(name + '-' + k)] = getCssSize(val[k]);
                    }
                }
                if (props) {
                    return el;
                }
            }
        }
        case 'margin-left':
        case 'margin-right':
        case 'margin-top':
        case 'margin-bottom':
        case 'padding-left':
        case 'padding-right':
        case 'padding-top':
        case 'padding-bottom':
            val = getCssSize(val);
            break;
        default:
            val = "" + val;
    }
    el.style[getStyleField(name)] = val;
    return el;
};


function cssVal(el, name, val) {
    if (arguments.length > 2) {
        return setCssValue(el, name, val);
    } else if (arguments.length === 2) {
        return cssStyle(el)[name];
    } else if (arguments.length === 1) {
        return cssStyle(el); 
    } else {
        throw new Error("[serenix_css_base.js:cssVal]: At least one argument expected");
    }
}



if (StyleSheetList && !StyleSheetList.prototype.map) {
    /**
    * A generic `Array#map` utility function.
    * @param {Function} callback The function that gets called for every array
    * item.
    * @returns {Array} A new array of values returned by the callback function.
    */
    StyleSheetList.prototype.map = 
    CSSRuleList.prototype.map = function(callback, that) {
        var t = this, result = [];
        var i = t.length;
        while (i--) {
            result[i] = callback.call(that, t[i], i, t);
        }
        return result;
    };
}

//if you must support IE before #9 you can 'shim' Array.prototype.filter-
if (StyleSheetList && !StyleSheetList.prototype.filter) {
    /**
     * 
     * @param {Function} p  The predicate function used to filter: the predicate
     *      function returns true if it' argument is  accepted and false 
     *      otherwise.
     * @param {Object} [scope]
     * @param {Function} [mapper]
     * @param {Object} [that]
     * @returns {Array}
     */
    StyleSheetList.prototype.filter = 
    CSSRuleList.prototype.map = function(p, scope, mapper, that){
        var t= this, r= [], i= 0, e, n = t.length;
        if (mapper) {
            if( typeof p === 'function' ){
                while(i<n){
                    if(i in t){
                        e= t[i];
                        if(p.call(scope, e, i, t)) r[r.length]= mapper.call(that, e, i, t);
                    }
                    ++i;
                }
            }
        } else {
            if( typeof p === 'function' ){
                while(i<n){
                    if(i in t){
                        e= t[i];
                        if(p.call(scope, e, i, t)) r[r.length]= e;
                    }
                    ++i;
                }
            }
        }
        return r;
    };
}

/**
 * Extracts and process document stylesheets.
 * @param {Function} predicate  The filter predicate function
 * @param {Function|String|Array&lt;String&gt;} process  The function to extract
 *       properties ( or process each style sheet) or the style sheet 
 *       selector(s) to filter using processCssText function as style sheet 
 *       processor
 * @returns {Array}
 */
function styleSheets(predicate, process) {
    if (process instanceof Function) {
        process = process.valueOf();
    }
    var _filter;
    if(arguments.length === 1) {
        if (isPlainObject(predicate) && !process) {            
            process = predicate.process||predicate.parse;
            _filter = predicate.selectors||predicate.selector;
            predicate = predicate.filter||predicate.predicate||predicate.stylesheet||predicate.styleSheet;
        } else {
            process = false;
        }
    } else if ((typeof process === 'string' && (process = process.trim())) || isArray(process) || process instanceof RegExp) {
        _filter = process;
        process = false;
    } else if (typeof process !== 'function') {
        process = false;
    }
    if (!process && _filter) {
        function p(styleSheet) {
            var t;
            try {
                t= styleSheet.cssRules;
            } catch (ex) { return [];}
            var r= [], i= 0, e, n = t.length;
            for(;i<n;i++){
                e= t[i];
                r[r.length]= processCSSText(e.cssText, p.filter); 
            }
            return {
                type: styleSheet.ownerNode.tagName.toLowerCase(),
                href: styleSheet.href || document.location.href,
                css: r
            };
        }
        p.filter = _filter;
        process = p;
    }
    var _styleSheets = document.styleSheets;
    if (predicate instanceof String) {
        predicate = predicate.valueOf();
    }
    if (predicate && typeof predicate === 'string') {
        _styleSheets.filter(function(stylesheet, i, styleSheets) {
            var styleSheet = stylesheet;
            function accept() {
                return eval(predicate);
            }
            return accept.call(styleSheet);
        });
    } else if (typeof predicate === 'function' || predicate instanceof Function) {
        _styleSheets = _styleSheets.filter(predicate);
    }
    if (process instanceof Function) {
        process = process.valueOf();
    }
    if (Object.prototype.toString.call(process) === '[object Object]') {
        
    } else if (typeof process !== 'function') {
        process = function(styleSheet) {
            return {
                type: styleSheet.ownerNode.tagName.toLowerCase(),
                href: styleSheet.href || document.location.href,
                selector : styleSheet.selectorText,
                css: (function() {
                    return styleSheet.cssRules.map(function(rule) {
                        return rule.cssText;
                    }).join('\n');
                })()
            };
        };
    }
    return _styleSheets.map(process);
}

var CSS3_PROPERTY_NAMES = {};
var CSS3_PROPERTIES_MAP = {};
var CSS3_PROPERTY_DESCRIPTIONS = {};
var CSS3_PROPERTIES = (function(props) {
    var list = [], n = props.length/2, prop, key;
    for (var i = 0; i < n; i++) {
        prop = props[2*i];
        list.push(prop);
        CSS3_PROPERTY_DESCRIPTIONS[prop] = props[2*i + 1];
        CSS3_PROPERTY_NAMES[prop] = key = prop.replace(/-(.)/g, function($0, $1) {
            return $1.toUpperCase();
        });
        CSS3_PROPERTIES_MAP[key] = prop;
    }
    return list;
})([
    'align-content', 'Specifies the alignment of flexible container\'s items within the flex container.',
    'align-items', 'Specifies the default alignment for items within the flex container.',
    'align-self', 'Specifies the alignment for selected items within the flex container.',
    'animation', 'Specifies the keyframe-based animations.',
    'animation-delay', 'Specifies when the animation will start.',
    'animation-direction', 'Specifies whether the animation should play in reverse on alternate cycles or not.',
    'animation-duration', 'Specifies the number of seconds or milliseconds an animation should take to compvare one cycle.',
    'animation-fill-mode', 'Specifies how a CSS animation should apply css to its target before and after it is executing.',
    'animation-iteration-count', 'Specifies the number of times an animation cycle should be played before stopping.',
    'animation-name', 'Specifies the name of @keyframes defined animations that should be applied to the selected element.',
    'animation-play-state', 'Specifies whether the animation is running or paused.',
    'animation-timing-function', 'Specifies how a CSS animation should progress over the duration of each cycle.',
    'backface-visibility', 'Specifies whether or not the "back" side of a transformed element is visible when facing the user.',
    'background', 'Defines a variety of background properties within one declaration.',
    'background-attachment', 'Specify whether the background image is fixed in the viewport or scrolls.',
    'background-clip', 'Specifies the painting area of the background.',
    'background-color', 'Defines an element\'s background color.',
    'background-image', 'Defines an element\'s background image.',
    'background-origin', 'Specifies the positioning area of the background images.',
    'background-position', 'Defines the origin of a background image.',
    'background-repeat', 'Specify whether/how the background image is tiled.',
    'background-size', 'Specifies the size of the background images.',
    'border', 'Sets the width, style, and color for all four sides of an element\'s border.',
    'border-bottom', 'Sets the width, style, and color of the bottom border of an element.',
    'border-bottom-color', 'Sets the color of the bottom border of an element.',
    'border-bottom-left-radius', 'Defines the shape of the bottom-left border corner of an element.',
    'border-bottom-right-radius', 'Defines the shape of the bottom-right border corner of an element.',
    'border-bottom-style', 'Sets the style of the bottom border of an element.',
    'border-bottom-width', 'Sets the width of the bottom border of an element.',
    'border-collapse', 'Specifies whether table cell borders are connected or separated.',
    'border-color', 'Sets the color of the border on all the four sides of an element.',
    'border-image', 'Specifies how an image is to be used in place of the border css.',
    'border-image-outset', 'Specifies the amount by which the border image area extends beyond the border box.',
    'border-image-repeat', 'Specifies whether the image-border should be repeated, rounded or stretched.',
    'border-image-slice', 'Specifies the inward offsets of the image-border.',
    'border-image-source', 'Specifies the location of the image to be used as a border.',
    'border-image-width', 'Specifies the width of the image-border.',
    'border-left', 'Sets the width, style, and color of the left border of an element.',
    'border-left-color', 'Sets the color of the left border of an element.',
    'border-left-style', 'Sets the style of the left border of an element.',
    'border-left-width', 'Sets the width of the left border of an element.',
    'border-radius', 'Defines the shape of the border corners of an element.',
    'border-right', 'Sets the width, style, and color of the right border of an element.',
    'border-right-color', 'Sets the color of the right border of an element.',
    'border-right-style', 'Sets the style of the right border of an element.',
    'border-right-width', 'Sets the width of the right border of an element.',
    'border-spacing', 'Sets the spacing between the borders of adjacent table cells.',
    'border-style', 'Sets the style of the border on all the four sides of an element.',
    'border-top', 'Sets the width, style, and color of the top border of an element.',
    'border-top-color', 'Sets the color of the top border of an element.',
    'border-top-left-radius', 'Defines the shape of the top-left border corner of an element.',
    'border-top-right-radius', 'Defines the shape of the top-right border corner of an element.',
    'border-top-style', 'Sets the style of the top border of an element.',
    'border-top-width', 'Sets the width of the top border of an element.',
    'border-width', 'Sets the width of the border on all the four sides of an element.',
    'bottom', 'Specify the location of the bottom edge of the positioned element.',
    'box-shadow', 'Applies one or more drop-shadows to the element\'s box.',
    'box-sizing', 'Alter the default CSS box model.',
    'caption-side', 'Specify the position of table\'s caption.',
    'clear', 'Specifies the placement of an element in relation to floating elements.',
    'clip', 'Defines the clipping region.',
    'color', 'Specify the color of the text of an element.',
    'column-count', 'Specifies the number of columns in a multi-column element.',
    'column-fill', 'Specifies how columns will be filled.',
    'column-gap', 'Specifies the gap between the columns in a multi-column element.',
    'column-rule', 'Specifies a straight line, or "rule", to be drawn between each column in a multi-column element.',
    'column-rule-color', 'Specifies the color of the rules drawn between columns in a multi-column layout.',
    'column-rule-style', 'Specifies the style of the rule drawn between the columns in a multi-column layout.',
    'column-rule-width', 'Specifies the width of the rule drawn between the columns in a multi-column layout.',
    'column-span', 'Specifies how many columns an element spans across in a multi-column layout.',
    'column-width', 'Specifies the optimal width of the columns in a multi-column element.',
    'columns', 'A shorthand property for setting column-width and column-count properties.',
    'content', 'Inserts generated content.',
    'counter-increment', 'Increments one or more counter values.',
    'counter-reset', 'Creates or resets one or more counters.',
    'cursor', 'Specify the type of cursor.',
    'direction', 'Define the text direction/writing direction.',
    'display', 'Specifies how an element is displayed onscreen.',
    'empty-cells', 'Show or hide borders and backgrounds of empty table cells.',
    'flex', 'Specifies the components of a flexible length.',
    'flex-basis', 'Specifies the initial main size of the flex item.',
    'flex-direction', 'Specifies the direction of the flexible items.',
    'flex-flow', 'A shorthand property for the flex-direction and the flex-wrap properties.',
    'flex-grow', 'Specifies how the flex item will grow relative to the other items inside the flex container.',
    'flex-shrink', 'Specifies how the flex item will shrink relative to the other items inside the flex container.',
    'flex-wrap', 'Specifies whether the flexible items should wrap or not.',
    'float', 'Specifies whether or not a box should float.',
    'font', 'Defines a variety of font properties within one declaration.',
    'font-family', 'Defines a list of fonts for element.',
    'font-size', 'Defines the font size for the text.',
    'font-size-adjust', 'Preserves the readability of text when font fallback occurs.',
    'font-stretch', 'Selects a normal, condensed, or expanded face from a font.',
    'font-style', 'Defines the font style for the text.',
    'font-variant', 'Specify the font variant.',
    'font-weight', 'Specify the font weight of the text.',
    'height', 'Specify the height of an element.',
    'justify-content', 'Specifies how flex items are aligned along the main axis of the flex container after any flexible lengths and auto margins have been resolved.',
    'left', 'Specify the location of the left edge of the positioned element.',
    'varter-spacing', 'Sets the extra spacing between varters.',
    'line-height', 'Sets the height between lines of text.',
    'list-style', 'Defines the display style for a list and list elements.',
    'list-style-image', 'Specifies the image to be used as a list-item marker.',
    'list-style-position', 'Specifies the position of the list-item marker.',
    'list-style-type', 'Specifies the marker style for a list-item.',
    'margin', 'Sets the margin on all four sides of the element.',
    'margin-bottom', 'Sets the bottom margin of the element.',
    'margin-left', 'Sets the left margin of the element.',
    'margin-right', 'Sets the right margin of the element.',
    'margin-top', 'Sets the top margin of the element.',
    'max-height', 'Specify the maximum height of an element.',
    'max-width', 'Specify the maximum width of an element.',
    'min-height', 'Specify the minimum height of an element.',
    'min-width', 'Specify the minimum width of an element.',
    'opacity', 'Specifies the transparency of an element.',
    'order', 'Specifies the order in which a flex items are displayed and laid out within a flex container.',
    'outline', 'Sets the width, style, and color for all four sides of an element\'s outline.',
    'outline-color', 'Sets the color of the outline.',
    'outline-offset', 'Set the space between an outline and the border edge of an element.',
    'outline-style', 'Sets a style for an outline.',
    'outline-width', 'Sets the width of the outline.',
    'overflow', 'Specifies the treatment of content that overflows the element\'s box.',
    'overflow-x', 'Specifies the treatment of content that overflows the element\'s box horizontally.',
    'overflow-y', 'Specifies the treatment of content that overflows the element\'s box vertically.',
    'padding', 'Sets the padding on all four sides of the element.',
    'padding-bottom', 'Sets the padding to the bottom side of an element.',
    'padding-left', 'Sets the padding to the left side of an element.',
    'padding-right', 'Sets the padding to the right side of an element.',
    'padding-top', 'Sets the padding to the top side of an element.',
    'page-break-after', 'Insert a page breaks after an element.',
    'page-break-before', 'Insert a page breaks before an element.',
    'page-break-inside', 'Insert a page breaks inside an element.',
    'perspective', 'Defines the perspective from which all child elements of the object are viewed.',
    'perspective-origin', 'Defines the origin (the vanishing point for the 3D space) for the perspective property.',
    'position', 'Specifies how an element is positioned.',
    'quotes', 'Specifies quotation marks for embedded quotations.',
    'resize', 'Specifies whether or not an element is resizable by the user.',
    'right', 'Specify the location of the right edge of the positioned element.',
    'tab-size', 'Specifies the length of the tab character.',
    'table-layout', 'Specifies a table layout algorithm.',
    'text-align', 'Sets the horizontal alignment of inline content.',
    'text-align-last', 'Specifies how the last line of a block or a line right before a forced line break is aligned when text-align is justify.',
    'text-decoration', 'Specifies the decoration added to text.',
    'text-decoration-color', 'Specifies the color of the text-decoration-line.',
    'text-decoration-line', 'Specifies what kind of line decorations are added to the element.',
    'text-decoration-style', 'Specifies the style of the lines specified by the text-decoration-line property',
    'text-indent', 'Indent the first line of text.',
    'text-justify', 'Specifies the justification method to use when the text-align property is set to justify.',
    'text-overflow', 'Specifies how the text content will be displayed, when it overflows the block containers.',
    'text-shadow', 'Applies one or more shadows to the text content of an element.',
    'text-transform', 'Transforms the case of the text.',
    'top', 'Specify the location of the top edge of the positioned element.',
    'transform', 'Applies a 2D or 3D transformation to an element.',
    'transform-origin', 'Defines the origin of transformation for an element.',
    'transform-style', 'Specifies how nested elements are rendered in 3D space.',
    'transition', 'Defines the transition between two states of an element.',
    'transition-delay', 'Specifies when the transition effect will start.',
    'transition-duration', 'Specifies the number of seconds or milliseconds a transition effect should take to compvare.',
    'transition-property', 'Specifies the names of the CSS properties to which a transition effect should be applied.',
    'transition-timing-function', 'Specifies the speed curve of the transition effect.',
    'vertical-align', 'Sets the vertical positioning of an element relative to the current text baseline.',
    'visibility', 'Specifies whether or not an element is visible.',
    'white-space', 'Specifies how white space inside the element is handled.',
    'width', 'Specify the width of an element.',
    'word-break', 'Specifies how to break lines within words.',
    'word-spacing', 'Sets the spacing between words.',
    'word-wrap', 'Specifies whether to break words when the content overflows the boundaries of its container.',
    'z-index', 'Specifies a layering or stacking order for positioned elements.'
]);

var SERENIX_CSS3_PROPERTIES = CSS3_PROPERTIES;
/**
 * 
 * @param {HTMLElement} el
 * @param {Object} css
 * @returns {HTMLElement}
 */
function assignCss(el, css) {
    if (!css) return el;
    for (var name in css) {
        if (CSS3_PROPERTIES.indexOf(name) >= 0) {
            el.style[name.replace(/-(.)/g, function($0, $1) {
                return $1.toUpperCase();
            })] = css[name];
        }
    }
    return el;
}

function ieRotationMatrix(angle) {
    var rad = toRad(typeof angle === 'number' ? angle + "deg" : angle);
    return  { 
        M11 : Math.cos(rad),
        M12 : -Math.sin(rad),
        M21 : Math.sin(rad),
        M22 : Math.cos(rad),
        sizingMethod : 'auto expand',
        SizingMethod: 'auto expand'
    };
}

function ieRotationMatrixString(angle, ie8) {
    var rad = toRad(typeof angle === 'number' ? angle + "deg" : angle);
    return  "M11 = " + Math.cos(rad) 
            + "M12 = -" + Math.sin(rad)
            + "M21 = " + Math.sin(rad)
            + "M22 = " + Math.cos(rad)
            + (ie8 ? "SizingMethod" : "sizingMethod") + " : 'auto expand'";
}
/**
 * 
 * @param {type} angle
 * @param {type} origin
 * @param {String} [rotate="rotate"]
 *      <p>Possible values: </p>
 *      <ul>
 *      <li>rotate</li>
 *      <li>rotateX</li>
 *      <li>rotateY</li>
 *      </ul>
 * @returns {String}
 */
function cssTextRotate(angle, origin, rotate) {
    if (isArray(origin)) {
        origin = origin.join(" ");
    }
    rotate = rotate||'rotate';
    var str = "transform:" + rotate + "(" + angle + ");";
    /* Safari */
    str += "-webkit-transform:" + rotate + "(" + angle + ");";
    /* Firefox */
    str += "-moz-transform:" + rotate + "(" + angle + ");";
    /* Opera */
    str += "-o-transform:" + rotate + "(" + angle + ");";
    /* IE */
    str += "-ms-transform:" + rotate + "(" + angle + ");";
    var rotation = typeof angle === 'number' ?  angle: angle === undefined || angle === null ? undefined : toDeg(angle);
    if (rotation !== undefined) {
        if (rotation  === 90 ||rotation === -270) {
            rotation = 1;
        } else if (rotation  === -90 ||rotation === 270) {
            rotation = 3;
        } else if (rotation  === 180 ||rotation === -180) {
            rotation = 2;
        } else if (rotation  === 0 ||rotation === 360) {
            rotation = 0;
        } else {
            rotation = false;
            /* IE6,IE7 */
            str += "filter:  progid:DXImageTransform.Microsoft.BasicImage(rotation=" + ieRotationMatrixString(angle) + ");";
            /* IE8 */
            str += "-ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=" + ieRotationMatrixString(angle, true) + ")\";";
        }
        if (rotation !== false) {            
            /* IE6,IE7 */
            str += "filter:  progid:DXImageTransform.Microsoft.BasicImage(rotation=" + rotation + ");";
            /* IE8 */
            str += "-ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=" + rotation + ")\";";
        }
   }
    if (origin) {
        /* Safari */
        str += "-webkit-transform-origin: " + origin + ";";
        /* Firefox */
        str += "-moz-transform-origin: " + origin + ";";
        /* Opera */
        str += "-o-transform-origin: " + origin + ";";
        str += "transform-origin: " + origin + ";";
    }
    
    
    
    str += "float:left;";
    return str;
}
/**
 * 
 * @param {Element} el
 * @param {String} angle
 * @param {type} origin
 * @param {String} [rotateFuncName="rotate"]
 * @returns {Element}
 */
function cssRotate(el, angle, origin, rotateFuncName) {
    rotateFuncName = rotateFuncName||'rotate';
    var prop = getStyleSupportedProp('transform'), ieVer;
    
    if (prop) {
        el.style[prop] = rotateFuncName + "(" + angle + ")";
    } else if ((ieVer = ieVersion()) >= 8 ){
        el.style.msFilter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + ieRotationMatrixString(angle, true) + ")";
    } else if (ieVer >= 6) {
        el.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + ieRotationMatrixString(angle) + ")";
    } else {
        throw new Error("CSS rotate not supported: too old browser");
    }
    if (isArray(origin)) {
        origin.join(" ");
    }
    if (origin) {
        if (prop = getStyleSupportedProp('transform-origin')) {
            el.style[prop] = origin;
        }
    }
    return el;
}
/**
 * 
 * @param {Element} el
 * @param {String} angle
 * @param {type} origin
 * @param {String} [rotateFuncName="rotate"]
 * @returns {Element}
 * @function
 */
var rotate = cssRotate;

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.oRequestAnimationFrame || 
                            window.msRequestAnimationFrame;


var CSS_TRANSFORM_PROPERTIES_LIST = [
    'transform',
    'WebkitTransform',
    'msTransform',
    'MozTransform',
    'OTransform'
];

var CSS_TRANSFORM_PROPERTIES_MAP = {
    'webkitTransform':'-webkit-transform',
    'WebkitTransform':'-webkit-transform',
    'OTransform':'-o-transform',
    'msTransform':'-ms-transform',
    'MozTransform':'-moz-transform',
    'transform':'transform'
};

var CSS_STYLE_TRANSFORM_PROPERTIES_MAP = {
    '-webkit-transform': 'webkitTransform',
    '-o-transform':'OTransform',
    '-ms-transform':'msTransform',
    '-moz-transform': 'MozTransform',
    'transform':'transform'
};

var CSS_BROWSER_STYLE_TRANSFORM_PROPERTIES_MAP = {
    'webkit': 'webkitTransform',
    'o':'OTransform',
    'opera':'OTransform',
    'ms':'msTransform',
    'moz': 'MozTransform',
    'ff': 'MozTransform',
    '':'transform'
};
/**
 * 
 * @param {Array&lt;String&gt;} prefixedProps
 * @returns {String}
 */
function getSupportedVendorPrefix(prefixedProps) {
    var tmp = document.createElement("div");
    for (var i = 0; i < prefixedProps.length; ++i) {
        if (typeof tmp.style[prefixedProps[i]] !== 'undefined'){
           return prefixedProps[i];
        }
    }
}

function getJSStyleProp(property) {
    var p = property.replace(/^-/, '').replace(/-([a-z])/g, function($0, $1) {
        return $1.toUpperCase();
    });
    p =  p[0].toUpperCase() + p;
    var prefs = ['Moz' + p, 'Webkit' + p, 'webkit' + p, 'O' + p,  property, 'ms' + p ],
        tmp = document.createElement("div");
    for (var i = 0; i < prefs.length; ++i) {
        if (typeof tmp.style[prefs[i]] !== 'undefined'){
           return prefs[i];
        }
    }
}

var getStyleSupportedProp = getJSStyleProp;

var jsStyleProp = getJSStyleProp;

(function() { 
    var el =document.createElement('p');
    
    var cache = {};
    
    var transitionProps = {
        transition: 1,
        'transition-property': 1,
        '-webkit-transition': 1,
        '-webkit-transition-property': 1
    };
    var transPropsRegExp = /(^\s*[\w-]+)|, (\s*[\w-]+)(?![^()]*\))/g;


    /**
     * Returns prefixed value transition/transform if needed.
     *
     * @param {String} match
     * @param {String} p1
     * @param {String} p2
     * @return {String}
     * @api private
     */
    function prefixTransitionCallback(match, p1, p2) {
        if (p1 === 'var') return 'var';
        if (p1 === 'all') return 'all';
        if (p2 === 'all') return ', all';
        var v = p1 ? supportedProperty(p1) : "`, " + supportedProperty(p2);
        if (!v) return p1 || p2;
        return v;
    }

    function supports(property, value) {
        // For server-side rendering.
        var val = value;
        if (!el || property === 'content') return val;

        // It is a string or a number as a string like '1'.
        // We want only prefixable values here.
        // eslint-disable-next-line no-restricted-globals
        if (typeof val !== 'string' || !isNaN(parseInt(val, 10))) {
          return val;
        }
        var key = property + ":" + value;
        if (property.startsWith('-')) {

        }

        // IE can even throw an error in some cases, for e.g. style.content = 'bar'.
        try {
            // Test value as it is.
            el.style[property] = val;
        } catch (err) {
            // Return false if value not supported.
            cache[key] = false;
            return false;
        }
        // If 'transition' or 'transition-property' property.
        if (transitionProps[property]) {
            val = val.replace(transPropsRegExp, prefixTransitionCallback);
        } else if (el.style[property] === '') {
            // Value with a vendor prefix.
            val = cssVendor.cssPrefix + val;

            // Hardcode test to convert "flex" to "-ms-flexbox" for IE10.
            if (val === '-ms-flex') el.style[property] = '-ms-flexbox';

            // Test prefixed value.
            el.style[property] = val;

            // Return false if value not supported.
            if (el.style[property] === '') {
                cache[key] = false;
                return false;
            }
        }

        // Reset styles for current property.
        el.style[property] = '';

        // Write current value to cache.
        cache[key] = val;

        return val;
    }

})();

var VENDOR_PREFIX = [
  'webkit',
  'moz',
  'ms',
  'o'
];

var setStyle = (function() {
    var re = new RegExp("^-(?!(?:" + VENDOR_PREFIX.join('|') + ")-)");
    /**
     * 
     * @param {Object} css
     */
    function autoPrefix(css) {
        var res = {};

        Object.keys(css).forEach(function(prop) {
            if (!re.test(prop)) {
              res[prop] = css[prop];
              return;
            }

            var val = css[prop];

            prop = prop.replace(/^-/, '');
            res[prop] = val;

            VENDOR_PREFIX.forEach(function (prefix) {
                res["-" + prefix + "-" + prop] = val;
            });
        });
        return res;
    }
    /**
     * 
     * @param {HTMLElement} el
     * @param {Object} css
     */
    function setStyle(el, css) {
      css = autoPrefix(css);

      Object.keys(css).forEach(function(key) {
        var prop = key.replace(/^-/, '').replace(/-([a-z])/g, function(_, $1) { return $1.toUpperCase();});
        el.style[prop] = css[key];
      });
    }
    return setStyle;
})();

// Get current vendor prefix and supported rules
var cssVendor = {};



(function() {
    
    
    
    var supportRules = [], currentPref;
    var styles = window.getComputedStyle(document.documentElement, null);
    function checkWebkitBackdropFilter() {
        try {
            styles.WebkitBackdropFilter = "";
            styles.WebkitBackdropFilter = 'blur(1px)';
        } catch(err) {
            return false;
        }
        return styles.WebkitBackdropFilter !== "";
    }
    for(var i = 0; i < styles.length ; i++) {
        if (styles[i].charAt(0) === '-') {
            var pos = styles[i].indexOf('-',1);
            supportRules.push(styles[i].substr(pos+1));
            currentPref = styles[i].substr(1, pos-1);
        }
    }
    if (currentPref) {
        cssVendor.prefix = currentPref;
        cssVendor.supportRules = supportRules;
        cssVendor.cssPrefix = '-' + currentPref + '-';
        cssVendor.jsPrefix = currentPref === 'ms' ? 'ms' : currentPref[0].toUpperCase() + currentPref.substring(1);
    }
    
    // Correctly detect the Safari browser.
    if (currentPref === 'webkit' && ('-apple-trailing-word' in styles || checkWebkitBackdropFilter())) {
        cssVendor.vendor = 'apple';
        cssVendor.apple = true;
    }
    
    // IE10 do supports flex but the code above didnt detect it so added manually
    if (currentPref === 'ms' && supportRules.indexOf('flex') === -1) {
        supportRules.push('flex');
    } else if (currentPref === 'webkit') {
        var div = document.createElement('div'), prop;
	div.style.cssText = 'background-image:linear-gradient(#9f9, white);';
        for (var p in div.style) {
            if (p.indexOf('webkit') === 0) {
                p = p.replace(/[A-Z]/g, function($0) { return '-' + $0.toLowerCase() });
                if (supportRules.indexOf(p.substr(7)) < 0) {
                    supportRules.push(p.substr(7));
                }
            }
        }
    }

})();


if (typeof SereniX !== 'object' || !SereniX) {
    SereniX = {};
}

SrnX = SereniX;

SrnX.CSS_BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];

SrnX.CSS_GLOBAL_VALUES = ['inherit', 'initial', 'unset'];

SrnX.CSS_REDEFINED_WIDTHS = ['thin', 'medium', 'thick'];
/**
 * 
 * @type Array&lt;String&gt;
 */
SrnX.CSS_UNIT_NAMES = CSS_UNIT_NAMES;

SrnX.CSS_RELATIVE_UNITS = CSS_RELATIVE_UNITS;

SrnX.CSS_FONT_RELATIVE_UNITS = CSS_FONT_RELATIVE_UNITS;

SrnX.CSS_UNITS = CSS_UNITS;
/**
 * 
 * @return {String}
 */
var cssPropertySupported = (function(){
  var mem = {}; // save test results for efficient future calls with same parameters

  return function cssPropertySupported(prop, values) {
      if (arguments.length === 1) {
          values = prop;
          prop = 'display';
      }
      if (typeof values === 'string') {
          values = [values];
      }
      if (!prop) prop = 'display';
    if( mem[prop+values] )
      return mem[prop+values];

    var element = document.createElement('p'),
        i = values.length,
        v,
        result = "";

    try {
        while (i--) {
          v = values[i];
          element.style[prop] = v;

          if (element.style[prop] === v){
            result = v;
            break;
          }
        }
    }
    catch (pError) {}

    mem[prop+values] = result;
    return result;
  };
})();

var supportsCssFlex = cssPropertySupported(['-ms-flexbox', '-webkit-box', 'flex']);
/**
 * 
 * @param {String} prop
 * @param {String} value
 * @returns {Boolean|el.style}
 */
function isStyleSupported(prop, value) {
    // If no value is supplied, use "inherit"
    value = arguments.length === 2 ? value : 'inherit';
    // Try the native standard method first
    if ('CSS' in window && 'supports' in window.CSS) {
        return window.CSS.supports(prop, value);
    }
    // Check Opera's native method
    if('supportsCSS' in window){
        return window.supportsCSS(prop, value);
    }
    // Convert to camel-case for DOM interactions
    var camel = prop.replace(/-([a-z]|[0-9])/ig, function(all, varter) {
        return (varter + '').toUpperCase();                          
    });
    // Check if the property is supported
    var support = (camel in el.style);
    // Create test element
    var el = document.createElement('div');
    // Assign the property and value to invoke
    // the CSS interpreter
    el.style.cssText = prop + ':' + value;
    // Ensure both the property and value are
    // supported and return
    return support && (el.style[camel] !== '');
}
/**
 * Horizontal center the content of the given HTML element
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function hcenter(el) {
    if (cssPropertySupported('style', ['flex'])) {
        el.style.display = "flex"; 
        el.style.justifyContent="center";
    } else {        
        el.style.margin = "0 auto";
        el.setAttribute('align', 'center');
    }
    return el;
}

var hCenter = hcenter;
/**
 * Vertical center the content of the given HTML element
 * @param {type} el
 * @returns {unresolved}
 */
function vcenter(el) {
    if (cssPropertySupported('style', ['flex'])) {
        el.style.display = 'flex';
        el.style.alignItems = 'center';
    } else {
        el.style.margin = '0';
        el.style.position = 'absolute';
        el.style.top = '50%';
        el.style['-ms-transform'] = 'translateY(-50%)';
        el.style.transform='translateY(-50%)';
    }
    return el;
}

var vCenter = vcenter;
/**
 * Horizontal and vertical center the content of the given HTML element
 * @param {type} el
 * @returns {unresolved}
 */
function hvcenter(el) {
    if (cssPropertySupported('style', ['flex'])) {
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
    } else {
        el.style.margin = '0';
        el.style.position = 'absolute';
        el.style.top = '50%';
        el.style.left = '50%';
        el.style['-ms-transform']= 'translate(-50%, -50%)';
        el.style.transform='translate(-50%, -50%)';
    }
    return el;
}




/**
 * <h3>CssFont detector class</h3>
 * <b>Purpose</b>: Detect availability of a particular font in a browser using 
 * JavaScript and CSS.
 *
 * <p>This code is inspired from code of Lalit Patel class Detector
 * (github https://gist.github.com/szepeviktor/d28dfcfc889fe61763f3: and 
 * website: http://www.lalit.org/lab/javascript-css-font-detect/).</p>
 */

/**
 * Usage: d = new Detector();
 *        d.detect('font name');
 */
function FontDetector() {
    // a font will be compared against all the three default fonts.
    // and if it doesn't match all 3 then that font is not available.
    var baseFonts = ['monospace', 'sans-serif', 'serif'];

    //we use m because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    var testString = "mmmmmmmmmmlli";

    //we test using 72px font size, we may use any size. I guess larger the better.
    var testSize = '72px';

    var b = document.getElementsByTagName("body")[0];

    // create a SPAN in the document to get the width of the text we use to test
    var s = document.createElement("span");
    s.style.fontSize = testSize;
    s.innerHTML = testString;
    var defaultWidth = {};
    var defaultHeight = {};
    for (var index in baseFonts) {
        //get the default width for the three base fonts
        s.style.fontFamily = baseFonts[index];
        b.appendChild(s);
        defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
        defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
        b.removeChild(s);
    }
    
    function detect(font) {
        var detected;
        for (var i=0, n = baseFonts.length; i < n; i++ ) {
            s.style.fontFamily = font + ',' + baseFonts[i]; // name of the font along with the base font for fallback.
            b.appendChild(s);
            detected = (s.offsetWidth != defaultWidth[baseFonts[i]] || s.offsetHeight != defaultHeight[baseFonts[i]]);
            b.removeChild(s);
            if (detected) return true;
        }
        return false;
    }
    
    function check(fonts, result) {        
        result = result||{};
        if (typeof fonts === 'string') {
            fonts = CssFont.names(fonts);
        }
        
        if (isArray(fonts)) {
            fonts.forEach(function(font) {
                result[font] = detect(font);
            });
        } else if (fonts) {
            for (var name in fonts) {
                result[name] = detect(name);
            }
        }
        return result;
    }
     /**
     * Checks availability of all the given font names and returns true for detected font name or false otherwise.
     * @function
     * @param {String} font  The font name
     * @param {Object} [result]  When result argument specified, it's used as
     *      result object. Otherwise, a new object is created.
     * @returns {Object}
     */
    this.detect = detect;
    /**
     * Checks availability of all the given font names and returns a result 
     * object with all the given font names as fields. Each value of font name 
     * field is true for detected font name or false otherwise.
     * @function
     * @param {String|Array&lt;String&gt;|Object} fonts
     * @param {Object} [result]  When result argument specified, it's used as
     *      result object. Otherwise, a new object is created.
     * @returns {Object}
     */
    this.check = check;
    /**
     * 
     * @alias this.check
     * @function
     * @param {String} fonts
     * @param {Object} [result]
     * @returns {Object}
     */
    this.detectFonts = check;
};

FontDetector.__CLASS__ = FontDetector.prototype.__CLASS__ = FontDetector;

FontDetector.__CLASS_NAME__ = FontDetector.prototype.__CLASS_NAME__ = "FontDetector";

FontDetector.__SINCE__ = "2021-06-21";


/**
 * 
 * @returns {CssFont}
 * @class CssFont
 */
function CssFont() {
    
}

CssFont.__CLASS__ = CssFont.prototype.__CLASS__ = CssFont;
CssFont.__CLASS_NAME__ = CssFont.prototype.__CLASS_NAME__ = "CssFont";
/**
 * 
 * @type Array&lt;String&gt;
 */
CssFont.WEIGHTS_LIST = [ 'normal', 'bold', 'lighter', 'bolder'];
/**
 * <ul>
 * <li><b>serif</b>: 
 * Glyphs have finishing strokes, flared or tapering ends, or have actual serifed endings.
 * <br>For example: Lucida Bright, Lucida Fax, Palatino, Palatino Linotype, Palladio, URW Palladio, serif.</li>
 * <li><b>sans-serif</b>: 
 * Glyphs have stroke endings that are plain.
 * <br>For example: Open Sans, Fira Sans, Lucida Sans, Lucida Sans Unicode, Trebuchet MS, Liberation Sans, Nimbus Sans L, sans-serif.</li>
 * <li><b>monospace</b>: 
 * All glyphs have the same fixed width.
 * <br>For example: Fira Mono, DejaVu Sans Mono, Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace.</li>
 * <li><b>cursive</b>: 
 * Glyphs in cursive fonts generally have either joining strokes or other cursive characteristics beyond those of italic typefaces. The glyphs are partially or compvarely connected, and the result looks more like handwritten pen or brush writing than printed varterwork.
 * <br>For example: Brush Script MT, Brush Script Std, Lucida Calligraphy, Lucida Handwriting, Apple Chancery, cursive.</li>
 * <li><b>fantasy</b>: 
 * Fantasy fonts are primarily decorative fonts that contain playful representations of characters.
 * <br>For example: Papyrus, Herculanum, Party LET, Curlz MT, Harrington, fantasy.</li>
 * <li><b>system-ui</b>: 
 * Glyphs are taken from the default user interface font on a given platform. Because typographic traditions vary widely across the world, this generic is provided for typefaces that don't map cleanly into the other generics.</li>
 * <li><b>ui-serif</b>: 
 * The default user interface serif font.</li>
 * <li><b>ui-sans-serif</b>: 
 * The default user interface sans-serif font.</li>
 * <li><b>ui-monospace</b>: 
 * The default user interface monospace font.</li>
 * <li><b>ui-rounded</b>: 
 * The default user interface font that has rounded features.</li>
 * <li><b>math</b>: 
 * This is for the particular stylistic concerns of representing mathematics: superscript and subscript, brackets that cross several lines, nesting expressions, and double struck glyphs with distinct meanings.</li>
 * <li><b>emoji</b>: 
 * Fonts that are specifically designed to render emoji.</li>
 * <li><b>fangsong</b>: 
 * A particular style of Chinese characters that are between serif-style Song and cursive-style Kai forms. This style is often used for government documents.</li>
 * </ul>
 * @type Array&lt;String&gt;
 */
CssFont.GENERIC_FAMILIES = [ 'serif', 'sans-serif', 'cursive', 'fantasy', 'monospace', 'system-ui', 'math', 'emoji', 'fangsong' ];
/**
 * 
 * @type String
 */
CssFont.GENERIC_FAMILY = 'serif, sans-serif, cursive, fantasy, monospace';

var FONT_GENERIC_FAMILIES = CssFont.GENERIC_FAMILIES;

var COMMON_WEIGHTS_MAPPING = {};

var COMMON_FONT_WEIGHT_NAME_VALUES = [];

var FONT_WEIGHT_VALUES = [];

var FONT_WEIGHTS = {};

var FONT_WEIGHT_RANGE = {min: 1, max: 1000};

var FONT_WEIGHT_MIN_VALUE = 1;

var FONT_WEIGHT_MAX_VALUE = 1000;

(function() {
    var m = [100, "Thin (Hairline)",
    200, "Extra Light (Ultra Light)",
    300, "Light",
    400, "Normal (Regular)",
    500, "Medium",
    600, "Semi Bold (Demi Bold)",
    700, "Bold",
    800, "Extra Bold (Ultra Bold)",
    900, "Black (Heavy)",
    950, "Extra Black (Ultra Black)"];
    var k, p, name, name2, lname, v;
    for (var i = 0, n = m.length/2; i < n; i++) {
        k = m[2*i+1];
        v = m[2*i];
        p = k.indexOf('(');
        if (p > 0) {
            name = k.substring(0, p).trim();
            lname = name.toLowerCase();            
            name2 = k.substring(p + 1, k.length - 1).trim();
            COMMON_WEIGHTS_MAPPING[name] = 
            COMMON_WEIGHTS_MAPPING[lname] = 
            COMMON_WEIGHTS_MAPPING[name2] = 
            
            COMMON_WEIGHTS_MAPPING[name2.toLowerCase()] = v;
        } else {
            lname = k.toLowerCase();
            COMMON_WEIGHTS_MAPPING[k] = 
            COMMON_WEIGHTS_MAPPING[lname] = v;
        }
        COMMON_FONT_WEIGHT_NAME_VALUES.push(lname);
        FONT_WEIGHT_VALUES.push(v);
        FONT_WEIGHTS[lname] = v;
    }
})();


/**
 * Returns the font weight integer value of the given name.
 * @param {String} name
 * @returns {Integer}
 */
CssFont.weightNum = function(name) {
    return COMMON_FONT_WEIGHT_NAME_VALUES[name.toLowerCase()];
};

CssFont.getWeightNum = CssFont.weightNum;
/**
 * If the exact weight given is available, returns it.
 * Otherwise, the following rule is used to determine the weight actually rendered:
<ul>
<li>
    If the target weight given is between 400 and 500 inclusive:
    Look for available weights between the target and 500, in ascending order.
    <ul>
    <li>If no match is found, look for available weights less than the target, in descending order.</li>
    <li>If no match is found, look for available weights greater than 500, in ascending order.</li>
    </ul>
</li>
<li>If a weight less than 400 is given, look for available weights less than the target, in descending order. If no match is found, look for available weights greater than the target, in ascending order.</li>
<li>If a weight greater than 500 is given, look for available weights greater than the target, in ascending order. If no match is found, look for available weights less than the target, in descending order.</li>
</ul>
 * @param {Number} weight
 * @returns {Number}
 */
CssFont.normalizeWeight = function(weight) {
    if (weight < 1 || weight > 1000) {
        throw new Error("CssFont weight value out of bounds : " + weight);
    }
    if (FONT_WEIGHT_VALUES.indexOf(weight) >= 0) return weight;
    var v;
    if (weight > 400 && weight < 500) {
        return weight < 450 ? 400 : 500;
    } else if (weight < 400) {
        for (var i = 2; i >= 0; i--) {
            if ((v = FONT_WEIGHT_VALUES[i]) < weight) {
                break;
            }
        }
    } else if (weight > 500) {
        for (var i = 5; i >= 0; i--) {
            if ((v = FONT_WEIGHT_VALUES[i]) > weight) {
                break;
            }
        }        
    }
    return v;
};

CssFont.fallbackWeight = CssFont.normalizeWeight;

CssFont.BOLD_FONT_WEIGHT = 700;

CssFont.NORMAL_FONT_WEIGHT = 400;

var BOLD_FONT_WEIGHT = 700;

var NORMAL_FONT_WEIGHT = 400;

var THIN_FONT_WEIGHT = 100;

var HEAVY_FONT_WEIGHT = 900;
/**
 * 
 * <ul>
 * <li><b>normal</b>:
 * Selects a font that is classified as normal within a font-family.
 * </li>
 * <li><b>italic</b>:
 * Selects a font that is classified as italic. If no italic version of the face is available, one classified as oblique is used instead. If neither is available, the style is artificially simulated.
 * </li>
 * <li><b>oblique</b>:
 * Selects a font that is classified as oblique. If no oblique version of the face is available, one classified as italic is used instead. If neither is available, the style is artificially simulated.
 * For oblique font style, it's possible to set an angle as follow : 
 * <b>oblique</b> &lt;angle&gt;: Selects a font classified as oblique, and additionally specifies an angle for the slant of the text. If one or more oblique faces are available in the chosen font family, the one that most closely matches the specified angle is chosen. If no oblique faces are available, the browser will synthesize an oblique version of the font by slanting a normal face by the specified amount. Valid values are degree values of -90deg to 90deg inclusive. If an angle is not specified, an angle of 14 degrees is used. Positive values are slanted to the end of the line, while negative values are slanted towards the beginning.
 * </li>
 * </ul>
 * @type Array&lt;String&gt;
 */
var FONT_STYLES = [ 'normal', 'italic', 'oblique' ];

/**
 * 
 * @param {Number|String} fontWeight
 * @returns {Boolean}
 */
function isBoldFont(fontWeight) {
    return typeof fontWeight === BOLD_FONT_WEIGHT || fontWeight === 'bold';
}
/**
 * 
 * @param {Number|String} fontWeight
 * @returns {Boolean}
 */
CssFont.isBold = function(fontWeight) {
    return typeof fontWeight === BOLD_FONT_WEIGHT || fontWeight === 'bold';
};

/**
 * 
 * @param {Number|String} fontWeight
 * @returns {Boolean}
 */
function isThinFont(fontWeight) {
    return fontWeight === THIN_FONT_WEIGHT || fontWeight === 'thin';
}
/**
 * 
 * @param {Number|String} fontWeight
 * @returns {Boolean}
 */
CssFont.isThin = function(fontWeight) {
    return fontWeight === THIN_FONT_WEIGHT || fontWeight === 'thin';
};
/**
 * 
 * @param {Number|String} fontWeight
 * @returns {Boolean}
 */
function isHeavyFont(fontWeight) {
    return fontWeight === HEAVY_FONT_WEIGHT || fontWeight === 'heavy';
}
/**
 * 
 * @param {Number|String} fontWeight
 * @returns {Boolean}
 */
CssFont.isHeavy = function(fontWeight) {
    return fontWeight === HEAVY_FONT_WEIGHT || fontWeight === 'heavy';
};
/**
 * 
 * @param {Number|String} fontWeight
 * @returns {Boolean}
 */
function isNormalFont(fontWeight) {
    return fontWeight === NORMAL_FONT_WEIGHT || fontWeight === 'normal';
}
/**
 * 
 * @param {Number|String} fontWeight
 * @returns {Boolean}
 */
CssFont.isHeavy = function(fontWeight) {
    return fontWeight === NORMAL_FONT_WEIGHT || fontWeight === 'normal';
};
/**
 * Returns the font weight integer value for the given font weight relative 
 * name and inherited font weight value from parent HTML element.
 * @param {Number} inheritedValue The inherited font weight value from parent 
 *      HTML element
 * @param {String} relName
 * @returns {Number}
 */
CssFont.relativeWeightValue = function(inheritedValue, relName) {
    var relValues = [
        //Inherited value, bolder, lighter,
        100, 400, 100,
        200, 400, 100,
        300, 400, 100,
        400, 700, 100,
        500, 700, 100,
        600, 900, 400,
        700, 900, 400,
        800, 900, 700,
        900, 900, 700
    ];
    var r = 0;
    switch(relName.toLowerCase()) {        
        case  'bolder' :
            r = 1;
            break;
        case  'lighter' :
            r = 2;
            break;
        default:
            throw new Error("Incorrect font relative weight name: '" + relName + "'");
        for (var i = 0, n = relValues.length/3; i < n; i++) {
            if (inheritedValue === relValues[3*i]) {
                return relValues[3*i + r];
            }
        }
    }
};
/**
 * Returns the font weight integer value for the given font weight relative 
 * name and inherited font weight value from parent HTML element.
 * @alias CssFont.relativeWeightValue
 * @param {Number} inheritedValue The inherited font weight value from parent 
 *      HTML element
 * @param {String} relName
 * @returns {Number}
 */
CssFont.relativeWeight = CssFont.relativeWeightVal = CssFont.relativeWeightValue;
/**
 * Splits font familly to array of font names
 * @param {String} fontFamilly
 * @returns {Array&lt;String&gt;}
 */
CssFont.getFontNames = function(fontFamilly) {
    var re = /"([^"]+)"|([a-z][a-zA-Z0-9]+(?:\-[a-z][a-zA-Z0-9]+)*)/g;
    var result = [], match;
    while (match=re.exec(fontFamilly)) {
        result.push(match[1]||match[2]);
    }
    return result.length ? result : null;
};
/**
 * Splits font familly to array of font names
 * @alias CssFont.getFontNames
 * @param {String} fontFamilly
 * @returns {Array&lt;String&gt;}
 */
CssFont.split = CssFont.splitFamilly = CssFont.getFontNames;

/**
 * Splits font familly to array of font names
 * @alias CssFont.getFontNames
 * @param {String} fontFamilly
 * @returns {Array&lt;String&gt;}
 */
CssFont.names = CssFont.fontNames = CssFont.getFontNames;


/**
 * Returns the first font name in the font family that is available in the brower
 * @param {String} fontFamily
 * @returns {Boolean}
 */
CssFont.firstDetectedFontName=function(fontFamily) {
    var names = CssFont.names(fontFamily), name;
    var detector = new FontDetector();
    for (var i = 0, n = names.length; i < n; i++) {
        if (detector.detect(name = names[i])) {
            return name;
        }
    }
    return false;
};
/**
 * Returns the first font name in the font family that is available in the browser.
 * @alias CssFont.firstDetectedFontName
 * @param {String} fontFamily
 * @returns {Boolean}
 */
CssFont.appliedFontName = CssFont.firstDetectedFontName;
/**
 * 
 * @param {type} str
 * @returns {unresolved}
 */
function toSyleObj(str) {
    if (str.startsWith('{')) {
        if (!str.endsWith('}')) {
            throw new Error("Incorrect style: \n" + str);
        }
        str = str.substring(1, str.length - 1);
    }
    var match, re = /(\w(?:\w|\d|[_-])*)\s*:\s*("(\\"|[^"]+)"|'(\\'|[^'])'|[^;\s*]+)[;]?/g;
    var css = {}, name, k;
    while (match = re.exec(str)) {
        name = match[1];
        name = (k = CSS3_PROPERTIES_MAP[name]) ? k : CSS3_PROPERTIES.indexOf(name) >= 0 ? name : "";
        if (!name) {
            css[name] = match[3] ? match[2].replace(/\\"/g, '"') : match[3] ? match[2].replace(/\\'/g, '\'') : match[2];
        }
    }
    return css;
}

function toCamelCaseSyleObj(str) {
    if (str.startsWith('{')) {
        if (!str.endsWith('}')) {
            throw new Error("Incorrect style: \n" + str);
        }
        str = str.substring(1, str.length - 1);
    }
    var match, re = /(\w(?:\w|\d|[_-])*)\s*:\s*("(\\"|[^"]+)"|'(\\'|[^'])'|[^;\s*]+)[;]?/g;
    var css = {}, name;
    while (match = re.exec(str)) {
        name = match[1];
        name = CSS3_PROPERTIES_MAP[name] ? name : CSS3_PROPERTIES.indexOf(name) >= 0 ? toCamelCase(name) : "";
        if (!name) {
            css[name] = match[3] ? match[2].replace(/\\"/g, '"') : match[3] ? match[2].replace(/\\'/g, '\'') : match[2];
        }
    }
    return css;
}
/**
 * 
 * <p>Keys are CSS properties</p>
 * @param {Object} obj
 * @returns {Object}
 */
function getCssObj(obj) {
    var css = {}, k;
    for (var name in obj) {
        name = (k = CSS3_PROPERTIES_MAP[name]) ? k : CSS3_PROPERTIES.indexOf(name) >= 0 ? name : "";
        if (!name) {
            css[name] = obj[name];
        }
    }
    return css;
}

/**
 * 
 * <p>Keys are camel case strings</p>
 * @param {Object} obj
 * @returns {Object}
 */
function getStyleObj(obj) {
    var css = {}, k;
    for (var name in obj) {
        name = CSS3_PROPERTIES_MAP[name] ? name : CSS3_PROPERTIES.indexOf(name) >= 0 ? toCamelCase(name) : "";
        if (!name) {
            css[name] = obj[name];
        }
    }
    return css;
}

var getCamelCaseCssObj = getStyleObj;


function getCSSProperty(name) {
    var l = name[0].toLowerCase();
    if (l !== name[0].toUpperCase()) {
        name = l + name.substring(1);
    }
    var re = /[A-Z]/g;
    return name.replace(re, function($0) {
        return '-' + $0.toLowerCase();
    });
}


function getCSSStringValue(prop, value) {
    var t = typeof value, re, match;
    if (['top',
        'left',
        'bottom',
        'right'
        ].indexOf(prop) >= 0
        || /[-](?:width|height|radius)$/.test(prop)) {
        if (t === 'string') {
            re = /^\d+(?:\.\d+)(px|pt|pc|mm|cm|mozmm|Q|in|em|ex|ch|rem|lh|vw|vh|vmin|vmax|%)?$/; 
            if (match = re.exec(value)) {
                return match[1] ? value: value += 'px';
            } else {
                throw new Error("Incorrect value");
            }
        } else if (t === 'number') {
            return value + 'px';
        } else if (t === 'object' && value) {
            throw new Error("Not yet supported");
        } else {
            throw new Error("Not supported");
        }
    } else if ([
        'border',
        'border-top',
        'border-left',
        'border-bottom',
        'border-right'].indexOf(prop) >= 0) {
        return (t === 'number' || (t === 'string' && /^\d+(?:\.\d+)$/.test(value) )) ? value + 'px' : value;
    } else if (prop === 'transform') {
        return 'rotate(' + ((t === 'number' || (t === 'string' && /^\d+(?:\.\d+)$/.test(value) )) ? value + 'deg' : value) + ')';
        if (t === 'string') {
            if (/^\d+(?:\.\d+)(?:deg|rad|grad|turn)$/.test(value)) {
                return 'rotate(' + value + ')';
            }
        } else if (t === 'object' && value) {

        }    
    }
    if (t === 'string') {
        return value;
    } else if (t === 'number') {
        
    } else if (t === 'object' && value) {
        
    } else if (isArray(value)) {
        
    }
}

//function getCssText(value, grid, row) {
//    var style = getStateStyle(value, grid, row), cssText = "";
function getCssText(style) {
    if (typeof style === 'string') return style;
    var cssText = "";
    if (typeof style === 'object' && style) {
        var v, prop;
        for (var name in style) {
            v = style[name];
            cssText += (prop = getCSSProperty(name)) + ":" + getCSSStringValue(prop, style[name]) + ";";
        }
    } else if (isArray(style)) {
        var n = Math.floor(style.length/2);
        for (var i = 0; i < n; i++) {
            cssText += (prop = getCSSProperty(style[2*i])) + ":" + getCSSStringValue(prop, style[2*i + 1]) + ";";
        }
    } else if (style) {
        throw new Error("");
    }    
    return cssText;
}
/**
 * 
 * 
 * @todo
 * @param {type} prop
 * @param {type} value
 * @param {type} [cssProp=false]
 * @returns {String}
 */
function toCSSPropString(prop, value, cssProp) {
    var v;
    prop = cssProp ? prop : prop.replace(/-\.([a-z])?/g, function($0, $1) {
        if ($1) {
            return "-" + $1.toLowerCase();
        }
        return "";
    }).toLowerCase();
    if (/(?:^(?:width|height)$)|(?:-(?:width|height)$)/.test(prop)) {
        v = toCssLength(value);
    } else if (/(?:^(?:color|background-color|border-color)$)|(?:-(?:\bcolor\b))/.test(prop)) {
        v = toCssColor(value);
    } else if (/(?:^border-radius$)|(?:\bradius\b)/.test(prop)) {
        //TODO
        v = toCssLength(value);
    } else if (/(?:^border$)|(?:\bborder\b)/.test(prop)) {
        v = toCssBorder(value);
    } else if (prop === 'rotate' || prop === 'rotation') {
        return "transform:rotate(" + (toCssAngle(value)||"0") + ")";
    } else {
        //TODO
        v = value;
    }
    return prop + ":" + v + ";";
}

function toCSSString(css) {
    var t, text = "";
    if ((t = typeof css) === 'object' && css) {
        
    } else if (t === 'string') {
        
    } else if (isArray(css)) {
        if (typeof css[0] !== 'string') {
            throw new Error("Incorrect argument");
        }
        var  len = css.length, i = len % 2, name;
        len = (len - i)/2;
        for (i =0; i < len; i++) {
            name = css[2*i];
            if (typeof name !== 'string') {
                throw new Error("Incorrect argument");
            }
            text += toCSSPropString(name, css[2*i + 1]);
        }
    }
    return text;
}




