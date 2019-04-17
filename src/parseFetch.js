import inso from 'insensitive-object'

const isDefined = x => typeof x !== 'undefined'

const isEmptyObject = obj => Object.keys(obj).length === 0

const trimmedContentTypes = [/^application\/json/]

export default function parseFetch (content) {
  const { method, path } = extractRequestLine(content)
  const headers = extractHeaders(content)
  const contentType = inso.get(headers, 'content-type')

  const body = extractBody(content, contentType)

  let url
  if (path[0] === '/') {
    // no host given in request line, looking in headers
    const host = inso.get(headers, 'host')
    inso.remove(headers, 'host')
    url = 'http://' + host + path
  } else {
    url = path
  }

  const options = {}
  if (body) options.body = body
  if (method && !method.match(/^get$/i)) options.method = method

  if (!isEmptyObject(headers)) options.headers = headers

  const result = { url }
  if (!isEmptyObject(options)) {
    result.options = options
  }
  return result
}

function extractRequestLine (content) {
  const requestLineParts = /^\s*([A-Z]+)\s+([^\s]+)(\s+([^\s]+))?\s*(\r?\n|$)/.exec(
    content
  )

  return {
    method: requestLineParts[1],
    path: requestLineParts[2],
    httpVersion: requestLineParts[4]
  }
}

function extractHeaders (content) {
  const contentParts = content.split(/(\n([ \t]*)\n)|(\r\n([ \t]*)\r\n)/, 2)
  const head = contentParts.length === 2 ? contentParts[0] : content

  const headers = {}

  const headerBlock = head.replace(/^\s+/, '').replace(/^[^\n]*(\n|$)/, '') // strip away request line
  if (headerBlock) {
    for (let line of headerBlock.split(/\r?\n/g)) {
      const lineParts = /^\s+([^:]+):\s*(.*)\s*$/.exec(line)
      if (lineParts) {
        const key = lineParts[1]
        const value = lineParts[2].trim()
        const currentValue = inso.get(headers, key)
        if (isDefined(currentValue)) {
          inso.set(headers, key, `${currentValue}, ${value}`, {
            keepOriginalCasing: true
          })
        } else {
          inso.set(headers, key, value)
        }
      }
    }
  }
  return headers
}

// Everything after the first two blank lines
function extractBody (content, contentType) {
  const contentParts = content.split(/\n[ \t]*\n|\r\n[ \t]*\r\n/, 2)
  if (contentParts.length === 1) return null

  const rawBody = contentParts[1]

  const shouldTrimBody =
    contentType &&
    trimmedContentTypes.find(matcher => contentType.match(matcher))

  return shouldTrimBody ? rawBody.trim() : rawBody
}
