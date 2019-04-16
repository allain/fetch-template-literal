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
