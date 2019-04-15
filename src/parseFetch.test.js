import parseFetch from './parseFetch'

describe('parseFetch', () => {
  it('can parse simplest fetch', () => {
    const parsed = parseFetch('GET http://testing.com')
    expect(parsed).toEqual({
      url: 'http://testing.com',
      options: {
        method: 'GET'
      }
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
        method: 'GET',
        headers: {
          Foo: 'Bar',
          Fuzz: 'Bizz'
        }
      }
    })
  })
})
