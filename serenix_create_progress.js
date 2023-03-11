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

(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }
    
})(this, 'createProgress', function() {
    var ib = 'inline-block';
    function intColor(c) {
        throw new Error('Int color not yet supported');
    }
    
    function isUndef(x) {
        return typeof x === 'undefined' || x === null;
    }
    
    function coalesce(o, $) {
        var args = Array.prototype.slice.call(arguments), i = 1, n = args.length, defVal, v;
        if (isArray($)) {
            if (args.length > 2)
                defVal = args[2];
            for (i = 0, n = $.length; i < n; i++) {
                if (!(typeof (x = $[i]) === 'string' || x instanceof String))
                    throw new Error("Incorrect arguments");
                v = o[x];
                if (v != undefined) //v !== undefined && v !== null
                    return v;
            }
        } else if (args.length > 1) {
            for (; i < n; i++) {
                if (!(typeof (x = args[i]) === 'string' || x instanceof String))
                    return x;
                v = o[x];
                if (v != undefined) //v !== undefined && v !== null
                    return v;
            }
        } else
            throw new Error("Incorrect arguments");

        return defVal;
    }
    
    
    function toColor(color) {
        var match, err;
        if (!color && color !== 0)
            return '';
        if (typeof (color=unboxVal(color)) === 'string') {
            if ((match=/^\d+(\.\d+)?$/.exec(color))) {
                return intColor(Math.ceil(parseFloat(color), 10));
            } else {
                return color;
            }
        } else if (isArray(color)) {
            if (color.length === 4) {
                return 'rgba(' + color.join(',') + ')';
            }
            if (color.length > 4 || color.length < 3) {
                err = new Error('Incorrect array color');
                err.color = color;
                throw err;
            }
            return 'rgb(' + color.join(',') + ')';
        } else if (isPlainObj(color)) {
            var r = color.red;
            if (isUndef(r)) {
                r = color.r;
                if (!isUndef(r)) {
                    return isUndef(color.a) ? 
                        'rgb(' + [r, color.g, color.b].join(',') + ')' : 
                        'rgba(' + [r, color.g, color.b, color.a].join(',') + ')';
                }
            } else {
                return isUndef(color.alpha) ? 
                    'rgb(' + [r, color.green, color.blue].join(',') + ')' : 
                    'rgba(' + [r, color.green, color.blue, color.alpha].join(',') + ')';;
            }
        } else if (typeof color === 'number') {
            return intColor(color);
        } else {
            return '';
        }
        if (!isUndef(color.h)) {
            var a;
            return isUndef(a = color.alpha||color.a) ? 
                    'hsl(' + [color.h, color.s, color.l].join(',') + ')' : 
                    'hsla(' + [color.h, color.s, color.l, a].join(',') + ')';
        }
    }
    
    function getOrCreateEditInput(el, display){
        var ed, input, symbol;
        if ((ed = createProgress.__$$edit$$__)) {
            input = ed.__input__;
            input.__progressEl__ = input.progressEl = el;
            input.__editor__ = ed;
            el.__edit__ = ed;
            input.__progressEl__ = el;
            return input;
        }
        input = document.createElement('input');
        ed = document.createElement('div');
        symbol = document.createElement('span');
        ed.__symbol__ = symbol;
        
        ed.style.margin = ed.style.padding = ed.borderWidth = '0px';
        addCssClass(ed, 'SereniX-progress-editor editor');
        addCssClass(input, 'editor-input');
        addCssClass(symbol, 'editor-symbol');
        
        input.type  = 'number';
        input.setAttribute('max', '100');
        input.setAttribute('min', '0');
        input.max = 100;
        input.min = 0;

        addEvt('focus', input, function(ev) {
            /*//TODO
            if (this.__progressEl__ && !this.__progressEl__.__$$editing$$__) {
                
                edit(this.__progressEl__);
            }*/
        });
        
        addEvt('blur', input, function(ev) {
            var el;
            //TODO
            if ((el = this.__progressEl__)) {
                stopEditing(el, ev);
                ev.oldValue = el.__oldValue__;
                ev.progressElement = ev.progressEl = ev.progress = el;
                ev.changeTarget = el;
                if (el.__synchronizer_) {
                    el.__synchronizer_.process(el);
                }
                el.__fireChange(ev);
            }
        });
        ed.style.display = display||'none';
        
        ed.appendChild(el.__input__ = input);
        
        symbol.innerHTML = '%';
        addCssClass(symbol, 'symbol');
        symbol.style.position = 'absolute';
        symbol.style.right = '0px';
        symbol.style.margin = symbol.style.padding = 
                symbol.borderWidth = '0px';
        symbol.style.marginLeft = '5px';
        ed.appendChild(symbol);
        
        el.appendChild(el.__edit__ = ed);
        input.__progressEl__ = input.progressEl = el;
        input.__editor__ = createProgress.__$$edit$$__ = ed;
        ed.__input__ = input;
        el.__edit__ = ed;
        input.__progressEl__ = el;
        return input;
    }
    
    function edit(el) {
        
        if (!el.focusable) {
            return;
        }
        
        var input = el.__input__, w, h, x;
        var ed = el.__edit__;
        if (ed && ed.progressEl && el !== ed.progressEl && ed.progressEl.__$$editing$$__) {
            stopEditing(ed.progressEl);
        }
        el.__$$editing$$__ = true;
        if (!input) {
            input = getOrCreateEditInput(el);
            ed = input.__editor__||input.__edit__;
        }
        ed.__input__ = input;
        el.setAttribute('tabindex', '-1');
        ed.style.display = ib;
        if (el.__label__ && el.editPos === 'label' ) {
            x = el.getClientBoundingRect();
            ed.style.position === 'absolute';
            ed.style.left = (x.x||x.left) + 'px';
            ed.style.left = (x.y||x.right) + 'px';
            x = CSSBoxModel.fullSize(el.__label__);
            CSSBoxModel.fullSize(ed, x);
            el.__label__.style.display = 'none';
        } else {
            ed.style.position === 'relative';
            x = CSSBoxModel.size(el);
            CSSBoxModel.fullSize(ed, x);
            if (el.__label__)
                el.__label__.style.display = 'none';
            if (el.__progress__)
                el.__progress__.style.display = 'none';
            else
                el.__bar__.style.display = 'none';
        }
        el.appendChild(ed);
        ed.progressEl = ed.__progressEl__ = el;
        input.value = '' + (el.__value__||(el.__value__ = 0));
        w = x.width;
        h = x.height;
        x = ed.__symbol__ ? CSSBoxModel.fullSize(ed.__symbol__) : {width: 0, height: 0 };
        var insets = CSSBoxModel.insets(ed);
        CSSBoxModel.fullSize(
            input, 
            w - x.width - insets.left - insets.right, 
            h - x.height - insets.top - insets.bottom
        );
        el.__$$editing$$__ = true;
        input.focus();
    }
    
    function setColors(el, $) {
        function _minField() {
            if (isUndef(c.min)) {
                if (isUndef(c.minimum)) {
                    if (isUndef(c.minValue)) {
                        if (!isUndef(c.minimumValue)) {
                            maxField = 'maximumValue';
                            minField = 'minimumValue';
                        }
                    } else {
                        maxField = 'maxValue';
                        minField = 'minValue';
                    }
                } else {
                    maxField = 'maximum';
                    minField = 'minimum';
                }
            } else {
                maxField = 'max';
                minField = 'min';
            }
        }
        function _rangeFields() {
            maxField = $.rangeMaxField||$.maxField;
            minField = $.rangeMinField||$.minField;
            valueField = $.valueField||$.valField||'value';
            if (maxField) {
                if (!minField) {
                    //replace the first occurrence of 'ax' by 'in' to get the field for the minimum
                    minField = maxField.replace(/ax/, 'in');
                }
                return;
            } else if (minField) {
                //replace the first occurrence of 'in' by 'ax' to get the field for the maximum
                maxField = minField.replace(/in/, 'ax');
                return;
            }
            if (isUndef(c.max)) {
                if (isUndef(c.maximum)) {
                    if (isUndef(c.maxValue)) {
                        if (isUndef(c.maximumValue)) {
                            _minField();
                        } else {
                            maxField = 'maximumValue';
                            minField = 'minimumValue';
                        }
                    } else {
                        maxField = 'maxValue';
                        minField = 'minValue';
                    }
                } else {
                    maxField = 'maximum';
                    minField = 'minimum';
                }
            } else {
                maxField = 'max';
                minField = 'min';
            }
        }
        function getRangeVal(r) {
            var v = r[valueField];
            if (!isUndef(v)) {
                if (isUndef(r[minField]))
                    r[minField] = r[maxField] = v;
            }
            return v;
        }
        var colors = $.colors||$.intervals||$.ranges||$.segments,
            x, c, n, maxField, minField, valueField, fraction, i;
        if (isArray(colors)&& (n = colors.length)) {
            c = colors[0];
            _rangeFields();
            var intervals = [];
            if (isUndef(maxField) && isUndef(minField)) {
                fraction = (100000/n)/1000;
                x = 0;
                for (i = 1; i < n; i++) {
                    x += fraction;
                    intervals.push({ max: x, color: colors[i - 1]} );
                }
                intervals.push({ max: 100, color: colors[n - 1]} );
            } else {
                colors.forEach(function(c, i) {
                    intervals.push({ 
                        min: c[minField],
                        exclusiveMin: c.exclusiveMin,
                        max: c[maxField],
                        exclusiveMax: c.exclusiveMax,
                        color: c.color
                    } );
                });
                intervals.sort(function(a, b) {
                    var max1, max2, min1, min2;
                    var v1 = getRangeVal(a);
                    var v2 = getRangeVal(b);
                    if (!isUndef(v1)) {
                        if (!isUndef(v2)) {
                            return v1 - v2;
                        } else {
                            return -1;
                        }
                    } else if (!isUndef(v2)) {
                        return  1;
                    }
                    max1 = a[maxField]||Number.POSITIVE_INFINITY;
                    max2 = b[maxField]||Number.POSITIVE_INFINITY;
                                        
                    if (max1 === max2) {
                        min1 = a[minField]||(a[minField]=0);
                        if (isUndef(min1))
                            min1 = a[minField]=0;
                        min2 = b[minField];
                        if (isUndef(min2))
                            min2 = b[minField]=0;
                        return min1 - min2;                        
                    } else {
                        return max1 - max2;
                    }
                });
            }
        }
        
        el.colors = intervals;
        x = $.barColor||$.progressColor;
        if (!isUndef(x)) {
            if (typeof x.getColor === 'function') {
                el.colorMethod = 'getColor';
                el.barColor = x;
            } else if (typeof x.color === 'function') {
                el.colorMethod = 'color';
                el.barColor = x;
            } else {
                el.barColor = toColor(x);
            }
        }
    }
    
    function stopEditing(el) {
        if (!el.__$$editing$$__) {
            return;
        }
        var ed = el.__edit__;
        var input = ed.__input__;
        var  x = CSSBoxModel.width(el), w = x.width, h, v;
        if (el.__label__) {
            el.__label__.style.display = ib;
            w -= CSSBoxModel.fullWidth(el.__labelPlace__);
        }
        if (el.__progress__) {
            el.__progress__.style.display = ib;
            CSSBoxModel.fullWidth(el.__progress__, w);
            w = CSSBoxModel.width(el.__progress__);
        } else {
            el.__bar__.style.display = ib;
        }
        v = parseFloat(input.value, 10);
        
        if (this.__value__ !== v) {
            el.__oldValue__ = this.__value__;
            setVal(el, el.__bar__, v);
        }
        el.__edit__.style.display = 'none';
        el.setAttribute('tabindex', '0');
        el.__$$editing$$__ = false;
    }
    
    
    function setVal(el, bar, val) {
        var x, i, colors = el.colors, n, c, min;
        bar.style.width = val + '%';
        el.__value__ = val;
        if (el.__label__) {
            el.innerHTML = val + '%';
        } else if (this.__withLabel__) {
            bar.innerHTML = val + '%';
        }
        if (isArray(colors)) {
            for (i = 0, n = colors.length; i < n; i++) {
                c = colors[i];
                min = c.min||0;
                if ((val === 80 || val === 79) && min === 80 && (isUndef(c.max) || c.max === Number.POSITIVE_INFINITY)) {
                    console.log(c);
                }
                if ((min < val || (!c.exclusiveMin && min === val))
                    && (isUndef(c.max) || (c.max > val || (!c.exclusiveMax && c.max === val)))) {
                    bar.style.backgroundColor = c.color;
                    return;
                }
            }
        }
        var color = el.barColor;
        if (typeof color === 'function') {
            bar.style.backgroundColor = el.barColor(val);
        } else if (isPlainObj(color)) {
            bar.style.backgroundColor = color[el.colorMethod](val);
        } else if (color) {
            bar.style.backgroundColor = color;
        }        
    }
    
    
    
    
    function createProgress(progress, $) {
        function setLabel($) {
            $ = $.toLowerCase();
            if ((match = /^(?:left|right|bar|top|bottom|(begin)|(end))$/.exec($))){
                withLabel = true;
                if (match[1])
                    labelPlace = 'left';
                else if (match[2])
                    labelPlace = 'left';
                else {
                    labelPlace = $;
                }
            } else {
                withLabel = false;
                labelPlace = '';
            }
        }
        var withLabel, labelPlace, match;
        var editable, val;
        if (arguments.length === 1) {
            if (typeof (progress = unboxVal(progress)) === 'string') {
                $ = { id: progress, progress: 0 };
                progress = 0;
            } else if (isPlainObj(progress)) {
                $ = progress;
                progress = $.value||$.progress;
            } else if (typeof progress === 'number') {
                if ((match = /^(\d+(?:\.\d+)?)%?$/.exec(val))) {
                    val = parseFloat(match[1], 10);
                    if (val < 0 || val > 100) {
                        throw new TypeError('Incorrect value');
                    }
                    $ = { progress: val };
                } else {
                    $ = { progress: progress};
                }
            } else {
                $ = {progress: progress = 0};
            }
        } else if (arguments.length === 0) {
            $ = { progress: progress = 0 };
        }
        
        this.__focusable_ = true;
        
        
        if (isPlainObj($=unboxVal($))) {
            withLabel = coalesce($, ['labeledProgress', 'labeled', 'withLabel', 'displayLabel']);
            if (isUndef(withLabel)) {
                if (isUndef($.labelPlace)) {
                    withLabel = false;
                    labelPlace = '';
                } else if (typeof (x = unboxVal($.labelPlace||$.labelPosition||$.labelPlace||'')) === 'string') {
                    setLabel(x);
                } else {
                    withLabel = false;
                    labelPlace = '';
                }
            } else if ((withLabel = toBool(withLabel))) {
                if (typeof (x = unboxVal($.labelPlace||$.labelPosition||$.labelPlace||'')) === 'string') {
                    setLabel(x);
                } else {
                    labelPlace = 'right';
                }
            } else {
                labelPlace = '';
            }
            var x = $.editable;
            if (isUndef(x)) {
                x = $.readOnly;
                if (isUndef(x)) {
                    x = $.readonly;
                    editable = isUndef(x) ? true : !toBool(x);
                } else {
                    editable = !toBool(x);
                }
            } else {
                editable = x;
            }
        } else if (typeof $ === 'string') {
            setLabel($);
        } else {
            withLabel = toBool($);
            labelPlace = 'bar';
            $ = { labelPlace: labelPlace };
        }
        
        
        var el;
        var bar = document.createElement('div'), prog;
        var lbl;
        var Sync = SereniX.proc !== undefined ? SereniX.proc.Synchronizer : undefined;
        var id = unboxVal($.id||$.Id||$.ID);
        var container = $.container;
        
        addCssClass(bar, 'bar');
        
        this.__focusable_ = isUndef($.focusable) ? true : toBool($.focusable);
        
        
        if (id) {
            el = document.getElementById(id);
            if (el) {
                el.innerHTML = '';
            } else {
                el = document.createElement('div');
                el.id = id;
            }
        } else {
            el = document.createElement('div');
        }
        el.__value__ = 0;
        
        setColors(el, $);
        
        if (Sync) {
            if ($.synchronizer instanceof Sync) {
                el.__synchronizer_ = $.synchronizer;
                el.__synchronizer_.setField(el);
            } else if (isPlainObj($.synchronizer)) {
                el.__synchronizer_ = new Sync($.synchronizer);
                el.__synchronizer_.setField(el);
            }
        
        }
        
        if (isUndef(x = $.editMode||$.editableMode||$.edit) || x === '') {
            el.__editMode_ = 'input';
        } else {
            el.setEditMode(x);
        }
        
        
        if (isDOMElt(container) && el.parentElement !== container) {
            container.appendChild(el);
        }
        
        function allowScrollEdit(el) {
            return el.disabled || el.editable || !el.focusable || el.__editMode_ === 'input';
        }
        
        var h, border, progBg, bg, match, re = /^\d+(?:\.\d+)([a-z]{2,3})$/g;
        if ((border = $.border)) {
            if (typeof border === 'number') {
                border = border + 'px solid lightgray';
            } else if (typeof border === 'string') {
                if ((match = re.exec(border)) && !match[1]) {
                    border = border.substring(0, re.lastIndex) + 'px' + border.substring(re.lastIndex);
                }
            }
        }
        if (!$.styleClass) {
            el.barColor = $.barColor||(el.inputOwner ? el.inputOwner.progressBarColor||'pink' : 'pink');
            x = $.width;
            el.style.width = (x ? toPx(x) : 200) + 'px';
            h = $.height;
            el.style.height = (h = (h ? toPx(h) : 21)) + 'px';
            border = border||'1px solid lightgray';
            progBg = $.progressBackground||$.progressBackgroundColor
                    || $.progressBg||$.progressBgColor;
            bg = $.background||$.backgroundColor
                    || $.bg || $.bgColor;
                
        } else {
            h = CSSBoxModel.height(el);
        }
        
        addEvt('keydown', bar, function(ev) {
            var el =  this.__progressEl__;
            if (!allowScrollEdit(el)) {
                return;
            }
            
            //TODO: use KeyboardEvents to bind events that increase of decrease the value and adjust the size of the bar
        });

        addEvt('keyup', bar, function(ev) {
            var el =  this.__progressEl__;
            if (!allowScrollEdit(el)) {
                return;
            }
            //TODO: use KeyboardEvents to unregister key events
        });

        addEvt('mousedown', bar, function(ev) {
            var el =  this.__progressEl__;
            if (!allowScrollEdit(el)) {
                return;
            }
            //TODO: drag start
        });

        addEvt('mousemove', bar, function(ev) {
            var el =  this.__progressEl__;
            if (!allowScrollEdit(el)) {
                return;
            }
            //TODO: adjust the size of the bar
        });

        addEvt('mouseup', bar, function(ev) {
            var el =  this.__progressEl__;
            if (!allowScrollEdit(el)) {
                return;
            }
            
            //TODO: drop (end drag)
        });
        if (withLabel) {            
            if (labelPlace === 'bar') {
                prog = el;
                el.appendChild(bar);
                bar.innerHTML = progress + '%';
                addCssClass(bar, 'labeled');
                addCssClass(el, 'progress labeled bar-label');
                bar.style.display = 'block';
                CSSBoxModel.fullHeight(bar, h);
            } else {
                addCssClass(bar, 'no-labeled');
                prog = document.createElement('span');
                prog.appendChild(bar);
                addCssClass(prog, 'progress');
                lbl = document.createElement('span');
                lbl.innerHTML = progress + '%';                
                if (labelPlace === 'right') {                
                    addCssClass(lbl, 'right-label');
                    addCssClass(prog, 'labeled horizontal-label');
                    el.appendChild(prog);
                    el.appendChild(lbl);
                } else if (labelPlace === 'left') {
                    addCssClass(lbl, 'left-label');
                    addCssClass(prog, 'labeled horizontal-label');
                    el.appendChild(lbl);
                    el.appendChild(prog);
                } else if (labelPlace === 'top') {
                    addCssClass(lbl, 'top-label');
                    addCssClass(prog, 'labeled vertical-label');
                    el.appendChild(lbl);
                    el.appendChild(prog);
                } else { // if (labelPlace === 'bottom') {
                    addCssClass(lbl, 'bottom-label');
                    addCssClass(prog, 'labeled vertical-label');
                    el.appendChild(prog);
                    el.appendChild(lbl);
                }
            }
            el.__withLabel__ = true;
            el.__labelPlace__ = labelPlace;
            el.__progress__ = prog;
            el.__label__ = lbl;
        }  else {
            addCssClass(bar, 'no-labeled');
            el.appendChild(bar);
            el.__withLabel__ = false;
            el.__labelPlace__ = 'none';
            prog = el;
        }
        if (h) {
            CSSBoxModel.fullHeight(bar, h);
        }
        if (border) {
            prog.style.border = border;
        }
        if (progBg) {
            prog.style.background = progBg;
        }
        if (bg) {
            el.style.background = bg;
        }
        el.__editable_ = editable;
        el.__$$editing$$__ = false;
        var cls = unboxVal($.className||$.styleName||$.cssName||$['class']);
        var theme = el.__theme_ = unboxVal($.theme)||'';
        addCssClass(el, 'SereniX-progress'
                + (cls ? ' ' + cls : '')
                + (theme ? ' ' + theme : ''));
        el.__bar__ = bar;  
        el.__focusable_ = isUndef($.focusable) ? true : toBool($.focusable);
        setVal(el, bar, progress);
        if ((el.__disabled_ = toBool($.disabled))) {
            addCssClass(el, 'disabled');
        } else if (el.__focusable_) {
            el.setAttribute('tabindex', '0');
        }
        
        if (cssStyle(el).position !== 'absolute') {
            el.style.position = 'relative';
        }
        if (editable) {
            getOrCreateEditInput(el);
        }
        
        el.isFocusable = function() {
            return this.__focusable_;
        };
        
        el.setFocusable = function(focusable) {
            this.__focusable_ = isUndef(focusable) ? true: toBool(focusable);
            if (this.__focusable_ && this.editable && !this.disabled) {
                el.setAttribute('tabindex', '0');
            } else {
                el.removeAttribute('tabindex');
            }
            return this;
        };
        /**
         * 
         * @param {Function} fn
         * @returns {HTMLElement}
         */
        el.removeChangeListener = function(fn) {
            var lsnrs, i;
            if (isArray(lsnrs = this.__changeLsnrs__)) {
                i = lsnrs.indexOf(fn);
                if (i >= 0)
                    lsnrs.splice(i, 1);
            }
            return this;
        };
        /**
         * 
         * @param {Function} fn
         * @returns {HTMLElement}
         */
        el.addChangeListener = function(fn) {
            (this.__changeLsnrs__||(this.__changeLsnrs__ = [])).push(fn);
            return this;
        };
        
        el.__fireChange = function(ev, target) {
            if (!isArray(this.__changeLsnrs__))
                return;
            if (!target) {
                target = this;
            }
            this.__changeLsnrs__.forEach(function(fn) {
                fn.call(target, ev);
            });
        };
        
        addEvt('focus', el, function(ev) {
            if (!el.focusable || !this.editable )
                return;
            edit(this, ev);
            preventDefault(ev||window.event);
        });
        
        addEvt('blur', el, function(ev) {
            if (this.__$$editing$$__ || !this.editable || !this.__input__)
                return;
            this.__edit__.style.display = 'none';
            this.setAttribute('tabindex', '0');
            preventDefault(ev = ev||window.event);
            if (this.__value__ !== (v = parseFloat(this.__input__.value, 10))) {
                ev.oldValue = this.__value__;
                setVal(this, this.__bar__, ev.newValue = v);
                ev.progressElement = ev.progressEl = ev.progress = this.__progressEl__;
                ev.changeTarget = this.__progressEl__;
                if (this.__synchronizer_) {
                    this.__synchronizer_.process(el);
                }
                this.__fireChange(ev);
            }
            
        });
        
        el.getEditMode = function() {
            return this.__editMode_;
        };
        
        el.setEditMode = function(mode) {
            var t;
            if (isUndef(mode = unboxVal(mode)) || mode === '') {
                this.__editMode_ = 'input';
            } else if ((t = typeof mode) === 'string') {
                this.__editMode_ = /^(?:s(?:croll)?|[2-9])/.test(mode) ? 'scroll' : 'input';
            } else if (t === 'number') {
                this.__editMode_ = mode >= 2 ? 'scroll' : 'input';
            } else if (t === 'boolean') {
                this.__editMode_ = mode ? 'input' : 'scroll';
            } else {
                throw new Error('Incorrect argument');
            }
            return this;
        };
        
        el.isEditable = function() {
            return this.inputOwner ? (isUndef(this.inputOwner.editable) ? true : 
                    toBool(this.inputOwner.editable) ? true : this.__editable_) : 
                    this.__editable_;
        };
        
        el.setEditable = function(editable) {
            this.__editable_ = isUndef(editable) ? true : toBool(editable);
            return this;
        };
        
        el.isDisabled = function() {
            return this.__disabled_;
        };
        
        el.setEditable = function(disabled) {
            this.__disabled_ = arguments.length ? toBool(disabled) : true;
            if (this.__disabled_) {
                addCssClass(this, 'disabled');
                this.setAttribute('tabindex', '0');
            } else {
                removeClass(this, 'disabled');
                this.removeAttribute('tabindex');
            }
            return this;
        };
        
        el.isReadOnly = function() {
            return !this.isEditable();
        };
        
        el.setReadOnly = function(readOnly) {
            this.__editable_ = isUndef(readOnly) ? false : !toBool(readOnly);
            return this;
        };
        
        el.removeBarColor = function() {
            this.__bar__.style.backgroundColor = '';
            return this;
        };
        el.unsetBarColor = el.removeBarColor;
        /**
         * 
         * @param {String|Array|Object} color
         * @returns {HTMLElement}
         */
        el.setBarColor = function(color) {
            var c = toColor(color);
            this.__bar__.style.backgroundColor = c ? c : '';
            return this;
        };
        
        
        
        el.getValue = function() {
            return this.__value__;
        };
        /**
         * 
         * @param {Number} val Value representing a percent.
         * <p>min: 0</p>
         * <p>max: 100</p>
         * @returns {undefined}
         */
        el.setValue = function(val) {
            var match, t;
            var bar = this.children[0];
            if ((t = typeof (val = unboxVal(val))) === 'string') {
                if ((match = /^(\d+(?:\.\d+)?)%?$/.exec(val))) {
                    val = parseFloat(match[1], 10);
                    if (val < 0 || val > 100) {
                        throw new TypeError('Incorrect value');
                    }
                } else {
                    throw new TypeError('Incorrect value');
                }
            } else if (t !== 'number' || val < 0 || val > 100) {
                throw new TypeError('Incorrect value');
            }
            setVal(this, bar, val);
            return this;
        };
        
        el.updateUI = function(w, h) {
            var $;
            if (!arguments.length) {
                $ = CSSBoxModel.size(this);
                w = $.width;
                h = $.height;
            } else {
                if (isPlainObj(w)) {
                    h = isUndef(w.height) ? w.h : w.height;
                    w = isUndef(w.width) ? w.w: w.width;
                }
                this.style.width = (w = toPx(w)) + 'px';
                this.style.height = (h = toPx(h)) + 'px';
                this.__bar__.style.height = h + 'px';
            }            
            var  x = CSSBoxModel.size(el);
            w = x.width;
            syncWidth(this, w);
            this.__bar__.style.height = h + 'px';
            return this;
        };
        
        function syncWidth(el, w) {
            if (this.__label__) {
                this.__label__.style.display = ib;
                w -= CSSBoxModel.fullWidth(this.__labelPlace__);
            }
            if (this.__progress__) {
                this.__progress__.style.display = ib;
                CSSBoxModel.fullWidth(this.__progress__, w);
                w = CSSBoxModel.width(this.__progress__);
            } else {
                this.__bar__.style.display = ib;
            }
            CSSBoxModel.fullWidth(this.__bar__, (w * this.value/100));            
        }
        
        el.width = function(w) {
            if (!arguments.length) {
                return CSSBoxModel.width(this);
            }
            CSSBoxModel.width(this, w = toPx(w));
            syncWidth(this, w);
            return this;
        };
        
        el.height = function(h) {
            if (!arguments.length) {
                return CSSBoxModel.height(this);
            }
            CSSBoxModel.height(this, h = toPx(h));
            this.__bar__.style.height = h + 'px';
            return this;
        };
        /**
         * 
         * @returns {Object}
         */
        el.getInputOwner = function() {
            return this.__owner_;
        };
        /**
         * 
         * @param {Object} o
         * @returns {HTMLElement}
         */
        el.setInputOwner = function(o) {
            if (!isPlainObj(o)) {
                throw new Error('Incorrect argument');
            }
            this.__owner_ = o;
            return this;
        };
        /**
         * 
         * @returns {HTMLElement}
         */
        el.stopEditing = function() {
            if (this.__$$editing$$__)
                stopEditing(this);
            return this;
        };
        
        Object.defineProperties(el, {
            'value' : {
                name: 'value',
                get: el.getValue,
                set: el.setValue,
                enumerable: true,
                configurable: true
            },
            inputOwner: {
                name: 'inputOwner',
                get: el.getInputOwner,
                set: el.setInputOwner,
                enumerable: true,
                configurable: false
            },
            disabled : {
                name: 'disabled',
                get: el.isDisabled,
                set: el.setDisabled,
                enumerable: true,
                configurable: true
            },
            editing: {
                name: 'editing',
                get: function() {
                    return this.__$$editing$$__;
                },
                set: function(e) {},
                enumerable: true,
                configurable: true
            },
            focusable: {
                name: 'focusable',
                get: el.isFocusable,
                set: el.setFocusable,
                enumerable: true,
                configurable: true
            },
            editable : {
                name: 'editable',
                get: el.isEditable,
                set: el.setEditable,
                enumerable: true,
                configurable: true
            },
            editMode : {
                name: 'editMode',
                get: el.getEditMode,
                set: el.setEditMode,
                enumerable: true,
                configurable: true
            },
            readOnly : {
                name: 'readOnly',
                get: el.isReadOnly,
                set: el.setReadOnly,
                enumerable: true,
                configurable: true
            },
            readonly : {
                name: 'readonly',
                alias: 'readOnly',
                get: el.isReadOnly,
                set: el.setReadOnly,
                enumerable: true,
                configurable: true
            }
        });
        return el;
    } //end create progress
    
    createProgress.__FUNCTION__ = createProgress;
    
    createProgress.__FUNCTION_NAME__ = createProgress.__NAME__ = 
            'createProgress';
    
    createProgress.__AUTHOR__ = 'Marc KAMGA Olivier';
    createProgress.__CREATOR__ = 'Marc KAMGA Olivier<kamga_marco@yahoo.com;mkamga.olivier@gmail.com>';
    createProgress.__SINCE__ = '2022';
    createProgress.__VERSION__ = '1.0';
    
    if (typeof SereniX.ui.addChild === 'function') {
        SereniX.ui.addChild(createProgress);
    } else {
        SereniX.ui.createProgress = createProgress;
    }
    
    
    return createProgress;
});


