# PageVisibilityEvent.js [![Build Status](https://travis-ci.org/uupaa/PageVisibilityEvent.js.svg)](https://travis-ci.org/uupaa/PageVisibilityEvent.js)

[![npm](https://nodei.co/npm/uupaa.pagevisibilityevent.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.pagevisibilityevent.js/)

PageVisibilityEvent.js is event dispatcher.


This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/PageVisibilityEvent.js/wiki/)
- [API Spec](https://github.com/uupaa/PageVisibilityEvent.js/wiki/PageVisibilityEvent)


## Browser compatibility

| Browser      | PageVisibilityEvent.on |
|--------------|------------------------|
| Safari       | 6.1+                   |
| Chrome       | 33+                    |
| AOSP Browser | 4.0+                   |
| Firefox      | :o:                    |
| Edge         | :o:                    |
| IE           | 10+                    |

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/PageVisibilityEvent.js"></script>
<script>
if (PageVisibilityEvent.enable) {
    PageVisibilityEvent.on(function(hidden) {
        console.log(hidden ? "page hide"
                           : "page show");
    });
}
</script>
```

