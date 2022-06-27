import { FederatedModuleLifecycles } from '@vf/federated-core'
import { CreateFederatedVueOptions } from './createFederatedVue.types'

// Lifecycles
import bootstrapLifecycle from './lifecycles/bootstrap'
import mountLifecycle from './lifecycles/mount'
import unmountLifecycle from './lifecycles/unmount'
import updateLifecycle from './lifecycles/update'

function createFederatedVue<PropsType>(
  options: CreateFederatedVueOptions<PropsType>
) {
  const { config, federatedRuntime } = options

  const {
    scope,
    name,
    type,
    description,
    domElementId,
    rootComponent,
    loadRootComponent,
    propValidationFunction,
    activeWhenPaths,
    exceptWhenPaths,
  } = config

  const moduleData = { scope, name }

  const lifecycles: FederatedModuleLifecycles<PropsType> = {
    bootstrap: () => bootstrapLifecycle(moduleData, federatedRuntime),
    mount: (props, mountId) =>
      mountLifecycle<PropsType>(
        moduleData,
        federatedRuntime,
        options,
        props as PropsType
      )(props, mountId),
    unmount: async () =>
      unmountLifecycle(moduleData, federatedRuntime, options),
    update: async (props?: PropsType) =>
      updateLifecycle(moduleData, federatedRuntime, options)(props),
  }

  return {
    domElementId,
    rootComponent,
    loadRootComponent,
    activeWhenPaths: activeWhenPaths || [],
    exceptWhenPaths: exceptWhenPaths || [],
    description,
    name,
    scope,
    type,
    validateProps: (props: PropsType) => {
      if (propValidationFunction) {
        return propValidationFunction(props)
      }

      return true
    },
    ...lifecycles,
  }
}

export default createFederatedVue
