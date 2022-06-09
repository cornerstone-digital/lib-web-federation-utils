const getModuleKey = (scope: string, moduleName: string): string => {
  return `${scope}:${moduleName}`
}

export default getModuleKey
