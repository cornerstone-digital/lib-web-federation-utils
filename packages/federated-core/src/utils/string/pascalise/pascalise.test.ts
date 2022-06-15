import pascalise from '../pascalise'

describe('pascalise', () => {
  it('should uppercase first letter when passed single lowercase word', () => {
    expect(pascalise('test')).toBe('Test')
  })

  it('should uppercase first letter of each word and remove spaces when passed multiple lowercase words', () => {
    expect(pascalise('test test')).toBe('TestTest')
  })

  it('should pascalise a string with hyphens', () => {
    expect(pascalise('test-test')).toBe('TestTest')
  })
})
