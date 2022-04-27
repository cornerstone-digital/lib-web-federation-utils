import Axios from 'axios'
// @ts-ignore
import hydrate from '@vfuk/lib-web-prerender/helpers/hydrate'

const loadModuleManifest = async (scope: string, moduleName: string, version?: string) => {
  const getAppBasePath = (scope: string) => window.Federated['appBasePaths'][scope]
  let manifestBaseUrl = `${getAppBasePath(scope)}/${moduleName}`
  if (version) manifestBaseUrl += `/${version}`

  const manifestUrl = `${manifestBaseUrl}/manifest.json`
  try {
    const { data } = await hydrate(
      manifestUrl,
      () => {
        return Axios.get(manifestUrl)
      },
      true,
    )
    return data
  } catch (error) {
    console.log(error)
  }
}

export default loadModuleManifest
