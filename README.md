PageVisibility.js
=========

PageVisibility event dispatcher

```js
PageVisibilityEvent.on(function(pageHide) {
    console.log(pageHide ? "page hide" : "page show");
});
```

PageVisibilityEvent は ブラウザの Page Visibility Event またはそれに類似したイベント(focus, blur)をハンドリングし、
ページの切り替えをフックする機会を提供します。

# Install, Setup modules

```sh
$ git clone git@github.com:uupaa/PageVisibilityEvent.js.git
$ cd PageVisibilityEvent.js
$ npm install

    npm http GET https://registry.npmjs.org/uupaa.task.js
    npm http 200 https://registry.npmjs.org/uupaa.task.js
    uupaa.task.js@0.8.0 node_modules/uupaa.task.js
```

# Test

```sh
$ npm test
```


