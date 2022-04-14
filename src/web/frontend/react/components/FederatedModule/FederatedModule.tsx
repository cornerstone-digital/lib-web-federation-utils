import { ComponentType, lazy, LazyExoticComponent, ReactElement, useEffect, useState } from 'react'
import { FederatedModuleProps } from './FederatedModule.types'
import useFederatedModule from '../../hooks/useFederatedModule/useFederatedModule'

function FederatedModule<Props>({ module, props, stateComponents }: FederatedModuleProps<Props>): ReactElement | null {
  const [Component, setComponent] = useState<LazyExoticComponent<ComponentType<Props>> | null>(null)

  const [mfeModule, isLoading, error] = useFederatedModule(module)
  const { loading: LoadingComponent, error: ErrorComponent } = stateComponents

  useEffect(() => {
    if (!isLoading) {
      const Comp = lazy(() => mfeModule as Promise<{ default: ComponentType<Props> }>)
      setComponent(Comp)
    }
  }, [mfeModule, isLoading, error])

  if (isLoading) {
    return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>
  }

  if (error) {
    return ErrorComponent ? <ErrorComponent /> : <div>Error</div>
  }

  // @ts-ignore
  return Component && <Component {...props} />
}

export default FederatedModule
