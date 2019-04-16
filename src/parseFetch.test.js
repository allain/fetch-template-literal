import parseFetch from './parseFetch'

describe('parseFetch', () => {
  it('can parse simplest fetch', () => {
    const parsed = parseFetch('GET http://testing.com')
    expect(parsed).toEqual({
      url: 'http://testing.com'
    })
  })

  it('constructs full url from headers', () => {
    const parsed = parseFetch(`
      GET /
      Host: testing.com
    `)
    expect(parsed).toEqual({
      url: 'http://testing.com/'
    })
  })

  it('leaves header case untouched', () => {
    const parsed = parseFetch(`
      GET https://testing.com/
      ThIsIsFuN: blah
    `)
    expect(parsed).toEqual({
      url: 'https://testing.com/',
      options: {
        headers: {
          ThIsIsFuN: 'blah'
        }
      }
    })
  })

  it('parses case when no headers given', () => {
    const parsed = parseFetch(`
    POST https://testing.com/
    
    Blah Blah`)
    expect(parsed).toEqual({
      url: 'https://testing.com/',
      options: {
        body: '    Blah Blah',
        method: 'POST'
      }
    })
  })

  it('handles multiple headers with same name as fetch does', () => {
    const parsed = parseFetch(`
      GET https://testing.com/
      A: 1 
      A: 2 
      A: 3 
    `)
    expect(parsed.options.headers).toEqual({ A: '1, 2, 3' })
  })

  it('aggregates headers into header first encountered, regardless of case', () => {
    const parsed = parseFetch(`
      GET https://testing.com/
      AA: 1 
      aA: 2 
      Aa: 3 
    `)
    expect(parsed.options.headers).toEqual({ AA: '1, 2, 3' })
  })

  it('can parse headers when no body', () => {
    const parsed = parseFetch(`
    GET http://testing.com
    Foo: Bar
    Fuzz: Bizz
    `)
    expect(parsed).toEqual({
      url: 'http://testing.com',
      options: {
        headers: {
          Foo: 'Bar',
          Fuzz: 'Bizz'
        }
      }
    })
  })

  it('trims whitespace on JSON requests', () => {
    const parsed = parseFetch(`
      POST http://testing.com
      Content-Type: application/json

      ${JSON.stringify({ a: 10, b: { c: true } })}
    `)

    expect(parsed).toEqual({
      url: 'http://testing.com',
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{"a":10,"b":{"c":true}}'
      }
    })
  })
})
