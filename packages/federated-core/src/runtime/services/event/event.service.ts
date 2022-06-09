import { getModuleKey } from '../../helpers'
import { FederatedModule, FederatedModuleParams } from '../../../types'
import { EventServiceType, EventStoreMap } from './event.service.types'
import {
  FederatedEventPayloadMap,
  FederatedEventKeys,
} from 'src/runtime/FederatedRuntime.types'

export const eventStore: EventStoreMap = new Map()

const unregister = (id: string) => {
  const event = eventStore.has(id) ? eventStore.get(id) : null

  if (event) {
    const { type, fn } = event
    window.removeEventListener(type, fn)
    eventStore.delete(id)
  }
}

const register = (
  type: FederatedEventKeys,
  fn: EventListener,
  module?: FederatedModuleParams
) => {
  const id = `${type}__${Date.now()}__${Math.floor(Math.random() * 1000)}`
  let eventType: string = type
  if (module) {
    eventType = replaceModuleKey(eventType, module)
  }

  eventStore.set(id, { type, fn })
  window.addEventListener(eventType, fn)

  return () => unregister(id)
}

const replaceModuleKey = (type: string, module: FederatedModuleParams) => {
  return type.replace(`%moduleKey%`, getModuleKey(module.scope, module.name))
}

const emit = (
  type: FederatedEventKeys,
  payload: FederatedEventPayloadMap[typeof type],
  module?: FederatedModule
): void => {
  let eventType: string = type
  if (module?.name) {
    eventType = replaceModuleKey(eventType, module)
  }

  window.dispatchEvent(new CustomEvent(eventType, payload as object))
}

const unregisterAll = () => {
  eventStore.forEach((_value, key) => {
    unregister(key)
  })
}

const clear = () => {
  eventStore.clear()
}

const eventService: EventServiceType = {
  register,
  unregister,
  unregisterAll,
  emit,
  clear,
  replaceModuleKey,
  eventStore,
}

export default eventService
