const addHtmlElementWithAttrs = (
  id: string,
  tagName: string,
  attrs: { [key: string]: string }
): void => {
  const element = document.createElement(tagName)
  element.id = id
  Object.keys(attrs).forEach((key) => {
    element.setAttribute(key, attrs[key])
  })

  document.body.appendChild(element)
}

export default addHtmlElementWithAttrs
