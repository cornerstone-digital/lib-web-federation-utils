import matchPathToUrlPaths from '../matchPathToUrlPaths'

describe('matchPathToUrlPaths', () => {
  it('should return false if the path is empty', () => {
    const path = ''
    expect(matchPathToUrlPaths(path, ['/'])).toBe(false)
  })

  it('should return false if path does not match any of the urlPaths', () => {
    const path = '/test'
    expect(matchPathToUrlPaths(path, ['/'])).toBe(false)
  })

  it('should return true if path matches any of the urlPaths', () => {
    const path = '/test'
    expect(matchPathToUrlPaths(path, ['/test'])).toBe(true)
  })
})
