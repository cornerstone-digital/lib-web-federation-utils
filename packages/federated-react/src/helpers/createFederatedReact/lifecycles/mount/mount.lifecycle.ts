import {
  AbstractFederatedRuntime,
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  moduleHelpers,
  EventMap,
} from '@vf/federated-core'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'
import createdErrorBoundary from '../../helpers/createErrorBoundary/createErrorBoundary'
import reactDomRender from '../../helpers/reactDomRender'
import { ComponentType, ReactElement } from 'react'

const mountLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: AbstractFederatedRuntime,
  opts: CreateFederatedReactOptions<PropsType>,
  defaultProps: PropsType
) => {
  const defaultMountId = `${module.name}`
  return async (
    props: PropsType = defaultProps as PropsType,
    mountId?: string
  ) => {
    const {
      React,
      config: { name, domElementId },
    } = opts
    let { rootComponent } = opts.config
    const moduleKey = moduleHelpers.getModuleKey(name)
    const savedModule = federatedRuntime.modules.get(moduleKey)
    const elementId = mountId || domElementId || defaultMountId
    const domContainer: HTMLElement | null = document.getElementById(elementId)

    if (!domContainer) {
      eventService.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_MOUNT_ERROR,
          payload: {
            module,
            error: new Error(
              `Could not find dom container with id ${domElementId}`
            ),
          },
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

      if (rootComponent) {
        const rootComponentElement = React.createElement(
          rootComponent,
          propsToUse
        )

        const errorBoundary = createdErrorBoundary(opts)

        const elementToRender: ReactElement = React.createElement(
          errorBoundary,
          {} as PropsType,
          rootComponentElement
        )

        eventService.emit<EventMap>(
          {
            type: FederatedEvents.MODULE_BEFORE_MOUNT,
            payload: {
              module,
            },
          },
          module
        )

        if (domContainer) {
          reactDomRender(opts, elementToRender, domContainer)
        }

        eventService.emit<EventMap>(
          {
            type: FederatedEvents.MODULE_MOUNTED,
            payload: {
              module,
            },
          },
          module
        )

        federatedRuntime?.setModuleState(
          { name },
          FederatedModuleStatuses.MOUNTED
        )
      }
    } catch (error) {
      eventService.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_MOUNT_ERROR,
          payload: {
            module,
            error: error as Error,
          },
        },
        module
      )

      federatedRuntime?.setModuleState(
        { name },
        FederatedModuleStatuses.LOAD_ERROR
      )
    }
  }
}

export default mountLifecycle
