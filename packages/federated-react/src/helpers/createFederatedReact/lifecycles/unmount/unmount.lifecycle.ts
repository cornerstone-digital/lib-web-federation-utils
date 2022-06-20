import {
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  AbstactFederatedRuntime,
} from '@vf/federated-core'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'

const unmountLifecycle = <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: AbstactFederatedRuntime,
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

      eventService.emit(
        FederatedEvents.MODULE_UNMOUNTED,
        {
          module,
        },
        module
      )

      federatedRuntime?.setModuleState(
        module,
        FederatedModuleStatuses.UNMOUNTED
      )
    }
  } catch (error) {
    eventService.emit(
      FederatedEvents.MODULE_UNMOUNT_ERROR,
      {
        module,
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
