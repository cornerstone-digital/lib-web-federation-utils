import {
  FederatedEventPayloadMap,
  FederatedRuntimeType,
  FederatedEvents,
} from '../runtime/FederatedRuntime.types'
import { eventService, loggerService } from '../runtime/services'

export type ImportMap = {
  imports: Record<string, string>
}

export enum FederatedModuleStatuses {
  NOT_LOADED = 'NOT_LOADED',
  LOADED = 'LOADED',
  BOOTSTRAPPING = 'BOOTSTRAPPING',
  NOT_MOUNTED = 'NOT_MOUNTED',
  MOUNTING = 'MOUNTING',
  MOUNTED = 'MOUNTED',
  UPDATING = 'UPDATING',
  UNMOUNTING = 'UNMOUNTING',
  UNMOUNT_ERROR = 'UNMOUNT_ERROR',
  UNMOUNTED = 'UNMOUNTED',
  UNLOADING = 'UNLOADING',
  LOAD_ERROR = 'LOAD_ERROR',
  UPDATE_ERROR = 'UPDATE_ERROR',
}

export type FederatedModuleStatusValues = `${FederatedModuleStatuses}`

export type FederatedModuleParams = Pick<FederatedModule, 'scope' | 'name'>

export type FederatedEvent<EventType extends FederatedEvents> = {
  type: EventType
  payload: FederatedEventPayloadMap[EventType]
  module?: FederatedModuleParams
}

export type ExposedServicesType = {
  event: typeof eventService
  logger: typeof loggerService
}

export type ExposedServiceKeys = keyof ExposedServicesType

export type RuntimeEventHandler = <
  EventType extends FederatedEvent<FederatedEvents>
>(
  event: EventType,
  RuntimeEngine: FederatedRuntimeType
) => void

export type FederatedModuleLifecycles<PropsType> = {
  bootstrap?: () => void
  mount?: (props?: PropsType, mountId?: string) => void
  unmount?: () => void
  update?: (props?: PropsType) => void
}

export type FederatedLifecyleMethods = keyof FederatedModuleLifecycles<unknown>

export type FederatedModuleTypes = 'app-module' | 'shared-module' | 'component'

export type FederatedModule<PropsType = unknown> = {
  scope: string
  name: string
  type: FederatedModuleTypes
  description?: string
  activeWhenPaths?: string[]
  exceptWhenPaths?: string[]
  lazyLoad?: boolean
  eventListeners?: Record<string, RuntimeEventHandler>
  validateProps?: (props: PropsType) => boolean
  status?: FederatedModuleStatuses
} & Partial<FederatedModuleLifecycles<PropsType>>

export type FederatedGlobalInfo = {
  moduleBaseUrls: Record<string, string>
  federatedRuntime?: FederatedRuntimeType
}
