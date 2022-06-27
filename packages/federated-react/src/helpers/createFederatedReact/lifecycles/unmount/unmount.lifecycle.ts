import {
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  AbstractFederatedRuntime,
  EventMap,
} from '@vf/federated-core'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'

const unmountLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: AbstractFederatedRuntime,
  opts: CreateFederatedReactOptions<PropsType>
) => {
  try {
    const { ReactDOM } = opts

    federatedRuntime?.setModuleState(module, FederatedModuleStatuses.UNMOUNTING)

    const domElementId =
      opts.config.domElementId || `${module.scope}-${module.name}`
    const domContainer: HTMLElement | null =
      document.getElementById(domElementId)

    if (domContainer) {
      ReactDOM.unmountComponentAtNode(domContainer)

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
