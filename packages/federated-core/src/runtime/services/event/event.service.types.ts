import { FederatedModuleParams } from '../../../types'
import { EventMap, EventTypeKeys } from '../../FederatedRuntime.types'

export type EventStoreMap = Map<string, { type: string; fn: EventListener }>

export type EventServiceType = {
  eventStore: EventStoreMap
  replaceModuleKey: (type: string, module: FederatedModuleParams) => string
  unregister(id: string): void
  register<EventKeys extends string>(
    type: EventTypeKeys<EventKeys>,
    fn: EventListener,
    module?: FederatedModuleParams
  ): () => void
  unregisterAll(): void
  clear(): void
  emit<EventsData extends EventMap>(
    event: EventMap<EventsData>,
    module?: FederatedModuleParams
  ): void
}
