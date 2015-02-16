// see: https://github.com/uupaa/PageVisibilityEvent.js/wiki#list-of-events-that-occur-in-the-page-switching

(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var _currentHiddenState = false; // current PageVisibility hidden state.
var _callbacks          = [];    // callback function array. [callback, ...]
var _suspendedTime      = { begin: 0, total: 0 };
var _blurEventType      = "";    // page blur event type. "pagehide", "blur", "hidden", "webkitHidden"

// --- class / interfaces ----------------------------------
function PageVisibilityEvent() { // @desc PageVisibility event dispatcher.
}

//{@dev
PageVisibilityEvent["repository"] = "https://github.com/uupaa/PageVisibilityEvent.js";
//}@dev

PageVisibilityEvent["on"]       = PageVisibilityEvent_on;       // PageVisibilityEvent.on(callback:Function):void
PageVisibilityEvent["off"]      = PageVisibilityEvent_off;      // PageVisibilityEvent.off(callback:Function):void
PageVisibilityEvent["clear"]    = PageVisibilityEvent_clear;    // PageVisibilityEvent.clear():void
PageVisibilityEvent["isHidden"] = PageVisibilityEvent_isHidden; // PageVisibilityEvent.isHidden():Boolean

// --- implements ------------------------------------------
function PageVisibilityEvent_on(callback) { // @arg Function - callback(pageHide:Boolean, eventType:EventTypeString):void
                                            // @desc attach PageVisibility event.
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(callback, "Function"), PageVisibilityEvent_on, "callback");
    }
//}@dev

    var pos = _callbacks.indexOf(callback); // find registered callback

    if (pos < 0) { // already -> ignore
        _callbacks.push(callback);
        if (_callbacks.length === 1) {
            _attachAndDetachEvents(true);
        }
    }
}

function PageVisibilityEvent_off(callback) { // @arg Function
                                             // @desc detach PageVisibility event.
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(callback, "Function"), PageVisibilityEvent_off, "callback");
    }
//}@dev

    var pos = _callbacks.indexOf(callback); // find registered callback

    if (pos >= 0) {
        _callbacks.splice(pos, 1);
        if (!_callbacks.length) {
            _attachAndDetachEvents(false);
        }
    }
}

function PageVisibilityEvent_clear() { // @desc cleanup, release all events and event listeners.
    _callbacks = [];
    _attachAndDetachEvents(false);
}

function PageVisibilityEvent_isHidden() { // @ret Boolean - true is page hidden
                                          // @desc get current PageVisibility state.
    return _currentHiddenState;
}

function _handlePageVisibilityEvent() { // @arg Event - PageVisibility event.
    _handleEvent(document[_blurEventType] || false);
}
function _handlePageShowAndFocusEvent(event) { // @arg Event - pageshow, pagehide, focus, blur event.
    _handleEvent(event["type"] === _blurEventType);
}
function _handleEvent(hidden) { // @arg Boolean
    if (_currentHiddenState !== hidden) {
        _currentHiddenState = hidden; // update current state.

        if (hidden) {
            _suspendedTime.begin = Date.now();
        } else {
            _suspendedTime.total += (Date.now() - _suspendedTime.begin);
            _suspendedTime.begin = 0;
        }

        if (_callbacks.length) {
            var fns = _callbacks;
            var eventType = event["type"];
            for (var i = 0, iz = fns.length; i < iz; ++i) {
                if (fns[i]) {
                    fns[i](hidden, eventType, _suspendedTime.total);
                }
            }
        }
    }
}

function _attachAndDetachEvents(attach) { // @arg Boolean
    var method = attach ? "addEventListener" : "removeEventListener";

    if (global["document"]) {
        _blurEventType = "hidden";
        if (_blurEventType in document) { // iOS 7+
            document[method]("visibilitychange", _handlePageVisibilityEvent);
        } else {
            _blurEventType = "webkitHidden";
            if (_blurEventType in document) {
                document[method]("webkitvisibilitychange", _handlePageVisibilityEvent);
            } else {
                if ( /iPhone|iPad|iPod/.test(global["navigator"]["userAgent"]) ) {
                    _blurEventType = "pagehide";
                    global[method]("pageshow", _handlePageShowAndFocusEvent);
                    global[method]("pagehide", _handlePageShowAndFocusEvent);
                } else {
                    _blurEventType = "blur";
                    global[method]("focus", _handlePageShowAndFocusEvent);
                    global[method]("blur",  _handlePageShowAndFocusEvent);
                }
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
if (!global["PageVisibilityEvent"]) {
     global["PageVisibilityEvent"] = PageVisibilityEvent;
}

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

