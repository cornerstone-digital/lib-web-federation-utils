import { ComponentType, lazy, LazyExoticComponent, ReactElement, useEffect, useState } from 'react'
import useFederatedModule from '@vf/federated-web-frontend-react/hooks/useFederatedModule/useFederatedModule'
import { FederatedModuleProps, FederatedModuleType } from './FederatedModule.types'

function FederatedModule<Props extends FederatedModuleType<unknown>>({
  module,
  props,
  stateComponents = {},
}: FederatedModuleProps<Props>): ReactElement | null {
  const [Component, setComponent] = useState<LazyExoticComponent<ComponentType<Props>> | null>(null)

  const [mfeModule, isLoading, error] = useFederatedModule(module)
  const { error: ErrorComponent } = stateComponents

  useEffect(() => {
    if (!isLoading) {
      const Comp = lazy(() => mfeModule as Promise<{ default: ComponentType<Props> }>)
      setComponent(Comp)
    }
  }, [mfeModule, isLoading, error])

  if (error) {
    return ErrorComponent ? <ErrorComponent /> : <div>Error</div>
  }

  // @ts-ignore
  return Component && <Component {...props} />
}

export default FederatedModule
