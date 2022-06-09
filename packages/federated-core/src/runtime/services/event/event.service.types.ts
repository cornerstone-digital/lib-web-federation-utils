import { FederatedModuleParams } from '../../../types'
import {
  FederatedEventPayloadMap,
  FederatedEventKeys,
} from '../../FederatedRuntime.types'

export type EventStoreMap = Map<
  string,
  { type: FederatedEventKeys; fn: EventListener }
>

export type EventServiceType = {
  eventStore: EventStoreMap
  replaceModuleKey: (type: string, module: FederatedModuleParams) => string
  unregister(id: string): void
  register(
    type: FederatedEventKeys,
    fn: EventListener,
    module?: FederatedModuleParams
  ): () => void
  unregisterAll(): void
  clear(): void
  emit(
    type: FederatedEventKeys,
    payload: FederatedEventPayloadMap[typeof type],
    module?: FederatedModuleParams
  ): void
}
