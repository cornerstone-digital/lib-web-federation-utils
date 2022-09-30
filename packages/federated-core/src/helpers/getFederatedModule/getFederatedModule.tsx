import { initFederatedRuntime } from '../../runtime'
import { FederatedModule, FederatedModuleParams } from '../../types'

const getFederatedModule = ({
  name,
  basePath,
}: FederatedModuleParams): Promise<FederatedModule<unknown> | undefined> => {
  const federatedRuntime = initFederatedRuntime()

  return federatedRuntime
    .loadModule({ name, basePath })
    .catch((error: unknown) => {
      console.error(name, basePath, error)
      return undefined
    })
}

export default getFederatedModule
