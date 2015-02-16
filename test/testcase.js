var ModuleTestPageVisibilityEvent = (function(global) {

//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit && /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

return new Test("PageVisibilityEvent", {
        disable:    false,
        browser:    true,
        worker:     false,
        node:       false,
        button:     false,
        both:       false,
    }).add([
//        testAPI,
    ]).run().clone();

function testAPI(test, pass, miss) {
    test.done(pass());
}

})((this || 0).self || global);

