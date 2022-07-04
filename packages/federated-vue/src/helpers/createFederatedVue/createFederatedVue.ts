import { FederatedModuleLifecycles } from '@vf/federated-core'
import {
  CreateFederatedVueOptions,
  FederatedVueApp,
} from './createFederatedVue.types'

// Lifecycles
import bootstrapLifecycle from './lifecycles/bootstrap'
import mountLifecycle from './lifecycles/mount'
import unmountLifecycle from './lifecycles/unmount'
import updateLifecycle from './lifecycles/update'

function validateModuleOptions<PropsType>(
  options: CreateFederatedVueOptions<PropsType>
) {
  if (!options.config) {
    throw new Error('Missing config')
  }

  if (!options.Vue) {
    throw new Error('Missing Vue')
  }

  if (!options.config.name) {
    throw new Error('Missing name')
  }

  if (!options.config.scope) {
    throw new Error('Missing scope')
  }

  if (!options.config.rootComponent && !options.config.loadRootComponent) {
    throw new Error('Missing rootComponent or loadRootComponent')
  }

  if (options.config.rootComponent && options.config.loadRootComponent) {
    throw new Error('Cannot have both rootComponent and loadRootComponent')
  }
}

function createFederatedVue<PropsType>(
  options: CreateFederatedVueOptions<PropsType>
): FederatedVueApp<PropsType> {
  validateModuleOptions(options)

  const { config, federatedRuntime } = options
  const { rootComponent } = config

  const {
    domElementId = `${config.scope}-${config.name}`,
    loadRootComponent,
    defaultProps,
    name,
    scope,
    type,
    description,
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
        defaultProps as PropsType
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
