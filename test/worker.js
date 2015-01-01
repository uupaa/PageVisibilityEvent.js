onmessage = function(event) {
    self.TEST_DATA = event.data; // WebModule/lib/Test.js
    self.TEST_ERROR_MESSAGE = "";

    if (!self.console) {
        self.console = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
    }

    

    self.postMessage({ TEST_ERROR_MESSAGE: self.TEST_ERROR_MESSAGE || "" });
};
