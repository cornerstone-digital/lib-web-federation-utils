/* eslint-disable */
import { FederatedEvent, FederatedModule, ImportMap, FederatedModuleStatuses, FederatedModuleStatusValues } from '../types'
import { isBrowser } from '../utils/environment'

class FederatedRuntime {
  useNativeModules = false
  enableImportMapOverrides = false
  sharedDependencyBaseUrl = ''

  debugEnabled = false

  modules: Map<string, FederatedModule> = new Map()

  isDebugEnabled() {
    return this.debugEnabled
  }

  setDebugEnabled(value: boolean) {
    this.debugEnabled = value

    return this
  }

  async fetchImportMapContent(modulePath: string): Promise<ImportMap> {
    const importMapPath = `${modulePath}/import-map.json`
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

  public setModuleState(scope: string, moduleName: string, state: FederatedModuleStatusValues) {
    const moduleKey = this.getModuleKey(scope, moduleName)

    Array.from(this.modules.entries()).find(([key, module]) => {
      if (key === moduleKey) {
        module.status = state as FederatedModuleStatuses
      }
    })
  }

  addBaseUrl(scope: string, baseUrl: string) {
    window.__FEDERATED_CORE__.moduleBaseUrls[scope] = baseUrl

    return this
  }

  public async registerModule(module: FederatedModule, isRemote: boolean = false) {
    const moduleKey = this.getModuleKey(module.scope, module.name)

    if (this.modules.has(moduleKey)) {
      console.error(Error(`Module ${moduleKey} already registered`))
    }

    if (isRemote) {
      module = (await this.loadModule(module.scope, module.name)) ?? module
    }

    module.status = FederatedModuleStatuses.NOT_LOADED

    this.modules.set(moduleKey, module)

    return this
  }

  public async loadModule(scope: string, moduleName: string): Promise<FederatedModule | undefined> {
    try {
      const moduleKey = this.getModuleKey(scope, moduleName)

      if (this.modules.has(moduleKey)) {
        return this.modules.get(moduleKey)
      }

      let resolvedModule: FederatedModule

      if (this.useNativeModules) {
        const moduleUrl = await this.getModuleUrl(scope, moduleName)
        resolvedModule = await import(/* @vite-ignore */ moduleUrl)
      } else {
        resolvedModule = await System.import(moduleName)
      }

      await this.registerModule(resolvedModule)

      return resolvedModule
    } catch (error) {
      console.error(error)

      return undefined
    }
  }

  pathToWildcard(path: string) {
    return `^${path.replace(/\*/g, '.*')}$`
  }

  matchPathToModuleActivePaths(path: string, activeWhenPaths: string[]): boolean {
    const matchFound = activeWhenPaths.find(activePath => {
      const wildcardRegex = new RegExp(this.pathToWildcard(activePath))
      return wildcardRegex.test(path)
    })

    return !!matchFound
  }

  getModulesByPath(path: string): FederatedModule[] {
    const modules: FederatedModule[] = []
    this.modules.forEach(module => {
      if (this.matchPathToModuleActivePaths(path, module.activeWhenPaths)) {
        modules.push(module)
      }
    })

    return modules
  }

  reroute() {
    const modulesToMount: FederatedModule[] = []
    const modulesToUnmount: FederatedModule[] = []

    this.modules.forEach(module => {
      if (this.matchPathToModuleActivePaths(window.location.pathname, module.activeWhenPaths)) {
        if (module.status === FederatedModuleStatuses.NOT_LOADED) {
          modulesToMount.push(module)
        }
      } else if (module.status === FederatedModuleStatuses.MOUNTED) {
        modulesToUnmount.push(module)
      }
    })

    modulesToUnmount.forEach(module => {
      if (module.unmount) {
        module.unmount()
      }
    })

    modulesToMount.forEach(module => {
      if (module.mount) {
        module.mount()
      }
    })
  }

  validateProps(scope: string, moduleName: string, props: any) {
    this.emit({ payload: { moduleName, props, scope }, type: 'federated-core:validating-props' })
    const moduleKey = this.getModuleKey(scope, moduleName)
    const module = this.modules.get(moduleKey)

    if (!module) {
      throw Error(`Module ${moduleKey} not registered`)
    }

    if (!module.validateProps) {
      return
    }

    module.validateProps(props)
  }

  addDynamicScriptTag(id: string, src: string, onload?: () => void) {
    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.crossOrigin = 'anonymous'
    if (onload) script.onload = onload
    document.body.appendChild(script)
  }

  addMetaTag(id: string, content: string) {
    const meta = document.createElement('meta')
    meta.id = id
    meta.content = content
    document.head.appendChild(meta)
  }

  addStyleTag(id: string, css: string) {
    const style = document.createElement('style')
    style.id = id
    style.innerHTML = css
    document.head.appendChild(style)
  }

  addLinkTag(id: string, rel: string, href: string) {
    const link = document.createElement('link')
    link.id = id
    link.rel = rel
    link.href = href
    document.head.appendChild(link)
  }

  addHtmlElementWithAttrs(tagName: string, attrs: { [key: string]: string }) {
    const element = document.createElement(tagName)
    Object.keys(attrs).forEach(key => {
      element.setAttribute(key, attrs[key])
    })

    document.body.appendChild(element)
  }

  addImportMapOverridesUi() {
    if (this.enableImportMapOverrides) {
      this.addHtmlElementWithAttrs('import-map-overrides-full', {
        'show-when-local-storage': 'import-map-overrides',
      })

      localStorage.setItem('import-map-overrides', 'true')

      this.addDynamicScriptTag('import-map-overrides', 'https://cdn.jsdelivr.net/npm/import-map-overrides/dist/import-map-overrides.js')
    }
  }

  ensureSystemJs() {
    if (!this.useNativeModules) {
      this.addMetaTag('importmap-type', 'systemjs-importmap')
      this.addDynamicScriptTag('systemjs', `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/system.min.js`)
      this.addDynamicScriptTag('systemjs-named-exports', `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/named-exports.min.js`)
      this.addDynamicScriptTag('systemjs-amd', `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/amd.min.js`)
      this.addDynamicScriptTag('systemjs-dynamic-import-maps', `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/dynamic-import-maps.min.js`)
    }
  }

  bootstrap(): void {
    this.emit({
      payload: {
        bootstrapTime: new Date().getDate().toString(),
        modules: this.modules,
        modulesBaseUrls: window.__FEDERATED_CORE__.moduleBaseUrls,
        useNativeModules: this.useNativeModules,
        enableImportMapOverrides: this.enableImportMapOverrides,
      },
      type: 'federated-core:bootstrapping',
    })

    this.ensureSystemJs()
    this.addImportMapOverridesUi()
    this.reroute()
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
    this.emit({ payload: {}, type: 'federated-core:started' })
    this.bootstrap()
  }

  async preFetchRoutes(routePaths: string[]): Promise<void> {
    this.emit({ payload: { routePaths }, type: 'federated-core:prefetching-routes' })

    routePaths.forEach(routePath => {
      const modules = this.getModulesByPath(routePath)
      modules.forEach(async module => {
        const moduleKey = this.getModuleKey(module.scope, module.name)
        if (!this.modules.has(moduleKey)) {
          await this.loadModule(module.scope, module.name)
        }
      })
    })

    this.emit({ payload: { routePaths }, type: 'federated-core:prefetched-routes' })
  }

  async preFetchModules(modules: FederatedModule[]): Promise<void> {
    this.emit({ payload: { modules }, type: 'federated-core:prefetching-modules' })

    for (const module of modules) {
      const moduleKey = this.getModuleKey(module.scope, module.name)
      if (!this.modules.has(moduleKey)) {
        await this.loadModule(module.scope, module.name)
      }
    }

    this.emit({ payload: { modules }, type: 'federated-core:prefetched-modules' })
  }

  emit<EventType extends FederatedEvent<string, unknown>>({ type, payload }: EventType): void {
    const event = new CustomEvent(type, { detail: payload })
    console.log('emitting', event)
    window.dispatchEvent(event)
  }

  subscribe<EventType extends FederatedEvent<string, unknown>>(
    { type }: EventType,
    callback: (payload: EventType['payload']) => void,
  ): { unsubscribe: () => void } {
    window.addEventListener(type, callback)

    return {
      unsubscribe: () => window.removeEventListener(type, callback),
    }
  }
}

export const getFederatedRuntime = (): FederatedRuntime | void => {
  if (isBrowser()) {
    if (!window.__FEDERATED_CORE__.federatedRuntime) {
      window.__FEDERATED_CORE__.federatedRuntime = new FederatedRuntime()
    }

    return window.__FEDERATED_CORE__.federatedRuntime
  }
}

export default FederatedRuntime
