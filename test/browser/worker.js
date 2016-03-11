// PageVisibilityEvent test

onmessage = function(event) {
    self.unitTest = event.data; // { message, setting: { secondary, baseDir } }

    if (!self.console) { // polyfill WebWorkerConsole
        self.console = function() {};
        self.console.dir = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
        self.console.table = function() {};
    }

    importScripts("../../lib/WebModule.js");

    WebModule.verify  = true;
    WebModule.verbose = true;
    WebModule.publish = true;

    
    
    
    
    

    self.postMessage(self.unitTest);
};

