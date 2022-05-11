import { FederatedRuntime } from '../runtime'

export type ImportMap = {
  imports: Record<string, string>
}

export enum FederatedModuleStatuses {
  NOT_LOADED = 'LOADED',
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

export type FederatedEvent<EventType, PayloadType> = {
  type: EventType
  payload: PayloadType
}

export type RuntimeEventHandler = <EventType extends FederatedEvent<string, unknown>>(
  event: EventType,
  RuntimeEngine: FederatedRuntime,
) => void

export type FederatedModuleLifecycles<PropsType> = {
  bootstrap?: () => void
  mount?: (props?: PropsType) => void
  unmount?: () => void
  update?: () => void
}

export type FederatedModule<PropsType = unknown> = {
  scope: string
  name: string
  description?: string
  activeWhenPaths: string[]
  eventListeners?: Record<string, RuntimeEventHandler>
  validateProps?: (props: PropsType) => void
  status?: FederatedModuleStatuses
} & Partial<FederatedModuleLifecycles<PropsType>>

export type FederatedGlobalInfo = {
  moduleBaseUrls: Record<string, string>
  federatedRuntime?: FederatedRuntime
}
