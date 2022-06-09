import pathToWildcard from '../pathToWildcard'

const matchPathToUrlPaths = (path: string, urlPaths: string[]): boolean => {
  const matchFound = urlPaths.find((activePath) => {
    const wildcardRegex = new RegExp(pathToWildcard(activePath))
    return wildcardRegex.test(path)
  })

  return !!matchFound
}

export default matchPathToUrlPaths
