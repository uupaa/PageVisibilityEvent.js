=========
PageVisibilityEvent.js
=========

![](https://travis-ci.org/uupaa/PageVisibilityEvent.js.png)

PageVisibilityEvent.js is event dispatcher.

# Document

- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [PageVisibilityEvent.js wiki](https://github.com/uupaa/PageVisibilityEvent.js/wiki/PageVisibilityEvent)


# How to use

```js
<script src="lib/PageVisibilityEvent.js">
<script>
// for Browser

PageVisibilityEvent.on(function(pageHide) { // @arg Boolean: true is page-hide
    console.log(pageHide ? "page hide"
                         : "page show");
});

</script>
```
