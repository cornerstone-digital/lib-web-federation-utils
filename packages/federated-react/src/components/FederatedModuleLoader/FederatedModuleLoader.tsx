import React from 'react'
import { FederatedModule, getFederatedModule } from '@vf/federated-core'
import { v4 } from 'uuid'

type FederatedModuleLoaderProps<PropTypes> = {
  scope: string
  name: string
  props: PropTypes
  mountId?: string
}

function FederatedModuleLoader<PropTypes>({
  scope,
  name,
  props,
  mountId = `${scope}-${name}-${v4()}`,
}: FederatedModuleLoaderProps<PropTypes>) {
  const module = getFederatedModule({ scope, name })

  module.then((module: FederatedModule | undefined) => {
    if (module?.mount) {
      module?.mount(props, mountId)
    }
  })

  return <div id={mountId} />
}

export default FederatedModuleLoader
