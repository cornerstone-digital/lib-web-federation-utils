const addStyleTag = (id: string, css: string): void => {
  const style = document.createElement('style')
  style.id = id
  style.innerHTML = css
  style.type = 'text/css'
  document.head.appendChild(style)
}

export default addStyleTag
