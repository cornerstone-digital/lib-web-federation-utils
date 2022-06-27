import {
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  AbstractFederatedRuntime,
  EventMap,
} from '@vf/federated-core'

const bootstrapLifecycle = async (
  module: FederatedModuleParams,
  federatedRuntime: AbstractFederatedRuntime
) => {
  try {
    eventService.emit<EventMap>(
      {
        type: FederatedEvents.MODULE_BEFORE_BOOTSTRAP,
        payload: {
          module,
        },
      },
      module
    )
    federatedRuntime?.setModuleState(
      module,
      FederatedModuleStatuses.BOOTSTRAPPING
    )

    eventService.emit<EventMap>(
      {
        type: FederatedEvents.MODULE_BOOTSTRAPPED,
        payload: {
          module,
        },
      },
      module
    )

    federatedRuntime?.setModuleState(
      module,
      FederatedModuleStatuses.BOOTSTRAPPED
    )
  } catch (error) {
    eventService.emit<EventMap>(
      {
        type: FederatedEvents.MODULE_BOOTSTRAP_ERROR,
        payload: {
          module,
          error: error as Error,
        },
      },
      module
    )
  }
}

export default bootstrapLifecycle
