import addStyleTag from './addStyleTag'

describe('addStyleTag', () => {
  it('should add a style tag to the document', () => {
    const id = 'test'
    const css = 'test'
    addStyleTag(id, css)
    expect(document.querySelector(`style[id="${id}"]`)).toBeTruthy()
  })

  it('should add a style tag to the document with the correct css', () => {
    const id = 'test'
    const css = 'test'
    addStyleTag(id, css)
    expect(
      document.querySelector<HTMLStyleElement>(`style[id="${id}"]`)?.innerHTML
    ).toContain(css)
  })

  it('should add a style tag to the document with the correct id', () => {
    const id = 'test'
    const css = 'test'
    addStyleTag(id, css)
    expect(
      document.querySelector<HTMLStyleElement>(`style[id="${id}"]`)?.id
    ).toContain(id)
  })

  it('should add a style tag to the document with the correct type', () => {
    const id = 'test'
    const css = 'test'
    addStyleTag(id, css)
    expect(
      document.querySelector<HTMLStyleElement>(`style[id="${id}"]`)?.type
    ).toContain('text/css')
  })
})
