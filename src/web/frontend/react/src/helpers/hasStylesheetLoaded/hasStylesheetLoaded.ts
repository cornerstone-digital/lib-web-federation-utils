const hasStylesheetLoaded = (srcPath: string) => {
  const link = document.querySelector(`link[href="${srcPath}"]`)
  return link ? link.getAttribute('rel') === 'stylesheet' : false
}

export default hasStylesheetLoaded
