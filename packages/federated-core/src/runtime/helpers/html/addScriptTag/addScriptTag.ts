const addScriptTag = (id: string, src: string, onload?: () => void): void => {
  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.crossOrigin = 'anonymous'
  if (onload) script.onload = onload
  document.body.appendChild(script)
}

export default addScriptTag
