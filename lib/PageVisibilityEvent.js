(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("PageVisibilityEvent", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
var VERIFY  = global["WebModule"]["verify"]  || false;
//var VERBOSE = global["WebModule"]["verbose"] || false;

var _currentHiddenState = false; // current PageVisibility hidden state.
var _callbacks          = [];    // callback function array. [callback, ...]
var _histories          = [];    // hidden event history. [{ hidden: hidden, time: 0 }, ... ]
var _blurEventType      = "";    // page blur event type. "pagehide", "blur", "hidden", "webkitHidden"

// --- class / interfaces ----------------------------------
var PageVisibilityEvent = {
    "on":           PageVisibilityEvent_on,         // PageVisibilityEvent.on(callback:Function):void
    "off":          PageVisibilityEvent_off,        // PageVisibilityEvent.off(callback:Function):void
    "clear":        PageVisibilityEvent_clear,      // PageVisibilityEvent.clear():void
    "isHidden":     PageVisibilityEvent_isHidden,   // PageVisibilityEvent.isHidden():Boolean
    "refHistory":   PageVisibilityEvent_refHistory, // PageVisibilityEvent.refHistory():Array
    "repository":   "https://github.com/uupaa/PageVisibilityEvent.js",
};

// --- implements ------------------------------------------
function PageVisibilityEvent_on(callback) { // @arg Function - callback(pageHide:Boolean, eventType:EventTypeString):void
                                            // @desc attach PageVisibility event.
//{@dev
    if (VERIFY) {
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
    if (VERIFY) {
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
    _histories = [];
    _attachAndDetachEvents(false);
}

function PageVisibilityEvent_refHistory() { // @ret Array - histories [{ hidden:Boolean, time:Integer }, ....]
    return _histories;
}

function PageVisibilityEvent_isHidden() { // @ret Boolean - true is page hidden
                                          // @desc get current PageVisibility state.
    return _currentHiddenState;
}

function _handlePageVisibilityEvent(event) { // @arg Event - PageVisibility event.
    _handleEvent(document[_blurEventType] || false, event["type"], event["timeStamp"]);
}
function _handlePageShowAndFocusEvent(event) { // @arg Event - pageshow, pagehide, focus, blur event.
    _handleEvent(event["type"] === _blurEventType, event["type"], event["timeStamp"]);
}
function _handleEvent(hidden, eventType, timeStamp) { // @arg Boolean
    if (_currentHiddenState !== hidden) {
        _currentHiddenState = hidden; // update current state.

        var suspendedTime = 0;

        if (!hidden && _histories.length) {
            suspendedTime = timeStamp - _histories[_histories.length - 1]["time"];
        }
        _histories.push({ hidden: hidden, time: timeStamp });

        if (_callbacks.length) {
            var fns = _callbacks;
            for (var i = 0, iz = fns.length; i < iz; ++i) {
                if (fns[i]) {
                    fns[i](hidden, eventType, suspendedTime);
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

return PageVisibilityEvent; // return entity

});

