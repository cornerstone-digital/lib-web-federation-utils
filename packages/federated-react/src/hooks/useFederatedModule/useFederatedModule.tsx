import { useEffect, useState } from 'react'
import { FederatedModule, FederatedModuleLifecycles } from '@vf/federated-core'
import { useFederatedRuntime } from '../useFederatedRuntime'

type UseFederatedModuleProps = {
  name: string
  scope: string
}
const useFederatedModule = ({
  name,
  scope,
}: UseFederatedModuleProps): FederatedModuleLifecycles<unknown> | null => {
  const federatedRuntime = useFederatedRuntime()
  const [module, setModule] =
    useState<FederatedModuleLifecycles<unknown> | null>(null)

  const mountModule = async () => {
    const loadedModule: FederatedModule | undefined =
      await federatedRuntime.loadModule({ scope, name })

    if (loadedModule) setModule(loadedModule)
  }

  useEffect(() => {
    mountModule().then(() => undefined)
  }, [scope, name])

  return module
}

export default useFederatedModule
