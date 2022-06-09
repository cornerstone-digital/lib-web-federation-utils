import pathToWildcard from './pathToWildcard'

describe('pathToWildcard', () => {
  it('should return the correct wildcard', () => {
    const path = '/test/*/id'
    expect(pathToWildcard(path)).toBe('^/test/.*/id$')
  })

  it('should return a starts with regex if the path is not a wildcard', () => {
    const path = '/test'
    expect(pathToWildcard(path)).toBe('^/test$')
  })
})
