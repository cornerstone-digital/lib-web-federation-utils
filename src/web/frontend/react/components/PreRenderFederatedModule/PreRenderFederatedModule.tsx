import { ReactElement, Suspense } from 'react'

import FederatedModule from '../FederatedModule'
import { FederatedModuleProps, FederatedModuleType } from '../FederatedModule/FederatedModule.types'

function PreRenderFederatedModule<Props extends FederatedModuleType<unknown>>({
  module,
  props,
  fallback,
  stateComponents = {},
}: FederatedModuleProps<Props>): ReactElement | null {
  const FallbackComp = fallback
  const { name, scope } = module
  const compId = `${scope}-${name}`

  const staticComponent = document.getElementById(compId)

  const Fallback = staticComponent ? <div dangerouslySetInnerHTML={{ __html: staticComponent.innerHTML }} /> : <FallbackComp />

  return (
    <div id={compId}>
      <Suspense fallback={Fallback}>
        <FederatedModule module={module} stateComponents={stateComponents} props={props} />
      </Suspense>
    </div>
  )
}

export default PreRenderFederatedModule
