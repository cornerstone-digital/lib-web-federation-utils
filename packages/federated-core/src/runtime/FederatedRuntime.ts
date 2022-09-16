import {
  ExposedServicesType,
  FederatedModule,
  FederatedModuleParams,
  FederatedModuleStatuses,
  RootComponentType,
  RootComponentTypes,
} from '../types'

import {
  AbstractFederatedRuntime,
  EventMap,
  FederatedEvents,
} from './FederatedRuntime.types'
import { environmentUtils } from '../utils'
import { eventService, loggerService } from './services'
import {
  addHtmlElementWithAttrs,
  addMetaTag,
  addScriptTag,
  getModuleKey,
  shouldModuleBeMounted,
} from './helpers'

const ExposedServices: ExposedServicesType = {
  event: eventService,
  logger: loggerService,
}

class FederatedRuntime implements AbstractFederatedRuntime {
  _bootstrapped = false
  _started = false
  _useNativeModules = false
  _importMapOverridesEnabled = false
  _debugEnabled = false
  _sharedDependencyBaseUrl = ''
  _cdnUrl = process.env['SHARED_CDN_DOMAIN'] || ''
  _modules: Map<string, FederatedModule> = new Map()
  _services: ExposedServicesType = ExposedServices

  // Setters and Getters
  set bootstrapped(bootstrapped: boolean) {
    this._bootstrapped = bootstrapped
  }

  get bootstrapped(): boolean {
    return this._bootstrapped
  }

  set started(started: boolean) {
    this._started = started
  }

  get started(): boolean {
    return this._started
  }

  set debugEnabled(value: boolean) {
    this._debugEnabled = value
  }

  get debugEnabled(): boolean {
    return this._debugEnabled
  }

  set sharedDependencyBaseUrl(baseUrl: string) {
    this._sharedDependencyBaseUrl = baseUrl
  }

  get sharedDependencyBaseUrl(): string {
    return this._sharedDependencyBaseUrl
  }

  set useNativeModules(useNativeModules: boolean) {
    this._useNativeModules = useNativeModules
  }

  get useNativeModules(): boolean {
    return this._useNativeModules
  }

  set importMapOverridesEnabled(importMapOverridesEnabled: boolean) {
    this._importMapOverridesEnabled = importMapOverridesEnabled
  }

  get importMapOverridesEnabled(): boolean {
    return this._importMapOverridesEnabled
  }

  set cdnUrl(cdnUrl: string) {
    this._cdnUrl = cdnUrl
  }

  get cdnUrl(): string {
    return this._cdnUrl
  }

  set modules(modules: Map<string, FederatedModule>) {
    this._modules = modules
  }

  get modules(): Map<string, FederatedModule> {
    return this._modules
  }

  get services(): ExposedServicesType {
    return this._services
  }

  // Helper Methods
  addImportMapOverridesUi(): void {
    const importMapOverridesKey = 'import-map-overrides'
    if (this.importMapOverridesEnabled) {
      addHtmlElementWithAttrs(
        'import-map-overrides-ui',
        'import-map-overrides-full',
        {
          'show-when-local-storage': importMapOverridesKey,
        }
      )

      localStorage.setItem(importMapOverridesKey, 'true')

      addScriptTag(
        importMapOverridesKey,
        `${this.sharedDependencyBaseUrl}/mobile/shared-assets/import-map-overrides.js`
      )

      this.services.event.emit<EventMap>({
        type: FederatedEvents.IMPORT_MAP_OVERRIDES_LOADED,
        payload: {
          loadedTime: Date.now(),
        },
      })
    }
  }

  ensureSystemJs(): void {
    if (!this.useNativeModules) {
      addMetaTag('importmap-type', 'importmap-type', 'systemjs-importmap')
      addScriptTag(
        'systemjs',
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/system.min.js`
      )
      addScriptTag(
        'systemjs-named-exports',
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/named-exports.min.js`
      )
      addScriptTag(
        'systemjs-amd',
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/amd.min.js`
      )
      addScriptTag(
        'systemjs-dynamic-import-maps',
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/dynamic-import-maps.min.js`
      )

      this.services.event.emit<EventMap>({
        type: FederatedEvents.SYSTEMJS_LOADED,
        payload: {
          loadedTime: Date.now(),
        },
      })
    }
  }

  async ensureImportMapHtmlElement(
    id: string,
    url?: string,
    content?: string
  ): Promise<void> {
    if (document.getElementById(id)) {
      return
    }

    const importMapHtmlElement = document.createElement('script')
    importMapHtmlElement.id = id

    if (url && !content) {
      importMapHtmlElement.src = url
    } else if (content) {
      importMapHtmlElement.innerHTML = content
    }
    importMapHtmlElement.crossOrigin = 'anonymous'
    importMapHtmlElement.type = this._useNativeModules
      ? 'importmap'
      : 'systemjs-importmap'

    document.head.appendChild(importMapHtmlElement)
  }

  ensureEsModuleShims(): void {
    const esModuleShimsId = 'es-module-shims'
    if (this._useNativeModules && !document.getElementById(esModuleShimsId)) {
      // Add es-module-shims to the page
      addScriptTag(
        esModuleShimsId,
        `${this.sharedDependencyBaseUrl}/es-module-shims/1.5.18/es-module-shims.js`
      )
    }
  }

  async ensureImportImapExists(
    module: FederatedModuleParams,
    basePath?: string
  ): Promise<void> {
    const importMapPath = `${basePath || this.cdnUrl}/entries-import-map.json`
    const importMapId = `${module.scope}-${module.name}-imports`

    if (!document.getElementById(importMapId)) {
      await this.ensureImportMapHtmlElement(importMapId, importMapPath)
    }
  }

  // Module Methods
  setModuleState(
    module: FederatedModuleParams,
    state: FederatedModuleStatuses
  ) {
    const { scope, name } = module
    const moduleKey = getModuleKey(scope, name)
    const moduleInstance: FederatedModule = {
      ...this.modules.get(moduleKey),
      status: state as FederatedModuleStatuses,
    } as FederatedModule

    this.modules.set(moduleKey, moduleInstance)

    eventService.emit<EventMap>(
      {
        type: FederatedEvents.MODULE_STATE_CHANGED,
        payload: {
          module,
        },
      },
      module
    )
  }

  setModuleRootComponent<
    ModuleComponentType extends RootComponentTypes,
    PropsType
  >(
    module: FederatedModuleParams,
    component: RootComponentType<ModuleComponentType, PropsType>
  ): void {
    const { scope, name } = module
    const moduleKey = getModuleKey(scope, name)
    const savedModule = this.modules.get(moduleKey)

    if (savedModule) {
      savedModule.rootComponent = component as RootComponentType<
        ModuleComponentType,
        PropsType
      >
      this.modules.set(moduleKey, savedModule)
    }
  }

  getModuleRootComponent<
    ModuleComponentType extends RootComponentTypes,
    PropsType
  >(
    module: FederatedModuleParams
  ): RootComponentType<ModuleComponentType, PropsType> | undefined | void {
    const { scope, name } = module
    const moduleKey = getModuleKey(scope, name)
    const savedModule = this.modules.get(moduleKey)

    if (savedModule) {
      return savedModule.rootComponent as RootComponentType<
        ModuleComponentType,
        PropsType
      >
    }
  }

  async registerModule(module: FederatedModule): Promise<this> {
    const { scope, name } = module
    const moduleKey = getModuleKey(scope, name)

    if (
      this.modules.has(moduleKey) &&
      this.modules.get(moduleKey)?.status === FederatedModuleStatuses.LOADED
    ) {
      this.services.event.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_ALREADY_REGISTERED,
          payload: {
            module,
          },
        },
        module
      )
    } else if (
      this.modules.has(moduleKey) &&
      this.modules.get(moduleKey)?.status === FederatedModuleStatuses.MOUNTED
    ) {
      this.services.event.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_ALREADY_MOUNTED,
          payload: {
            module,
          },
        },
        module
      )
    } else {
      this.services.event.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_BEFORE_REGISTER,
          payload: {
            module,
          },
        },
        module
      )

      this.setModuleState(
        { scope: module.scope, name: module.name },
        FederatedModuleStatuses.NOT_LOADED
      )
      this.modules.set(moduleKey, module)
      this.services.event.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_REGISTERED,
          payload: {
            module,
          },
        },
        module
      )
    }

    return this
  }

  getModulesByPath(path: string): FederatedModule[] {
    const modules: FederatedModule[] = []
    this.modules.forEach((module) => {
      if (shouldModuleBeMounted(path, module)) {
        modules.push(module)
      }
    })

    return modules
  }

  async loadModule(
    module: FederatedModuleParams
  ): Promise<FederatedModule | undefined> {
    const { scope, name } = module

    try {
      await this.ensureImportImapExists(module)
      const moduleKey = getModuleKey(scope, name)

      if (this.modules.has(moduleKey)) {
        const storeModule = this.modules.get(moduleKey)
        if (
          storeModule &&
          ['journey-module', 'component'].includes(storeModule.type) &&
          this.modules.get(moduleKey)?.status ===
            FederatedModuleStatuses.MOUNTED
        ) {
          this.services.event.emit<EventMap>(
            {
              type: FederatedEvents.MODULE_ALREADY_MOUNTED,
              payload: {
                module,
              },
            },
            module
          )

          return this.modules.get(moduleKey)
        }

        if (
          storeModule &&
          this.modules.get(moduleKey)?.status === FederatedModuleStatuses.LOADED
        ) {
          this.services.event.emit<EventMap>(
            {
              type: FederatedEvents.MODULE_ALREADY_LOADED,
              payload: {
                module,
              },
            },
            module
          )

          return this.modules.get(moduleKey)
        }
      }

      this.services.event.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_BEFORE_LOAD,
          payload: {
            module,
          },
        },
        module
      )

      this.services.event.emit<EventMap>(
        {
          type: this.useNativeModules
            ? FederatedEvents.NATIVE_MODULE_LOADING
            : FederatedEvents.SYSTEMJS_MODULE_LOADING,
          payload: {
            module,
          },
        },
        module
      )

      const importModule = async (name: string) => {
        if (this.useNativeModules) {
          return import(name)
        }

        return System.import(name)
      }

      const resolvedModule: FederatedModule = await importModule(name)

      this.services.event.emit<EventMap>(
        {
          type: this.useNativeModules
            ? FederatedEvents.NATIVE_MODULE_LOADED
            : FederatedEvents.SYSTEMJS_MODULE_LOADED,
          payload: {
            module: resolvedModule,
          },
        },
        module
      )

      if (!this.modules.has(moduleKey) && !resolvedModule.status) {
        await this.registerModule(resolvedModule)
      }

      if (
        !resolvedModule.status ||
        resolvedModule.status === FederatedModuleStatuses.NOT_LOADED
      ) {
        this.setModuleState({ scope, name }, FederatedModuleStatuses.LOADED)
      }

      return resolvedModule
    } catch (error) {
      this.services.event.emit<EventMap>(
        {
          type: FederatedEvents.MODULE_LOAD_ERROR,
          payload: {
            module,
            error: error as Error,
          },
        },
        module
      )

      return undefined
    }
  }

  async mountModule(
    module: FederatedModuleParams,
    props: unknown,
    mountId: string
  ): Promise<void> {
    const { scope, name } = module
    const loadedModule = await this.loadModule({ scope, name })

    if (loadedModule?.mount) {
      await loadedModule.mount(props, mountId)
    }
  }

  async unmountModule(module: FederatedModuleParams): Promise<void> {
    const { scope, name } = module
    const loadedModule = await this.modules.get(getModuleKey(scope, name))

    if (loadedModule?.unmount) {
      await loadedModule.unmount()
    }
  }

  validateProps(module: FederatedModuleParams, props: unknown): boolean {
    const { scope, name } = module
    const moduleKey = getModuleKey(scope, name)
    this.services.event.emit<EventMap>(
      {
        type: FederatedEvents.MODULE_VALIDATE_PROPS,
        payload: {
          module,
          props,
        },
      },
      module
    )
    const loadedModule = this.modules.get(moduleKey)

    if (!loadedModule?.validateProps) {
      return true
    }

    return loadedModule.validateProps(props)
  }

  async preFetchModules(modules: FederatedModule[]): Promise<this> {
    this.services.event.emit<EventMap>({
      type: FederatedEvents.RUNTIME_MODULES_PREFETCH_START,
      payload: {
        modules,
      },
    })

    for (const module of modules) {
      const { name, scope } = module
      const moduleKey = getModuleKey(scope, name)
      if (!this.modules.has(moduleKey)) {
        this.services.event.emit<EventMap>({
          type: FederatedEvents.RUNTIME_BEFORE_MODULE_PREFETCH,
          payload: {
            module,
          },
        })
        await this.loadModule({ scope, name })

        this.services.event.emit<EventMap>({
          type: FederatedEvents.RUNTIME_MODULE_PREFETCHED,
          payload: {
            module,
          },
        })
      }
    }

    this.services.event.emit<EventMap>({
      type: FederatedEvents.RUNTIME_MODULES_PREFETCHED,
      payload: {
        modules,
      },
    })

    return this
  }

  async applyModules(): Promise<void> {
    const modulesToMount: FederatedModule[] = []
    const modulesToUnmount: FederatedModule[] = []

    this.modules.forEach((module) => {
      if (shouldModuleBeMounted(window.location.pathname, module)) {
        modulesToMount.push(module)
      } else {
        modulesToUnmount.push(module)
      }
    })

    for (const module of modulesToUnmount) {
      const moduleKey = getModuleKey(module.scope, module.name)
      const moduleInstance = this.modules.get(moduleKey)

      if (moduleInstance?.unmount) {
        this.services.event.emit<EventMap>(
          {
            type: FederatedEvents.MODULE_BEFORE_UNMOUNT,
            payload: {
              module,
            },
          },
          module
        )
        await moduleInstance.unmount()

        this.services.event.emit<EventMap>(
          {
            type: FederatedEvents.MODULE_UNMOUNTED,
            payload: {
              module: moduleInstance,
            },
          },
          module
        )
      } else if (
        moduleInstance?.type === 'journey-module' ||
        moduleInstance?.type === 'component'
      ) {
        this.setModuleState(
          { scope: module.scope, name: module.name },
          FederatedModuleStatuses.NOT_LOADED
        )
      }
    }

    for (const module of modulesToMount) {
      try {
        const { scope, name, props } = module
        const loadedModule = await this.loadModule({ scope, name })

        if (loadedModule?.mount) {
          this.services.event.emit<EventMap>(
            {
              type: FederatedEvents.MODULE_BEFORE_MOUNT,
              payload: {
                module: loadedModule,
              },
            },
            module
          )
          await loadedModule.mount(props)
          this.services.event.emit<EventMap>(
            {
              type: FederatedEvents.MODULE_MOUNTED,
              payload: {
                module: loadedModule,
              },
            },
            module
          )
        }
      } catch (error) {
        this.services.event.emit<EventMap>(
          {
            type: FederatedEvents.MODULE_MOUNT_ERROR,
            payload: {
              module,
              error: error as Error,
            },
          },
          module
        )
      }
    }
  }

  // Navigation Methods
  navigateTo(path: string): void {
    if (window.location.pathname === path) {
      this.services.event.emit<EventMap>({
        type: FederatedEvents.ROUTE_ALREADY_ACTIVE,
        payload: {
          path,
        },
      })

      return
    }

    this.services.event.emit<EventMap>({
      type: FederatedEvents.ROUTE_NAVIGATE_TO,
      payload: {
        previousPath: window.location.pathname,
        path,
      },
    })

    window.history.pushState(null, '', path)

    // Trigger popstate event
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  async reroute(): Promise<void> {
    this.services.event.emit<EventMap>({
      type: FederatedEvents.ROUTE_CHANGED,
      payload: {
        path: window.location.pathname,
      },
    })

    await this.applyModules()
  }

  async preFetchRoutes(routePaths: string[]): Promise<this> {
    try {
      this.services.event.emit<EventMap>({
        type: FederatedEvents.RUNTIME_ROUTES_PREFETCH_START,
        payload: {
          routes: routePaths,
        },
      })

      for (const path of routePaths) {
        this.services.event.emit<EventMap>({
          type: FederatedEvents.RUNTIME_BEFORE_ROUTE_PREFETCH,
          payload: {
            path,
          },
        })

        const modules = this.getModulesByPath(path)

        for (const module of modules) {
          const { name, scope } = module
          if (module?.status !== FederatedModuleStatuses.LOADED) {
            await this.loadModule({ scope, name })
          }
        }

        this.services.event.emit<EventMap>({
          type: FederatedEvents.RUNTIME_ROUTE_PREFETCHED,
          payload: {
            path,
          },
        })
      }

      this.services.event.emit<EventMap>({
        type: FederatedEvents.RUNTIME_ROUTES_PREFETCHED,
        payload: {
          routes: routePaths,
        },
      })
    } catch (error) {
      this.services.event.emit<EventMap>({
        type: FederatedEvents.RUNTIME_ROUTES_PREFETCH_ERROR,
        payload: {
          routes: routePaths,
          error: error as Error,
        },
      })
    }

    return this
  }

  // Lifecycle Methods
  async bootstrap(): Promise<void> {
    this.bootstrapped = false
    const boostrapStartTime = Date.now()
    this.services.event.emit<EventMap>({
      type: FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP,
      payload: {
        bootstrapTime: new Date().toDateString(),
        modules: this.modules,
        useNativeModules: this.useNativeModules,
        importMapOverridesEnabled: this.importMapOverridesEnabled,
      },
    })

    window.addEventListener('popstate', async (popstateEvent) => {
      this.services.event.emit<EventMap>({
        type: FederatedEvents.POPSTATE_EVENT_FIRED,
        payload: {
          popstateEvent,
        },
      })

      await this.reroute()
    })

    this.ensureEsModuleShims()
    this.ensureSystemJs()
    this.addImportMapOverridesUi()

    for (const entry of this.modules) {
      const moduleData = entry[1]
      try {
        if (moduleData.bootstrap) {
          this.services.event.emit<EventMap>(
            {
              type: FederatedEvents.MODULE_BEFORE_BOOTSTRAP,
              payload: {
                module: moduleData,
              },
            },
            moduleData
          )

          await moduleData.bootstrap()
          this.services.event.emit<EventMap>(
            {
              type: FederatedEvents.MODULE_BOOTSTRAPPED,
              payload: {
                module: moduleData,
              },
            },
            moduleData
          )
        }
      } catch (error) {
        this.services.event.emit<EventMap>(
          {
            type: FederatedEvents.MODULE_BOOTSTRAP_ERROR,
            payload: {
              module: moduleData,
              error: error as Error,
            },
          },
          moduleData
        )
      }
    }

    const bootstrapEndTime = Date.now()
    const bootstrapDuration = bootstrapEndTime - boostrapStartTime
    this.bootstrapped = true
    this.services.event.emit<EventMap>({
      type: FederatedEvents.RUNTIME_BOOTSTRAPPED,
      payload: {
        bootstrapEndTime,
        bootstrapDuration,
      },
    })
  }

  async start(): Promise<void> {
    try {
      const startTime = Date.now()
      this.started = false
      this.services.event.emit<EventMap>({
        type: FederatedEvents.RUNTIME_BEFORE_START,
        payload: {
          startTime: new Date(startTime).toDateString(),
          modules: this.modules,
        },
      })
      await this.bootstrap()
      await this.reroute()
      const startEndTime = Date.now()
      const startDuration = startEndTime - startTime
      this.services.event.emit<EventMap>({
        type: FederatedEvents.RUNTIME_STARTED,
        payload: {
          startTime,
          startEndTime,
          startDuration,
        },
      })
      this.started = true
    } catch (error) {
      this.services.event.emit<EventMap>({
        type: FederatedEvents.RUNTIME_START_ERROR,
        payload: {
          error: error as Error,
        },
      })
    }
  }
}

type RuntimeInitConfig = {
  useNativeModules?: boolean
  addImportMapOverridesUi?: boolean
  importMapOverridesEnabled?: boolean
  debugEnabled?: boolean
  sharedDependencyBaseUrl?: string
  cdnUrl?: string
}

export const initFederatedRuntime = (initConfig?: RuntimeInitConfig) => {
  if (environmentUtils.isBrowser()) {
    if (!window.__FEDERATED_CORE__) {
      window.__FEDERATED_CORE__ = {
        federatedRuntime: new FederatedRuntime(),
      }
    }

    if (!window.__FEDERATED_CORE__.federatedRuntime) {
      window.__FEDERATED_CORE__.federatedRuntime = new FederatedRuntime()
    }

    const runtime = window.__FEDERATED_CORE__.federatedRuntime

    runtime.useNativeModules =
      initConfig?.useNativeModules || runtime.useNativeModules || false

    if (
      initConfig?.importMapOverridesEnabled ||
      runtime.importMapOverridesEnabled
    ) {
      runtime.importMapOverridesEnabled =
        initConfig?.importMapOverridesEnabled ||
        runtime.importMapOverridesEnabled ||
        false
      runtime.addImportMapOverridesUi()
    }

    runtime.debugEnabled = initConfig?.debugEnabled || false
    runtime.sharedDependencyBaseUrl = initConfig?.sharedDependencyBaseUrl || ''
    runtime.cdnUrl = initConfig?.cdnUrl || runtime.cdnUrl || ''

    window.__FEDERATED_CORE__.federatedRuntime = runtime

    return runtime
  }

  return new FederatedRuntime()
}

export default FederatedRuntime
