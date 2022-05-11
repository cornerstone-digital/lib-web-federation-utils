import { CreateFederatedReactOptions } from './createFederatedReact.types'
import React, { ErrorInfo } from 'react'
import { FederatedModule, FederatedModuleLifecycles, FederatedModuleStatuses } from '@vf/federated-web-core'

const createErrorBoundary = () => {
  type ErrorBoundaryProps = {
    children?: React.ReactNode
  }

  type ErrorBoundaryState = {
    hasError: boolean
  }

  class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
      console.error(error)
      // Update state so the next render will show the fallback UI.
      return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      // You can also log the error to an error reporting service
      console.error(error, errorInfo)
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>
      }

      return this.props.children
    }
  }

  return ErrorBoundary
}

function createFederatedReact<PropsType>(options: CreateFederatedReactOptions<PropsType>) {
  const { React, ReactDOM, federatedRuntime, config } = options
  const {
    domElementId,
    rootComponent,
    defaultProps,
    name,
    scope,
    description,
    propValidationFunction,
    errorBoundary,
    activeWhenPaths,
    eventListeners,
  } = config
  const domContainer = document.getElementById(domElementId)

  if (!federatedRuntime) {
    throw new Error(`Federated runtime not found.`)
  }

  if (!domContainer) {
    throw new Error(`No DOM container '${domElementId}' found for ${federatedRuntime.getModuleKey(scope, name)}`)
  }

  const hasChildrenDom = domContainer.children.length > 0
  const renderMethod = hasChildrenDom ? ReactDOM.hydrate : ReactDOM.render

  const lifecycles: FederatedModuleLifecycles<PropsType> = {
    bootstrap: async () => {
      federatedRuntime.emit({ payload: { name, scope }, type: 'federated-core:module-bootstrapping' })
      federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.BOOTSTRAPPING)

      if (lifecycles.mount) {
        await lifecycles.mount()
      }
    },
    mount: (props?: typeof defaultProps, mountId?: string) => {
      try {
        federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.MOUNTING)
        const propsToUse = props || defaultProps
        federatedRuntime.validateProps(scope, name, propsToUse)
        const rootComponentElement = React.createElement(rootComponent, propsToUse)
        const errorBoundaryElement = errorBoundary || createErrorBoundary()
        const rootComponentWithErrorBoundary = React.createElement(errorBoundaryElement, propsToUse, rootComponentElement)
        if (mountId) {
          renderMethod(rootComponentWithErrorBoundary, document.getElementById(mountId))
        } else {
          renderMethod(rootComponentWithErrorBoundary, domContainer)
        }

        federatedRuntime.emit({
          payload: {
            name,
          },
          type: 'federated-core:module-mounted',
        })
        federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.MOUNTED)
      } catch (error) {
        federatedRuntime.emit({
          payload: {
            error,
            name,
          },
          type: 'federated-core:module-mount-error',
        })
        federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.LOAD_ERROR)
      }
    },
    unmount: () => {
      try {
        federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.UNMOUNTING)
        ReactDOM.unmountComponentAtNode(domContainer)
        federatedRuntime.emit({
          payload: {
            name,
          },
          type: 'federated-core:module-unmounted',
        })
        federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.UNMOUNTED)
      } catch (error) {
        federatedRuntime.emit({
          payload: {
            error,
            name,
          },
          type: 'federated-core:module-unmount-error',
        })
        federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.UNMOUNT_ERROR)
      }
    },
    update: (props?: typeof defaultProps) => {
      try {
        federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.UPDATING)
        const propsToUse = props || defaultProps
        if (lifecycles.unmount) lifecycles.unmount()
        if (lifecycles.mount) lifecycles.mount(propsToUse)
        federatedRuntime.emit({
          payload: {
            name,
          },
          type: 'federated-core:module-updated',
        })
      } catch (error) {
        federatedRuntime.emit({
          payload: {
            error,
            name,
          },
          type: 'federated-core:module-update-error',
        })
        federatedRuntime.setModuleState(scope, name, FederatedModuleStatuses.UPDATE_ERROR)
      }
    },
  }

  const module: FederatedModule<PropsType> = {
    activeWhenPaths: activeWhenPaths || [],
    description,
    eventListeners: eventListeners || {},
    name,
    scope,
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
