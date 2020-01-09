import parseFetch from './parseFetch.js'

function fetchLiteral(template, ...subs) {
  return typeof template === 'function'
    ? buildFetcherLiteral(template)
    : performFetch(interpolate(template, subs), global.fetch)
}

function buildFetcherLiteral(fetch) {
  return (template, ...subs) =>
    performFetch(interpolate(template, subs), fetch)
}

function performFetch(requestSpec, fetch) {
  const parsed = parseFetch(requestSpec)
  return fetch(parsed.url, parsed.options)
}

const interpolate = (template, subs) => {
  return typeof template === 'string'
    ? template // no-op
    : String.raw(template, ...subs.map(stringify))
}

function stringify(x) {
  switch (typeof (x)) {
    case 'object':
      if (x == null) {
        throw new Error(`invalid value for substitution: ${x}`)
      }
      break;
    case 'function':
      throw new Error(`invalid value for substitution: ${x}`)
  }
  return JSON.stringify(x)
}

export default fetchLiteral
