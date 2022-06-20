import {
  AbstactFederatedRuntime,
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  getModuleKey,
} from '@vf/federated-core'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'
import createdErrorBoundary from '../../helpers/createErrorBoundary/createErrorBoundary'
import reactDomRender from '../../helpers/reactDomRender'
import { ComponentType, ReactElement, Suspense } from 'react'

const mountLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: AbstactFederatedRuntime,
  opts: CreateFederatedReactOptions<PropsType>,
  defaultProps: PropsType
) => {
  const defaultMountId = `${module.scope}-${module.name}`
  return async (
    props: PropsType = defaultProps as PropsType,
    mountId?: string
  ) => {
    const {
      React,
      config: { scope, name, domElementId },
    } = opts
    let { rootComponent } = opts.config
    const moduleKey = getModuleKey(scope, name)
    const savedModule = federatedRuntime.modules.get(moduleKey)
    const elementId = mountId || domElementId || defaultMountId
    const domContainer: HTMLElement | null = document.getElementById(elementId)

    if (!domContainer) {
      eventService.emit(
        FederatedEvents.MODULE_MOUNT_ERROR,
        {
          module,
          error: new Error(
            `Could not find dom container with id ${domElementId}`
          ),
        },
        module
      )
    }

    if (savedModule?.bootstrap) {
      await savedModule.bootstrap()
    }

    rootComponent = (rootComponent ||
      federatedRuntime.getModuleRootComponent(
        module
      )) as ComponentType<PropsType>

    try {
      federatedRuntime?.setModuleState(module, FederatedModuleStatuses.MOUNTING)
      const propsToUse = props || defaultProps
      federatedRuntime?.validateProps(module, propsToUse)

      let loadedRootComponent
      let useSuspense = false

      if (opts.config.loadRootComponent) {
        loadedRootComponent = await opts.config.loadRootComponent()
        rootComponent = loadedRootComponent as ComponentType<PropsType>

        federatedRuntime.setModuleRootComponent<'react', PropsType>(
          module,
          rootComponent
        )

        useSuspense = true
      }

      if (rootComponent) {
        const rootComponentElement = React.createElement(
          rootComponent,
          propsToUse
        )

        const errorBoundary = createdErrorBoundary(opts)

        let elementToRender: ReactElement = React.createElement(
          errorBoundary,
          {},
          rootComponentElement
        )

        if (useSuspense) {
          elementToRender = React.createElement(
            Suspense,
            { fallback: React.createElement('div', null, 'Loading...') },
            elementToRender
          )
        }

        eventService.emit(
          FederatedEvents.MODULE_BEFORE_MOUNT,
          {
            module,
          },
          module
        )

        if (domContainer) {
          reactDomRender(opts, elementToRender, domContainer)
        }

        eventService.emit(
          FederatedEvents.MODULE_MOUNTED,
          {
            module,
          },
          module
        )

        federatedRuntime?.setModuleState(
          { scope, name },
          FederatedModuleStatuses.MOUNTED
        )
      }
    } catch (error) {
      eventService.emit(
        FederatedEvents.MODULE_MOUNT_ERROR,
        {
          module,
          error: error as Error,
        },
        module
      )

      federatedRuntime?.setModuleState(
        { scope, name },
        FederatedModuleStatuses.LOAD_ERROR
      )
    }
  }
}

export default mountLifecycle
