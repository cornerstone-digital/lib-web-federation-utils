import { ReactElement, useRef, useState, useEffect } from 'react'
import { useFederatedModule } from '@vf/federated-web-frontend-react/src/hooks'

import { FederatedModuleProps, FederatedModuleType } from './FederatedModule.types'

function FederatedModule<Props extends FederatedModuleType<unknown>>({
  module,
  props,
  fallback,
  stateComponents = {},
}: FederatedModuleProps<Props>): ReactElement | null {
  const FallbackComp: ReactElement | undefined = fallback
  const { name, scope } = module
  const compId = `${scope}-${name}`

  const staticComponent = useRef(document.getElementById(compId))
  const [Component, setComponent] = useState<System.Module | null>(null)

  const { mfeModule, isLoading, error } = useFederatedModule(module)
  const { error: ErrorComponent } = stateComponents

  useEffect(() => {
    if (!isLoading) {
      setComponent(mfeModule)
    }
  }, [isLoading])

  const Fallback = staticComponent.current // @ts-ignore
    ? () => <div id={compId} dangerouslySetInnerHTML={{ __html: staticComponent.current.innerHTML }} />
    : FallbackComp

  if (Fallback && (!Component || error)) {
    // @ts-ignore
    return <Fallback />
  }

  if (error) {
    return ErrorComponent ? <ErrorComponent /> : <div>Error</div>
  }
  return (
    <div id={compId}>
      {/** @ts-ignore */}
      <Component {...props} />
    </div>
  )
}

export default FederatedModule