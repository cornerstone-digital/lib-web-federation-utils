const getGlobalEnvVar = (varName: string, namespace?: string) => {
  if (!window.VFUK) {
    throw new Error('window.VFUK is not defined')
  }

  const vfukVar: string | Record<string, unknown> = window.VFUK

  if (namespace) {
    const namespaceVar = window.VFUK[namespace] as Record<string, unknown>

    if (!namespaceVar) {
      throw new Error(`window.VFUK.${namespace} is not defined`)
    }

    return namespaceVar[varName]
  } else {
    return vfukVar[varName]
  }
}

export default getGlobalEnvVar
