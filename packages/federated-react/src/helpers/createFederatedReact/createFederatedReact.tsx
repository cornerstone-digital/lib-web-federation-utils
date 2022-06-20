import {
  CreateFederatedReactOptions,
  FederatedReactApp,
} from './createFederatedReact.types'

import { FederatedModuleLifecycles } from '@vf/federated-core'

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

function createFederatedReact<PropsType>(
  options: CreateFederatedReactOptions<PropsType>
): FederatedReactApp<PropsType> {
  validateModuleOptions(options)

  const { federatedRuntime, config } = options
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
    eventListeners,
  } = config

  const moduleData = { scope, name }
  const lifecycles: FederatedModuleLifecycles<PropsType> = {
    bootstrap: () =>
      bootstrapLifecycle<PropsType>(moduleData, federatedRuntime),
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
    eventListeners: eventListeners || {},
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

export default createFederatedReact
