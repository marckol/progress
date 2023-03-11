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



;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }
    
})(this, 'Synchronizer', function() {
    /**
     * <h3>Synchronizer class</h3>
     * <ul>
     * <li>field:  Field to use the value as input of synchronization. 
     * For example, when the value of an input field changed and synchronizer 
     * binded to the field {SereniX.ui.Field object), the synchronization is 
     * fired.</li>
     * <li>applyTo: The elements/objects to synchronize. Each element can have 
     * it's specific variables.</li>
     * <li>variables: Variables used when required evaluation of expressions 
     * during the synchronization.</li>
     * </ul>
     * <p>To launch the synchronization, invoke the instance method named 
     * 'process'.</p>
     * @param {Object} [o] Options object with <b><i>field</i></b>, 
     *      <b><i>applyTo</i></b> and <b><i>variables</i></b> properties.
     * @class SereniX.proc.Synchronizer
     */
    function Synchronizer(o) {
        var x;
        if (isPlainObj(o)) {
            if (o.field)
                this.setField(o.field);
            x = o.applyTo||o.at||o.applyto
                    ||o.updatables||o.updates||o.update||o.elements;
            if (x !== undefined && x !== null) {
                this.setApplyTo(x);
            }
            x = o.variables||o.vars||o.parameters||o.params||o.parms;
            if (x !== undefined && x !== null) {
                this.setVariables(x);
            }
        }
    }

    var p = Synchronizer.prototype;
    
    p.__CLASS__ = Synchronizer.__CLASS__ = Synchronizer;
    
    p.__CLASS_NAME__ = Synchronizer.__CLASS_NAME__ = 
            Synchronizer.__NAME__ = Synchronizer;
    /**
     * 
     * @memberOf SereniX.proc.Synchronizer.prototype
     * @returns {HTMLElement|SereniX.ui.Field|Object}
     */
    p.getField = function() {
        return this.__field_;
    };
    /**
     * 
     * @memberOf SereniX.proc.Synchronizer.prototype
     * @param {HTMLElement|SereniX.ui.Field|Object} f
     * @returns {SereniX.prog.Synchronizer}
     */
    p.setField = function(f) {
        this.__field_ = f;
        return this;
    };
    /**
     * @memberOf SereniX.proc.Synchronizer.prototype
     * @returns {Array}
     */
    p.getApplyTo = function() {
        return this.__applyTo_;
    };
    /**
     * 
     * @memberOf SereniX.proc.Synchronizer.prototype
     * @param {Array|Object|String} at
     * @returns {SereniX.prog.Synchronizer}
     */
    p.setApplyTo = function(at) {
        if (isPlainObj(at = unboxVal(at)) || typeof at === 'string') {
            at = [at];
        } else if (isArray(at)) {
            throw new Error('Incorrect argument');
        }
        this.__applyTo_ = at;
        return this;
    };
    
    p.getVariables = function() {
        return this.__variables_;
    };
    /**
     * 
     * @param {Object|Array} vs  Variables
     * @param {Boolean} [normalize=false]
     * @returns {nm$_serenix_synchronizer.serenix_synchronizerL#54.p}
     */
    p.setVariables = function(vs, normalize) {
        function _getVar(x) {
            if (x === null || /^(number|string|boolean|function|undefined)$/.test(typeof unboxVal(x))) {
                return { type: 'value', value: x };
            }
            var vs = x.value;
            if (isUndef(vs)) {
                if (x.expression) {
                    x.type === 'expression';
                    x.value = x.expression;
                } else {
                    x.type = 'reference';
                    x.name = x.name||x.reference||x.ref;
                }                
            } else if (!x.type) {
                if (x.expression) {
                    x.type = 'expression';
                } else {
                    x.type = 'value';
                }
            }
            return x;
        }
        var map, i, n, x;
        if (isArray(vs)) {
            map = {};
            if (typeof vs[0] === 'string') {
                n = Math.floor(vs.length/2);
                for (i = 0; i < n; i++) {
                    map[x = vs[2*i]] = _getVar(vs[2*i+1]);
                }
            } else {
                vs.forEach(function(x) {
                    map[x.name] = _getVar(x, x.name);
                });  
            }
            
        } else if (isPlainObj(vs)) {
            if (!normalize) {
                map = vs;
            } else {
                map = {};
                for (x in vs) {
                    map[x] = _getVar(vs[x], x);
                }
            }
        } else {
            throw new Error('Incorrect arguments');
        }
        this.__variables_ = map;
        return this;
    };
    
    function getVariables(main, vars) {
        var _vars;
        function copyTo(o, result) {
            for (var k in o) {
                result[k] = o[k];
            }
        }
        if (main) {
            if (!vars)
                return main;
        } else {
            return vars;
        }
        copyTo(main, _vars = {});
        
        copyTo(vars, _vars = {});
        return _vars;
    }
    

    function replace(text, opener, closer, variables, field) {
        var name, i = 0, j, n = text.length, offset = 0, result = '', v;
        for (;;) {
            i = text.indexOf(opener, offset);
            if (i < 0) {
                result += text.substring(offset);
                break;
            }
            if (i >= 0) {
                j = text.indexOf(closer, i + opener.length);
                if (j < 0) {
                    result += text.substring(offset);
                    break;
                } else {
                    name = text.substring(i + opener.length, j).trim();
                    if (name === 'this') {
                        result += fieldValue(field);
                    } else {
                        v = variables[name];
                        if (typeof v.getValue === 'function') {
                            result += v.getValue();
                        } else if (typeof v.value === 'function') {
                            result += v.value();
                        } else if (typeof v.val === 'function') {
                            result += v.val();
                        } else if (v.operator) {
                            throw new Error('Not yet supported');
                        } else if (Object.keys(v).indexOf('value') >= 0) {
                            result += v.value;
                        } else {
                            result += v;
                        }
                    }
                    i = offset = j + closer.length;
                    if (i >= n) {
                        break;
                    }
                }
            } else {
                result += text.substring(offset, i = offset + opener.length);
                if (i >= n) {
                    break;
                }
                offset = i;
            }
        }
        return result;
    }
    
    function getFieldValue(field) {
        return typeof field.getValue === 'function' ? field.getValue() : 
                typeof field.val === 'function' ? field.val() : 
                typeof field.value === 'function' ? field.value() : field.value;
    }
    /**
     * 
     * @returns {Function}
     */
    p.getFieldValue = function() {
        return this.__fieldValue_;
    };
    
    function valFunc(fv, name) {
        function val() {
            return val.fn.call(val.o);
        }
        val.o= fv;
        val.fn = fv[name];
        return val;
    }
    /**
     * 
     * @param {Function|Object} fieldValue
     * @returns {SereniX.proc.Synchronizer}
     */
    p.setFieldValue = function(fieldValue) {
        var fv = fieldValue;
        if (typeof fv === 'function' || fv instanceof Function) {
            this.__fieldValue_ = fv;
            return this;
        } else if (isPlainObj(fv)) {
            if (typeof fv.value === 'function') {
                return valFunc(fv, 'value');
            }
            if (typeof fv.getValue === 'function') {
                return valFunc(fv, 'getValue');
            }
        }
        throw new Error('Incorrect argument');
    };
    
    function childIndex(parent, child) {
        var children = parent.children, n = children.length, i = 0;
        for(;i < n; i++) {
            if (children[i] === child)
                return i;
        }
        return -1;
    }
    /**
     * 
     * @memberOf SereniX.proc.Synchronizer.prototype
     * @param {HTMLElement|SereniX.ui.Field|Object} [field=this.field]
     */
    p.process = function(field) {
        var applyTo = this.applyTo;
        var opener;
        var closer;
        var updatable, tag, _at;
        
        field = field||this.getField();
        function update(str, html) {
            var name;
            if ((name = _at.setField||_at.valueField||_at.valueFieldName||_at.fieldName)) {
                updatable[name] = str;
            } else if ((name = _at.setter||_at.setMethod||_at.setterMethod
                    ||_at.valueMethod||_at.valueFuncName||_at.valueFunctionName)) {
                updatable[name](str);
            } else if (isDOMElt(updatable)) {
                tag = (updatable.tagName||updatable.nodeName).toLowerCase();
                if (/^(input|textarea)$/.test(tag)) {
                    updatable.value = str;
                } else if (html) {
                    updatable.innerHTML = str;
                } else {
                    updatable.innerHTML = escapeHTML(str);
                }                            
            } else if (typeof updatable.setValue === 'function') {
                updatable.setValue(str);
            } else if (typeof updatable.value === 'function') {
                updatable.value(str);
            } else if (typeof updatable.val === 'function') {
                updatable.val(str);
            } else {
                updatable.value = str;
            }
        }
        if (!applyTo )
            return;
        if (!isArray(applyTo)) {
            applyTo = [applyTo];
        }
        function getUpdatable(updatable) {
            var x, t, e;
            if (typeof updatable === 'string') {
                if ((match = /^\[\[([^\[\]]+)\]\]$/.exec(updatable))) {
                    match = match[1].trim();
                    x = field.label;
                    if (match === 'label') {
                        if (isDOMElt(field) && !x) {
                            parent = field.parentElement;
                            i = childIndex(parent, field) - 1;
                            if (i >= 0) {
                                x = parent.children[i];
                            }
                        } else {

                        }
                    } else if (/^prev(?:ious)?(?:-?same-?level)(?:-?(?:sibling|element))?$/i.test(match)) {
                        if (isDOMElt(field) && !x) {
                            parent = field.parentElement;
                            i = childIndex(parent, field) - 1;
                            if (i >= 0) {
                                return parent.children[i];
                            }
                        } else {
                            throw new Error('Not yet supported: only applied to HTML element');
                        }
                    } else if (/^next(?:-?same-?level)(?:-?sibling|element)?$/i.test(match)) {
                        if (isDOMElt(field) && !x) {
                            parent = field.parentElement;
                            return parent.children[childIndex(parent, field) + 1];
                        } else {
                            throw new Error('Not yet supported: only applied to HTML element');
                        }
                    } else if (/^prev(?:ious)?(?:-?(?:sibling|element))?$/i.test(match)) {
                        if (isDOMElt(field) && !x) {
                            parent = field.parentElement;
                            i = childIndex(parent, field) - 1;
                            if (i >= 0) {
                                return parent.children[i];
                            } else {
                                //TODO: go to parent previous sibling/element and process
                                throw new Error('Not yet supported');
                            }
                        } else {
                            throw new Error('Not yet supported: only applied to HTML element');
                        }
                    } else if (/^next(?:-?sibling|element)?$/i.test(match)) {
                        if (isDOMElt(field) && !x) {
                            parent = field.parentElement;
                            i = childIndex(parent, field) + 1;
                            if (i < parent.children.length) {
                                return parent.children[i];
                            } else {
                                //TODO: go to parent next sibling/element and process
                                throw new Error('Not yet supported');
                            }
                        } else {
                            throw new Error('Not yet supported: only applied to HTML element');
                        }
                    }
                } else {
                    el = document.getElementById(updatable);
                    if (!el)
                        throw new Error('HTML element not found: ' + updatable);
                    return el;
                }
            } else if (isArray(updatable)) {
                throw new Error('Not yet supported');
            } else if (isPlainObj(updatable)) {
                if ((t = typeof (x = unboxVal(updatable.selector))) === 'string') {
                    
                } else if (t === 'function') {
                    return updatable.selector();
                } else if (typeof (x = unboxVal(updatable.id)) === 'string' && x) {
                    e = document.getElementById(updatable.id);
                    if (e)
                        return e;
                    throw new Error('HTML element not found: ' + updatable.id);
                } else if (typeof (x = unboxVal(updatable.field)) === 'string' && x) {
                    throw new Error('Not yet supported');
                } else if (typeof updatable.setValue === 'function' || typeof updatable.value === 'function') {
                    return updatable;
                } else {
                    throw new Error('Not yet supported');
                }
            }
        }
        
        function _setDom(updatable, at, prefix, sufix, val, field) {
            var match, el, x, parent, i, children;
            var tag = (updatable.tagName||updatable.nodeName).toLowerCase();
            if (/^(input|textarea)$/.test(tag)) {
                updatable.value = (prefix||'') + val + (sufix||'');
            } else if (at.html || at.htmlText) {
                updatable.innerHTML = (prefix||'') + (at.htmlValue ? '' + val : escapeHTML('' + val)) + (sufix||'');
            } else {
                updatable.innerHTML = escapeHTML((prefix||'') + val + (sufix||''));
            }
        }
        
        function _concat(updatable, at, prefix, sufix, val) {
            if (typeof updatable.setValue === 'function') {
                updatable.setValue((prefix||'') + val + (sufix||''));
            } else if (typeof updatable.value === 'function') {
                updatable.value((prefix||'') + val + (sufix||''));
            } else if (isDOMElt(updatable)) {
                _setDom(updatable, at, prefix, sufix, val, field);
            } else {
                updatable.value = ((prefix||'') + val + (sufix||''));
            }
        }
        //get the main variables
        var vars = this.getVariables();
        
        var fieldValue = this.fieldValue||getFieldValue;
        
        applyTo.forEach(function(at) {
            var delims = /[ \t*\/\\=?<>,\.:;\{\}\[\]\(\)!@#$%&|+-]/;
            var text, variables, prefix, sufix, expr, val, i, n;
            if (typeof at === 'function') {
                at();
            } else if (isPlainObj(_at = at)) {
                updatable = getUpdatable(at.updatable||at.updateable||at.field||at.element);
                if (typeof SereniX.TextPattern === 'function' && (text = at.text) instanceof SereniX.TextPattern) {
                    throw new Error('Not yet supported');
                } else if (text) {
                    n = text.length; i = 0;
                    variables = getVariables(vars, at.variables);
                    opener = this.variableOpener;
                    closer = this.variableCloser;
                    if (!opener) {
                        update(replace(text, '((', '}}', variables, field), at.html);
                    } else if (!closer) {
                        closer = '';
                        throw new Error('Not yet supported');
                    } else {
                        update(replace(text, opener, closer, variables, field, at.html), at.html);
                    }                
                } else {
                    val = fieldValue(field);
                    prefix = at.prefix;
                    sufix = at.sufix||at.suffix;
                    if (prefix || sufix) {
                        if (val === undefined || val === null)
                            val = '';
                        if ((expr = at.variable)) {
                            throw new Error('Not yet supported');
                        } else if (typeof (expr = at.expression||at.formula||at.calc) === 'function') {
                            throw new Error('Not yet supported');
                        } else if (typeof expr === 'string') {
                            throw new Error('Not yet supported');
                        } else if (isPlainObj(expr)) {
                            throw new Error('Not yet supported');
                        } else {                        
                            if (isDOMElt(updatable)) {
                                _setDom(updatable, at, prefix, sufix, val);                            
                            } else if ((name = at.setter||at.setMethod||at.valueMethod)) {
                                updatable[name]((prefix||'') + val + (sufix||''));
                            } else if ((name = at.setFieldName||at.valueField||at.valueFieldName||at.setField)) {
                                updatable[name] = (prefix||'') + val + (sufix||'');
                            } else if (typeof updatable.setValue === 'function') {
                                updatable.setValue((prefix||'') + val + (sufix||''));
                            } else if (isArray(updatable = getUpdatable(updatable))) {
                                updatable.forEach(function(u) {
                                    throw new Error('Not yet supported');
                                });
                            } else {
                                _concat(updatable, at, prefix, sufix, val);
                            }
                        }
                    } else {
                        
                    }
                }
            }
        });
    };
    
    var props = {
        /**
         * @memberOf Serenix.proc.Synchronizer.prototype
         * @property {HTMLElement|SereniX.ui.Field|Object} field  Field to use 
         * the value as input of synchronization. 
         * <p><b>Note</b>: Field can be an HTML element, an instance of 
         * SereniX.ui.Field or any plain object with a method named 'getValue' or 
         * a method named 'value' or a field named 'value'.</p>
         */
        field: {
            name: 'field',
            get: p.getField,
            set: p.setField
        },
        /**
         * @memberOf Serenix.proc.Synchronizer.prototype
         * @property {Array} applyTo  List of objects (HTML elements, fields,
         *  plain object) on which apply the synchronisation ( update when 
         *  executing the non static method named 'process').
         *  <p>Elements of the list can be:</p>
         *  <ul>
         *  <li>HTMLElement</li>
         *  <li>string: </li>
         *  <li>Object</li>
         *  </ul>
         */
        applyTo: {
            name: 'applyTo',
            get: p.getApplyTo,
            set: p.setApplyTo
        },
        /**
         * @memberOf Serenix.proc.Synchronizer.prototype
         * @property {Function} variables  Variables that can be used when 
         * evaluationg expressions
         */
        variables: {
            name: 'variables',
            get: p.getVariables,
            set: p.setVariables
        },
        /**
         * @memberOf Serenix.proc.Synchronizer.prototype
         * @property {Function} fieldValue  Function that get/return the value 
         * of a field.
         * <p><b>Note</b>: A field can be and HTMLElement, and instance of  
         * SereniX.ui.Field or a plain object with a method named 'getValue' or 
         * a method named 'value' or a field named 'value'.</p>
         */
        fieldValue: {
            name: 'fieldValue',
            get: p.getFieldValue,
            set: p.setFieldValue
        }
    };
    
    Object.defineProperties(p, props);
    
    p.__definedProperties__ = props;
    
    var propsList = p.__definedPropertiesList__ = [];
    
    for (var name in props) {
        propsList.push(props[name]);
    }
    
    if (typeof SereniX.proc.addChild === 'function') {
        SereniX.proc.addChild(Synchronizer);
    } else {
        SereniX.proc.Synchronizer = Synchronizer;
    }
    
    SereniX.proc.Setter = Synchronizer;

    return Synchronizer;

});