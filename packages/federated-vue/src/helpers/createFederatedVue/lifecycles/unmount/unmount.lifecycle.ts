import {
  AbstractFederatedRuntime,
  EventMap,
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
} from '@vf/federated-core'

import { CreateFederatedVueOptions } from '../../createFederatedVue.types'

const unmountLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: AbstractFederatedRuntime,
  opts: CreateFederatedVueOptions<PropsType>
) => {
  try {
    const { Vue } = opts
    const domElementId = opts.config.domElementId || `${module.name}`
    const domContainer: HTMLElement | null =
      document.getElementById(domElementId)

    if (domContainer) {
      federatedRuntime.setModuleState(
        module,
        FederatedModuleStatuses.UNMOUNTING
      )
      Vue.render(null, domContainer)

      eventService.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_UNMOUNTED,
          payload: {
            module,
          },
        },
        module
      )

      federatedRuntime?.setModuleState(
        module,
        FederatedModuleStatuses.UNMOUNTED
      )
    }
  } catch (error) {
    eventService.emit<EventMap>(
      {
        type: FederatedEvents.MODULE_UNMOUNT_ERROR,
        payload: {
          module,
          error: error as Error,
        },
      },
      module
    )
    federatedRuntime?.setModuleState(
      module,
      FederatedModuleStatuses.UNMOUNT_ERROR
    )
  }
}

export default unmountLifecycle
