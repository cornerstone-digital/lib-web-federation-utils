import React, { useEffect, useState } from 'react'
import {
  FederatedModuleLifecycles,
  getFederatedRuntime,
} from '@vf/federated-core'

type UseFederatedModuleProps = {
  name: string
  scope: string
}

const useFederatedModule = ({
  name,
  scope,
}: UseFederatedModuleProps): Partial<
  FederatedModuleLifecycles<unknown>
> | null => {
  const federatedRuntime = getFederatedRuntime()
  const [module, setModule] = useState<Partial<
    FederatedModuleLifecycles<unknown>
  > | null>(null)

  const mountModule = async () => {
    try {
      const loadedModule = await federatedRuntime?.loadModule({ scope, name })

      if (loadedModule) setModule(loadedModule)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    mountModule().then(() => undefined)
  }, [scope, name])

  return module
}

export default useFederatedModule
