function isPlainObj(o) {
	return Object.prototype.toString.call(o) === '[object Object]';
}

function isArray(a) {
    return Array.isArray(a);
}

if (typeof Array.prototype.contains === 'undefined') {
    Array.prototype.contains = function(e) {
        return this.indexOf(e) >= 0;
    };
}

if (typeof addEvt === 'undefined') {
    function addEvt(evt, el, fn) {
        evt = evt.toLowerCase();
        if (el.addEventListener) {
            if (evt.startsWith('on')) {
                evt = evt.substring(2);
            }
            el.addEventListener(evt, fn);
        } else if (el.attachEvent) {
            if (!evt.startsWith('on')) {
                evt = 'on' + evt;
            }
            el.attachEvent(evt, fn);
        }
    }
}

if (typeof removeEvt === 'undefined') {
	function removeEvt(evt, el, fn) {
            evt = evt.toLowerCase();
            if (el.addEventListener) {
                if (evt.startsWith('on')) {
                    evt = evt.substring(2);
                }
                el.removeEventListener(evt, fn);
            } else if (el.attachEvent) {
                if (!evt.startsWith('on')) {
                    evt = 'on' + evt;
                }
                el.detachEvent(evt, fn);
            }
	}
}

if (typeof preventDefault === 'undefined') {
    preventDefault = function(ev) {
        if (ev.preventDefault) ev.preventDefault();
        else if (ev.stopPropagation) ev.stopPropagation();
    };
}


function fireEvent(el, evtType) {
    evtType = evtType.toLowerCase();
    if (el.fireEvent) {
        el.fireEvent((/^on/.test(evtType) ? '' : 'on') + evtType);
    } else {
        var ev = document.createEvent('Events');
        ev.initEvent(/^on/.test(evtType) ? evtType.substring(2) : evtType, true, false);
        el.dispatchEvent(ev);
    }
}

var dispatchEvent = fireEvent;

function getPointerData(ev) {
    var touches = [ 'touchstart', 'touchend', 'touchmouve'].indexOf(ev.type) >= 0 ?  ev.changedTouches :ev.touches;
    // if is touch event, return last item in touchList
    // else return original event
    return touches ? touches[touches.length - 1] : ev;
}
/**
 * <p>Returns the list of touch points (TouchList object) whose Touch objects 
 * include all the touch points that contributed to the given touch event when 
 * the given target value is not equals to 'screen' or all 
 * the active touch points triggered on the screen otherwise.</p>
 * <p>When the event type is 'touchend', the result will be 
 * <b color="navy">changedTouches</b> property of the touch event regardless of the target argument.</p>
 * <h3>Touch points description</h3>
 * <p>We have the following touch points cases:</p>
 * <ul>
 * <li><b color="navy">touches</b>: A list of information for every finger currently touching the touch surface (screen), regardless of whether or not they've changed or what their target element was at touchstart time.
 * <p>You can think of it as how many separate fingers are able to be identified as touching the screen.</p>
 * </li>
 * <li><b color="navy">targetTouches</b>: Like touches, but is filtered to only the information for finger touches that started out within the same node</li>
 * <li><b color="navy">changedTouches</b>: A list of information for every finger involved in the event.
 * <p>The changedTouches read-only property is a TouchList whose touch points (Touch objects) varies depending on the event type, as follows:</p>
 * <ul>
 * <li>For the touchstart event, it is a list of the touch points that became active with the current event.</li>
 * <li>For the touchmove event, it is a list of the touch points that have changed since the last event.</li>
 * <li>For the touchend event, it is a list of the touch points that have been removed from the surface (that is, the set of touch points corresponding to fingers no longer touching the surface).</li>
 * </ul>
 * </li>
 * </ul>
 * <h3>Examples</h3>
 * <p>To better understand what might be in these lists, let’s go over some examples quickly. They vary according to the following rules:</p>
 * <ul>
 * <li>When I put a finger down, all three lists will have the same information. It will be in changedTouches because putting the finger down is what caused the event</li>
 * <li>When I put a second finger down, touches will have two items, one for each finger. targetTouches will have two items only if the finger was placed in the same node as the first finger. changedTouches will have the information related to the second finger, because it’s what caused the event</li>
 * <li>If I put two fingers down at exactly the same time, it’s possible to have two items in changedTouches, one for each finger</li>
 * <li>If I move my fingers, the only list that will change is changedTouches and will contain information related to as many fingers as have moved (at least one).</li>
 * <li>When I lift a finger, it will be removed from touches, targetTouches and will appear in changedTouches since it’s what caused the event</li>
 * <li>Removing my last finger will leave touches and targetTouches empty, and changedTouches will contain information for the last finger</li>
 * </ul>
 * @param {TouchEvent} ev The touch event
 * @param {String|Boolean} [target=false] The target  ('screen', 'target', '', false) : the event related to?
 *      <p><b>The string value must be lower case. If not, will be considered 
 *      as value 'target' when the value can be assimilated to true string 
 *      value.</b> 
 *      The followings caseless string values are assimilated to boolean false 
 *      value: 'false', 'no', 'none','n', 'off', 'nok', 'ko'. Other string 
 *      value is assimilated to boolean true value.</p>
 * @returns {TouchList}
 */
function eventTouches(ev, target) {
    if (target === 'target' || target === true || ((typeof target !== 'string' || ['target', 'screen', ''].indexOf(target) < 0) && toBool(target))) {
        return ev.targetTouches;
    }
    if (target === 'screen' && ev.type !== 'touchend') return ev.touches;
    return ['touchstart', 'touchmouve', 'touchend'].indexOf(ev.type) >= 0 ?  ev.changedTouches : ev.touches;
}

var hasTouchEvents = document.documentElement ? "ontouchstart" in document.documentElement : false;

var wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
				 document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
				 "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox;

/**
 * Returns the mouse position
 * @param {Event} ev
 */
function getMousePosition(ev) {
    var touches = [ 'touchstart', 'touchend', 'touchmouve'].indexOf(ev.type) >= 0 ?  ev.changedTouches :ev.touches;
    ev = touches ? touches[touches.length - 1] : ev;
    return {
      x: ev.clientX,
      y: ev.clientY
    };
}

var getMousePos = getMousePosition;

if (typeof $addEvt === 'undefined')
    $addEvt = addEvt;

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

