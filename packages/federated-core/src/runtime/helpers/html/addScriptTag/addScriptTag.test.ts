import addScriptTag from './addScriptTag'

describe('addScriptTag', () => {
  it('should add a script tag to the document', () => {
    const id = 'test'
    const src = 'test'
    const onload = jest.fn()
    addScriptTag(id, src, onload)
    expect(document.querySelector(`script[id="${id}"]`)).toBeTruthy()
  })

  it('should add a script tag to the document with the correct src', () => {
    const id = 'test'
    const src = 'test'
    const onload = jest.fn()
    addScriptTag(id, src, onload)
    expect(
      document.querySelector<HTMLScriptElement>(`script[id="${id}"]`)?.src
    ).toContain(src)
  })
})
