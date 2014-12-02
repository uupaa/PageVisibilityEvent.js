var tabID = ("" + Date.now()).slice(-2);

if (PageVisibilityEvent) {
    PageVisibilityEvent.on(function(pageHide) { // @arg Boolean:
        if (pageHide) {
            title = tabID + "\u25a0"; // stop icon
        } else {
            title = tabID + "\u25b6"; // play icon
        }
        document.title = title;
    });
}

var storage = localStorage;

window.addEventListener("load", function(event) {
    storage.setItem("load", tabID);
});
window.addEventListener("unload", function(event) {
    storage.setItem("unload", tabID);
});
window.addEventListener("beforeunload", function(event) {
    storage.setItem("beforeunload", tabID);
  //event.returnValue = "leave this page?";
});
window.addEventListener("pageshow", function(event) {
    storage.setItem("pageshow", tabID);
});
window.addEventListener("pagehide", function(event) {
    storage.setItem("pagehide", tabID);
});
window.addEventListener("focus", function(event) {
    storage.setItem("focus", tabID);
});
window.addEventListener("blur", function(event) {
    storage.setItem("blur", tabID);
});

document.addEventListener("visibilitychange", function(event) {
    var state = document.webkitHidden ? "hidden" : "show";
    storage.setItem("visibilitychange:" + state, tabID);
});

// logging other page events
window.addEventListener("storage", function(storageEvent) { // { key, oldValud, newValue, url, storageArea }
    var targetTabID = storageEvent.newValue;

    if (tabID !== targetTabID) {
        traceOther(storageEvent.key, targetTabID);
    }
});

var lineBreakCounter = 0;

function traceOther(msg, tab) {
    var traceWindow = document.querySelector("#trace");

    var span = document.createElement("span");
    span.setAttribute("value", msg);

    span.appendChild( document.createTextNode(tab + ":" + msg) );

    var lineBreak = ++lineBreakCounter % 16 === 0;

    if (msg === "load") {
        lineBreak = true;
    }
    if (lineBreak) {
        lineBreakCounter = 0;
        traceWindow.appendChild( document.createElement("br") );
    }
    traceWindow.appendChild(span);
}

