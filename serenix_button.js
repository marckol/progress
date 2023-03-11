;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'createButton', function() {
    var doc = document;
    function size(w) {
        if (typeof w === 'number') return w + 'px';
        if (typeof w === 'string' && w) {
            if (!w.endsWith('%')) {
                w = "";
            } 
            w = /^\d+(?:\.\d+){a-zA-Z]$/.test(w) ? w : parseFloat(w) + 'px';
        } else if (typeof w === 'object' && w) {
            var v = coalesce(w, ["width", "height", 'size', 'dimension']),
                u = w.unit||w.Unit;
            w = v ? v + (u||'px') : undefined;
        } else {
            w = undefined;
        }
        return w;
    }
    /**
     * 
     * @private
     * @param {String|Object} [b]  Button name or image text when the argument is of type string or button definition/metadata when the argument is an aobject.
     * @param {String|Object} [lbl] Label string when the argument is a string or label object
     * @param {Number|String} [w] The width of the button
     * @param {Number|String} [h] The height of the button
     * @param {Boolean} [iconBefore]
     * @returns {Element}
     */
    function createButton(b, lbl, w, h, iconBefore) {
        var name, img, caption, imgBefore, 
            tag = createButton.tag, btnClass, action;
        if (!arguments.length) {
            b = doc.createElement(tag||(tag = 'span'));
            if (tag.toLowerCase() === 'a') {
                b.href = '#';
                b.style.textDecoration = 'none';
                b.style.textAlign  = "center"; 
            }
            b.style.display = "inline-block";
            addCssClass(b, 'Serenix-button');
            return b;
        }
        if (arguments.length === 1) {
            if (isPlainObj(unboxVal(b))) {
                name = b.name||b.Name||"";
                lbl = b;
                w = b.width;
                h = b.height;
                tag = b.tagName||b.tag||b.nodeName||createButton.tag;
                btnClass = unboxVal(b.className);
                if (btnClass === undefined || btnClass === null) {
                    btnClass = unboxVal(b.cssName);
                    if (btnClass === undefined || btnClass === null) {
                        btnClass = unboxVal(b.styleName);
                        if (btnClass === undefined || btnClass === null) {
                            btnClass = unboxVal(b.buttonClass);
                            if (btnClass === undefined || btnClass === null) {
                                btnClass = unboxVal(b.btnClass);
                            }
                        }
                    }
                }
                action = unboxVal(b.action);
                if (isPlainObj(action)) {
                    var fn = action.fire||action.exec||action.handle||action.launch||action.trigger;
                    if (typeof fn === 'function' || fn instanceof Function) {
                        action = (function() {
                            function fire(ev) {
                               fire.fn.call(fire.own, ev);
                            }
                            fire.own = action;
                            fire.fn = fn;
                            return fire;
                        })();
                    } else {
                        action = undefined;
                    }
                } else if (typeof action !== 'function') {
                    action = undefined;
                }
            } else {
                lbl = name = b;
                name = lbl && typeof lbl === 'object' ? lbl.name||lbl.Name : undefined;
            }
        } else if (typeof (lbl = unboxVal(lbl)) === 'number') {
            name = b;
            h = w;
            w = lbl;
            lbl = name;
            iconBefore = arguments[3];
        } else if (!lbl) {
            lbl = name;
        }

        w = size(w);
        h = size(h);

        if (lbl instanceof String) {
            lbl = lbl.valueOf();
        }
        function button(lbl) {
            var t;
            a = doc.createElement(tag||(tag = 'a'));
            if ((t = tag.toLowerCase()) === 'a') {
                a.style.textDecoration = "none";
                a.style.textAlign  = "center";                                
                a.href = '#';
            } else if (!['button', 'input'].contains(t)) {
                a.tabIndex = 0;
                a.setAttribute('tabindex', '0');
            }
            a.style.display = "inline-block";
            a.innerHTML = lbl;
            return a;
        }
        function toLength(w) {
            var t, x;
            if ((t = typeof w) === 'number')
                return w + 'px';
            if (t === 'string') {
                x = /^([+-]?)(\d+(?:\.\d+)?)[ \t]*(px|pt|pc|mm|cm|mozmm|Q|in|em|ex|ch|rem|lh|vw|vh|vmin|vmax|%)$/.exec(w);
                if (x)
                    return (x[1] === '-' ? '-' : '' ) + x[1] + (x[2]||'px');
                return;
            }
            return '';
        } 
        function strImg(img) {
            if (img.indexOf('<svg ') >= 0) {
                return "<span class=\"image\" style=\"display:inline-block;\">" + img + "</span>";
            } else if (/^[<>+-]$/.test(img)) {
                return '<b>' + img + '</b>';
            } else {
                return /^(?:&|<b>|<i>|<s>|<strike>|<u>)/.test(img) ? img :
                        "<img class=\"image\" src=\"" + img + "\"/>";
            }
        }
        function _image(img) {
            var src, w, h, cls, alt;
            if (typeof img === 'string') {
                return strImg(img);
            } else if (isPlainObject(img)) {
                src = unboxVal(img.src||img.url||img.path);
                if (!src)
                    return;
                alt = unboxVal(img.alt);
                cls = unboxVal(img.className||img.cssName||img.styleName||img['class']);
                w = toLength(unboxVal(img.width == undefined ? img.w : img.width));
                h = toLength(unboxVal(img.height == undefined ? img.h : img.height));
                //if not alt text and no class and w is undefined (equals to 
                //undefined or equals to null) and h is undefined
                if (!alt && !cls && w == undefined && h == undefined) {
                    return strImg(src);
                }
                
                return "<img class=\"image" 
                        + (cls ? ' ' + cls : '') + "\"" 
                        + " src=\"" + src + "\"" 
                        + (alt ? " alt=\"" + alt + "\"" : "")
                        + (w ? " width=\"" + w + "\"" : "")
                        + (h ? " height=\"" + h + "\"" : "")
                        + "/>";
            }
        }
        function _html(s) {
            var t;
            return typeof s === 'string' ? escapeHTML(s) : 
                    !s ? "" : typeof s.html === 'string' ? s.html : 
                            (t = s.text||s.Text||s.label||s.caption||s.title||s.Label||s.Caption||s.Title||"", 
                                    s.html ? t : escapeHTML(t));
        }
        var  a;
        if (!lbl) {
            a = button("");
        } else if (isPlainObject(lbl)) {
            img = lbl.image||lbl.img||lbl.icon||lbl.Image||lbl.Img||lbl.Icon;
            caption = lbl.caption||lbl.label||lbl.title||lbl.text||lbl.Caption||lbl.Label||lbl.Title||lbl.Text;
            if (img instanceof String) {
                img = img.valueOf();
            }
            if (img) {
                imgBefore = coalesce(lbl, [ 'imageBefore', 'imgBefore', 'iconBefore', 'ImageBefore', 'ImgBefore', 'IconBefore' ]);
                if (imgBefore === undefined) {
                        imgBefore = coalesce(lbl, [ 'imageAfter', 'imgAfter', 'iconAfter', 'ImageAfter', 'ImgAfter', 'IconAfter' ]);
                        if (imgBefore !== undefined) {
                            imgBefore = imgBefore === null ? true : typeof toBool === 'function' ? !toBool(imgBefore) : !imgBefore;
                        } else {
                            imgBefore = imgBefore === null ? true : typeof toBool === 'function' ? toBool(imgBefore) : imgBefore;
                        }
                }
                lbl = caption||"";
                a = button(imgBefore ? _image(img) + _html(caption) : _html(caption) + _image(img));
            } else {
                lbl = caption||lbl.name||lbl.Name||'';
                a = button(typeof lbl.html === 'string' ? lbl.html : lbl.html ? caption : escapeHTML(caption));
            }
        } else if (lbl.indexOf('<svg') >= 0) {
                a = doc.createElement('div');
                //a.style.display = "inline-block";
                a.style.margin  = '0px';
                a.style.padding  = '0px';
                a.style.border  = '0px';
                a.innerHTML = lbl;
        }  else {
           a = button(escapeHTML(lbl));
        }
        if (w) {
            a.style.width = w;
        }
        if (h) {
            a.style.height = h;
        }
        //reauires serenix_css_base.js
        addCssClass(a, 'SereniX-button' + (btnClass ? ' ' + btnClass : ''));
        if (name) {
            a.name = name;
        }
        //reauires serenix_base_evt.js
        if (action) bindAction(a, action);
        return a;
    }

    return createButton;
});