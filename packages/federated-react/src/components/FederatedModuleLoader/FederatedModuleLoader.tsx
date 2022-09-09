import React from 'react'
import type { FederatedModule, FederatedModuleParams } from '@vf/federated-core'
import { getFederatedModule } from '@vf/federated-core'
import { v4 } from 'uuid'

type FederatedModuleLoaderProps<PropTypes> = FederatedModuleParams & {
  props: PropTypes
  mountId?: string
}

function FederatedModuleLoader<PropTypes>({
  scope,
  name,
  basePath,
  props,
  mountId = `${scope}-${name}-${v4()}`,
}: FederatedModuleLoaderProps<PropTypes>) {
  if (typeof window !== 'undefined') {
    const module = getFederatedModule({ scope, name, basePath })

    module.then((module: FederatedModule | undefined) => {
      if (module?.mount) {
        module?.mount(props, mountId)
      }
    })
  }

  return <div id={mountId} />
}

export default FederatedModuleLoader
