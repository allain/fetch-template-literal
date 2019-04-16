const mapToJson = m =>
  m.size
    ? [...m.entries()].reduce(
      (map, [key, value]) => ({ ...map, [key]: value }),
      {}
    )
    : undefined

export default function parseFetch (content) {
  const { method, path } = extractRequestLine(content)
  const headersMap = extractHeaders(content)
  const contentType = headersMap.get('content-type')

  const body = extractBody(content, contentType)

  let url
  if (path[0] === '/') {
    // no host given in request line, looking in headers
    const host = headersMap.get('host')
    headersMap.delete('host')
    url = 'http://' + host + path
  } else {
    url = path
  }

  const optionsMap = new Map()
  if (body) optionsMap.set('body', body)
  if (method && !method.match(/^get$/i)) optionsMap.set('method', method)

  const headers = mapToJson(headersMap)
  if (headers) optionsMap.set('headers', headers)
  const options = mapToJson(optionsMap)

  return JSON.parse(
    JSON.stringify({
      url,
      options
    })
  )
}

function extractRequestLine (content) {
  const requestLineParts = /^\s*([A-Z]+)\s+([^\s]+)(\s+([^\s+]))?\s*(\r?\n|$)/.exec(
    content
  )

  return {
    method: requestLineParts[1],
    path: requestLineParts[2],
    httpVersion: requestLineParts[4]
  }
}

function extractHeaders (content) {
  const contentParts = content.split(/\n\n|\r\n\r\n/, 2)
  const head = contentParts.length === 2 ? contentParts[0] : content

  const headers = new Map()

  const headerBlock = head.replace(/^\s+.*(\r?\n)/, '')
  if (headerBlock) {
    for (let line of headerBlock.split(/\r?\n/g)) {
      const lineParts = /^\s+([^:]+):\s*(.*)\s*$/.exec(line)
      if (lineParts) {
        headers.set(lineParts[1].toLowerCase(), lineParts[2])
      }
    }
  }
  return headers
}

function extractBody (content, contentType) {
  const contentParts = content.split(/\n\n|\r\n\r\n/, 2)
  if (contentParts.length === 2) {
    const rawBody = contentParts.length === 2 ? contentParts[1] : content

    const shouldTrimBody =
      contentType && contentType.match(/^application\/json/)

    return shouldTrimBody ? rawBody.trim() : rawBody
  }
}
