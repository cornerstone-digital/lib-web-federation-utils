const addLinkTag = (id: string, rel: string, href: string): void => {
  const link = document.createElement('link')
  link.id = id
  link.rel = rel
  link.href = href
  document.head.appendChild(link)
}

export default addLinkTag
