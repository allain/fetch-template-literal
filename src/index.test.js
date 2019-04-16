import e from './index'
import fetchLiteral from './fetchLiteral'

describe('main module export', () => {
  it('is fetchTemplate', () => {
    expect(e).toBe(fetchLiteral)
  })
})
