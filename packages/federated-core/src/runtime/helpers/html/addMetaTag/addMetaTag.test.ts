import addMetaTag from './addMetaTag'

describe('addMetaTag', () => {
  it('should add a meta tag to the document', () => {
    const id = 'test'
    const name = 'test'
    const content = 'test'
    addMetaTag(id, name, content)
    expect(document.querySelector(`meta[id="${id}"]`)).toBeTruthy()
  })

  it('should add a meta tag to the document with the correct name', () => {
    const id = 'test'
    const name = 'test'
    const content = 'test'
    addMetaTag(id, name, content)
    expect(
      document.querySelector<HTMLMetaElement>(`meta[id="${id}"]`)?.name
    ).toContain(name)
  })

  it('should add a meta tag to the document with the correct content', () => {
    const id = 'test'
    const name = 'test'
    const content = 'test'
    addMetaTag(id, name, content)
    expect(
      document.querySelector<HTMLMetaElement>(`meta[id="${id}"]`)?.content
    ).toContain(content)
  })

  it('should add a meta tag to the document with the correct id', () => {
    const id = 'test'
    const name = 'test'
    const content = 'test'
    addMetaTag(id, name, content)
    expect(
      document.querySelector<HTMLMetaElement>(`meta[id="${id}"]`)?.id
    ).toContain(id)
  })
})
