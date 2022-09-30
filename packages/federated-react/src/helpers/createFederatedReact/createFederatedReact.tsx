import {
  CreateFederatedReactOptions,
  FederatedReactApp,
} from './createFederatedReact.types'

import {
  FederatedModuleLifecycles,
  FederatedModuleStatuses,
} from '@vf/federated-core'

import bootstrapLifecycle from './lifecycles/bootstrap/bootstrap.lifecycle'
import mountLifecycle from './lifecycles/mount/mount.lifecycle'
import unmountLifecycle from './lifecycles/unmount'
import updateLifecycle from './lifecycles/update'

function validateModuleOptions<PropsType>(
  options: CreateFederatedReactOptions<PropsType>
) {
  if (!options.config) {
    throw new Error('Missing config')
  }

  if (!options.React) {
    throw new Error('Missing React')
  }

  if (!options.ReactDOM) {
    throw new Error('Missing ReactDOM')
  }

  if (!options.config.name) {
    throw new Error('Missing name')
  }

  if (!options.config.rootComponent) {
    throw new Error('Missing rootComponent')
  }
}

function createFederatedReact<PropsType>(
  options: CreateFederatedReactOptions<PropsType>
): FederatedReactApp<PropsType> {
  validateModuleOptions(options)

  const { federatedRuntime, config } = options
  const { rootComponent } = config
  const {
    domElementId = `${config.name}`,
    defaultProps,
    name,

    type,
    description,
    propValidationFunction,
    activeWhenPaths,
    exceptWhenPaths,
  } = config
  const moduleData = { name }
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
    activeWhenPaths: activeWhenPaths || [],
    exceptWhenPaths: exceptWhenPaths || [],
    status: FederatedModuleStatuses.NOT_LOADED,
    description,
    name,
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

export default createFederatedReact
