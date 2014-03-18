// @name: PageVisibilityEvent.js
// @spec: http://www.w3.org/TR/page-visibility/
// @require: Valid.js

/*

| Browser               | page open | page blur        | page focus       | page close | page-visibility spec implement |
|-----------------------|-----------|------------------|------------------|------------|--------------------------------|
| iOS 5.1 MobileSafari  | pageshow  | pagehide         | pageshow         | (none)     |  no                            |
| iOS 6.1 MobileSafari  | pageshow  | pagehide         | pageshow         | pagehide   |  no                            |
| iOS 7.0 MobileSafari  | pageshow  | visibilitychange | visibilitychange | pagehide   |  yes                           |
| Mac Safari 6.0.4      | pageshow  | blur             | focus            | (none)     |  no                            |
| Mac Safari 6.1.1      | pageshow  | visibilitychange | visibilitychange | pagehide   |  yes                           |
| Android Browser 2.3.6 | pageshow  | (none)           | (none)           | pagehide   |  no                            |
| Android Browser 4.0.1 | pageshow  | blur             | focus            | pagehide   |  no                            |
| Chrome for Android 32 | pageshow  | visibilitychange | visibilitychange | (none)     |  yes                           |
| Mac Chrome 33         | pageshow  | visibilitychange | visibilitychange | pagehide   |  yes                           |

 */

(function(global) {
"use strict";

// --- variable --------------------------------------------
//{@assert
var Valid = global["Valid"] || require("uupaa.valid.js");
//}@assert

//{@assert
//_if(!global["document"] || !global["addEventListener"],
//    "PageVisibilityEvent.js will not work in this environment.");
//}@assert

var _inNode = "process" in global;

var _hidden = false;    // @internal Boolean: current PageVisibility state
var _callbacks = [];    // @internal FunctionArray: [callback, ...]
var _document = global["document"] || null;

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function PageVisibilityEvent() { // @help: PageVisibilityEvent
                                 // @desc: PageVisibility event dispatcher.
}

PageVisibilityEvent["name"]       = "PageVisibilityEvent";
PageVisibilityEvent["repository"] = "https://github.com/uupaa/PageVisibilityEvent.js";

PageVisibilityEvent["on"]       = PageVisibilityEvent_on;       // PageVisibilityEvent.on(callback:Function):Boolean
PageVisibilityEvent["off"]      = PageVisibilityEvent_off;      // PageVisibilityEvent.off(callback:Function):Boolean
PageVisibilityEvent["clear"]    = PageVisibilityEvent_clear;    // PageVisibilityEvent.clear():void
PageVisibilityEvent["isHidden"] = PageVisibilityEvent_isHidden; // PageVisibilityEvent.isHidden():Boolean

// --- implement -------------------------------------------
function PageVisibilityEvent_on(callback) { // @arg Function: callback(pageHide:Boolean, eventType:EventTypeString):void
                                            // @ret Boolean:
                                            // @help: PageVisibilityEvent.on
                                            // @desc: Attach PageVisibility event.
//{@assert
    _if(!Valid.type(callback, "Function"), "PageVisibilityEvent.on(callback)");
//}@assert

    var pos = _callbacks.indexOf(callback);

    if (pos >= 0) {
        return false;
    }
    // add
    _callbacks.push(callback);

    if (_callbacks.length === 1) {
        _handler(true);
    }
    return true;
}

function PageVisibilityEvent_off(callback) { // @arg Function:
                                             // @ret Boolean:
                                             // @help: PageVisibilityEvent.off
                                             // @desc: detach PageVisibility event.
//{@assert
    _if(!Valid.type(callback, "Function"), "PageVisibilityEvent.off(callback)");
//}@assert

    var pos = _callbacks.indexOf(callback); // find registered callback

    if (pos >= 0) {
        if (_callbacks[pos]) { // already
            _callbacks.splice(pos, 1);
            if (!_callbacks.length) {
                _handler(false);
            }
            return true;
        }
    }
    return false;
}

function PageVisibilityEvent_clear() { // @help: PageVisibilityEvent.clear
                                       // @desc: detach all PageVisibility event.
    _callbacks = [];
    _handler(false);
}

function PageVisibilityEvent_isHidden() { // @ret Boolean: true is page hidden
                                          // @help: PageVisibilityEvent.isHidden
                                          // @desc: get current PageVisibility state.
    return _hidden;
}

function _handler(attachEvent) { // @arg Boolean: true is attachEvent, false is detachEvent
    var method = attachEvent ? "addEventListener"
                             : "removeEventListener";

    if (_document) {
        if ( "hidden" in _document ) { // iOS 7+
            _document[method]("visibilitychange", _handlePageVisibility);
        } else if ( "webkitHidden" in _document ) {
            _document[method]("webkitvisibilitychange", _handlePageVisibility);
        } else {
            if ( /iPhone|iPad|iPod/.test(global.navigator.userAgent) ) {
                global[method]("pageshow", _handlePageShow);
                global[method]("pagehide", _handlePageShow);
            } else {
                global[method]("focus", _handleFocus);
                global[method]("blur",  _handleFocus);
            }
        }
    }

    function _handlePageVisibility(event) {
        _hidden = _document["hidden"] || _document["webkitHidden"] || false;
        _callback(_hidden, event["type"]);
    }
    function _handlePageShow(event) {
        _hidden = event["type"] === "pagehide";
        _callback(_hidden, event["type"]);
    }
    function _handleFocus(event) {
        _hidden = event["type"] === "blur";
        _callback(_hidden, event["type"]);
    }

    function _callback(hiddenState, eventType) {
        var ary = _callbacks, i = 0, iz = ary.length;
        var fn = null;

        for (; i < iz; ++i) {
            fn = _callbacks[i];
            if (fn) {
                fn(hiddenState, eventType);
            }
        }
    }
}

//{@assert
function _if(value, msg) {
    if (value) {
        console.error(Valid.stack(msg));
        throw new Error(msg);
    }
}
//}@assert

// --- export ----------------------------------------------
//{@node
if (_inNode) {
    module["exports"] = PageVisibilityEvent;
}
//}@node
if (global["PageVisibilityEvent"]) {
    global["PageVisibilityEvent_"] = PageVisibilityEvent; // already exsists
} else {
    global["PageVisibilityEvent"]  = PageVisibilityEvent;
}

})((this || 0).self || global);

