import Axios from 'axios'

const loadModuleManifest = async (scope: string, modulePath: string) => {
  // @ts-ignore
  const getAppBasePath = (scope: string) => window.VFUK['@vfuk/basePaths'][scope]
  const routePath = getAppBasePath(scope)
  const manifestUrl = `${routePath}${modulePath}/manifest.json`
  try {
    const { data } = await Axios.get(manifestUrl)
    return data
  } catch (error) {
    console.log(error)
  }
}

export default loadModuleManifest
