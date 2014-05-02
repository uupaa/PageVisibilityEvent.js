PageVisibilityEvent.on(function(pageHide) { // @arg Boolean:
    document.title = pageHide ? "\u25a0"  // stop icon
                              : "\u25b6"; // play icon
});

window.addEventListener("load",         function(event) { log(event.type); });
window.addEventListener("unload",       function(event) { log(event.type); });
window.addEventListener("beforeunload", function(event) { log(event.type); return "leave?"; });
window.addEventListener("pageshow",     function(event) { log(event.type); });
window.addEventListener("pageshow",     function(event) { log(event.type); });
window.addEventListener("pagehide",     function(event) { log(event.type); });
window.addEventListener("focus",        function(event) { log(event.type); });
window.addEventListener("blur",         function(event) { log(event.type); });
document.addEventListener("visibilitychange",       _visibilitychange);
document.addEventListener("webkitvisibilitychange", _visibilitychange);

function _visibilitychange(event) {
    log(event.type + ":" + (document.webkitHidden ? "hidden" : "show"));
}

function log(msg) {
    console.log(msg);
    document.body.innerHTML += msg + "<br />";
}

