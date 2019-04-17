import parseFetch from './parseFetch.js'

const interpolate = (template, substitutions) =>
  typeof template === 'string'
    ? template // no-op
    : String.raw(template, ...substitutions)

function performFetch (requestSpec, fetch) {
  const parsed = parseFetch(requestSpec)
  return fetch(parsed.url, parsed.options)
}

function fetchLiteral (template, ...substitutions) {
  return typeof template === 'function'
    ? buildFetcherLiteral(template)
    : performFetch(interpolate(template, substitutions), global.fetch)
}

function buildFetcherLiteral (fetch) {
  return (template, ...substitutions) =>
    performFetch(interpolate(template, substitutions), fetch)
}
export default fetchLiteral
