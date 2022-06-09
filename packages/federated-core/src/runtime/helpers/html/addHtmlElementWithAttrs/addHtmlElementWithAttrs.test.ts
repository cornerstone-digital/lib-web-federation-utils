import addHtmlElementWithAttrs from './addHtmlElementWithAttrs'

describe('addHtmlElementWithAttrs', () => {
  it('should add an element to the document', () => {
    const id = 'test'
    const tag = 'div'
    const attrs = {
      id: 'test',
      class: 'test',
      style: 'test',
    }
    addHtmlElementWithAttrs(id, tag, attrs)
    expect(document.querySelector(`${tag}[id="${id}"]`)).toBeTruthy()
  })

  it('should add an element to the document with the correct id', () => {
    const id = 'test'
    const tag = 'div'
    const attrs = {
      id: 'test',
      class: 'test',
      style: 'test',
    }
    addHtmlElementWithAttrs(id, tag, attrs)
    expect(document.querySelector(`${tag}[id="${id}"]`)?.id).toContain(id)
  })

  it('should add an element to the document with the correct class', () => {
    const id = 'test'
    const tag = 'div'
    const attrs = {
      id: 'test',
      class: 'test',
      style: 'test',
    }
    addHtmlElementWithAttrs(id, tag, attrs)
    expect(document.querySelector(`${tag}[id="${id}"]`)?.className).toContain(
      'test'
    )
  })
})
