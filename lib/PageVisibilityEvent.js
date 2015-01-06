/*

| Browser               | page open event | page blur event  | page focus event | page close event    | native support |
|-----------------------|-----------------|------------------|------------------|---------------------|----------------|
| iOS 5.1 MobileSafari  | pageshow        | pagehide         | pageshow         | (none)              | NO             |
| iOS 6.1 MobileSafari  | pageshow        | pagehide         | pageshow         | pagehide            | NO             |
| iOS 7.0 MobileSafari  | pageshow        | visibilitychange | visibilitychange | pagehide            | YES            |
| Safari 6.0.4          | pageshow        | blur             | focus            | (none)              | NO             |
| Safari 6.1.1          | pageshow        | visibilitychange | visibilitychange | pagehide            | YES            |
| Android Browser 2.3.6 | pageshow        | (none)           | (none)           | pagehide            | NO             |
| Android Browser 4.0.1 | pageshow        | blur             | focus            | pagehide            | NO             |
| Android Browser 4.3.x | pageshow        | blur             | focus            | pagehide            | NO             |
| Android Browser 4.4.0 | pageshow        | visibilitychange | visibilitychange | pagehide            | YES            |
| Chrome for Android 32 | pageshow        | visibilitychange | visibilitychange | (none)              | YES            |
| Chrome for Android 39 | pageshow        | visibilitychange | visibilitychange | pagehide(sometimes) | YES            |
| Chrome                | pageshow        | visibilitychange | visibilitychange | pagehide            | YES            |

 */

(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit && /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var _hidden = false;    // @internal Boolean: current PageVisibility state
var _callbacks = [];    // @internal FunctionArray: [callback, ...]
var _document = global["document"] || null;

// --- class / interfaces ----------------------------------
function PageVisibilityEvent() { // @desc PageVisibility event dispatcher.
}

//{@dev
PageVisibilityEvent["repository"] = "https://github.com/uupaa/PageVisibilityEvent.js";
//}@dev

PageVisibilityEvent["on"]       = PageVisibilityEvent_on;       // PageVisibilityEvent.on(callback:Function):Boolean
PageVisibilityEvent["off"]      = PageVisibilityEvent_off;      // PageVisibilityEvent.off(callback:Function):Boolean
PageVisibilityEvent["clear"]    = PageVisibilityEvent_clear;    // PageVisibilityEvent.clear():void
PageVisibilityEvent["isHidden"] = PageVisibilityEvent_isHidden; // PageVisibilityEvent.isHidden():Boolean

// --- implements ------------------------------------------
function PageVisibilityEvent_on(callback) { // @arg Function - callback(pageHide:Boolean, eventType:EventTypeString):void
                                            // @ret Boolean
                                            // @desc Attach PageVisibility event.
//{@dev
    $valid($type(callback, "Function"), PageVisibilityEvent_on, "callback");
//}@dev

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

function PageVisibilityEvent_off(callback) { // @arg Function
                                             // @ret Boolean
                                             // @desc detach PageVisibility event.
//{@dev
    $valid($type(callback, "Function"), PageVisibilityEvent_off, "callback");
//}@dev

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

function PageVisibilityEvent_clear() { // @desc detach all PageVisibility event.
    _callbacks = [];
    _handler(false);
}

function PageVisibilityEvent_isHidden() { // @ret Boolean - true is page hidden
                                          // @desc get current PageVisibility state.
    return _hidden;
}

function _handler(attachEvent) { // @arg Boolean - true is attachEvent, false is detachEvent
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

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if (typeof module !== "undefined") {
    module["exports"] = PageVisibilityEvent;
}
global["PageVisibilityEvent" in global ? "PageVisibilityEvent_"
                                       : "PageVisibilityEvent"] = PageVisibilityEvent; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

