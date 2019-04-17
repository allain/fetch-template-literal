# fetch-template-literal

A tool for making http requests using template literals and `fetch`. It is heavily influenced by [http-template-literal](https://github.com/pfrazee/http-template-literal) but focuses on [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) exlusively.

## Installation

```bash
npm install --save fetch-template-literal
```

## Browser Usage (with bundler)

```js
const ftl = require('fetch-template-literal')

const result = await ftl`
  POST https://httpbin.org/post/
  Content-Type: application/json

  {"example": true}`

// result is a fetch Response and exposes the expected fields (like .json(), .status, etc)
const json = await result.json()
```



## Node.js Usage
`node.js` doesn't support fetch by default, so `fetch-template-literal` can be used as a factory function into which you pass the implementation of fetch you want to use. The example below uses node-fetch.
```js
const fetch = require('node-fetch') 
const ftl = require('fetch-template-literal')(fetch)

const result = await ftl`
  POST https://httpbin.org/post/
  Content-Type: application/json

  {"example": true}`

// result is a fetch Response and exposes the expected fields (like .json(), .status, etc)
const json = await result.json()
```




