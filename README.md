# PageVisibilityEvent.js [![Build Status](https://travis-ci.org/uupaa/PageVisibilityEvent.js.png)](http://travis-ci.org/uupaa/PageVisibilityEvent.js)

[![npm](https://nodei.co/npm/uupaa.pagevisibilityevent.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.pagevisibilityevent.js/)

PageVisibilityEvent.js is event dispatcher.

## Document

- [PageVisibilityEvent.js wiki](https://github.com/uupaa/PageVisibilityEvent.js/wiki/PageVisibilityEvent)
    - [PageVisibilityEvent W3C spec](http://www.w3.org/TR/page-visibility/)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)


## How to use

### Browser

```js
<script src="lib/PageVisibilityEvent.js"></script>
<script>
// for Browser

PageVisibilityEvent.on(function(pageHide) { // @arg Boolean: true is page-hide
    console.log(pageHide ? "page hide"
                         : "page show");
});

</script>
```
