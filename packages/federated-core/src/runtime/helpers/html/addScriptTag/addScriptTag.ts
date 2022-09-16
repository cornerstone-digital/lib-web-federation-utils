const addScriptTag = (id: string, src: string, onload?: () => void): void => {
  if (document.getElementById(id)) {
    return
  }

  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.crossOrigin = 'anonymous'
  if (onload) script.onload = onload
  document.head.appendChild(script)
}

export default addScriptTag
