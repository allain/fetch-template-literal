# fetch-template-literal

A tool for making http requests using template literals and `fetch`. It is heavily influenced by [http-template-literal](https://www.google.com/search?q=http-template-literal) but focuses on fetch exlusively.

`fetch` is a tool for making http requests. It's comparatively simple, but it obfusciates some of the undeflying `HTTP` plumbing.

`fetch-template-literal` aims at making things less abstract. "you get what you see".

## Browser Usage

```js
const ftl = require('fetch-template-literal')

const content = await ftl`
  POST https://httpbin.org/post/
  Content-Type: application/json

  {"example": true}
```

## Node.js Usage
```js
const fetch = require('node-fetch') // because node.js doesn't support fetch by default
const ftl = require('fetch-template-literal')(fetch)

const content = await ftl`
  POST https://httpbin.org/post/
  Content-Type: application/json

  {"example": true}
```




