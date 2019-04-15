export default function parseFetch (content) {
  const { method, url } = extractRequestLine(content)
  const headers = extractHeaders(content)

  return JSON.parse(
    JSON.stringify({
      url,
      options: {
        method,
        headers
      }
    })
  )
}

function extractRequestLine (content) {
  const requestLineParts = /^\s*([A-Z]+)\s+([^\s]+)(\s+([^\s+]))?(\r?\n|$)/.exec(
    content
  )

  return {
    method: requestLineParts[1],
    url: requestLineParts[2],
    httpVersion: requestLineParts[4]
  }
}

function extractHeaders (content) {
  const head = content.substr(
    0,
    Math.max(
      content.indexOf('\n\n'),
      content.indexOf('\r\n\r\n'),
      content.length
    )
  )
  const headerBlock = head.replace(/^\s+.*(\r?\n)/, '')
  if (!headerBlock) return

  let headerCount = 0
  const headers = {}
  for (let line of headerBlock.split(/\r?\n/g)) {
    const lineParts = /^\s+([^:]+):\s*(.*)\s*$/.exec(line)
    if (lineParts) {
      headers[lineParts[1]] = lineParts[2]
      headerCount++
    }
  }
  return headerCount ? headers : undefined
}
