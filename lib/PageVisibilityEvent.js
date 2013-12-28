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
var _callback = null;   // @internal Function: callback

// --- interface -------------------------------------------
function PageVisibilityEvent() { // @help: PageVisibilityEvent
                                 // @desc: PageVisibility event dispatcher.
}

PageVisibilityEvent.on  = on;            // on(callback:Function):void
PageVisibilityEvent.off = off;           // off():void
PageVisibilityEvent.isHidden = isHidden; // isHidden():Boolean

// --- implement -------------------------------------------
function on(callback) { // @arg Function: callback(pageHide:Boolean, eventType:EventTypeString)
                        // @help: PageVisibilityEvent.on
                        // @desc: Attach PageVisibility event.
//{@assert
    _if(!callback || typeof callback !== "function", "invalid PageVisibility.on(callback)");
//}@assert

    _callback = callback;
    _handler(true);
}

function off() { // @help: PageVisibilityEvent.off
                 // @desc: detach PageVisibility event.
    _callback = null;
    _handler(false);
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

