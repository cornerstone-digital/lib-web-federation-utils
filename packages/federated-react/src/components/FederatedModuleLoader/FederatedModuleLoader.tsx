import React, { useState } from 'react'
import type { FederatedModule, FederatedModuleParams } from '@vf/federated-core'
import { getFederatedModule } from '@vf/federated-core'
import { v4 } from 'uuid'

type FederatedModuleLoaderProps<PropTypes> = FederatedModuleParams & {
  props: PropTypes
  mountId?: string
  loadingComponent?: React.ReactNode
}

function FederatedModuleLoader<PropTypes>({
  name,
  basePath,
  props,
  mountId = `${name}-${v4()}`,
  loadingComponent = <div>Loading...</div>,
}: FederatedModuleLoaderProps<PropTypes>) {
  if (typeof window !== 'undefined') {
    const module = getFederatedModule({ name, basePath })

    module.then((module: FederatedModule | undefined) => {
      if (module?.mount) {
        void module.mount(props, mountId)
      }
    })
  }

  return (
    <>
      <div id={mountId}>{loadingComponent}</div>
    </>
  )
}

export default FederatedModuleLoader
