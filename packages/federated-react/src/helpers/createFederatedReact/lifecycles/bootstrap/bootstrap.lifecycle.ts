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
  federatedRuntime: FederatedRuntimeType,
  opts: CreateFederatedReactOptions<PropsType>
) => {
  let { rootComponent, loadRootComponent } = opts.config

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

    let loadedRootComponent

    if (loadRootComponent) {
      loadedRootComponent = await loadRootComponent()
      rootComponent = loadedRootComponent.default as ComponentType<PropsType>

      federatedRuntime.setModuleRootComponent<'react', PropsType>(
        module,
        rootComponent
      )
    }

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
