import {
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  FederatedRuntimeType,
  getModuleKey,
} from '@vf/federated-core'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'
import createdErrorBoundary from '../../helpers/createErrorBoundary/createErrorBoundary'
import reactDomRender from '../../helpers/reactDomRender'
import { ComponentType } from 'react'

const mountLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: FederatedRuntimeType,
  opts: CreateFederatedReactOptions<PropsType>,
  defaultProps: PropsType
) => {
  const defaultMountId = `${module.scope}-${module.name}`
  return async (
    props: PropsType = defaultProps as PropsType,
    mountId?: string
  ) => {
    const { React } = opts
    let { scope, name, domElementId, rootComponent } = opts.config
    const moduleKey = getModuleKey(scope, name)
    const savedModule = federatedRuntime.modules.get(moduleKey)
    let domContainer: HTMLElement | null

    domElementId = mountId || domElementId || defaultMountId
    domContainer = document.getElementById(domElementId)

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

      if (rootComponent) {
        const rootComponentElement = React.createElement(
          rootComponent,
          propsToUse
        )

        const errorBoundary = createdErrorBoundary(opts)

        let elementToRender = React.createElement(errorBoundary, {
          children: rootComponentElement,
        })

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
