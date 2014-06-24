var ModuleTestPageVisibilityEvent = (function(global) {

return new Test("PageVisibilityEvent", {
        disable:    false,
        browser:    true,
        worker:     false,
        node:       false,
        button:     false,
        both:       false,
    }).add([
        testAPI,
    ]).run().clone();

function testAPI(test, pass, miss) {

    var result1 = PageVisibilityEvent.on(handler1);  // true
    var result2 = PageVisibilityEvent.on(handler2);  // true
    var result3 = PageVisibilityEvent.on(handler2);  // false (already registered)
    var result4 = PageVisibilityEvent.off(handler3); // false (not registered)
                  PageVisibilityEvent.clear();       // true
    var result6 = PageVisibilityEvent.off(handler1); // false (not registered)

    if ( result1 &&
         result2 &&
        !result3 &&
        !result4 &&
       //result5 &&
        !result6) {

        test.done(pass());
    } else {
        test.done(miss());
    }
}

function handler1(pageHide, eventType) { // @arg Boolean:
    console.log("1 " + eventType + ":" + (pageHide ? "page hide" : "page show"));
}
function handler2(pageHide, eventType) { // @arg Boolean:
    console.log("2 " + eventType + ":" + (pageHide ? "page hide" : "page show"));
}
function handler3(pageHide, eventType) { // @arg Boolean:
    console.log("3 " + eventType + ":" + (pageHide ? "page hide" : "page show"));
}

})((this || 0).self || global);

