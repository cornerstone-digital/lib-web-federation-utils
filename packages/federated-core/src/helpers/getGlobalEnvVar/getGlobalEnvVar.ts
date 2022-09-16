const getGlobalEnvVar = (varName: string, namespace?: string) => {
  if (!window.VFUK) {
    console.error('window.VFUK is not defined')

    return
  }

  if (!window.VFUK['env']) {
    console.error('window.VFUK.env is not defined')

    return
  }

  const vfukVar: string | Record<string, unknown> = window.VFUK[
    'env'
  ] as Record<string, unknown>

  if (namespace && vfukVar[namespace]) {
    const namespaceVar = vfukVar[namespace] as Record<string, unknown>

    return namespaceVar[varName] || vfukVar[varName]
  }

  return vfukVar[varName]
}

export default getGlobalEnvVar
