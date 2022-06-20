import {
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  AbstactFederatedRuntime,
  getModuleKey,
} from '@vf/federated-core'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'

const updateLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: AbstactFederatedRuntime,
  opts: CreateFederatedReactOptions<PropsType>
) => {
  return async (props?: PropsType) => {
    try {
      federatedRuntime?.setModuleState(module, FederatedModuleStatuses.UPDATING)
      const propsToUse = props || opts.config.defaultProps
      const moduleKey = getModuleKey(module.scope, module.name)
      const loadedModule = federatedRuntime.modules.get(moduleKey)

      eventService.emit(
        FederatedEvents.MODULE_BEFORE_UPDATE,
        {
          module,
        },
        module
      )

      if (!loadedModule) {
        throw new Error(`Could not find module with key ${moduleKey}`)
      }

      if (loadedModule?.unmount) {
        await loadedModule.unmount()
      }
      if (loadedModule?.mount) {
        await loadedModule.mount(propsToUse)
      }

      eventService.emit(
        FederatedEvents.MODULE_UPDATED,
        {
          module: module,
        },
        module
      )
    } catch (error) {
      eventService.emit(
        FederatedEvents.MODULE_UPDATE_ERROR,
        {
          module: module,
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
