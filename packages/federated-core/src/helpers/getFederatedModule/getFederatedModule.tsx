import { getFederatedRuntime } from '../../runtime'
import { FederatedModule } from '../../types'

type UseFederatedModuleProps = {
  name: string
  scope: string
}

const getFederatedModule = ({
  name,
  scope,
}: UseFederatedModuleProps): Promise<FederatedModule<unknown> | undefined> => {
  const federatedRuntime = getFederatedRuntime()
  const loadModule = federatedRuntime
    .loadModule({ name, scope })
    .catch((error) => {
      console.error(error)
      return undefined
    })

  return loadModule
}

export default getFederatedModule
