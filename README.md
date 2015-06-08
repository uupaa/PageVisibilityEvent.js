# PageVisibilityEvent.js [![Build Status](https://travis-ci.org/uupaa/PageVisibilityEvent.js.svg)](https://travis-ci.org/uupaa/PageVisibilityEvent.js)

[![npm](https://nodei.co/npm/uupaa.pagevisibilityevent.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.pagevisibilityevent.js/)

PageVisibilityEvent.js is event dispatcher.

## Document

- PageVisibilityEvent.js made of [WebModule](https://github.com/uupaa/WebModule).
- [Spec](https://github.com/uupaa/PageVisibilityEvent.js/wiki/PageVisibilityEvent)

## Browser and NW.js(node-webkit)

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/PageVisibilityEvent.js"></script>
<script>
WebModule.PageVisibilityEvent.on(function(pageHide) { // @arg Boolean: true is page-hide
    console.log(pageHide ? "page hide"
                         : "page show");
});
</script>
```

