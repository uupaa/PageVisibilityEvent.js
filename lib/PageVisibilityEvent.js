// @name: PageVisibilityEvent.js
// @spec: http://www.w3.org/TR/page-visibility/

/*

PageVisibilityEvent.on(function(pageHide) { // @arg Boolean:
    console.log(pageHide ? "page hide"
                         : "page show");
});

 */
/*
| Browser               | tab open | tab blur         | tab focus        | tab  close | compatibility  |
|-----------------------|----------|------------------|------------------|------------|----------------|
| iOS 5.1 MobileSafari  | pageshow | pagehide         | pageshow         | (none)     |  polyfilled    |
| iOS 6.1 MobileSafari  | pageshow | pagehide         | pageshow         | pagehide   |  polyfilled    |
| iOS 7.0 MobileSafari  | pageshow | visibilitychange | visibilitychange | pagehide   |    ready       |
| Mac Safari 6.0.4      | pageshow | blur             | focus            | (none)     |  polyfilled    |
| Mac Safari 6.1.1      | pageshow | visibilitychange | visibilitychange | pagehide   |    ready       |
| Mac Chrome 33         | pageshow | visibilitychange | visibilitychange | pagehide   |    ready       |
| Chrome for Android 32 | pageshow | visibilitychange | visibilitychange | (none)     |    ready       |
| Android Browser 2.3.6 | pageshow | (none)           | (none)           | pagehide   | none(not work) |
| Android Browser 4.0.1 | pageshow | blur             | focus            | pagehide   |  polyfilled    |
 */

(function(global) {

//{@assert
_if (!global.document || !global.addEventListener,
        "PageVisibilityEvent.js will not work in this environment.");
//}@assert

// --- define ----------------------------------------------
// --- variable --------------------------------------------
var _hidden = false;    // @internal Boolean: current PageVisibility state
var _callbacks = [];    // @internal FunctionArray: [callback, ...]

// --- interface -------------------------------------------
function PageVisibilityEvent() { // @help: PageVisibilityEvent
                                 // @desc: PageVisibility event dispatcher.
}

PageVisibilityEvent.name = "PageVisibilityEvent";
PageVisibilityEvent.repository = "https://github.com/uupaa/PageVisibilityEvent.js";
PageVisibilityEvent.on = on;             // PageVisibilityEvent.on(callback:Function):Boolean
PageVisibilityEvent.off = off;           // PageVisibilityEvent.off(callback:Function = null):Boolean
PageVisibilityEvent.isHidden = isHidden; // PageVisibilityEvent.isHidden():Boolean

// --- implement -------------------------------------------
function on(callback) { // @arg Function: callback(pageHide:Boolean, eventType:EventTypeString)
                        // @ret Boolean:
                        // @help: PageVisibilityEvent.on
                        // @desc: Attach PageVisibility event.
//{@assert
    if (callback) {
        _if(typeof callback !== "function", "invalid PageVisibilityEvent.on(callback)");
    }
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

function off(callback) { // @arg Function(= null):
                         // @ret Boolean:
                         // @help: PageVisibilityEvent.off
                         // @desc: detach PageVisibility event.
//{@assert
    if (callback) {
        _if(typeof callback !== "function", "invalid PageVisibilityEvent.off(callback)");
    }
//}@assert

    if (callback) {
        var pos = _callbacks.indexOf(callback);

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
    _callbacks = [];
    _handler(false);
    return true;
}

function isHidden() { // @ret Boolean: true is page hidden
                      // @help: PageVisibilityEvent.isHidden
                      // @desc: get current PageVisibility state.
    return _hidden;
}

function _handler(attachEvent) { // @arg Boolean: true is attachEvent, false is detachEvent
    var method = attachEvent ? "addEventListener"
                             : "removeEventListener";

    if ( "hidden" in document ) { // iOS 7+
        document[method]("visibilitychange", _handlePageVisibility);
    } else if ( "webkitHidden" in document ) {
        document[method]("webkitvisibilitychange", _handlePageVisibility);
    } else {
        if ( /iPhone|iPad|iPod/.test(global.navigator.userAgent) ) {
            global[method]("pageshow", _handlePageShow);
            global[method]("pagehide", _handlePageShow);
        } else {
            global[method]("focus", _handleFocus);
            global[method]("blur",  _handleFocus);
        }
    }

    function _handlePageVisibility(event) {
        _hidden = document.hidden || document.webkitHidden || false;
        _callback(_hidden, event.type);
    }
    function _handlePageShow(event) {
        _hidden = event.type === "pagehide";
        _callback(_hidden, event.type);
    }
    function _handleFocus(event) {
        _hidden = event.type === "blur";
        _callback(_hidden, event.type);
    }

    function _callback(hiddenState, eventType) {
        var ary = _callbacks, i = 0, iz = ary.length;
        var fn = null;

        for (; i < iz; ++i) {
            fn = _callbacks[i];
            fn && fn(hiddenState, eventType);
        }
    }
}

//{@assert
function _if(booleanValue, errorMessageString) {
    if (booleanValue) {
        throw new Error(errorMessageString);
    }
}
//}@assert

// --- export ----------------------------------------------
if (global.process) { // node.js
    module.exports = PageVisibilityEvent;
}
global.PageVisibilityEvent = PageVisibilityEvent;

})(this.self || global);

