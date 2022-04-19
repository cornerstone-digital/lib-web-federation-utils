import Axios from 'axios'

const loadModuleManifest = async (scope: string, moduleName: string, version: string) => {
  const getAppBasePath = (scope: string) => window.Federated['appBasePaths'][scope]
  const manifestUrl = `${getAppBasePath(scope)}/${moduleName}/${version}/manifest.json`
  try {
    const { data } = await Axios.get(manifestUrl)
    return data
  } catch (error) {
    console.log(error)
  }
}

export default loadModuleManifest
