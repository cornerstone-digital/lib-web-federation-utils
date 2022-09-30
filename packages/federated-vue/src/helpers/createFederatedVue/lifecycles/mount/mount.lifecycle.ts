import {
  AbstractFederatedRuntime,
  EventMap,
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  getModuleKey,
} from '@vf/federated-core'

import { CreateFederatedVueOptions } from '../../createFederatedVue.types'
import { Component } from 'vue'

const mountLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: AbstractFederatedRuntime,
  opts: CreateFederatedVueOptions<PropsType>,
  defaultProps: PropsType
) => {
  const defaultMountId = `${module.name}`
  return async (
    props: PropsType = defaultProps as PropsType,
    mountId?: string
  ) => {
    try {
      const {
        Vue,
        config: { name, domElementId },
      } = opts

      let { rootComponent } = opts.config

      federatedRuntime.setModuleState(module, FederatedModuleStatuses.MOUNTING)
      const propsToUse = module || defaultProps
      federatedRuntime.validateProps(module, propsToUse)

      const moduleKey = getModuleKey(name)
      const savedModule = federatedRuntime.modules.get(moduleKey)
      const elementId = mountId || domElementId || defaultMountId
      const domContainer: HTMLElement | null =
        document.getElementById(elementId)

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
        federatedRuntime.getModuleRootComponent(module)) as Component<PropsType>

      const rootComponentElement = Vue.createApp(rootComponent)

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
        rootComponentElement.mount(domContainer)

        eventService.emit<EventMap>(
          {
            type: FederatedEvents.MODULE_MOUNTED,
            payload: {
              module,
            },
          },
          module
        )

        federatedRuntime.setModuleState(module, FederatedModuleStatuses.MOUNTED)
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
        module,
        FederatedModuleStatuses.LOAD_ERROR
      )
    }
  }
}

export default mountLifecycle
