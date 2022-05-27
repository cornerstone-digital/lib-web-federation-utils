import * as eventService from './services/event'
import * as loggerService from './services/logger'

import {
  FederatedModule,
  ImportMap,
  FederatedModuleStatuses,
  FederatedRuntimeType, ExposedServicesType,
} from '../types'

import { isBrowser } from '../utils/environment'

const ExposedServices: ExposedServicesType = {
    eventService,
    loggerService,
}

class FederatedRuntime implements FederatedRuntimeType {
  useNativeModules = false

  enableImportMapOverrides = false

  sharedDependencyBaseUrl = ''

  cdnUrl = ''

  debugEnabled = false

  modules = new Map<string, FederatedModule>()

  services = ExposedServices

  isDebugEnabled(): boolean {
    return this.debugEnabled
  }

  setDebugEnabled(value: boolean): FederatedRuntimeType {
    this.debugEnabled = value

    return this
  }

  async fetchImportMapContent(modulePath: string): Promise<ImportMap> {
    const importMapPath = `${modulePath}/entries-import-map.json`
    const importMap = await fetch(importMapPath)

    return importMap.json()
  }

  getModuleKey(scope: string, moduleName: string): string {
    return `${scope}/${moduleName}`
  }

  async getModuleUrl(scope: string, moduleName: string): Promise<string> {
    const moduleBaseUrl = window.__FEDERATED_CORE__.moduleBaseUrls[scope]
    const importMap = await this.fetchImportMapContent(moduleBaseUrl)
    const moduleKey = this.getModuleKey(scope, moduleName)

    return importMap.imports[moduleKey]
  }

  public setModuleState(scope: string, moduleName: string, state: FederatedModuleStatuses) {
    const moduleKey = this.getModuleKey(scope, moduleName)

    Array.from(this.modules.entries()).forEach(([key, module]) => {
      if (key === moduleKey) {
        module.status = state as FederatedModuleStatuses
      }
    })
  }

  addBaseUrl(scope: string, baseUrl: string) {
    window.__FEDERATED_CORE__.moduleBaseUrls[scope] = baseUrl

    return this
  }

  public async registerModule(module: FederatedModule) {
    const moduleKey = this.getModuleKey(module.scope, module.name)

    if (this.modules.has(moduleKey) && this.modules.get(moduleKey)?.status === FederatedModuleStatuses.LOADED) {
      eventService.emit({ payload: { module }, type: `federated-core:${moduleKey}:module-already-registered` })
    } else if (module.status === FederatedModuleStatuses.MOUNTED) {
        eventService.emit({ payload: { module }, type: `federated-core:${moduleKey}:module-already-mounted` })
      } else {
        eventService.emit({
          payload: { module },
          type: `federated-core:${moduleKey}:before-register-module`,
        })

        this.setModuleState(module.scope, module.name, FederatedModuleStatuses.NOT_LOADED)
        this.modules.set(moduleKey, module)
        eventService.emit({ payload: { module }, type: `federated-core:${moduleKey}:module-registered` })
      }

    return this
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
  public async loadModule(scope: string, moduleName: string): Promise<FederatedModule | undefined> {
    try {
      const moduleKey = this.getModuleKey(scope, moduleName)
      if (this.modules.has(moduleKey)) {
        const module = this.modules.get(moduleKey)
        if (
          module &&
          ['app-module', 'component'].includes(module.type) &&
          this.modules.get(moduleKey)?.status === FederatedModuleStatuses.MOUNTED
        ) {
          eventService.emit({
            payload: { module },
            type: `federated-core:${moduleKey}:app-module-already-mounted`,
          })

          return this.modules.get(moduleKey)
        }

        if (
          this.modules.get(moduleKey)?.type === 'shared-module' &&
          this.modules.get(moduleKey)?.status === FederatedModuleStatuses.LOADED
        ) {
          eventService.emit({
            payload: { module},
            type: `federated-core:${moduleKey}:shared-module-already-loaded`,
          })

          return this.modules.get(moduleKey)
        }
      }

      eventService.emit({
        payload: { scope, moduleName },
        type: `federated-core:${moduleKey}:before-load-module`,
      })

      let resolvedModule: FederatedModule

      // Load stylesheet from manifest
      if (isBrowser) {
        const moduleBaseUrl = window.__FEDERATED_CORE__.moduleBaseUrls[scope]
        const importMap = await this.fetchImportMapContent(moduleBaseUrl)
        const moduleUrl = importMap.imports[`${moduleName}.css`]

        if (moduleUrl) {
          this.addLinkTag(`${moduleName}.css`, 'stylesheet', moduleUrl)
        }
      }

      if (this.useNativeModules) {
        eventService.emit({ payload: { moduleName, scope }, type: `federated-core:${moduleKey}:loading-native-module` })
        const moduleUrl = await this.getModuleUrl(scope, moduleName)
        resolvedModule = await import(/* webpackIgnore: true */ /* @vite-ignore */ moduleUrl)
        eventService.emit({
          payload: { moduleName, scope },
          type: `federated-core:${moduleKey}:native-module-loaded`,
        })
      } else {
        eventService.emit({ payload: { moduleName, scope }, type: `federated-core:${moduleKey}:loading-systemjs-module` })
        resolvedModule = await System.import(moduleName)
        eventService.emit({
          payload: { moduleName, scope },
          type: `federated-core:${moduleKey}:systemjs-module-loaded`,
        })
      }

      if (!this.modules.has(moduleKey) && !resolvedModule.status) {
        await this.registerModule(resolvedModule)
      }

      if (!resolvedModule.status || resolvedModule.status === FederatedModuleStatuses.NOT_LOADED) {
        this.setModuleState(scope, moduleName, FederatedModuleStatuses.LOADED)
      }

      return resolvedModule
    } catch (error) {
      const moduleKey = this.getModuleKey(scope, moduleName)
      console.log('federated-core:error-loading-module', error)
      eventService.emit({ payload: { moduleName, scope }, type: `federated-core:${moduleKey}:module-load-error`, error })

      return undefined
    }
  }

  async mountModule(scope: string, name: string, props: any, mountId: string): Promise<void> {
    const module = await this.loadModule(scope, name)

    if (module?.mount) {
      module.mount(props, mountId)
    }
  }

  async unmountModule(scope: string, name: string, mountId: string): Promise<void> {
    const module = await this.modules.get(this.getModuleKey(scope, name))

    if (module?.unmount) {
      module.unmount()
    }
  }

  pathToWildcard(path: string): string {
    return `^${path.replace(/\*/g, '.*')}$`
  }

  matchPathToUrlPaths(path: string, urlPaths: string[] = []): boolean {
    const matchFound = urlPaths.find((activePath) => {
      const wildcardRegex = new RegExp(this.pathToWildcard(activePath))
      return wildcardRegex.test(path)
    })

    return !!matchFound
  }

  shouldModuleBeMounted(path: string, module: FederatedModule): boolean {
    return (
      this.matchPathToUrlPaths(path, module.activeWhenPaths) && !this.matchPathToUrlPaths(path, module.exceptWhenPaths)
    )
  }

  getModulesByPath(path: string): FederatedModule[] {
    const modules: FederatedModule[] = []
    this.modules.forEach((module) => {
      if (this.shouldModuleBeMounted(path, module)) {
        modules.push(module)
      }
    })

    return modules
  }

  navigateTo(path: string) {
    if (window.location.pathname === path) {
      eventService.emit({ payload: { path }, type: 'federated-core:route-already-active' })

      return
    }

    eventService.emit({ payload: { path }, type: 'federated-core:navigate-to' })
    window.history.pushState(null, '', path)

    // Trigger popstate event
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  reroute() {
    eventService.emit({
      payload: {
        location: window.location,
        activeModules: this.getModulesByPath(window.location.pathname),
      },
      type: 'federated-core:route-triggered',
    })
    const modulesToMount: FederatedModule[] = []
    const modulesToUnmount: FederatedModule[] = []

    this.modules.forEach((module) => {
      if (this.shouldModuleBeMounted(window.location.pathname, module)) {
        modulesToMount.push(module)
      } else {
        modulesToUnmount.push(module)
      }
    })

    modulesToUnmount.forEach(async (module) => {
      const moduleKey = this.getModuleKey(module.scope, module.name)
      const moduleInstance = this.modules.get(moduleKey)

      if (moduleInstance?.unmount) {
        eventService.emit({ payload: { module }, type: `federated-core:${moduleKey}:before-module-unmount` })
        moduleInstance.unmount()
      } else if (moduleInstance?.type === 'app-module' || moduleInstance?.type === 'component') {
          this.setModuleState(module.scope, module.name, FederatedModuleStatuses.NOT_LOADED)
        }
    })

    modulesToMount.forEach(async (module) => {
      const moduleKey = this.getModuleKey(module.scope, module.name)
      const loadedModule = await this.loadModule(module.scope, module.name)
      if (loadedModule?.mount) {
        eventService.emit({ payload: { module }, type: `federated-core:${moduleKey}:before-module-mount` })
        loadedModule.mount()
      }
    })
  }

  validateProps(scope: string, moduleName: string, props: unknown): boolean {
    const moduleKey = this.getModuleKey(scope, moduleName)
    eventService.emit({ payload: { moduleName, props, scope }, type: `federated-core:${moduleKey}:validating-props` })
    const module = this.modules.get(moduleKey)

    if (!module) {
      throw Error(`Module ${moduleKey} not registered`)
    }

    if (!module.validateProps) {
      return true
    }

    return module.validateProps(props)
  }

  addDynamicScriptTag(id: string, src: string, onload?: () => void): void {
    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.crossOrigin = 'anonymous'
    if (onload) script.onload = onload
    document.body.appendChild(script)
  }

  addMetaTag(id: string, content: string): void {
    const meta = document.createElement('meta')
    meta.id = id
    meta.content = content
    document.head.appendChild(meta)
  }

  addStyleTag(id: string, css: string): void {
    const style = document.createElement('style')
    style.id = id
    style.innerHTML = css
    document.head.appendChild(style)
  }

  addLinkTag(id: string, rel: string, href: string): void {
    const link = document.createElement('link')
    link.id = id
    link.rel = rel
    link.href = href
    document.head.appendChild(link)
  }

  addHtmlElementWithAttrs(tagName: string, attrs: { [key: string]: string }): void {
    const element = document.createElement(tagName)
    Object.keys(attrs).forEach((key) => {
      element.setAttribute(key, attrs[key])
    })

    document.body.appendChild(element)
  }

  addImportMapOverridesUi(): void {
    const importMapOverridesKey = 'import-map-overrides'
    if (this.enableImportMapOverrides) {
      this.addHtmlElementWithAttrs('import-map-overrides-full', {
        'show-when-local-storage': importMapOverridesKey,
      })

      localStorage.setItem(importMapOverridesKey, 'true')

      this.addDynamicScriptTag(
        importMapOverridesKey,
        'https://cdn.jsdelivr.net/npm/import-map-overrides/dist/import-map-overrides.js',
        () => {
          eventService.emit({ type: 'federated-core:import-map-overrides-loaded', payload: {} })
        },
      )
    }
  }

  setSharedDependencyBaseUrl(baseUrl: string) {
    this.sharedDependencyBaseUrl = baseUrl

    return this
  }

  ensureSystemJs(): void {
    if (!this.useNativeModules && !(typeof System.import === 'function')) {
      this.addMetaTag('importmap-type', 'systemjs-importmap')
      this.addDynamicScriptTag('systemjs', `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/system.min.js`)
      this.addDynamicScriptTag(
        'systemjs-named-exports',
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/named-exports.min.js`,
      )
      this.addDynamicScriptTag('systemjs-amd', `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/amd.min.js`)
      this.addDynamicScriptTag(
        'systemjs-dynamic-import-maps',
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/dynamic-import-maps.min.js`,
      )

      eventService.emit({ type: 'federated-core:systemjs-loaded', payload: {} })
    }
  }

  bootstrap(): void {
    eventService.emit({
      payload: {
        bootstrapTime: new Date().getDate().toString(),
        modules: this.modules,
        modulesBaseUrls: window.__FEDERATED_CORE__.moduleBaseUrls,
        useNativeModules: this.useNativeModules,
        enableImportMapOverrides: this.enableImportMapOverrides,
      },
      type: 'federated-core:bootstrapping',
    })

    window.addEventListener('popstate', (event) => {
      eventService.emit({ payload: { event }, type: 'federated-core:popstate-event-fired' })
      this.reroute()
    })

    this.ensureSystemJs()
    this.addImportMapOverridesUi()
  }

  setUseNativeModules(useNativeModules: boolean) {
    this.useNativeModules = useNativeModules

    return this
  }

  setEnableImportMapOverrides(enableImportMapOverrides: boolean) {
    this.enableImportMapOverrides = enableImportMapOverrides

    return this
  }

  start(): void {
    this.bootstrap()
    eventService.emit({ payload: {}, type: 'federated-core:started' })
    this.reroute()
  }

  async preFetchRoutes(routePaths: string[]): Promise<FederatedRuntimeType> {
    eventService.emit({ payload: { routePaths }, type: 'federated-core:prefetching-routes' })

    routePaths.forEach((routePath) => {
      const modules = this.getModulesByPath(routePath)
      modules.forEach(async (module) => {
        const moduleKey = this.getModuleKey(module.scope, module.name)
        if (!this.modules.has(moduleKey)) {
          await this.loadModule(module.scope, module.name)
        }
      })
    })

    eventService.emit({ payload: { routePaths }, type: 'federated-core:prefetched-routes' })

    return this
  }

  async preFetchModules(modules: FederatedModule[]): Promise<FederatedRuntimeType> {
    eventService.emit({ payload: { modules }, type: 'federated-core:prefetching-modules' })

    for (const module of modules) {
      const moduleKey = this.getModuleKey(module.scope, module.name)
      if (!this.modules.has(moduleKey)) {
        await this.loadModule(module.scope, module.name)
      }
    }

    eventService.emit({ payload: { modules }, type: 'federated-core:prefetched-modules' })

    return this
  }
}

export const getFederatedRuntime = (): FederatedRuntimeType | void => {
  if (isBrowser) {
    if (!window.__FEDERATED_CORE__.federatedRuntime) {
      // eslint-disable-next-line @vfuk/rules/js-prefer-static
      window.__FEDERATED_CORE__.federatedRuntime = new FederatedRuntime()
    }

    return window.__FEDERATED_CORE__.federatedRuntime
  }
}

export default FederatedRuntime
