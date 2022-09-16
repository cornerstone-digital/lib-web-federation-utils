const getGlobalEnvVar = (varName: string, namespace?: string) => {
  if (!window.VFUK) {
    throw new Error('window.VFUK is not defined')
  }

  const vfukVar: string | Record<string, unknown> = window.VFUK

  if (vfukVar && namespace) {
    if (!vfukVar[namespace]) {
      throw new Error(`window.VFUK.${namespace} is not defined`)
    }
    const namespaceVar = vfukVar[namespace] as Record<string, unknown>

    return namespaceVar[varName]
  } else {
    return vfukVar[varName]
  }
}

export default getGlobalEnvVar
