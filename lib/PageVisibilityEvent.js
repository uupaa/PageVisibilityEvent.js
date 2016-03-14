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
var VERBOSE = global["WebModule"]["verbose"] || false;

var ENABLE_VISIBILITY   = global["document"] ? ("hidden" in document || "webkitHidden" in document) : false;
var ENABLE_PAGESHOW     = global["document"] ? /iPhone|iPad|iPod/.test(navigator.userAgent) : false;
var ENABLE_FOCUS        = global["document"] ? ("onfocus" in global && "onblur" in global) : false;

var _keyword            = "";    // hidden state keyword. "hidden" or "webkitHidden" or "pagehide" or "blur"
var _callbacks          = [];    // callback function array. [callback, ...]
var _lastHiddenState    = false; // last hidden state.

// --- class / interfaces ----------------------------------
var PageVisibilityEvent = {
    "enable":       ENABLE_VISIBILITY || ENABLE_PAGESHOW || ENABLE_FOCUS,
    "on":           PageVisibilityEvent_on,         // PageVisibilityEvent.on(callback:Function):void
    "off":          PageVisibilityEvent_off,        // PageVisibilityEvent.off(callback:Function):void
    "end":          PageVisibilityEvent_end,        // PageVisibilityEvent.end():void
    "isHidden":     PageVisibilityEvent_isHidden,   // PageVisibilityEvent.isHidden():Boolean
    "repository":   "https://github.com/uupaa/PageVisibilityEvent.js",
};

if (ENABLE_VISIBILITY || ENABLE_PAGESHOW | ENABLE_FOCUS) {
    _keyword = _event(true);
}

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
    }
}

function PageVisibilityEvent_end() { // @desc cleanup, release all events and event listeners.
    _callbacks = [];
    _event(false); // detach
}

function PageVisibilityEvent_isHidden() { // @ret Boolean - true is page hidden
                                          // @desc get current PageVisibility state.
    return _lastHiddenState;
}

function _event(attach) { // @arg Boolean - true is attach, false is detach
                          // @ret String - hidden state keyword
    var method = attach ? "addEventListener" : "removeEventListener";

    if (ENABLE_VISIBILITY) {
        if ("hidden" in document) {
            document[method]("visibilitychange", _handlePageVisibilityEvent);
            return "hidden";
        } else if ("webkitHidden" in document) {
            document[method]("webkitvisibilitychange", _handlePageVisibilityEvent);
            return "webkitHidden";
        }
    } else if (ENABLE_PAGESHOW) {
        global[method]("pageshow", _handlePageShowAndFocusEvent);
        global[method]("pagehide", _handlePageShowAndFocusEvent);
        return "pagehide";
    } else if (ENABLE_FOCUS) {
        global[method]("focus", _handlePageShowAndFocusEvent);
        global[method]("blur",  _handlePageShowAndFocusEvent);
        return "blur";
    }
    return "";
}

function _handlePageVisibilityEvent(event) { // @arg Event - PageVisibility event.
    _handleEvent(document[_keyword] || false, event["type"]);
}

function _handlePageShowAndFocusEvent(event) { // @arg Event - pageshow, pagehide, focus, blur event.
    _handleEvent(event["type"] === _keyword, event["type"]);
}

function _handleEvent(hidden, eventType) { // @arg Boolean
    if (_lastHiddenState !== hidden) {
        _lastHiddenState = hidden; // update current state.

        if (VERBOSE) {
            console.info("onvisibilitychange", hidden, eventType);
        }
        for (var i = 0, iz = _callbacks.length; i < iz; ++i) {
            if (_callbacks[i]) {
                _callbacks[i](hidden, eventType);
            }
        }
    }
}

return PageVisibilityEvent; // return entity

});

