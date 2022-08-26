import {
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  AbstractFederatedRuntime,
  getModuleKey,
  EventMap,
} from '@vf/federated-core'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'

const updateLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: AbstractFederatedRuntime,
  opts: CreateFederatedReactOptions<PropsType>
) => {
  return async (props?: PropsType) => {
    try {
      federatedRuntime?.setModuleState(module, FederatedModuleStatuses.UPDATING)
      const propsToUse = props || opts.config.defaultProps
      const moduleKey = getModuleKey(module.scope, module.name)
      const loadedModule = federatedRuntime.modules.get(moduleKey)

      eventService.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_BEFORE_UPDATE,
          payload: {
            module,
          },
        },
        module
      )

      if (loadedModule?.unmount) {
        await loadedModule.unmount()
      }
      if (loadedModule?.mount) {
        await loadedModule.mount(propsToUse)
      }

      eventService.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_UPDATED,
          payload: {
            module: module,
          },
        },
        module
      )
    } catch (error) {
      eventService.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_UPDATE_ERROR,
          payload: {
            module: module,
            error: error as Error,
          },
        },
        module
      )
      federatedRuntime?.setModuleState(
        module,
        FederatedModuleStatuses.UPDATE_ERROR
      )
    }
  }
}

export default updateLifecycle
