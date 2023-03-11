function isPlainObj(o) {
	return Object.prototype.toString.call(o) === '[object Object]';
}

function isArray(a) {
    return Array.isArray(a);
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
        return {};
    });
}

(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
            module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
            define([name], factory);
    } else {
            root[name] = factory();
    }
	
})(this, 'KeyboardEvents', function() {
    
    function getChar(ev) {
        var key = ev.key;
        if (!key || ev.ctlKey)
            return;
        return ev.shiftKey ? key.toUpperCase() : key.toLowerCase();
    }
	
	
	var ff = /firefox/i.test(((typeof inBrowser !== 'undefined' ? inBrowser : typeof window !== 'undefined') && window.navigator.userAgent)||"");
	var ffRe = new RegExp(' The event.which value is (\\d+)(?:\\(no value\\))? in Firefox(?:. Also FF provides the code value as, ([a-zA-Z]+))?$');
	var keyboard = [
		//'KEY NAME', 'EVENT.WHICH', 'EVENT.KEY', 'EVENT.CODE', 'NOTES',
		'backspace', '8', 'Backspace', 'Backspace', '',
		'tab', '9', 'Tab', 'Tab', '',
		'enter', '13', 'Enter', 'Enter', '',
		'shift(left)', '16', 'Shift', 'ShiftLeft', 'event.shiftKey is true',
		'shift(right)', '16', 'Shift', 'ShiftRight', 'event.shiftKey is true',
		'ctrl(left)', '17', 'Control', 'ControlLeft', 'event.ctrlKey is true',
		'ctrl(right)', '17', 'Control', 'ControlRight', 'event.ctrlKey is true',
		'alt(left)', '18', 'Alt', 'AltLeft', 'event.altKey is true',
		'alt(right)', '18', 'Alt', 'AltRight', 'event.altKey is true',
		'pause/break', '19', 'Pause', 'Pause', '',
		'caps lock', '20', 'CapsLock', 'CapsLock', '',
		'escape', '27', 'Escape', 'Escape', '',
		'space', '32', ' ', 'Space', 'The event.key value is a single space.',
		'page up', '33', 'PageUp', 'PageUp', '',
		'page down', '34', 'PageDown', 'PageDown', '',
		'end', '35', 'End', 'End', '',
		'home', '36', 'Home', 'Home', '',
		'left arrow', '37', 'ArrowLeft', 'ArrowLeft', '',
		'up arrow', '38', 'ArrowUp', 'ArrowUp', '',
		'right arrow', '39', 'ArrowRight', 'ArrowRight', '',
		'down arrow', '40', 'ArrowDown', 'ArrowDown', '',
		'print screen', '44', 'PrintScreen', 'PrintScreen', '',
		'insert', '45', 'Insert', 'Insert', '',
		'delete', '46', 'Delete', 'Delete', '',
		'0', '48', '0', 'Digit0', '',
		'1', '49', '1', 'Digit1', '',
		'2', '50', '2', 'Digit2', '',
		'3', '51', '3', 'Digit3', '',
		'4', '52', '4', 'Digit4', '',
		'5', '53', '5', 'Digit5', '',
		'6', '54', '6', 'Digit6', '',
		'7', '55', '7', 'Digit7', '',
		'8', '56', '8', 'Digit8', '',
		'9', '57', '9', 'Digit9', '',
		'a', '65', 'a', 'KeyA', '',
		'b', '66', 'b', 'KeyB', '',
		'c', '67', 'c', 'KeyC', '',
		'd', '68', 'd', 'KeyD', '',
		'e', '69', 'e', 'KeyE', '',
		'f', '70', 'f', 'KeyF', '',
		'g', '71', 'g', 'KeyG', '',
		'h', '72', 'h', 'KeyH', '',
		'i', '73', 'i', 'KeyI', '',
		'j', '74', 'j', 'KeyJ', '',
		'k', '75', 'k', 'KeyK', '',
		'l', '76', 'l', 'KeyL', '',
		'm', '77', 'm', 'KeyM', '',
		'n', '78', 'n', 'KeyN', '',
		'o', '79', 'o', 'KeyO', '',
		'p', '80', 'p', 'KeyP', '',
		'q', '81', 'q', 'KeyQ', '',
		'r', '82', 'r', 'KeyR', '',
		's', '83', 's', 'KeyS', '',
		't', '84', 't', 'KeyT', '',
		'u', '85', 'u', 'KeyU', '',
		'v', '86', 'v', 'KeyV', '',
		'w', '87', 'w', 'KeyW', '',
		'x', '88', 'x', 'KeyX', '',
		'y', '89', 'y', 'KeyY', '',
		'z', '90', 'z', 'KeyZ', '',
		'left window key', '91', 'Meta', 'MetaLeft', 'event.metaKey is true',
		'right window key', '92', 'Meta', 'MetaRight', 'event.metaKey is true',
		'select key (Context Menu)', '93', 'ContextMenu', 'ContextMenu', '',
		'numpad 0', '96', '0', 'Numpad0', '',
		'numpad 1', '97', '1', 'Numpad1', '',
		'numpad 2', '98', '2', 'Numpad2', '',
		'numpad 3', '99', '3', 'Numpad3', '',
		'numpad 4', '100', '4', 'Numpad4', '',
		'numpad 5', '101', '5', 'Numpad5', '',
		'numpad 6', '102', '6', 'Numpad6', '',
		'numpad 7', '103', '7', 'Numpad7', '',
		'numpad 8', '104', '8', 'Numpad8', '',
		'numpad 9', '105', '9', 'Numpad9', '',
		'multiply', '106', '*', 'NumpadMultiply', '',
		'add', '107', '+', 'NumpadAdd', '',
		'subtract', '109', '-', 'NumpadSubtract', '',
		'decimal point', '110', '.', 'NumpadDecimal', '',
		'divide', '111', '/', 'NumpadDivide', '',
		'f1', '112', 'F1', 'F1', '',
		'f2', '113', 'F2', 'F2', '',
		'f3', '114', 'F3', 'F3', '',
		'f4', '115', 'F4', 'F4', '',
		'f5', '116', 'F5', 'F5', '',
		'f6', '117', 'F6', 'F6', '',
		'f7', '118', 'F7', 'F7', '',
		'f8', '119', 'F8', 'F8', '',
		'f9', '120', 'F9', 'F9', '',
		'f10', '121', 'F10', 'F10', '',
		'f11', '122', 'F11', 'F11', '',
		'f12', '123', 'F12', 'F12', '',
		'num lock', '144', 'NumLock', 'NumLock', '',
		'scroll lock', '145', 'ScrollLock', 'ScrollLock', '',
		'audio volume mute', '173', 'AudioVolumeMute', '', '⚠️ The event.which value is 181 in Firefox. Also FF provides the code value as, VolumeMute',
		'audio volume down', '174', 'AudioVolumeDown', '', '⚠️ The event.which value is 182 in Firefox. Also FF provides the code value as, VolumeDown',
		'audio volume up', '175', 'AudioVolumeUp', '', '⚠️ The event.which value is 183 in Firefox. Also FF provides the code value as, VolumeUp',
		'media player', '181', 'LaunchMediaPlayer', '', '⚠️ The ️event.which value is 0(no value) in Firefox. Also FF provides the code value as, MediaSelect',
		'launch application 1', '182', 'LaunchApplication1', '', '⚠️ The ️event.which value is 0(no value) in Firefox. Also FF provides the code value as, LaunchApp1',
		'launch application 2', '183', 'LaunchApplication2', '', '⚠️ The ️event.which value is 0(no value) in Firefox. Also FF provides the code value as, LaunchApp2',
		'semi-colon', '186', ';', 'Semicolon', '⚠️ The event.which value is 59 in Firefox',
		'equal sign', '187', '=', 'Equal', '⚠️ The event.which value is 61 in Firefox',
		'comma', '188', ',', 'Comma', '',
		'dash', '189', '-', 'Minus', '⚠️ The event.which value is 173 in Firefox',
		'period', '190', '.', 'Period', '',
		'forward slash', '191', '/', 'Slash', '',
		'Backquote/Grave accent', '192', '`', 'Backquote', '',
		'open bracket', '219', '[', 'BracketLeft', '',
		'back slash', '220', '\\', 'Backslash', '',
		'close bracket', '221', ']', 'BracketRight', '',
		'single quote', '222', "'", 'Quote', ''
	];
	var _keys = {}, whiches = {};
        var whichNames = {};
	var pressedKeys = {};
	var map = {
            ctl: 'Control',
            ctrl: 'Control',
            Ctl: 'Control',
            Ctrl: 'Control',
            control: 'Control',
            Control: 'Control',
            shift: 'Shift',
            Shift: 'Shift',
            alt: 'Alt',
            Alt: 'Alt',
            'alt gr': 'AltGr',
            altgr: 'AltGr',
            'Alt Gr': 'AltGr',
            'AltGr': 'AltGr',
            'Altgr': 'AltGr',
            'up': 'ArrowUp',
            'Up': 'ArrowUp',
            'down': 'ArrowDown',
            'Down': 'ArrowDown',
            'left': 'ArrowLeft',
            'Left': 'ArrowLeft',
            'right': 'ArrowRight',
            'Right': 'ArrowRight',
            maj: 'Shift',
            Maj: 'Shift',
            meta: 'Meta',
            META: 'Meta',
            Meta: 'Meta'
	};
	var res = {
            ctrl: /^(shift|alt(?:[ ]?gr)?)(\s*\+\s*)?/i,
            shift: /^(ctl|ctrl|control|alt(?:[ ]?gr)?)(\s*\+\s*)?/i,
            alt: /^(ctl|ctrl|control|shift)(\s*\+\s*)?/i,
            ControlShift : /alt[ ]*gr/i,
            ControlAlt : /shift/i,
            ShiftAlt : /ctl|ctrl|control/i,
            ControlAltGr : /shift/i,
            ShiftAltGr : /ctl|ctrl|control/i
	};
	res.ctl = res.control = res.Control = res.ctrl;
	res.Shift = res.shift;
	res.Alt = res.alt;
	res.ShiftControl = res.ControlShift;
	res.AltControl = res.ControlAlt;
	res.AltShift = res.ShiftAlt;
	res.AltGrShift = res.ShiftAltGr;
	
	var keyCodes = {
            backspace: 8,
            backSpace: 8,
            tab: 9,
            enter: 13,
            entree: 13,
            entrée: 13,
            shiftleft: 16,
            shiftright: 16,
            shift: 16,
            maj: 16,
            Maj: 16,
            ctrlleft: 17,
            ctrlright: 17,
            ctrl: 17,
            altleft: 18,
            altright: 18,
            shiftLeft: 16,
            shiftRight: 16,
            ctrlLeft: 17,
            ctrlRight: 17,
            altLeft: 18,
            altRight: 18,
            pause: 19,
            capslock: 20,
            capsLock: 20,
            escape: 27,
            esc: 27,
            echap: 27,
            "échap": 27,
            pageup: 33,
            pagedown: 34,
            pageUp: 33,
            pageDown: 34,
            "page Up": 33,
            "page Down": 34,
            "page up": 33,
            "page down": 34,
            end: 35,
            home: 36,
            arrowleft: 37,
            arrowup: 38,
            arrowright: 39,
            arrowdown: 40,
            arrowLeft: 37,
            arrowUp: 38,
            arrowRight: 39,
            arrowDown: 40,
            insert: 45,
            delete: 46,
            del: 46,
            suppr: 46,
            0: 48,
            1: 49,
            2: 50,
            3: 51,
            4: 52,
            5: 53,
            6: 54,
            7: 55,
            8: 56,
            9: 57,
            a: 65,
            b: 66,
            c: 67,
            d: 68,
            e: 69,
            f: 70,
            g: 71,
            h: 72,
            i: 73,
            j: 74,
            k: 75,
            l: 76,
            m: 77,
            n: 78,
            o: 79,
            p: 80,
            q: 81,
            r: 82,
            s: 83,
            t: 84,
            u: 85,
            v: 86,
            w: 87,
            x: 88,
            y: 89,
            z: 90,
            metaleft: 91,
            metaright: 92,
            metaLeft: 91,
            metaRight: 92,
            "meta left": 91,
            "meta right": 92,
            "meta Left": 91,
            "meta Right": 92,
            select: 93,
            "select(Context Menu)": 93,
            "Context Menu": 93,
            "Context menu": 93,
            "context Menu": 93,
            "context menu": 93,
            numpad0: 96,
            numpad1: 97,
            numpad2: 98,
            numpad3: 99,
            numpad4: 100,
            numpad5: 101,
            numpad6: 102,
            numpad7: 103,
            numpad8: 104,
            numpad9: 105,
            numpadmultiply: 106,
            numpadadd: 107,
            numpadsubtract: 109,
            numpaddecimal: 110,
            numpaddivide: 111,
            numpad_0: 96,
            numpad_1: 97,
            numpad_2: 98,
            numpad_3: 99,
            numpad_4: 100,
            numpad_5: 101,
            numpad_6: 102,
            numpad_7: 103,
            numpad_8: 104,
            numpad_9: 105,
            "numpad 0": 96,
            "numpad 1": 97,
            "numpad 2": 98,
            "numpad 3": 99,
            "numpad 4": 100,
            "numpad 5": 101,
            "numpad 6": 102,
            "numpad 7": 103,
            "numpad 8": 104,
            "numpad 9": 105,
            numpad_multiply: 106,
            "numpad multiply": 106,
            "numpad *": 106,
            numpad_add: 107,
            "numpad_plus": 107,
            "numpad add": 107,
            "numpad plus": 107,
            "numpad +": 107,
            numpad_subtract: 109,
            "numpad subtract": 109,
            numpad_minus: 109,
            "numpad minus": 109,
            "numpad -": 109,
            numpad_decimal: 110,
            numpad_dot: 110,
            "numpad decimal": 110,
            "numpad dot": 110,
            numpad_divide: 111,
            "numpad /": 111,
            multiply: 106,
            times: 106,
            add: 107,
            plus: 107,
            subtract: 109,
            decimal: 110,
            dot: 110,
            divide: 111,
            f1: 112,
            f2: 113,
            f3: 114,
            f4: 115,
            f5: 116,
            f6: 117,
            f7: 118,
            f8: 119,
            f9: 120,
            f10: 121,
            f11: 122,
            f12: 123,
            numlock: 144,
            scrolllock: 145,
            semicolon: 186,
            equalsign: 187,
            comma: 188,
            minus: 189,
            period: 190,
            slash: 191,
            "/": 191,
            backquote: 192,
            bracketleft: 219,
            bracketLeft: 219,
            backslash: 220,
            braketright: 221,
            braketRight: 221,
            "open bracket": 219,
            "close bracket": 221,
            "open Bracket": 219,
            "close Bracket": 221,
            "openbracket": 219,
            "closebracket": 221,
            "openBracket": 219,
            "closeBracket": 221,
            quote: 222,
            asciisemicolon: 59,
            asciiSemicolon: 59,
            asciiSemiColon: 59,
            ascii_semicolon: 59,
            'break': 19
	};
	
	/**
	 * <h3>KeyboardEvents class </h3>
	 * Class to manage combined keyboard events.
         * @static
	 * @class SereniX.KeyboardEvents
	 */
	function KeyboardEvents() {
	}
	
	var E = KeyboardEvents;
	
	E.__CLASS__ =  E.prototype.__CLASS__ = KeyboardEvents;
	
	E.__CLASS_NAME__ =  E.prototype.__CLASS_NAME__ =  "KeyboardEvents";
	
	function def(name, prop) {
            Object.defineProperty(E, name, prop);
	};
	
	(function() {
            for (var i = 0; i < 10; i++) {
                keyCodes["digit " + i ] = keyCodes["digit" + i ] = keyCodes[i];
            }
	})();
	
	
	(function() {
            var letters = "abcdefghijklmnopqrstuvwxyz", n = letters.length, ch, u;
            for (var i = 0; i < n; i++) {
                ch = letters[i];
                u = ch.toUpperCase();
                keyCodes["key " + ch] = keyCodes["key" + ch] = 
                keyCodes["key " + u] = keyCodes["key" + u] = 
                keyCodes[u] = keyCodes[ch];
            }
	})();
	
	keyboard = (function() {
            var match;
            var kbs = {}, 
                key, keyName, o, 
                which, 
                code, 
                notes;
            var i = 0, n = keyboard.length/5, _c;
            for (;i<n;i++) {
                keyName = key = keyboard[5*i + 2];
                key = keyboard[5*i + 2];
                _c = keyboard[5*i + 3];
                notes = keyboard[5*i + 4];
                if (ff && (match = ffRe.exec(keyboard[5*i + 4]))) {
                    which = match[1];
                    code = match[2]||_c;
                    if (_c) map[_c] = code;
                } else {
                    which = keyboard[5*i + 1];
                    code = _c;
                }
                map[keyName] = key;
                if (code) map[code] = key;
                o = {
                    key: key,
                    keyName: keyName,
                    which: which = parseInt(which),
                    code: code,
                    notes: notes
                };
                _keys[which] = key;
                whiches[key] = which;
                whichNames[which] = keyName;
                kbs[key] = o;
            }
            return kbs;
	})();
	
	var keyNames = [], _k, keyName, name, val, numpad = /^(numpad)\s*_?\s*(\d)$/, match, pr,c2, name2;
	Object.keys(keyCodes).forEach(function(c) {
            val = keyCodes[keyName = c];
            map[c] = _k = _keys[keyCodes[c]];
            if (match = numpad.exec(c)) {
                c = match[1] + ' ' + match[2];
                c2 = match[1] + match[2];
            }
            map[name = c[0].toUpperCase() + c.substring(1)] = _k;
            pr = { name: name, value: val, writable: false, configurable: true };
            def(keyName, pr);

            if (keyNames.indexOf(name) < 0) {
                keyNames.push(name);
                def(name, pr);
            }
            if (c2) {
                map[name2 = c2[0].toUpperCase() + c2.substring(1)] = _k;
                if (keyNames.indexOf(name2) < 0) {
                    keyNames.push(name2);
                    def(name2, pr);
                }
            }
	});
	def("keyNames", pr = {value: keyNames, writable: false, configurable: true, name: keyNames });
	def("KEY_NAMES", pr);
	
	def("keyCodes", pr = {value: keyCodes, writable: false, configurable: true });
	def("KEY_CODES", pr);
	
	
	
	def("keyboard", pr = {value: keyboard, writable: false, configurable: true, name: 'keyboard' });
	def("KEYBOARD", pr);
	
	def("KEYS", pr = {value: _keys, writable: false, configurable: true, name: "keys" });
	def("keys", pr);
	
	def("WHICHES", pr = {value: whiches, writable: false, configurable: true, name: "whiches" });
	def("whiches", pr);
	
	
	/**
	 * Returns the int key code of the given event key name
	 * @param {String} key  The event key name to get the int key code
	 * @return {Number}
	 */
	E.which = function(key) {
            return E.WHICHES[map[key]||key];
	};
	/**
	 * Returns the event key name of the given int key code
	 * @param {Number} which The int key code to get the event key name
	 * @return {String}
	 */
	E.key = function(which) {
            return E.KEYS[which];
	};
	
	
	/**
	 * 
	 * Sets the pressed key of the given event to true;
         * @param {KeyEvent} ev 
	 */
	E.register = function(ev) {
            pressedKeys[(ev||window.event).key] = true;
	};
	/**
	 * 
	 * Unsets the pressed key of the given event.
         * @param {KeyEvent} ev
	 */
	E.unregister = function(ev) {
            delete pressedKeys[(ev||window.event).key];
	};
	/**
	 * Clear the pressed keys: unregister all the pressed keys.
	 */
	E.clear = function() {
            pressedKeys = {};
	};
	/** 
	 * Returns true if the given combination of keys corresponds to the keyboard events.
	 * <p><b>When there is an arugment that is an instance of KeyboardEvent, this method will
	 * automatically register the event key before check the combination of keys.</b></p>
	 * @param {KeyboardEvent|Array|String|Object} $1 Key board 
	 *		event or combination of keys
	 * @param {Array|String|Object|KeyboardEvent} [$2] Combination
	 *  of keys or key board event
	 *  <p>When there is only one argument, it should be a
	 *   a combination of keys represented by an array of 
	 *   strings or a string.</p>
	 * 	<p>If the first argument is an instanceof javascript 
	 *  DOM KeyboardEvent, the second one should be an array 
	 *  or a string.Otherwise, the second argument should be
	 *  an instanceof javascript.</p>
	 * @param {Boolean} [strict=true]
	 * @return {Boolean}
	 */
	E.is = function($1, $2, strict) {
            var ev, keys, match, s, _k, i, n, k, ignores = 0;
            if (arguments.length > 1) {
                if ($1 instanceof KeyboardEvent) {
                    ev = $1;
                    s = $2;
                } else if ($2 instanceof KeyboardEvent) {
                    s = $1;
                    ev = $2;
                } else if (typeof $2 === 'boolean') {
                    s = $1;
                    if (strict instanceof KeyboardEvent) ev = strict;
                    strict = $2;
                } else if ($1 != undefined) {
                    throw new Error("Incorrect arguments");
                } else {
                    return false;
                }
                E.register(ev);
            }
            if (strict == undefined) {
                strict = true;
            }
            if (s instanceof String)
                s = s.valueOf();
	    if (typeof s === 'string') {
                var chain = "";
                keys = [];
                if (/\d+(?:\.\d+)?/.test(s)) {
                    keys = [whichNames[s]];
                } else {
                    s = s.replace(/\btouche\b/gi, "Numpad").trim().replace(/\s*\+\s*\+\s*/g, function() {
                        return " + add";
                    });
                
                    if (match = /^(ctl|ctrl|control|shift|alt(?:[ ]?gr)?)(\s*\+\s*)?/i.exec(s)) {
                        keys.push(_k = map[match[1]]);
                        chain += _k;
                        s = s.substring(match[0].length);
                        if (match = res[chain].exec(s)) {
                            s = s.substring(match[0].length);
                            keys.push(_k = map[match[1]||match[0]]);
                            chain += _k;
                            if (match = res[chain].exec(s)) {
                                s = keys.substring(match[0].length);
                                keys.push(_k = map[match[1]||match[0]]);
                                chain += _k;
                            }
                        }
                    }
                    s.split(/\s*(?:\||\+|,)\s*/).forEach(function(k) {
                        keys.push(/^[A-Z]$/.test(k) ? k.toLowerCase() : k);
                    });
                }

            } else if (typeof s === 'number') {
                keys = [whichNames[s]];
            } else {
                keys = s;
            }
            if (isArray(keys)) {
                i = 0;
                n = keys.length;
                for (; i < n; i++) {
                    if (!pressedKeys[map[k = keys[i]]||k]) {
                        return false;
                    }
                }
            } else if (isPlainObj(keys)) {
                n = 0;
                for (var k in keys) {
                    if (["prototype", "_proto_"].indexOf(k) < 0) {
                        if (pressedKeys[map[k]||k] != keys[k]) {
                            return false;
                        } else {
                            n++;
                        }
                    }
                }
            } else if (keys) {
                throw new Error("Incorrect arguments");
            } else {
                return false;
            }
            if (strict) {
                keys = Object.keys(pressedKeys);
                if (keys.indexOf("prototype") >= 0) {
                    ignores++;
                }
                if (keys.indexOf("_proto_") >= 0) {
                    ignores++;
                }
                return n === (keys.length - ignores);
            }
            return  true;
	};
	
	E.isCtrlKey = function(ev, strict) {
            if (arguments.length) {
                return E.is('Control', ev, strict);
            }
            return pressedKeys.Control;
	};
	
	E.isCtrl = E.isCtrlKey;
	
	E.isControl = E.isCtrlKey;
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */
	E.isShiftKey = function(ev, strict) {
            if (arguments.length) {
                return E.is('Shift', ev, strict);
            }
            return pressedKeys.Shift;
	};
	
	
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */
	E.isCtrlShift = function(ev, strict) {
            if (arguments.length) {
                return E.is('Control + Shift', ev, strict);
            }
            return pressedKeys.Control && pressedKeys.Shift;
	};
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @return {Boolean}
	 */
	E.hasCtrlShift = function(ev) {
	    return E.isCtrlShift(ev, false);
	};
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */
	E.isControlShift = E.isCtrlShift;
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */
	E.isShiftControl = E.isCtrlShift;
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */
	E.isShiftCtrl = E.isCtrlShift;
	
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @return {Boolean}
	 */
	E.hasControlShift = E.hasCtrlShift;
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @return {Boolean}
	 */
	E.hasShiftControl = E.hasCtrlShift;
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @return {Boolean}
	 */
	E.hasShiftCtrl = E.hasCtrlShift;
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */
	E.isAltKey = function(ev, strict) {
            if (arguments.length) {
                return E.is('Alt', ev, strict);
            }
            return pressedKeys.Alt;
	};
	/**
	 * 
	 * @param {KeyboardEvent} ev
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */
	E.isShift = E.isShiftKey;
	/**
	 * Returns normalized key string
	 * @param {String|Array|Object} k
	 * @param {Boolean} [longFormat=false]
	 * @param {String|Boolean} [space=true]
	 * @return {String}
	 */
	E.toKeyString = function(k, longFormat, space) {
            function add(n) {
                if (n === '+') n = "add";
                n = (map[n]||n).trim();
                if ('Control' === n) {
                    ks.splice(0, 0, longFormat ? 'Control' : 'Ctrl');
                    ctl = true;
                } else if ('Alt' === n && ks.length) {
                    ks.splice(ctl ? 1 : 0, 0, n);
                    alt = true;
                } else if ('Shift' === n && ks.length > (p=alt && ctl ? 2 : alt || ctl ? 1 : 0)) {
                    ks.splice(p, 0, n);
                    shift = true;
                } else {
                    ks.push(/^[a-z]$/.test(n) ? n.toUpperCase() : n);
                }
            };
            var s = "", ks = [], alt, ctl, shift, p;
            if (typeof k === 'string' || k instanceof String) {
                    k = k.split(/\s*(?:\||\+|,)\s*/);
            }
            if (arguments.length < 3) {
                space = " ";
            } else {
                space = space ? " " : "";
            }
            if (isArray(k)) {
                k.forEach(function(x) {
                        add(x);
                });
            } else if (isPlainObj(k)) {
                for (var n in k) {
                    if (k[n]) {
                        add(n);
                    };
                }
            } else {
                    throw new Error("Incorrect argument");
            }
            return ks.join(space + "+" + space);
    };

    E.toNormalizedKeyString = E.toKeyString;

    E.normalizedKeyString = E.toKeyString;

    E.normalizedString = E.toKeyString;
    /**
     * Returns the set of choices keys combination accepted for key event.
     * <b>This set of choices is used to check if combination keys of a key event is accepted.</b>
     * @memberOf SereniX.KeyboardEvents
     * @param {Object|Array|String|Number} keys
     * @returns {Object}
     */
    E.getCombinedKeyFlags =function(keys) {
        function _keys(arr) {
            arr.forEach(function(key) {
                var c = key.toLowerCase().split(/\s*\+\s+|\s+/);
                var s = '';
                var i;
                if ((i = c.indexOf('control')) >= 0 
                        || (i = c.indexOf('ctl')) >= 0 
                        || (i = c.indexOf('ctrl')) >= 0) {
                    s = 'Control';
                    c.splice(i, 1);
                }
                if ((i = c.indexOf('shift')) >= 0) {
                    s += (s ? '+' : '') + 'Shift';
                    c.splice(i, 1);
                }
                s  += (s ? '+' : '') + getName(c.join(''));
                ks[s] = true;
            });
        }
        function getName(s) {
            return s[0].toUpperCase() + s.substring(1);
        }
        var ks = {};
        if (isPlainObj(keys = unboxVal(keys))) {
            for (var k in keys) {
                ks[normalizeKeys(k)] = toBool(keys[k]);
            }
        } else if (isArray(keys)) {
            _keys(keys);
        } else if (typeof keys === 'string') {
            _keys(keys.split(/\|/));
        } else if (typeof keys === 'number') {
            ks[keys] = true;
        } else {
            return;
        }
        return ks;
    };
    
    E.getCombinedKeys = E.getCombinedKeyFlags;
    
    E.getKeys = E.getCombinedKeys;
    
    E.isPrintable = function(keycode) {
        return (keycode > 47 && keycode < 58)   || // number keys
            keycode === 32 || keycode === 13   || // spacebar & return key(s) (if you want to allow carriage returns)
            (keycode > 64 && keycode < 91)   || // letter keys
            (keycode > 95 && keycode < 112)  || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223);   // [\]' (in order)
    };
    
    E.getWhichKeyName = function(which) {
        return whichNames[which];
    };
    
    E.whichKeyName = E.getWhichKeyName;
    E.getChar = getChar;
    
    if (typeof SereniX.addChild === 'function') {
        SereniX.addChild(E);
    } else {
        SereniX.KeyboardEvents = E;
    }

    if (typeof SereniX.Keyboard !== 'undefined') {
        SereniX.Keyboard.is = E.is;
    }

    return E;
});

/*
console.log('------------------ short format ------------------');
console.log('ctrl+ A => ' + KeyboardEvents.normalizedString('ctrl+ A'));

console.log('control+ a => ' + KeyboardEvents.normalizedString('control+ a'));

console.log('Control+ a => ' + KeyboardEvents.normalizedString('Control+ a'));


console.log('shift +Alt+Control+ c => ' + KeyboardEvents.normalizedString('shift +Alt+Control+ c'));


console.log('------------------ long format ------------------');


console.log('ctrl+ B => ' + KeyboardEvents.normalizedString('ctrl+ B', true));

console.log('control+ b => ' + KeyboardEvents.normalizedString('control+b', true));

console.log('Control+ b => ' + KeyboardEvents.normalizedString('Control +b', true));

console.log('maj +Alt+Control+ c => ' + KeyboardEvents.normalizedString('maj +Alt+Control+ c', true));

*/