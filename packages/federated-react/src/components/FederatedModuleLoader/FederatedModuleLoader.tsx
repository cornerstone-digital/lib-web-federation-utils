import React from 'react'
import type { FederatedModule, FederatedModuleParams } from '@vf/federated-core'
import { getFederatedModule } from '@vf/federated-core'
import { v4 } from 'uuid'

type FederatedModuleLoaderProps<PropTypes> = FederatedModuleParams & {
  props: PropTypes
  mountId?: string
  loadingComponent?: React.ReactNode
}

function FederatedModuleLoader<PropTypes>({
  scope,
  name,
  basePath,
  props,
  mountId = `${scope}-${name}-${v4()}`,
  loadingComponent = <div>Loading...</div>,
}: FederatedModuleLoaderProps<PropTypes>) {
  let isLoading = true
  if (typeof window !== 'undefined') {
    const module = getFederatedModule({ scope, name, basePath })

    module.then((module: FederatedModule | undefined) => {
      if (module?.mount) {
        isLoading = false
        void module.mount(props, mountId)
      }
    })
  }

  return (
    <>
      {isLoading && loadingComponent}
      <div id={mountId}></div>
    </>
  )
}

export default FederatedModuleLoader
