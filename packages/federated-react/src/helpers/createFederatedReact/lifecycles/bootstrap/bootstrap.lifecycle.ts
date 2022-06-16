import {
  eventService,
  FederatedEvents,
  FederatedModuleParams,
  FederatedModuleStatuses,
  FederatedRuntimeType,
  getModuleKey,
} from '@vf/federated-core'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'
import { ComponentType } from 'react'

const bootstrapLifecycle = async <PropsType>(
  module: FederatedModuleParams,
  federatedRuntime: FederatedRuntimeType
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
