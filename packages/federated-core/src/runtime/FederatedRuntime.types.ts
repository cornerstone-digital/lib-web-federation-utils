import {
  FederatedModule,
  ImportMap,
  FederatedModuleParams,
  ExposedServicesType,
  FederatedModuleStatuses,
  RootComponentType,
  RootComponentTypes,
} from '../types'
import { ComponentType } from 'react'

export enum FederatedEvents {
  // Bootstrap Events
  RUNTIME_BEFORE_BOOTSTRAP = 'federated-core:runtime:before-bootstrap',
  RUNTIME_BOOTSTRAPPED = 'federated-core:runtime:bootstrapped',
  RUNTIME_BOOTSTRAP_ERROR = 'federated-core:runtime:bootstrap:error',

  // Runtime Start Events
  RUNTIME_BEFORE_START = 'federated-core:runtime:before-start',
  RUNTIME_STARTED = 'federated-core:runtime:started',
  RUNTIME_START_ERROR = 'federated-core:runtime:start:error',

  // Pre-Fetch Module Events
  RUNTIME_MODULES_PREFETCH_START = 'federated-core:runtime:modules:pre-fetch:start',
  RUNTIME_BEFORE_MODULE_PREFETCH = 'federated-core:runtime:module:before-prefetch',
  RUNTIME_MODULE_PREFETCHED = 'federated-core:runtime:module:prefetched',
  RUNTIME_MODULE_PREFETCH_ERROR = 'federated-core:runtime:module:prefetch:error',
  RUNTIME_MODULES_PREFETCHED = 'federated-core:runtime:modules:pre-fetched',

  // Pre-Fetch Route Events
  RUNTIME_ROUTES_PREFETCH_START = 'federated-core:runtime:routes:pre-fetch:start',
  RUNTIME_BEFORE_ROUTE_PREFETCH = 'federated-core:runtime:route:before-prefetch',
  RUNTIME_ROUTE_PREFETCHED = 'federated-core:runtime:route:prefetched',
  RUNTIME_ROUTES_PREFETCH_ERROR = 'federated-core:runtime:routes:prefetch:error',
  RUNTIME_ROUTES_PREFETCHED = 'federated-core:runtime:routes:pre-fetched',

  // Import Map Events
  IMPORT_MAP_OVERRIDES_LOADED = 'federated-core:import-map-overrides:loaded',
  IMPORT_MAP_OVERRIDES_LOAD_ERROR = 'federated-core:import-map-overrides:load-error',

  // Routing Events
  ROUTE_CHANGED = 'federated-core:route:changed',
  ROUTE_ERROR = 'federated-core:route:error',
  ROUTE_ALREADY_ACTIVE = 'federated-core:route:already-active',
  ROUTE_NAVIGATE_TO = 'federated-core:route:navigate-to',
  POPSTATE_EVENT_FIRED = 'federated-core:popstate:event-fired',
  POPSTATE_EVENT_ERROR = 'federated-core:popstate:event-error',

  // Native Module Events
  NATIVE_MODULE_LOADING = 'federated-core:native-module:loading',
  NATIVE_MODULE_LOADED = 'federated-core:native-module:loaded',
  NATIVE_MODULE_LOAD_ERROR = 'federated-core:native-module:load-error',

  // SystemJS Events
  SYSTEMJS_LOADED = 'federated-core:systemjs:loaded',
  SYSTEMJS_LOAD_ERROR = 'federated-core:systemjs:load-error',
  SYSTEMJS_MODULE_LOADING = 'federated-core:systemjs:module:loading',
  SYSTEMJS_MODULE_LOADED = 'federated-core:systemjs:module:loaded',

  // Module Registation Events
  MODULE_BEFORE_REGISTER = 'federated-core:module:%moduleKey%:before-register',
  MODULE_REGISTERED = 'federated-core:module:%moduleKey%:registered',
  MODULE_ALREADY_REGISTERED = 'federated-core:module:%moduleKey%:already-registered',
  MODULE_REGISTER_ERROR = 'federated-core:module:%moduleKey%:register:error',

  // Module Loading Events
  MODULE_BEFORE_LOAD = 'federated-core:module:%moduleKey%:before-load',
  MODULE_LOADED = 'federated-core:module:%moduleKey%:loaded',
  MODULE_ALREADY_LOADED = 'federated-core:module:%moduleKey%:already-loaded',
  MODULE_LOAD_ERROR = 'federated-core:module:%moduleKey%:load:error',
  MODULE_VALIDATE_PROPS = 'federated-core:module:%moduleKey%:validate-props',

  // Module Bootstrap Events
  MODULE_BEFORE_BOOTSTRAP = 'federated-core:module:%moduleKey%:before-bootstrap',
  MODULE_BOOTSTRAPPED = 'federated-core:module:%moduleKey%:bootstrapped',
  MODULE_BOOTSTRAP_ERROR = 'federated-core:module:%moduleKey%:bootstrap:error',

  // Module Mount Events
  MODULE_BEFORE_MOUNT = 'federated-core:module:%moduleKey%:before-mount',
  MODULE_MOUNTED = 'federated-core:module:%moduleKey%:mounted',
  MODULE_MOUNT_ERROR = 'federated-core:module:%moduleKey%:mount:error',
  MODULE_ALREADY_MOUNTED = 'federated-core:module:%moduleKey%:already-mounted',

  // Module Unmount Events
  MODULE_BEFORE_UNMOUNT = 'federated-core:module:%moduleKey%:before-unmount',
  MODULE_UNMOUNTED = 'federated-core:module:%moduleKey%:unmounted',
  MODULE_UNMOUNT_ERROR = 'federated-core:module:%moduleKey%:unmount:error',
  MODULE_NOT_MOUNTED = 'federated-core:module:%moduleKey%:not-mounted',

  // Module Update Events
  MODULE_BEFORE_UPDATE = 'federated-core:module:%moduleKey%:before-update',
  MODULE_UPDATED = 'federated-core:module:%moduleKey%:updated',
  MODULE_UPDATE_ERROR = 'federated-core:module:%moduleKey%:update:error',

  // Module Events
  MODULE_STATE_CHANGED = 'federated-core:module:%moduleKey%:state-changed',
}

export type FederatedEventKeys = `${FederatedEvents}`

export type FederatedEventPayloadMap = {
  // Runtime Bootstrap Events
  [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: {
    bootstrapTime: string
    modules: Map<string, FederatedModuleParams>
    modulesBaseUrls: Record<string, string>
    useNativeModules: boolean
    importMapOverridesEnabled: boolean
  }
  [FederatedEvents.RUNTIME_BOOTSTRAPPED]: {
    bootstrapEndTime: number
    bootstrapDuration: number
  }
  [FederatedEvents.RUNTIME_BOOTSTRAP_ERROR]: {
    error: Error
  }

  // Runtime Start Events
  [FederatedEvents.RUNTIME_BEFORE_START]: {
    startTime: number
    modules: Map<string, FederatedModuleParams>
  }
  [FederatedEvents.RUNTIME_STARTED]: {
    startTime: number
    startEndTime: number
    startDuration: number
  }
  [FederatedEvents.RUNTIME_START_ERROR]: {
    error: Error
  }

  // Pre-Fetch Module Events
  [FederatedEvents.RUNTIME_MODULES_PREFETCH_START]: {
    modules: FederatedModuleParams[]
  }
  [FederatedEvents.RUNTIME_MODULES_PREFETCHED]: {
    modules: FederatedModuleParams[]
  }
  [FederatedEvents.RUNTIME_BEFORE_MODULE_PREFETCH]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.RUNTIME_MODULE_PREFETCHED]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.RUNTIME_MODULE_PREFETCH_ERROR]: {
    module: FederatedModuleParams
  }

  // Pre-Fetch Routes Events
  [FederatedEvents.RUNTIME_ROUTES_PREFETCH_START]: {
    routes: string[]
  }
  [FederatedEvents.RUNTIME_ROUTES_PREFETCHED]: {
    routes: string[]
  }
  [FederatedEvents.RUNTIME_BEFORE_ROUTE_PREFETCH]: {
    path: string
  }
  [FederatedEvents.RUNTIME_ROUTE_PREFETCHED]: {
    path: string
  }
  [FederatedEvents.RUNTIME_ROUTES_PREFETCH_ERROR]: {
    routes: string[]
    error: Error
  }

  // Router Events
  [FederatedEvents.POPSTATE_EVENT_FIRED]: {
    popstateEvent: PopStateEvent
  }
  [FederatedEvents.POPSTATE_EVENT_ERROR]: {
    error: Error
  }
  [FederatedEvents.ROUTE_ALREADY_ACTIVE]: {
    path: string
  }
  [FederatedEvents.ROUTE_CHANGED]: {
    path: string
  }
  [FederatedEvents.ROUTE_ERROR]: {
    path: string
    error: Error
  }
  [FederatedEvents.ROUTE_NAVIGATE_TO]: {
    previousPath: string
    path: string
  }

  // SystemJS Events
  [FederatedEvents.SYSTEMJS_LOADED]: {
    loadedTime: number
  }
  [FederatedEvents.SYSTEMJS_MODULE_LOADING]: {
    moduleKey: string
    module: FederatedModuleParams
  }
  [FederatedEvents.SYSTEMJS_MODULE_LOADED]: {
    moduleKey: string
    module: FederatedModuleParams
  }
  [FederatedEvents.SYSTEMJS_LOAD_ERROR]: {
    error: Error
  }

  // Native Module Events
  [FederatedEvents.NATIVE_MODULE_LOADING]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.NATIVE_MODULE_LOADED]: {
    module: FederatedModuleParams
    loadedTime: number
  }
  [FederatedEvents.NATIVE_MODULE_LOAD_ERROR]: {
    module: FederatedModuleParams
    error: Error
  }

  // Import Map Events
  [FederatedEvents.IMPORT_MAP_OVERRIDES_LOADED]: {
    loadedTime: number
  }
  [FederatedEvents.IMPORT_MAP_OVERRIDES_LOAD_ERROR]: {
    error: Error
  }

  // Module Registration Events
  [FederatedEvents.MODULE_ALREADY_REGISTERED]: {
    moduleKey: string
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_BEFORE_REGISTER]: {
    moduleKey: string
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_REGISTERED]: {
    moduleKey: string
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_REGISTER_ERROR]: {
    module: FederatedModuleParams
    error: Error
  }

  // Module Bootstrap Events
  [FederatedEvents.MODULE_BEFORE_BOOTSTRAP]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_BOOTSTRAPPED]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_BOOTSTRAP_ERROR]: {
    module: FederatedModuleParams
  }

  // Module Load Events
  [FederatedEvents.MODULE_BEFORE_LOAD]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_LOADED]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_LOAD_ERROR]: {
    module: FederatedModuleParams
    error: Error
  }
  [FederatedEvents.MODULE_ALREADY_LOADED]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_VALIDATE_PROPS]: {
    module: FederatedModuleParams
    props: unknown
  }

  // Module Mount Events
  [FederatedEvents.MODULE_BEFORE_MOUNT]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_ALREADY_MOUNTED]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_MOUNTED]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_MOUNT_ERROR]: {
    module: FederatedModuleParams
    error: Error
  }

  // Module Unmount Events
  [FederatedEvents.MODULE_BEFORE_UNMOUNT]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_UNMOUNTED]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_NOT_MOUNTED]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_UNMOUNT_ERROR]: {
    module: FederatedModuleParams
    error: Error
  }

  // Module Update Events
  [FederatedEvents.MODULE_BEFORE_UPDATE]: {
    module: FederatedModuleParams
  }

  [FederatedEvents.MODULE_UPDATED]: {
    module: FederatedModuleParams
  }

  [FederatedEvents.MODULE_UPDATE_ERROR]: {
    module: FederatedModuleParams
    error: Error
  }

  // Module Events
  [FederatedEvents.MODULE_STATE_CHANGED]: {
    module: FederatedModuleParams
  }
}

export type FederatedRuntimeType = {
  // Booleans
  _useNativeModules: boolean
  _importMapOverridesEnabled: boolean
  _debugEnabled: boolean
  _modules: Map<string, FederatedModule>
  _sharedDependencyBaseUrl: string
  _cdnUrl: string

  // Setters and Getters
  set debugEnabled(value: boolean)
  get debugEnabled(): boolean
  set sharedDependencyBaseUrl(baseUrl: string)
  get sharedDependencyBaseUrl(): string
  set useNativeModules(useNativeModules: boolean)
  get useNativeModules(): boolean
  set importMapOverridesEnabled(importMapOverridesEnabled: boolean)
  get importMapOverridesEnabled(): boolean
  set cdnUrl(cdnUrl: string)
  get cdnUrl(): string
  set modules(modules: Map<string, FederatedModule>)
  get modules(): Map<string, FederatedModule>
  get services(): ExposedServicesType

  // Helper Methods
  addImportMapOverridesUi(): void
  ensureSystemJs(): void
  fetchImportMapContent(modulePath: string): Promise<ImportMap>
  addBaseUrl(scope: string, baseUrl: string): FederatedRuntimeType

  // Module Methods
  setModuleState(
    module: FederatedModuleParams,
    state: FederatedModuleStatuses
  ): void
  setModuleRootComponent<
    ModuleComponentType extends RootComponentTypes,
    PropsType
  >(
    module: FederatedModuleParams,
    component: RootComponentType<ModuleComponentType, PropsType>
  ): void
  getModuleRootComponent<
    ModuleComponentType extends RootComponentTypes,
    PropsType
  >(
    module: FederatedModuleParams
  ): RootComponentType<ModuleComponentType, PropsType> | undefined | void
  registerModule(module: FederatedModule): Promise<FederatedRuntimeType>
  getModuleUrl(module: FederatedModuleParams): Promise<string>
  getModulesByPath(path: string): FederatedModule[]
  loadModule(
    module: FederatedModuleParams
  ): Promise<FederatedModule | undefined>
  mountModule(
    module: FederatedModuleParams,
    props: unknown,
    mountId: string
  ): Promise<void>
  unmountModule(module: FederatedModuleParams): Promise<void>
  validateProps(module: FederatedModuleParams, props: unknown): boolean
  preFetchModules(modules: FederatedModule[]): Promise<FederatedRuntimeType>

  // Navigation Methods
  navigateTo(path: string): void
  reroute(): Promise<void>
  preFetchRoutes(routePaths: string[]): Promise<FederatedRuntimeType>

  // Lifecycle Methods
  bootstrap(): void
  start(): Promise<void>
}
