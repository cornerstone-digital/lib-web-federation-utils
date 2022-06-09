import addLinkTag from './addLinkTag'

describe('addLinkTag', () => {
  it('should add a link tag to the document', () => {
    const id = 'test'
    const rel = 'test'
    const href = 'test'
    addLinkTag(id, rel, href)
    expect(document.querySelector(`link[id="${id}"]`)).toBeTruthy()
  })

  it('should add a link tag to the document with the correct rel', () => {
    const id = 'test'
    const rel = 'test'
    const href = 'test'
    addLinkTag(id, rel, href)
    expect(
      document.querySelector<HTMLLinkElement>(`link[id="${id}"]`)?.rel
    ).toContain(rel)
  })

  it('should add a link tag to the document with the correct href', () => {
    const id = 'test'
    const rel = 'test'
    const href = 'test'
    addLinkTag(id, rel, href)
    expect(
      document.querySelector<HTMLLinkElement>(`link[id="${id}"]`)?.href
    ).toContain(href)
  })
})
