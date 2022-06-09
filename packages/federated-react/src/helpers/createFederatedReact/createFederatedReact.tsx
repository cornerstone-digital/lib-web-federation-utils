import { ReactElement } from 'react'

import { CreateFederatedReactOptions } from './createFederatedReact.types'

import {
  eventService,
  FederatedModule,
  FederatedModuleLifecycles,
  FederatedModuleStatuses,
  getModuleKey,
} from '@vf/federated-core'

function reactDomRender<PropsType>(
  opts: CreateFederatedReactOptions<PropsType>,
  elementToRender: ReactElement,
  domElement: HTMLElement
) {
  const renderType =
    typeof opts.renderType === 'function'
      ? opts.renderType()
      : opts.renderType || 'render'

  if (renderType === 'hydrate') {
    opts.ReactDOM.hydrate(elementToRender, domElement)
  } else {
    // default to this if 'renderType' is null or doesn't match the other options
    opts.ReactDOM.render(elementToRender, domElement)
  }

  return null
}

function createFederatedReact<PropsType>(
  options: CreateFederatedReactOptions<PropsType>
) {
  const { React, ReactDOM, federatedRuntime, config } = options
  let { rootComponent } = config
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

  let domContainer = document.getElementById(domElementId)

  if (!federatedRuntime) {
    throw new Error(`Federated runtime not found.`)
  }

  const moduleKey = getModuleKey(scope, name)
  const lifecycles: FederatedModuleLifecycles<PropsType> = {
    bootstrap: async () => {
      eventService.emit({
        payload: { name, scope },
        type: `federated-core:${moduleKey}:module-bootstrapping`,
      })
      federatedRuntime.setModuleState(
        { scope, name },
        FederatedModuleStatuses.BOOTSTRAPPING
      )

      if (rootComponent) {
        return Promise.resolve() // Root component is already loaded
      }

      if (loadRootComponent) rootComponent = await loadRootComponent()
    },
    mount: async (props?: PropsType, mountId?: string) => {
      try {
        if (lifecycles.bootstrap) await lifecycles.bootstrap()
        federatedRuntime.setModuleState(
          { scope, name },
          FederatedModuleStatuses.MOUNTING
        )
        const propsToUse = props || defaultProps
        federatedRuntime.validateProps({ scope, name }, propsToUse)

        if (mountId) {
          const mountIdElement = document.getElementById(mountId)
          if (!mountIdElement) {
            throw new Error(
              `No DOM container '${mountId}' found for ${getModuleKey(
                scope,
                name
              )}`
            )
          }
          domContainer = mountIdElement
        }

        if (rootComponent) {
          const rootComponentElement = React.createElement(
            rootComponent,
            propsToUse
          )

          if (domContainer) {
            reactDomRender(options, rootComponentElement, domContainer)
          }

          eventService.emit({
            payload: {
              name,
            },
            type: `federated-core:${moduleKey}:module-mounted`,
          })
          federatedRuntime.setModuleState(
            { scope, name },
            FederatedModuleStatuses.MOUNTED
          )
        }
      } catch (error) {
        eventService.emit({
          payload: {
            error,
            name,
          },
          type: `federated-core:${moduleKey}:module-mount-error`,
        })
        federatedRuntime.setModuleState(
          { scope, name },
          FederatedModuleStatuses.LOAD_ERROR
        )
      }
    },
    unmount: () => {
      try {
        federatedRuntime.setModuleState(
          { scope, name },
          FederatedModuleStatuses.UNMOUNTING
        )
        if (domContainer) {
          ReactDOM.unmountComponentAtNode(domContainer)

          eventService.emit({
            payload: {
              name,
            },
            type: `federated-core:${moduleKey}:module-unmounted`,
          })
          federatedRuntime.setModuleState(
            { scope, name },
            FederatedModuleStatuses.UNMOUNTED
          )
        }
      } catch (error) {
        eventService.emit({
          payload: {
            error,
            name,
          },
          type: `federated-core:${moduleKey}:module-unmount-error`,
        })
        federatedRuntime.setModuleState(
          { scope, name },
          FederatedModuleStatuses.UNMOUNT_ERROR
        )
      }
    },
    update: (props?: PropsType) => {
      try {
        federatedRuntime.setModuleState(
          { scope, name },
          FederatedModuleStatuses.UPDATING
        )
        const propsToUse = props || defaultProps
        if (lifecycles.unmount) lifecycles.unmount()
        if (lifecycles.mount) lifecycles.mount(propsToUse)
        eventService.emit({
          payload: {
            name,
          },
          type: `federated-core:${moduleKey}:module-updated`,
        })
      } catch (error) {
        eventService.emit({
          payload: {
            error,
            name,
          },
          type: `federated-core:${moduleKey}:module-update-error`,
        })
        federatedRuntime.setModuleState(
          { scope, name },
          FederatedModuleStatuses.UPDATE_ERROR
        )
      }
    },
  }

  const module: FederatedModule<PropsType> = {
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

  return module
}

export default createFederatedReact
