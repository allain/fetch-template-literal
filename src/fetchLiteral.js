import parseFetch from './parseFetch.js'

function fetchLiteral (template, ...substitutions) {
  if (typeof template === 'function') {
    const fetch = template
    return (template, ...substitutions) =>
      doFetch(String.raw(template, ...substitutions), fetch)
  } else {
    // normal template path
    return doFetch(String.raw(template, ...substitutions), global.fetch)
  }

  function doFetch (requestSpec, fetch) {
    const parsed = parseFetch(requestSpec)
    return fetch(parsed.url, parsed.options)
  }
}

export default fetchLiteral
