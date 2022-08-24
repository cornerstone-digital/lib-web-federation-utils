import { initFederatedRuntime } from '../../runtime'
import { FederatedModule, FederatedModuleParams } from '../../types'

const getFederatedModule = ({
  name,
  scope,
  basePath,
}: FederatedModuleParams): Promise<FederatedModule<unknown> | undefined> => {
  const federatedRuntime = initFederatedRuntime()

  return federatedRuntime
    .loadModule({ name, scope, basePath })
    .catch((error: unknown) => {
      console.error(name, scope, basePath, error)
      return undefined
    })
}

export default getFederatedModule
