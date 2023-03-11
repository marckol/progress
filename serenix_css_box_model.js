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

/**
 * Returns the major version of Internet Explorer if the browser is Internet 
 * Explorer. If not Internet Explorer browser, returns false.
 */
var ieVer = ieVersion;
/**
 * Returns the major version of Internet Explorer if the browser is Internet 
 * Explorer. If not Internet Explorer browser, returns false.
 */
var ieMajVer = ieVersion;
/**
 * Returns the major version of Internet Explorer if the browser is Internet 
 * Explorer. If not Internet Explorer browser, returns false.
 */
var ieMajorVer = ieVersion;
/**
 * Returns the major version of Internet Explorer if the browser is Internet 
 * Explorer. If not Internet Explorer browser, returns false.
 */
var ieMajorVersion = ieVersion;

var cssCompliant;


/**
 * 
 * @type Object
 */
var CSSBoxModel = (function() {
    var slice = Array.prototype.slice;
    var ieVer = ieVersion(),
        _cssCompliant = cssCompliant = !(ieVer !== false && ieVer < 6);
    function px(w) {
        if (w instanceof Number || w instanceof String) {
            w = w.valueOf();
        }
        if (typeof w === 'string') {
            w = pixels(w);
        } else if (typeof w !== 'number') {
            throw new Error("Incorrect width argument");
        }
        return w;
    }
    /**
     * 
     * @private
     * @param {HTMLElement} el
     * @param {String} margin  The margin field name : 'margin', 'padding' or 'border'.
     * @param {Object} val
     * @returns {Object}
     */
    function _margin(el, margin, val) {     
        
        var args = slice.call(arguments), len = args.length;
        function  set(el, field, v) {
            el.style[margin + field] = v + 'px';
        }
        if (len === 2) {
            if (val instanceof Number || val instanceof String) {
                val = val.valueOf();
            }
            var m;
            if (typeof val === 'string' && val) {
                val = (m = val.split(/\s+/g)).length > 2 ? m: toPx(val);
            }
            if (typeof val === 'number') {
                el.style.margin = val + 'px';
            } else if (isPlainObject(val)) {
                set(el, margin, 'Left', val.left||val.Left);
                set(el, margin, 'Top', val.top||val.Top);
                set(el, margin, 'Right', val.right||val.Right);
                set(el, margin, 'Bottom', val.bottom||val.Bottom);
            } else if (isArray(val)) {
                set(el, margin, 'Left', val[4]);
                set(el, margin, 'Top', val[1]);
                set(el, margin, 'Right', val[2]);
                set(el, margin, 'Bottom', val[3]);
            }            
        } else if (len === 3) {
            set(el, margin, 'Left', args[2]);
            set(el, margin, 'Top', args[1]);
            set(el, margin, 'Right', args[2]);
            set(el, margin, 'Bottom', args[1]);
        } else if (len === 4) {
            set(el, margin, 'Left', args[2]);
            set(el, margin, 'Top', args[1]);
            set(el, margin, 'Right', args[2]);
            set(el, margin, 'Bottom', args[3]);
        } else if (len > 5) {
            set(el, margin, 'Left', args[4]);
            set(el, margin, 'Top', args[1]);
            set(el, margin, 'Right', args[2]);
            set(el, margin, 'Bottom', args[3]);            
        } else {
            throw new Error("Incorrect args");
        }
        return el;
    }
    
    var Model = {
        AUTHOR: 'Marc KAMGA Olivier',
        SINCE : '',
        VERSION: '1.0',
        /**
         * Returns the margin's object of the given HTML element when only one argument.
         * Otherwise, sets the margin's properties of the style of the given HTML element.
         * <p>Below are the use cases when setting the margin's properties:</p>
         * <ul>
         * <li><p>If the margin property has four values (five arguments at least):</p>
         * <p><b>The sequence of arguments are : element, top margin, right margin, 
         * bottom margin and left margin.</b></p>
         * margin: 10px 5px 15px 20px;<br>
         * top margin is 10px<br>
         * right margin is 5px<br>
         * bottom margin is 15px<br>
         * left margin is 20px<br>
         * </li>
         * <li><p>If the margin property has three values (four arguments):</p>
         * <p><b>The sequence of arguments are : element, top margin, right and left margins for 
         * the third argument and bottom for the last argument.</b></p>
         * margin: 10px 5px 15px;<br>
         * top margin is 10px<br>
         * right and left margins are 5px<br>
         * bottom margin is 15px<br>
         * </li>
         * <li><p>If the margin property has two values (three arguments):</p>
         * <p><b>The sequence of arguments are : element, top and bottom margins for the second argument and , 
         * right margin and left margin for the third argument.</b></p>
         * margin: 10px 5px;<br>
         * top and bottom margins are 10px<br>
         * right and left margins are 5px<br>
         * </li>
         * <li><p>If the margin property has one value (two arguments):</p>
         *     <ul>
         *     <li>
         *     <p><b>When the second argument is single value argument, the sequence of 
         *     arguments is element for the first argument and top, right, bottom and 
         *     left margins for the second argument.</b></p>
         *     margin: 10px;<br>
         *     all four margins are 10px<br>
         *     Note: Negative values are allowed.
         *     </li>
         *     <li><b>When the second argument is an array, it belongs to the case that 
         *     corresponds to it's number of values described above.</b></li>
         *     <li><b>When the second argument is a plain object, values of fields 
         *     'top', 'left', 'bottom' and 'right' are setted respectively to their 
         *     correspondings in the HTML element style..</b></li>
         *     </ul>
         * </li>
         * </ul>
         * @param {HTMLElement} el
         * @param {Number|String|Array|Object} [margin]
         * @returns {Object}  The returned object is an object that corresponds to 
         *      margins of the given HTML element when only one argument or the 
         *      given HTML element otherwise.
         */
        margin :function(el, margin) {
            if (arguments.length === 1) {
                var style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;
                return { 
                    left: parseInt(style.marginLeft) || 0, 
                    right: parseInt(style.marginRight) || 0, 
                    top: parseInt(style.marginTop) || 0, 
                    bottom: parseInt(style.marginBottom) || 0 
                };
            }
            return _margin(el, 'margin', margin);
        },
        /**
         * Returns the padding's object of the given HTML element when only one argument.
         * Otherwise, sets the padding's properties of the style of the given HTML element.
         * <p>Below are the use cases when setting the padding's properties:</p>
         * <ul>
         * <li><p>If the padding property has four values (five arguments at least):</p>
         * <p><b>The sequence of arguments are : element, top padding, right padding, 
         * bottom padding and left padding.</b></p>
         * padding: 10px 5px 15px 20px;
         * top padding is 10px
         * right padding is 5px
         * bottom padding is 15px
         * left padding is 20px
         * </li>
         * <li><p>If the padding property has three values (four arguments):</p>
         * <p><b>The sequence of arguments are : element, top padding, right and left margins for 
         * the third argument and bottom for the last argument.</b></p>
         * padding: 10px 5px 15px;
         * top padding is 10px
         * right and left margins are 5px
         * bottom padding is 15px
         * </li>
         * <li><p>If the padding property has two values (three arguments):</p>
         * <p><b>The sequence of arguments are : element, top and bottom margins for the second argument and , 
         * right padding and left padding for the third argument.</b></p>
         * padding: 10px 5px;
         * top and bottom margins are 10px
         * right and left margins are 5px
         * </li>
         * <li><p>If the padding property has one value (two arguments):</p>
         *     <ul>
         *     <li>
         *     <p><b>When the second argument is single value argument, the sequence of 
         *     arguments is element for the first argument and top, right, bottom and 
         *     left margins for the second argument.</b></p>
         *     padding: 10px;
         *     all four margins are 10px
         *     Note: Negative values are allowed.
         *     </li>
         *     <li><b>When the second argument is an array, it belongs to the case that 
         *     corresponds to it's number of values described above.</b></li>
         *     <li><b>When the second argument is a plain object, values of fields 
         *     'top', 'left', 'bottom' and 'right' are setted respectively to their 
         *     correspondings in the HTML element style..</b></li>
         *     </ul>
         * </li>
         * </ul>
         * @param {HTMLElement} el
         * @param {Number|String|Array|Object} [value]
         * @returns {Object}  The returned object is an object that corresponds to 
         *      margins of the given HTML element when only one argument or the 
         *      given HTML element otherwise.
         */
        padding :function(el, value) { 
            var style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;
            return { 
                left: parseInt(style.paddingLeft) || 0, 
                right: parseInt(style.paddingRight) || 0, 
                top: parseInt(style.paddingTop) || 0, 
                bottom: parseInt(style.paddingBottom) || 0 
            };
            return _margin(el, 'padding', value);
        },
        /**
         * 
         * @param {HTMLElement} el
         * @returns {Object}
         */
        border :function(el) { 
            var style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;
            return { 
                left: parseInt(style.borderLeftWidth) || 0, 
                right: parseInt(style.borderWidth) || 0, 
                top: parseInt(style.borderTopWidth) || 0, 
                bottom: parseInt(style.borderBottomWidth) || 0 
            };
        },
        /**
         * Returns the insets object of an HTML element
         * @param {HTMLElement} el
         * @returns {Object} The insets object has the following fields:
         *      <ul>
         *         <li><b>left</b>: left inset (margin + border + padding) in pixel</li>
         *         <li><b>top</b>: top inset (margin + border + padding) in pixel</li>
         *         <li><b>right</b>: right inset (margin + border + padding) in pixel</li>
         *         <li><b>bottom</b>: bottom inset (margin + border + padding) in pixel</li>
         *         <li><b>margin</b>: 
         *         <ul>
         *            <li><b>left</b>: left margin in pixel</li>
         *            <li><b>top</b>: top margin in pixel</li>
         *            <li><b>right</b>: right margin in pixel</li>
         *            <li><b>bottom</b>: bottom margin in pixel</li>
         *         </ul>
         *         </li>
         *         <li><b>border</b>: the border sizes/widths in pixel
         *            <ul>
         *            <li><b>left</b>: left border in pixel</li>
         *            <li><b>top</b>: top border in pixel</li>
         *            <li><b>right</b>: right border in pixel</li>
         *            <li><b>bottom</b>: bottom border in pixel</li>
         *            </ul>
         *         </li>
         *         <li><b>padding:
         *            <ul>
         *            <li><b>left</b>: left padding in pixel</li>
         *            <li><b>top</b>: top padding in pixel</li>
         *            <li><b>right</b>: right padding in pixel</li>
         *            <li><b>bottom</b>: bottom padding in pixel</li>
         *            </ul>
         *         </li>
         *      </ul>
         */
        insets: function(el) {
            var style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;

            var _insets = {};
            _insets.margin = { 
                left: parseInt(style.marginLeft) || 0, 
                right: parseInt(style.marginRight) || 0, 
                top: parseInt(style.marginTop) || 0, 
                bottom: parseInt(style.marginBottom) || 0 
            };

            _insets.padding = { 
                left: parseInt(style.paddingLeft) || 0, 
                right: parseInt(style.paddingRight) || 0, 
                top: parseInt(style.paddingTop) || 0, 
                bottom: parseInt(style.paddingBottom) || 0 
            };

            _insets.border = { 
                left: parseInt(style.borderLeftWidth) || 0, 
                right: parseInt(style.borderRightWidth) || 0, 
                top: parseInt(style.borderTopWidth) || 0, 
                bottom: parseInt(style.borderBottomWidth) || 0 
            };

            _insets.left = _insets.margin.left + _insets.padding.left + _insets.border.left;

            _insets.right = _insets.margin.right + _insets.padding.right + _insets.border.right;

            _insets.top = _insets.margin.top + _insets.padding.top + _insets.border.top;

            _insets.bottom = _insets.margin.bottom + _insets.padding.bottom + _insets.border.bottom;

            return _insets;
        },
        /**
         * Returns the box object of an HTML element
         * @param {HTMLElement} el
         * @returns {Object} The box object has the following fields:
         *     <ul>
         *     <li><b>x</b>: client x/left position in pixel</li>
         *     <li><b>y</b>: client y/top position in pixel</li>
         *     <li><b>left</b>: client left/x position in pixel</li>
         *     <li><b>top</b>: client top/y position in pixel</li>
         *     <li><b>bottom</b>: client bottom position in pixel</li>
         *     <li><b>right</b>: client right position in pixel</li>
         *     <li><b>width</b>: box/full width in pixel</li>
         *     <li><b>height</b>: box/full height in pixel</li>
         *     <li><b>insets
         *         <ul>
         *         <li><b>left</b>: left inset (margin + border + padding) in pixel</li>
         *         <li><b>top</b>: top inset (margin + border + padding) in pixel</li>
         *         <li><b>right</b>: right inset (margin + border + padding) in pixel</li>
         *         <li><b>bottom</b>: bottom inset (margin + border + padding) in pixel</li>
         *         <li><b>margin</b>: 
         *             <ul>
         *             <li><b>left</b>: left margin in pixel</li>
         *             <li><b>top</b>: top margin in pixel</li>
         *             <li><b>right</b>: right margin in pixel</li>
         *             <li><b>bottom</b>: bottom margin in pixel</li>
         *             </ul>
         *         </li>
         *         <li><b>border</b>: the border sizes/widths in pixel
         *            <ul>
         *             <li><b>left</b>: left border in pixel</li>
         *             <li><b>top</b>: top border in pixel</li>
         *             <li><b>right</b>: right border in pixel</li>
         *             <li><b>bottom</b>: bottom border in pixel</li>
         *             </ul>
         *         </li>
         *         <li><b>padding:
         *            <ul>
         *             <li><b>left</b>: left padding in pixel</li>
         *             <li><b>top</b>: top padding in pixel</li>
         *             <li><b>right</b>: right padding in pixel</li>
         *             <li><b>bottom</b>: bottom padding in pixel</li>
         *             </ul>
         *         </li>
         *         </ul>
         *     </li>
         *     <li><b>rwidth</b>: bounding client width in pixel</li>
         *     <li><b>rheight</b>: bounding client height in pixel</li>
         *     <li><b>bwidth</b>: bounding client width in pixel</li>
         *     <li><b>bheight</b>: bounding client height in pixel</li>
         *     <li><b>innerWidth</b>: inner width in pixel</li>
         *     <li><b>innerHeight</b>: inner height in pixel</li>
         *     </ul>
         */
        box: function(el) {
            var b = {}, i;
            b.insets = i = this.insets(el);
            var r = el.getBoundingClientRect();
            b.width = r.width + i.margin.left + i.margin.right;
            b.height = r.height + i.margin.top + i.margin.bottom;
            //bounding client width
            b.bwidth = b.rwidth = r.width;
            //bounding client height
            b.bheight = b.rheight = r.height;
            b.x = b.left = r.left;
            b.y = b.top = r.right;
            b.right = r.right;
            b.bottom = r.bottom;
            b.innerWidth = b.width - i.left - i.right;
            b.innerHeight = b.height - i.top - i.bottom;
            return b;
        },
         /**
         * Returns the (basic) box object of an HTML element
         * @param {HTMLElement} el
         * @returns {Object} The (basic) box object has the following fields:
         *     <ul>
         *     <li><b>x</b>: client x/left position in pixel</li>
         *     <li><b>y</b>: client y/top position in pixel</li>
         *     <li><b>left</b>: client left/x position in pixel</li>
         *     <li><b>top</b>: client top/y position in pixel</li>
         *     <li><b>bottom</b>: client bottom position in pixel</li>
         *     <li><b>right</b>: client right position in pixel</li>
         *     <li><b>width</b>: box/full width in pixel</li>
         *     <li><b>height</b>: box/full height in pixel</li>
         *     </ul>
         */
        simpleBox: function(el) {
            var b = {}, i = this.insets(el);
            var r = el.getBoundingClientRect();
            b.width = r.width + i.margin.left + i.margin.right;
            b.height = r.height + i.margin.top + i.margin.bottom;
            b.x = b.left = r.left;
            b.y = b.top = r.right;
            b.right = r.right;
            b.bottom = r.bottom;
            return b;
        },
        /**
         * Returns (when only one argument) or sets (when more than 1 argument) the 
         * inner width of the given HTML element 
         * @param {HTMLElement} e
         * @param {Number} [w]
         * @param {Object} [insets]
         * @returns {Number}
         */
        width : _cssCompliant ? function(e, w, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }
            if (typeof w === 'object' && w) {
                var x = w;
                w = insets;
                insets = x;
            }
            if (arguments.length === 1 || w === undefined) {
                return e.clientWidth;
            }            
            e.style.width = px(w) + "px";
            return e;
        } : function(e, w, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }            
            if (typeof w === 'object' && w) {
                var x = w;
                w = insets;
                insets = x;
            }
            if (arguments.length === 1 || w === undefined) {
                return e.clientWidth;
            }
            
            e.style.width = (px(w) + (insets||(insets = this.insets(e))).left + insets.right) + "px";
            return e;
        },
        /**
         * Returns (when only one argument) or sets (when more than 1 argument) the full/box width of a HTML element 
         * @param {HTMLElement} e
         * @param {Number} [w]
         * @param {Object} [insets]
         * @returns {Number}
         */
        fullWidth : _cssCompliant ? function(e, w, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }
            if (typeof w === 'object' && w) {
                var x = w;
                w = insets;
                insets = x;
            }
            insets=insets||this.insets(e);
            if (arguments.length === 1 || w === undefined) {
                var r = e.getBoundingClientRect();
                return r.width + insets.margin.left + insets.margin.right;
            }
            
            e.style.width = (px(w) - insets.left - insets.right) + "px";
            return e;
        } : function(e, w, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }
            if (typeof w === 'object' && w) {
                var x = w;
                w = insets;
                insets = x;
            }
            if (arguments.length === 1 || w === undefined) {  
                var r = e.getBoundingClientRect();
                insets=insets||this.insets(e);
                return r.width + insets.margin.left + insets.margin.right;
            }                        
            e.style.width = px(w) + "px";
            return e;
        } //end fullWidth
        ,
        /**
         * Returns (when only one argument) or sets (when more than 1 argument) the inner height of the given HTML element 
         * @param {HTMLElement} e
         * @param {Number} [h]
         * @param {Object} [insets]
         * @returns {Number}
         */
        height : _cssCompliant ? function(e, h, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }
            if (typeof h === 'object' && h) {
                var x = h;
                h = insets;
                insets = x;
            } 
            if (arguments.length === 1 || h === undefined) {
                insets=insets||this.insets(e);
                return e.clientHeight - insets.padding.top  - insets.padding.bottom
                     - insets.border.top  - insets.border.bottom;
            }
            e.style.height = px(h) + "px";
            return e;
        } : function(e, h, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            } 
            if (typeof h === 'object' && h) {
                var x = h;
                h = insets;
                insets = x;
            }
            insets=insets||this.insets(e);
            if (arguments.length === 1 || h === undefined) {
                return e.clientHeight
                     - insets.padding.top  - insets.padding.bottom
                     - insets.border.top  - insets.border.bottom;
            }
            e.style.height = (px(h) + insets.top + insets.bottom) + "px";
            return e;
        }  //end height function
        ,
        /**
         * Returns (when only one argument) or sets (when more than 1 argument) the full/box height of a HTML element 
         * @param {HTMLElement} e
         * @param {Number} [h]
         * @param {Object} [insets]
         * @returns {Number}
         */
        fullHeight : _cssCompliant ? function(e, h, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }
            if (typeof h === 'object' && h) {
                var x = h;
                h = insets;
                insets = x;
            } 
            insets=insets||this.insets(e);
            if (arguments.length === 1 || h === undefined) {
                var r = e.getBoundingClientRect();
                return r.height + insets.margin.top + insets.margin.bottom;
            }
            e.style.height = (px(h) - insets.top - insets.bottom) + "px";
            return e;
        } : function(e, h, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }
            if (typeof h === 'object' && h) {
                var x = h;
                h = insets;
                insets = x;
            }
            if (arguments.length === 1 || h === undefined) {
                var r = e.getBoundingClientRect();
                insets=insets||this.insets(e);
                return r.height + insets.margin.top + insets.margin.bottom;
            }
            e.style.height = px(h) + "px";
            return e;
        } //fullHeight
        ,
        /**
         * Returns (when only one argument) or sets (when more than 1 argument) the full/box size of a HTML element 
         * @param {HTMLElement} e
         * @param {Number} [w]
         * @param {Number} [h]
         * @param {Object} [insets]
         * @returns {Object}
         */
        fullSize: _cssCompliant ? function(e, w, h, insets) {            
            if (typeof w === 'object' && w) {
                var x;
                if (typeof h === 'object' && h) {
                    insets = h;
                    h = w.height;
                    w = w.width;
                } else if (arguments.length === 2) { //branch added 2022-10-26 by Marc KAMGA Olivier
                    h = w.height;
                    w = w.width;
                } else {
                    x = w;
                    w = h;
                    h = insets;
                    insets = x;
                }
            }
            if (!insets) {
                insets = this.insets(e);
            }
            if (arguments.length === 1 || w === undefined) {
                var r = e.getBoundingClientRect();
                return { 
                    width: r.width + insets.margin.left + insets.margin.right,
                    height: r.height + insets.margin.top + insets.margin.bottom
                };
            }
            if (w instanceof Number || w instanceof String) {
                w = w.valueOf();
            }
            if (typeof w === 'string') {
                w = pixels(w);
            } else if (typeof w !== 'number') {
                throw new Error("Incorrect width argument");
            }
            if (h instanceof Number || h instanceof String) {
                h = h.valueOf();
            }
            if (typeof h === 'string') {
                h = pixels(h);
            } else if (typeof h !== 'number') {
                throw new Error("Incorrect height argument");
            }            
            w -= insets.left + insets.right;
            h -= insets.top + insets.bottom;

            e.style.width = w + "px";
            e.style.height = h + "px";
            return e;
        } : function(e, w, h, insets) {            
            if (typeof w === 'object' && w) {
                var x;
                if (typeof h === 'object' && h) {
                    insets = h;
                    h = w.height;
                    w = w.width;
                } else {
                    x = w;
                    w = h;
                    h = insets;
                    insets = x;
                }
            }
            if (!insets) {
                insets = this.insets(e);
            }
            if (arguments.length === 1 || w === undefined) {
                var r = e.getBoundingClientRect();
                return { 
                    width: r.width + insets.margin.left + insets.margin.right,
                    height: r.height + insets.margin.top + insets.margin.bottom
                };
            }
            if (w instanceof Number || w instanceof String) {
                w = w.valueOf();
            }
            if (typeof w === 'string') {
                w = pixels(w);
            } else if (typeof w !== 'number') {
                throw new Error("Incorrect width argument");
            }
            if (h instanceof Number || h instanceof String) {
                h = h.valueOf();
            }
            if (typeof h === 'string') {
                h = pixels(h);
            } else if (typeof h !== 'number') {
                throw new Error("Incorrect height argument");
            }
            e.style.width = w + "px";
            e.style.height = h + "px";
            return e;
        },
        /**
         * Returns (when only one argument) or sets (when more than 1 argument) the 
         * inner width of the given HTML element 
         * @param {HTMLElement} e
         * @param {Number} [w]
         * @param {Number} [h]
         * @param {Object} [insets]
         * @returns {Number}
         */
        size : _cssCompliant ? function(e, w, h, insets) {
            var args = Array.prototype.slice.call(arguments);
            if (args.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }
            if (typeof w === 'object' && w) {
                var x;
                if (typeof h === 'object' && h) {
                    insets = h;
                    h = w.height;
                    w = w.width;
                } else {
                    x = w;
                    w = h;
                    h = insets;
                    insets = x;
                }
            }
            if (!insets) {
                insets = this.insets(e);
            }
            if (args.length === 1 || w === undefined) {
                var r = e.getBoundingClientRect();
                return { 
                    width: r.width - insets.padding.left - insets.padding.right
                        - insets.border.left - insets.border.right,
                    height: r.height - insets.padding.top - insets.padding.bottom
                        - insets.border.top - insets.border.bottom
                };
            }
            if (w instanceof Number || w instanceof String) {
                w = w.valueOf();
            }
            if (typeof w === 'string') {
                w = pixels(w);
            } else if (typeof w !== 'number') {
                throw new Error("Incorrect width argument");
            }
            if (h instanceof Number || h instanceof String) {
                h = h.valueOf();
            }
            if (typeof h === 'string') {
                h = pixels(h);
            } else if (typeof h !== 'number') {
                throw new Error("Incorrect height argument");
            }            
            e.style.width = px(w) + "px";
            e.style.height = px(h) + "px";
            return e;
        } : function(e, w, h, insets) {
            if (arguments.length === 0) {
                throw new Error("At leat HTML/DOM element argument expected");
            }            
            if (typeof w === 'object' && w) {
                var x;
                if (typeof h === 'object' && h) {
                    insets = h;
                    h = w.height;
                    w = w.width;
                } else {
                    x = w;
                    w = h;
                    h = insets;
                    insets = x;
                }
            }
            insets=insets||this.insets(e);
            if (arguments.length === 1 || w === undefined) {
                var r = e.getBoundingClientRect();
                return { 
                    width: r.width - insets.padding.left - insets.padding.right
                        - insets.border.left - insets.border.right,
                    height: r.height - insets.padding.top - insets.padding.bottom
                        - insets.border.top - insets.border.bottom
                };
            }
            
            e.style.width = (px(w) + insets.left + insets.right) + "px";
            e.style.height = (px(h) + insets.top + insets.bottom) + "px";
            return e;
        } //end size
        ,
        /**
         * 
         * <p><b>Not the bounding client rectangle width</b></p>
         * @param {HTMLElement} e
         * @returns {Number}
         */
        clientWidth : function(e) {
            return e.clientWidth;
        },
        /**
         * 
         * <p><b>Not the bounding client rectangle height</b></p>
         * @param {HTMLElement} e
         * @returns {Number}
         */
        clientHeight : function(e) {
            return e.clientHeight;
        },
        /**
         * Returns object (not DomRect instance) providing information about the 
         * size of an element and its position relative to the viewport. It's an
         * equivalent of HTML element method getBoundingClientRect.
         * <p><b>Note</b>: </p>
         * <ul>
         * <li>Properties in the returned object of 
         * Element.prototype.getBoundingClientRect() method are not own properties. 
         * While the in operator and for...in will find returned properties, other 
         * APIs such as Object.keys() will fail. Moreover, and unexpectedly, 
         * the ES2015 and newer features such as Object.assign() and object 
         * rest/spread will fail to copy returned properties.</li>
         * <li>Properties of the returned object of this method 
         * (CSSBoxModel.clientRect) call, are accesible by all the APIs and  for 
         * ES2015 and newer features such as Object.assign() and object 
         * rest/spread will not fail to copy returned properties.
         * rest/spread will fail to copy returned properties</li>
         * </ul>
         * @param {HTMLElement} e
         * @returns {Object}
         */
        clientRect : function(e) {
            //invoke native getBoundingClientRect from the element : the result not 
            //compliant to ES015 features
            var r = e.getBoundingClientRect();
            //return and object compliant to ES015 features
            return {
                top: r.top,
                bottom : r.bottom,
                left: r.left,
                right : r.right,
                width : r.width,
                height : r.height,
                x : r.x||r.left,
                y: r.y||r.top
            };
        },
        /**
         * 
         * @param {type} e
         * @returns {unresolved}
         */
        clientX : function(e) {
            return e.getBoundingClientRect().left;
        },
        /**
         * 
         * @param {type} e
         * @returns {unresolved}
         */
        clientY : function(e) {
            return e.getBoundingClientRect().top;
        },
        offsetX : function(e) {
            return e.getBoundingClientRect().left + document.body.scrollLeft;
        },
        offsetY : function(e) {
            return e.getBoundingClientRect().top + document.body.scrollTop;
        },
        offsetXY : function(e) {
            var r = e.getBoundingClientRect();
            var x = r.left, y = r.top; 
            return { x: x, y: y, left: x, top: y };
        }
    };
    return Model;
})();


CSSBoxModel.offsetPosition = CSSBoxModel.offsetXY;

CSSBoxModel.offsetPos = CSSBoxModel.offsetXY;

/**
 * Returns or sets the inner width of the given HTMLElement
 * @alias CSSBoxModel.width
 * @function
 */
CSSBoxModel.innerWidth = CSSBoxModel.width;
/**
 * Returns the inner height of the given HTMLElement
 * @alias CSSBoxModel.height
 * @function
 */
CSSBoxModel.innerHeight = CSSBoxModel.height;
/**
 * Returns the inner width of the given HTMLElement
 * @alias CSSBoxModel.width
 * @function
 */
CSSBoxModel.w = CSSBoxModel.width;
/**
 * Returns the inner height of the given HTML element
 * @alias CSSBoxModel.height
 * @function
 */
CSSBoxModel.h = CSSBoxModel.height;
/**
 * Returns or sets the full width of the given HTML element.
 * @alias CSSBoxModel.fullWidth
 * @function
 */
CSSBoxModel.W = CSSBoxModel.fullWidth;

/**
 * Returns or sets the full width of the given HTML element.
 * @alias CSSBoxModel.fullWidth
 * @function
 */
CSSBoxModel.outerW = CSSBoxModel.fullWidth;

/**
 * Returns or sets the full width of the given HTML element.
 * @alias CSSBoxModel.fullWidth
 * @function
 */
CSSBoxModel.outerWidth = CSSBoxModel.fullWidth;

CSSBoxModel.x = CSSBoxModel.clientX;

CSSBoxModel.y = CSSBoxModel.clientY;
CSSBoxModel.setInnerWidth = function(e, w) {
	return CSSBoxModel.width(e, w);
}

CSSBoxModel.setInnerHeight = function(e, h) {
	return CSSBoxModel.height(e, h);
}

CSSBoxModel.setFullWidth = function(e, w) {
	return CSSBoxModel.fullWidth(e, w);
}

CSSBoxModel.setFullHeight = function(e, h) {
	return CSSBoxModel.fullHeight(e, h);
}
/**
 * 
 * @param {type} e
 * @param {Number} [w]
 * @returns {Number|Element}
 */
function offsetWidth(e, w) { return CSSBoxModel.fullWidth.apply(CSSBoxModel, arguments); }


/**
 * Returns the inner width style property setter
 * @param {Number} w The inner width to set (width without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var innerWidthStyleProperty = cssCompliant ? function (w, insets) {
    return "width:" + w + 'px';
} : function(w, insets) {
    return "width:" + (w + insets.left + insets.left) + 'px';
};
/**
 * 
 * @param {Number} h  The inner height to set (height without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var innerHeightStyleProperty = cssCompliant ? function (h, insets) {
    return "height:" + h + 'px';
} : function(w, insets) {
    return "height:" + (w + insets.left + insets.left) + 'px';
};

/**
 * 
 * @alias
 * @param {Number} w  The inner width to set (width without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var cssWidthProperty = innerWidthStyleProperty;
/**
 * 
 * @alias
 * @param {Number} h  The inner height to set (height without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var cssHeightProperty = innerHeightStyleProperty;
/**
 * 
 * @alias
 * @param {Number} w  The inner width to set (width without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var cssWidthProp = innerWidthStyleProperty;
/**
 * 
 * @alias
 * @param {Number} h  The inner height to set (height without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var cssHeightProp = innerHeightStyleProperty;

/**
 * 
 * @alias
 * @param {Number} w  The inner width to set (width without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var cssWidth = cssWidthProp;
/**
 * 
 * @alias
 * @param {Number} h  The inner height to set (height without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var cssHeight = cssHeightProp;

/**
 * 
 * @alias
 * @param {Number} w  The inner width to set (width without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var styleWidth = cssWidthProp;
/**
 * 
 * @alias
 * @param {Number} h  The inner height to set (height without margins, paddings and borders)
 * @param {Object} insets
 * @returns {String}
 * @function
 */
var styleHeight = cssHeightProp;
/**
 * Returns or sets the full height of the given HTML element.
 * @alias CSSBoxModel.fullHeight
 * @function
 */
CSSBoxModel.H = CSSBoxModel.fullHeight;
/**
 * Returns or sets the full height of the given HTML element.
 * @alias CSSBoxModel.fullHeight
 * @function
 */
CSSBoxModel.outerH = CSSBoxModel.fullHeight;
/**
 * Returns or sets the full height of the given HTML element.
 * @alias CSSBoxModel.fullHeight
 * @function
 */
CSSBoxModel.outerHeight = CSSBoxModel.fullHeight;
/**
 * 
 * @param {Element} e
 * @param {Number} h
 * @returns {Number|Element}
 */
function offsetHeight(e, h) { return CSSBoxModel.fullHeight.apply(CSSBoxModel, arguments); }

CSSBoxModel.basicBox = CSSBoxModel.bBox = CSSBoxModel.bbox = CSSBoxModel.simpleBox;

CSSBoxModel.fullBox = CSSBoxModel.fBox = CSSBoxModel.fbox = CSSBoxModel.box;



var CssBoxModel = CSSBoxModel;

var cssBoxModel = CSSBoxModel;

if (typeof SereniX !== 'object' || !SereniX) {
    SereniX = {};
}

SrnX = SereniX;

SrnX.CSSBoxModel = CSSBoxModel;
SrnX.CssBoxModel = CSSBoxModel;
SrnX.BoxModel = CSSBoxModel;
SrnX.Box = CSSBoxModel;

