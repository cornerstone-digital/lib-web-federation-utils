import * as React from 'react'
import { Component } from 'vue'
import { AbstractFederatedRuntime } from '../runtime'
import { eventService, loggerService } from '../runtime/services'

export type ImportMap = {
  imports: Record<string, string>
}

export enum FederatedModuleStatuses {
  NOT_LOADED = 'NOT_LOADED',
  LOADED = 'LOADED',
  BOOTSTRAPPING = 'BOOTSTRAPPING',
  BOOTSTRAPPED = 'BOOTSTRAPPED',
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

export type ExposedServicesType = {
  event: typeof eventService
  logger: typeof loggerService
}

export type FederatedModuleLifecycles<PropsType> = {
  bootstrap: () => Promise<void>
  mount: (props?: PropsType, mountId?: string) => Promise<void>
  unmount: () => Promise<void>
  update: (props?: PropsType) => Promise<void>
}

export type FederatedLifecycleMethods = keyof FederatedModuleLifecycles<unknown>
export type FederatedModuleTypes =
  | 'journey-module'
  | 'shared-module'
  | 'component'
export type RootComponentTypes = 'react' | 'vue' | 'unknown'
export type RootComponentType<RootComponentTypes, PropsType> =
  RootComponentTypes extends 'react'
    ? React.ComponentType<PropsType>
    : never | RootComponentTypes extends 'vue'
    ? Component<PropsType>
    : never
export type FederatedModuleBaseOptions<PropsType> = {
  scope: string
  name: string
  type: FederatedModuleTypes
  props?: PropsType
  description?: string
  activeWhenPaths?: string[]
  exceptWhenPaths?: string[]
  validateProps?: (props: PropsType) => boolean
  status?: FederatedModuleStatuses
  rootComponent?: unknown
}

export type FederatedModule<PropsType = unknown> =
  FederatedModuleBaseOptions<PropsType> &
    Partial<FederatedModuleLifecycles<PropsType>>

export type FederatedGlobalInfo = {
  federatedRuntime: AbstractFederatedRuntime
}
