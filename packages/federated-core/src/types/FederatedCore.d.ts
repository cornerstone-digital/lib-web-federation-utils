import * as eventService from '../runtime/services/event'
import * as loggerService from '../runtime/services/logger'

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

export type FederatedEvent<EventType, PayloadType> = {
  type: EventType
  payload: PayloadType
}

type ExposedServicesType = {
  eventService: typeof eventService
  loggerService: typeof loggerService
}

export type FederatedRuntimeType = {
  // Booleans
  useNativeModules: boolean
  enableImportMapOverrides: boolean
  debugEnabled: boolean
  isDebugEnabled(): boolean

  // Member Variables
  sharedDependencyBaseUrl: string
  modules: Map<string, FederatedModule>
  services: ExposedServicesType

  // Setters
  setDebugEnabled(value: boolean): FederatedRuntimeType
  setUseNativeModules(useNativeModules: boolean): FederatedRuntimeType
  setEnableImportMapOverrides(enableImportMapOverrides: boolean)

  // Functions
  fetchImportMapContent(modulePath: string): Promise<ImportMap>
  getModuleKey(scope: string, moduleName: string): string
  getModuleUrl(scope: string, moduleName: string): Promise<string>
  setModuleState(scope: string, moduleName: string, state: FederatedModuleStatuses)
  addBaseUrl(scope: string, baseUrl: string): FederatedRuntimeType
  registerModule(module: FederatedModule): Promise<FederatedRuntimeType>
  loadModule(scope: string, moduleName: string): Promise<FederatedModule | undefined>
  mountModule(scope: string, name: string, props: any, mountId: string): Promise<void>
  unmountModule(scope: string, name: string, mountId: string): Promise<void>
  pathToWildcard(path: string): string
  matchPathToUrlPaths(path: string, urlPaths: string[]): boolean
  getModulesByPath(path: string): FederatedModule[]
  reroute(): void
  validateProps(scope: string, moduleName: string, props: unknown): boolean
  addDynamicScriptTag(id: string, src: string, onload?: () => void): void
  addMetaTag(id: string, content: string): void
  addStyleTag(id: string, css: string): void
  addLinkTag(id: string, rel: string, href: string): void
  addHtmlElementWithAttrs(tagName: string, attrs: { [key: string]: string }): void
  addImportMapOverridesUi(): void
  setSharedDependencyBaseUrl(baseUrl: string): FederatedRuntimeType
  ensureSystemJs(): void
  bootstrap(): void
  start(): void
  preFetchRoutes(routePaths: string[]): Promise<FederatedRuntimeType>
  preFetchModules(modules: FederatedModule[]): Promise<FederatedRuntimeType>
}

export type RuntimeEventHandler = <EventType extends FederatedEvent<string, unknown>>(
  event: EventType,
  RuntimeEngine: FederatedRuntimeType,
) => void

export type FederatedModuleLifecycles<PropsType> = {
  bootstrap?: () => void
  mount?: (props?: PropsType, mountId?: string) => void
  unmount?: () => void
  update?: (props?: PropsType) => void
}

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
