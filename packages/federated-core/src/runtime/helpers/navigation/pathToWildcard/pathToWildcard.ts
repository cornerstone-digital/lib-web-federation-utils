const pathToWildcard = (path: string): string => {
  return `^${path.replace(/\*/g, '.*')}$`
}

export default pathToWildcard
