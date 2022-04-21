import Axios from 'axios'

const loadModuleManifest = async (scope: string, moduleName: string, version?: string) => {
  const getAppBasePath = (scope: string) => window.Federated['appBasePaths'][scope]
  let manifestBaseUrl = `${getAppBasePath(scope)}/${moduleName}`
  if (version) manifestBaseUrl += `/${version}`

  const manifestUrl = `${manifestBaseUrl}/manifest.json`
  try {
    const { data } = await Axios.get(manifestUrl)
    return data
  } catch (error) {
    console.log(error)
  }
}

export default loadModuleManifest
