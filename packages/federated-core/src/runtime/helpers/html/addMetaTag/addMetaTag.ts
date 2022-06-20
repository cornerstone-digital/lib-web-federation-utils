const addMetaTag = (id: string, name: string, content: string): void => {
  if (document.getElementById(id)) {
    return
  }

  const meta = document.createElement('meta')
  meta.id = id
  meta.content = content
  meta.name = name
  document.head.appendChild(meta)
}

export default addMetaTag
