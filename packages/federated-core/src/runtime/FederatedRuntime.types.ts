import {
  FederatedModule,
  FederatedModuleParams,
  ExposedServicesType,
  FederatedModuleStatuses,
  RootComponentType,
  RootComponentTypes,
} from '../types'

export enum FederatedEvents {
  RUNTIME_EXPERIMENTAL = 'runtime.experimental',

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

  // Module Registration Events
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
  MODULE_STATE_CHANGED = 'federated-core:module:%moduleKey%:state-changed',

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
}

export type FederatedPayloadMap = {
  [FederatedEvents.RUNTIME_EXPERIMENTAL]: {
    featureName: string
    reason: string
  }

  // Runtime Bootstrap Events
  [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: {
    bootstrapTime: string
    modules: Map<string, FederatedModuleParams>
    useNativeModules: boolean
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
    startTime: string
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
    module: FederatedModuleParams
  }
  [FederatedEvents.SYSTEMJS_MODULE_LOADED]: {
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
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_BEFORE_REGISTER]: {
    module: FederatedModuleParams
  }
  [FederatedEvents.MODULE_REGISTERED]: {
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
    error: Error
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
  [FederatedEvents.MODULE_STATE_CHANGED]: {
    module: FederatedModuleParams
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
}

export type FederatedEventKeys = `${FederatedEvents}`

export type EventTypeKeys<EventsKeys extends string = ''> = EventsKeys

export type EventData<Type extends string, Payload> = {
  type?: Type
  payload?: Payload
}

export type EventMap<
  CustomEventMap extends EventData<string, unknown> = Record<string, unknown>
> =
  | EventData<
      FederatedEvents.RUNTIME_EXPERIMENTAL,
      FederatedPayloadMap[FederatedEvents.RUNTIME_EXPERIMENTAL]
    >
  // Runtime Bootstrap Events
  | EventData<
      FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP,
      FederatedPayloadMap[FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]
    >
  | EventData<
      FederatedEvents.RUNTIME_BOOTSTRAPPED,
      FederatedPayloadMap[FederatedEvents.RUNTIME_BOOTSTRAPPED]
    >
  | EventData<
      FederatedEvents.RUNTIME_BOOTSTRAP_ERROR,
      FederatedPayloadMap[FederatedEvents.RUNTIME_BOOTSTRAP_ERROR]
    >

  // Runtime Start Events
  | EventData<
      FederatedEvents.RUNTIME_BEFORE_START,
      FederatedPayloadMap[FederatedEvents.RUNTIME_BEFORE_START]
    >
  | EventData<
      FederatedEvents.RUNTIME_STARTED,
      FederatedPayloadMap[FederatedEvents.RUNTIME_STARTED]
    >
  | EventData<
      FederatedEvents.RUNTIME_START_ERROR,
      FederatedPayloadMap[FederatedEvents.RUNTIME_START_ERROR]
    >

  // Pre-Fetch Module Events
  | EventData<
      FederatedEvents.RUNTIME_MODULES_PREFETCH_START,
      FederatedPayloadMap[FederatedEvents.RUNTIME_MODULES_PREFETCH_START]
    >
  | EventData<
      FederatedEvents.RUNTIME_MODULES_PREFETCHED,
      FederatedPayloadMap[FederatedEvents.RUNTIME_MODULES_PREFETCHED]
    >
  | EventData<
      FederatedEvents.RUNTIME_BEFORE_MODULE_PREFETCH,
      FederatedPayloadMap[FederatedEvents.RUNTIME_BEFORE_MODULE_PREFETCH]
    >
  | EventData<
      FederatedEvents.RUNTIME_MODULE_PREFETCHED,
      FederatedPayloadMap[FederatedEvents.RUNTIME_MODULE_PREFETCHED]
    >
  | EventData<
      FederatedEvents.RUNTIME_MODULE_PREFETCH_ERROR,
      FederatedPayloadMap[FederatedEvents.RUNTIME_MODULE_PREFETCH_ERROR]
    >

  // Pre-Fetch Routes Events
  | EventData<
      FederatedEvents.RUNTIME_ROUTES_PREFETCH_START,
      FederatedPayloadMap[FederatedEvents.RUNTIME_ROUTES_PREFETCH_START]
    >
  | EventData<
      FederatedEvents.RUNTIME_ROUTES_PREFETCHED,
      FederatedPayloadMap[FederatedEvents.RUNTIME_ROUTES_PREFETCHED]
    >
  | EventData<
      FederatedEvents.RUNTIME_BEFORE_ROUTE_PREFETCH,
      FederatedPayloadMap[FederatedEvents.RUNTIME_BEFORE_ROUTE_PREFETCH]
    >
  | EventData<
      FederatedEvents.RUNTIME_ROUTE_PREFETCHED,
      FederatedPayloadMap[FederatedEvents.RUNTIME_ROUTE_PREFETCHED]
    >
  | EventData<
      FederatedEvents.RUNTIME_ROUTES_PREFETCH_ERROR,
      FederatedPayloadMap[FederatedEvents.RUNTIME_ROUTES_PREFETCH_ERROR]
    >

  // Router Events
  | EventData<
      FederatedEvents.POPSTATE_EVENT_FIRED,
      FederatedPayloadMap[FederatedEvents.POPSTATE_EVENT_FIRED]
    >
  | EventData<
      FederatedEvents.POPSTATE_EVENT_ERROR,
      FederatedPayloadMap[FederatedEvents.POPSTATE_EVENT_ERROR]
    >
  | EventData<
      FederatedEvents.ROUTE_ALREADY_ACTIVE,
      FederatedPayloadMap[FederatedEvents.ROUTE_ALREADY_ACTIVE]
    >
  | EventData<
      FederatedEvents.ROUTE_CHANGED,
      FederatedPayloadMap[FederatedEvents.ROUTE_CHANGED]
    >
  | EventData<
      FederatedEvents.ROUTE_ERROR,
      FederatedPayloadMap[FederatedEvents.ROUTE_ERROR]
    >
  | EventData<
      FederatedEvents.ROUTE_NAVIGATE_TO,
      FederatedPayloadMap[FederatedEvents.ROUTE_NAVIGATE_TO]
    >

  // SystemJS Events
  | EventData<
      FederatedEvents.SYSTEMJS_LOADED,
      FederatedPayloadMap[FederatedEvents.SYSTEMJS_LOADED]
    >
  | EventData<
      FederatedEvents.SYSTEMJS_MODULE_LOADING,
      FederatedPayloadMap[FederatedEvents.SYSTEMJS_MODULE_LOADING]
    >
  | EventData<
      FederatedEvents.SYSTEMJS_MODULE_LOADED,
      FederatedPayloadMap[FederatedEvents.SYSTEMJS_MODULE_LOADED]
    >
  | EventData<
      FederatedEvents.SYSTEMJS_LOAD_ERROR,
      FederatedPayloadMap[FederatedEvents.SYSTEMJS_LOAD_ERROR]
    >

  // Native Module Events
  | EventData<
      FederatedEvents.NATIVE_MODULE_LOADING,
      FederatedPayloadMap[FederatedEvents.NATIVE_MODULE_LOADING]
    >
  | EventData<
      FederatedEvents.NATIVE_MODULE_LOADED,
      FederatedPayloadMap[FederatedEvents.NATIVE_MODULE_LOADED]
    >
  | EventData<
      FederatedEvents.NATIVE_MODULE_LOAD_ERROR,
      FederatedPayloadMap[FederatedEvents.NATIVE_MODULE_LOAD_ERROR]
    >

  // Import Map Events
  | EventData<
      FederatedEvents.IMPORT_MAP_OVERRIDES_LOADED,
      FederatedPayloadMap[FederatedEvents.IMPORT_MAP_OVERRIDES_LOADED]
    >
  | EventData<
      FederatedEvents.IMPORT_MAP_OVERRIDES_LOAD_ERROR,
      FederatedPayloadMap[FederatedEvents.IMPORT_MAP_OVERRIDES_LOAD_ERROR]
    >

  // Module Registration Events
  | EventData<
      FederatedEvents.MODULE_ALREADY_REGISTERED,
      FederatedPayloadMap[FederatedEvents.MODULE_ALREADY_REGISTERED]
    >
  | EventData<
      FederatedEvents.MODULE_BEFORE_REGISTER,
      FederatedPayloadMap[FederatedEvents.MODULE_BEFORE_REGISTER]
    >
  | EventData<
      FederatedEvents.MODULE_REGISTERED,
      FederatedPayloadMap[FederatedEvents.MODULE_REGISTERED]
    >
  | EventData<
      FederatedEvents.MODULE_REGISTER_ERROR,
      FederatedPayloadMap[FederatedEvents.MODULE_REGISTER_ERROR]
    >

  // Module Bootstrap Events
  | EventData<
      FederatedEvents.MODULE_BEFORE_BOOTSTRAP,
      FederatedPayloadMap[FederatedEvents.MODULE_BEFORE_BOOTSTRAP]
    >
  | EventData<
      FederatedEvents.MODULE_BOOTSTRAPPED,
      FederatedPayloadMap[FederatedEvents.MODULE_BOOTSTRAPPED]
    >
  | EventData<
      FederatedEvents.MODULE_BOOTSTRAP_ERROR,
      FederatedPayloadMap[FederatedEvents.MODULE_BOOTSTRAP_ERROR]
    >

  // Module Load Events
  | EventData<
      FederatedEvents.MODULE_BEFORE_LOAD,
      FederatedPayloadMap[FederatedEvents.MODULE_BEFORE_LOAD]
    >
  | EventData<
      FederatedEvents.MODULE_LOADED,
      FederatedPayloadMap[FederatedEvents.MODULE_LOADED]
    >
  | EventData<
      FederatedEvents.MODULE_LOAD_ERROR,
      FederatedPayloadMap[FederatedEvents.MODULE_LOAD_ERROR]
    >
  | EventData<
      FederatedEvents.MODULE_ALREADY_LOADED,
      FederatedPayloadMap[FederatedEvents.MODULE_ALREADY_LOADED]
    >
  | EventData<
      FederatedEvents.MODULE_VALIDATE_PROPS,
      FederatedPayloadMap[FederatedEvents.MODULE_VALIDATE_PROPS]
    >

  // Module Mount Events
  | EventData<
      FederatedEvents.MODULE_BEFORE_MOUNT,
      FederatedPayloadMap[FederatedEvents.MODULE_BEFORE_MOUNT]
    >
  | EventData<
      FederatedEvents.MODULE_ALREADY_MOUNTED,
      FederatedPayloadMap[FederatedEvents.MODULE_ALREADY_MOUNTED]
    >
  | EventData<
      FederatedEvents.MODULE_MOUNTED,
      FederatedPayloadMap[FederatedEvents.MODULE_MOUNTED]
    >
  | EventData<
      FederatedEvents.MODULE_MOUNT_ERROR,
      FederatedPayloadMap[FederatedEvents.MODULE_MOUNT_ERROR]
    >
  | EventData<
      FederatedEvents.MODULE_STATE_CHANGED,
      FederatedPayloadMap[FederatedEvents.MODULE_STATE_CHANGED]
    >

  // Module Unmount Events
  | EventData<
      FederatedEvents.MODULE_BEFORE_UNMOUNT,
      FederatedPayloadMap[FederatedEvents.MODULE_BEFORE_UNMOUNT]
    >
  | EventData<
      FederatedEvents.MODULE_UNMOUNTED,
      FederatedPayloadMap[FederatedEvents.MODULE_UNMOUNTED]
    >
  | EventData<
      FederatedEvents.MODULE_NOT_MOUNTED,
      FederatedPayloadMap[FederatedEvents.MODULE_NOT_MOUNTED]
    >
  | EventData<
      FederatedEvents.MODULE_UNMOUNT_ERROR,
      FederatedPayloadMap[FederatedEvents.MODULE_UNMOUNT_ERROR]
    >

  // Module Update Events
  | EventData<
      FederatedEvents.MODULE_BEFORE_UPDATE,
      FederatedPayloadMap[FederatedEvents.MODULE_BEFORE_UPDATE]
    >
  | EventData<
      FederatedEvents.MODULE_UPDATED,
      FederatedPayloadMap[FederatedEvents.MODULE_UPDATED]
    >
  | EventData<
      FederatedEvents.MODULE_UPDATE_ERROR,
      FederatedPayloadMap[FederatedEvents.MODULE_UPDATE_ERROR]
    >
  | CustomEventMap

export abstract class AbstractFederatedRuntime {
  // Booleans
  abstract _useNativeModules: boolean
  abstract _debugEnabled: boolean
  abstract _modules: Map<string, FederatedModule>
  abstract _sharedDependencyBaseUrl: string
  abstract _cdnUrl: string

  // Setters and Getters
  abstract set useNativeModules(value: boolean)
  abstract get useNativeModules(): boolean
  abstract set debugEnabled(value: boolean)
  abstract get debugEnabled(): boolean
  abstract set sharedDependencyBaseUrl(value: string)
  abstract get sharedDependencyBaseUrl(): string
  abstract set cdnUrl(value: string)
  abstract get cdnUrl(): string
  abstract set modules(modules: Map<string, FederatedModule>)
  abstract get modules(): Map<string, FederatedModule>
  abstract get services(): ExposedServicesType

  // Helper Methods
  abstract addImportMapOverridesUi(): void
  abstract ensureImportMapHtmlElement(id: string, url: string): Promise<void>
  abstract ensureImportImapExists(module: FederatedModuleParams): Promise<void>

  // Module Methods
  abstract setModuleState(
    module: FederatedModuleParams,
    state: FederatedModuleStatuses
  ): void
  abstract setModuleRootComponent<
    ModuleComponentType extends RootComponentTypes,
    PropsType
  >(
    module: FederatedModuleParams,
    component: RootComponentType<ModuleComponentType, PropsType>
  ): void
  abstract getModuleRootComponent<
    ModuleComponentType extends RootComponentTypes,
    PropsType
  >(
    module: FederatedModuleParams
  ): RootComponentType<ModuleComponentType, PropsType> | undefined | void
  abstract registerModule(module: FederatedModule): Promise<this>
  abstract getModulesByPath(path: string): FederatedModule[]
  abstract loadModule(
    module: FederatedModuleParams
  ): Promise<FederatedModule | undefined>
  abstract mountModule(
    module: FederatedModuleParams,
    props: unknown,
    mountId: string
  ): Promise<void>
  abstract unmountModule(module: FederatedModuleParams): Promise<void>
  abstract validateProps(module: FederatedModuleParams, props: unknown): boolean
  abstract preFetchModules(modules: FederatedModule[]): Promise<this>
  abstract applyModules(): Promise<void>

  // Navigation Methods
  abstract navigateTo(path: string): void
  abstract reroute(): Promise<void>
  abstract preFetchRoutes(routePaths: string[]): Promise<this>

  // Lifecycle Methods
  abstract bootstrap(): void
  abstract start(): Promise<void>
}
