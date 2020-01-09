import fetchLiteral from './fetchLiteral.js'

describe('fetchLiteral', () => {
  it('can accept fetch function', async () => {
    const f = jest.fn(async () => true)
    const ftl = fetchLiteral(f)
    expect(ftl).toBeInstanceOf(Function)

    const result = ftl`
        GET https://httpbin.org/get
        Accept: application/json`
    expect(result).toBeInstanceOf(Promise)
    expect(f).toHaveBeenCalledWith('https://httpbin.org/get', {
      headers: { Accept: 'application/json' }
    })
  })

  it('can accept a string as first param when using factory', async () => {
    const fetch = jest.fn(async () => true)

    const ftl = fetchLiteral(fetch)

    const result = ftl`
      GET https://httpbin.org/get
      Accept: application/json`
    expect(result).toBeInstanceOf(Promise)
    expect(fetch).toHaveBeenCalledWith('https://httpbin.org/get', {
      headers: { Accept: 'application/json' }
    })
  })

  it('can accept a string as first param when fetch global', async () => {
    const oldFetch = global.fetch
    try {
      global.fetch = jest.fn(async () => true)
      const result = fetchLiteral`
        GET https://httpbin.org/get
        Accept: application/json`

      expect(result).toBeInstanceOf(Promise)
      expect(global.fetch).toHaveBeenCalledWith('https://httpbin.org/get', {
        headers: { Accept: 'application/json' }
      })
    } finally {
      global.fetch = oldFetch
    }
  })

  it('interpolates objects as JSON', () => {
    const fetch = jest.fn(async () => true)

    const payload = { a: 1, b: ["c"], d: null }
    const ftl = fetchLiteral(fetch)

    const result = ftl`
      POST https://httpbin.org/post
      Content-Type: application/json
      Accept: application/json
      
      ${payload}`

    expect(result).toBeInstanceOf(Promise)
    expect(fetch).toHaveBeenCalledWith('https://httpbin.org/post', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      method: 'POST'
    })
  })

  it('uses global fetch if called without function first', () => {
    const oldFetch = global.fetch
    try {
      global.fetch = jest.fn(async () => true)

      const result = fetchLiteral`
        GET https://httpbin.org/get
        Accept: application/json`
      expect(result).toBeInstanceOf(Promise)
      expect(global.fetch).toHaveBeenCalledWith('https://httpbin.org/get', {
        headers: { Accept: 'application/json' }
      })
    } finally {
      global.fetch = oldFetch
    }
  })
})
