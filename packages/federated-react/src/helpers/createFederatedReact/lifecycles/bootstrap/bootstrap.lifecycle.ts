import {
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  AbstactFederatedRuntime,
} from '@vf/federated-core'

const bootstrapLifecycle = async (
  module: FederatedModuleParams,
  federatedRuntime: AbstactFederatedRuntime
) => {
  try {
    eventService.emit(
      FederatedEvents.MODULE_BEFORE_BOOTSTRAP,
      {
        module,
      },
      module
    )
    federatedRuntime?.setModuleState(
      module,
      FederatedModuleStatuses.BOOTSTRAPPING
    )

    eventService.emit(
      FederatedEvents.MODULE_BOOTSTRAPPED,
      {
        module,
      },
      module
    )

    federatedRuntime?.setModuleState(
      module,
      FederatedModuleStatuses.BOOTSTRAPPED
    )
  } catch (error) {
    eventService.emit(
      FederatedEvents.MODULE_BOOTSTRAP_ERROR,
      {
        module,
        error: error as Error,
      },
      module
    )
  }
}

export default bootstrapLifecycle
