/**
 * @jest-environment jsdom
 */

import FederatedRuntime, { getFederatedRuntime } from './FederatedRuntime'
import LoggerService from './services/logger'
import EventService from './services/event'

import {
  FederatedModule,
  FederatedModuleStatuses,
  FederatedLifecycleMethods,
} from '../types'
import { FederatedEvents } from './FederatedRuntime.types'
import { getModuleKey } from './helpers'

let federatedRuntime: FederatedRuntime
let dispatchedEventCount: Record<string, number> = {}
let lifecycleMethodCallCount: Record<FederatedLifecycleMethods, number> = {
  bootstrap: 0,
  mount: 0,
  unmount: 0,
  update: 0,
}

const originalDispatchEvent = window.dispatchEvent

const bootstrapHandler = async () => {
  lifecycleMethodCallCount.bootstrap++
}
const mountHandler = async () => {
  lifecycleMethodCallCount.mount++
}
const unmountHandler = async () => {
  lifecycleMethodCallCount.unmount++
}
const updateHandler = async () => {
  lifecycleMethodCallCount.update++
}

const resolvedModule = {
  scope: 'scope',
  name: 'module-1',
  status: FederatedModuleStatuses.LOADED,
  bootstrap: bootstrapHandler,
  mount: mountHandler,
  unmount: unmountHandler,
  update: updateHandler,
}

describe('FederatedRuntime', () => {
  describe('In Browser', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      federatedRuntime = new FederatedRuntime()

      const originalWindow = window

      window.__FEDERATED_CORE__ = {
        moduleBaseUrls: {},
        federatedRuntime,
      }

      window.dispatchEvent = jest.fn().mockImplementation((event: Event) => {
        dispatchedEventCount[event.type] = dispatchedEventCount[event.type]
          ? dispatchedEventCount[event.type] + 1
          : 1

        originalDispatchEvent(event)
      })

      dispatchedEventCount = {}
      lifecycleMethodCallCount = {
        bootstrap: 0,
        mount: 0,
        unmount: 0,
        update: 0,
      }

      // @ts-ignore
      global.System.import = jest.fn(() => Promise.resolve(resolvedModule))

      // @ts-ignore
      global.window = Object.create(window)
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/path',
        },
      })

      // eslint-disable-next-line no-global-assign
      window = originalWindow
    })

    describe('constructor', () => {
      it('should create a FederatedRuntime instance', () => {
        expect(federatedRuntime).toBeDefined()
      })

      it('should set bootstrapped to false by default', () => {
        expect(federatedRuntime.bootstrapped).toBe(false)
      })

      it('should set started to false by default', () => {
        expect(federatedRuntime.started).toBe(false)
      })

      it('should set useNativeModules to false by default', () => {
        expect(federatedRuntime.useNativeModules).toBe(false)
      })

      it('should set enableImportMapOverrides to false by default', () => {
        expect(federatedRuntime.importMapOverridesEnabled).toBe(false)
      })

      it('should set sharedDependencyBaseUrl to empty string by default', () => {
        expect(federatedRuntime.sharedDependencyBaseUrl).toBe('')
      })

      it('should set cdnUrl to empty string by default', () => {
        expect(federatedRuntime.cdnUrl).toBe('')
      })

      it('should set debugEnabled to false by default', () => {
        expect(federatedRuntime.debugEnabled).toBe(false)
      })

      it('should set modules to any empty map by default', () => {
        expect(federatedRuntime.modules).toEqual(new Map())
      })

      it('should expose an instance of eventService', () => {
        expect(federatedRuntime.services.event).toEqual(EventService)
      })

      it('should expose an instance of loggerService', () => {
        expect(federatedRuntime.services.logger).toEqual(LoggerService)
      })
    })

    describe('setters', () => {
      describe('set bootstrapped', () => {
        it('should set bootstrapped to true', () => {
          expect(federatedRuntime.bootstrapped).toBe(false)
          federatedRuntime.bootstrapped = true
          expect(federatedRuntime.bootstrapped).toBe(true)
        })
      })

      describe('set started', () => {
        it('should set started to true', () => {
          expect(federatedRuntime.started).toBe(false)
          federatedRuntime.started = true
          expect(federatedRuntime.started).toBe(true)
        })
      })

      describe('set debugEnabled', () => {
        it('should set debugEnabled to true', () => {
          expect(federatedRuntime.debugEnabled).toBe(false)
          federatedRuntime.debugEnabled = true
          expect(federatedRuntime.debugEnabled).toBe(true)
        })
      })

      describe('set modules', () => {
        it('should set modules to new module map', () => {
          expect(federatedRuntime.modules).toEqual(new Map())
          const newMap: Map<string, FederatedModule> = new Map([
            [
              'scope/name',
              { scope: 'scope', name: 'name', type: 'journey-module' },
            ],
          ])
          federatedRuntime.modules = newMap
          expect(federatedRuntime.modules).toEqual(newMap)
        })
      })

      describe('set useNativeModules', () => {
        it('should set useNativeModules to true', () => {
          expect(federatedRuntime.useNativeModules).toBe(false)
          federatedRuntime.useNativeModules = true
          expect(federatedRuntime.useNativeModules).toBe(true)
        })
      })

      describe('set importMapOverridesEnabled', () => {
        it('should set enableImportMapOverrides to true', () => {
          expect(federatedRuntime.importMapOverridesEnabled).toBe(false)
          federatedRuntime.importMapOverridesEnabled = true
          expect(federatedRuntime.importMapOverridesEnabled).toBe(true)
        })
      })

      describe('set sharedDependencyBaseUrl', () => {
        it('should set sharedDependencyBaseUrl to a string', () => {
          expect(federatedRuntime.sharedDependencyBaseUrl).toBe('')
          federatedRuntime.sharedDependencyBaseUrl =
            'https://cdn.vodafone.co.uk/federated/shared-dependencies'
          expect(federatedRuntime.sharedDependencyBaseUrl).toBe(
            'https://cdn.vodafone.co.uk/federated/shared-dependencies'
          )
        })
      })

      describe('set cdnUrl', () => {
        it('should set cdnUrl to a string', () => {
          expect(federatedRuntime.cdnUrl).toBe('')
          federatedRuntime.cdnUrl = 'https://cdn.vodafone.co.uk'
          expect(federatedRuntime.cdnUrl).toBe('https://cdn.vodafone.co.uk')
        })
      })
    })

    describe('getters', () => {
      describe('get bootstrapped', () => {
        it('should return bootstrapped', () => {
          expect(federatedRuntime.bootstrapped).toBe(false)
          federatedRuntime.bootstrapped = true
          expect(federatedRuntime.bootstrapped).toBe(true)
        })
      })

      describe('get started', () => {
        it('should return started', () => {
          expect(federatedRuntime.started).toBe(false)
          federatedRuntime.started = true
          expect(federatedRuntime.started).toBe(true)
        })
      })

      describe('get debugEnabled', () => {
        it('should return debugEnabled', () => {
          expect(federatedRuntime.debugEnabled).toBe(false)
          federatedRuntime.debugEnabled = true
          expect(federatedRuntime.debugEnabled).toBe(true)
        })
      })

      describe('get modules', () => {
        it('should return modules', () => {
          expect(federatedRuntime.modules).toEqual(new Map())
          const newMap: Map<string, FederatedModule> = new Map([
            [
              'scope/name',
              { scope: 'scope', name: 'name', type: 'journey-module' },
            ],
          ])
          federatedRuntime.modules = newMap
          expect(federatedRuntime.modules).toEqual(newMap)
        })
      })

      describe('get useNativeModules', () => {
        it('should return useNativeModules', () => {
          expect(federatedRuntime.useNativeModules).toBe(false)
          federatedRuntime.useNativeModules = true
          expect(federatedRuntime.useNativeModules).toBe(true)
        })
      })

      describe('get importMapOverridesEnabled', () => {
        it('should return enableImportMapOverrides', () => {
          expect(federatedRuntime.importMapOverridesEnabled).toBe(false)
          federatedRuntime.importMapOverridesEnabled = true
          expect(federatedRuntime.importMapOverridesEnabled).toBe(true)
        })
      })

      describe('get sharedDependencyBaseUrl', () => {
        it('should return sharedDependencyBaseUrl', () => {
          expect(federatedRuntime.sharedDependencyBaseUrl).toBe('')
          federatedRuntime.sharedDependencyBaseUrl =
            'https://cdn.vodafone.co.uk/federated/shared-dependencies'
          expect(federatedRuntime.sharedDependencyBaseUrl).toBe(
            'https://cdn.vodafone.co.uk/federated/shared-dependencies'
          )
        })
      })

      describe('get cdnUrl', () => {
        it('should return cdnUrl', () => {
          expect(federatedRuntime.cdnUrl).toBe('')
          federatedRuntime.cdnUrl = 'https://cdn.vodafone.co.uk'
          expect(federatedRuntime.cdnUrl).toBe('https://cdn.vodafone.co.uk')
        })
      })
    })

    describe('methods', () => {
      describe('addImportMapOverridesUi', () => {
        it('should add import map overrides ui when importMapOverrides is enabled', () => {
          federatedRuntime.importMapOverridesEnabled = true
          federatedRuntime.addImportMapOverridesUi()
          const importMapOverridesUi = document.getElementById(
            'import-map-overrides-ui'
          )
          expect(importMapOverridesUi).toBeTruthy()
        })
      })

      describe('ensureSystemJs', () => {
        it('should ensure systemjs is loaded', () => {
          federatedRuntime.ensureSystemJs()
          const systemJs = window.System
          expect(systemJs).toBeTruthy()
        })

        it('should add importmap-type meta tag to head', () => {
          federatedRuntime.ensureSystemJs()
          const importMapTypeMeta = document.querySelector(
            'meta[name="importmap-type"]'
          )
          expect(importMapTypeMeta).toBeTruthy()
        })

        it('should add script with id of systemjs to head', () => {
          federatedRuntime.ensureSystemJs()
          const systemJsScript = document.getElementById('systemjs')
          expect(systemJsScript).toBeTruthy()
        })

        it('should add script with id of systemjs-named-exports to head', () => {
          federatedRuntime.ensureSystemJs()
          const systemJsNamedExportsScript = document.getElementById(
            'systemjs-named-exports'
          )
          expect(systemJsNamedExportsScript).toBeTruthy()
        })

        it('should add script with systemjs-amd to head', () => {
          federatedRuntime.ensureSystemJs()
          const systemJsAmdScript = document.getElementById('systemjs-amd')
          expect(systemJsAmdScript).toBeTruthy()
        })

        it('should add script with systemjs-dynamic-import-maps to head', () => {
          federatedRuntime.ensureSystemJs()
          const systemJsDynamicImportMapsScript = document.getElementById(
            'systemjs-dynamic-import-maps'
          )
          expect(systemJsDynamicImportMapsScript).toBeTruthy()
        })

        it('should fire systemjs-loaded event', () => {
          federatedRuntime.ensureSystemJs()

          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
          })
        })
      })

      describe('fetchImportMapContent', () => {
        it('should fetch import map content', async () => {
          const modulePath = 'https://cdn.vodafone.co.uk/federated/scope/name'
          const importMapContent =
            '{"imports": {"scope/name": "https://cdn.vodafone.co.uk/federated/scope/name.js"}}'
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          const result = await federatedRuntime.fetchImportMapContent(
            modulePath
          )
          expect(global.fetch).toHaveBeenCalledWith(
            `${modulePath}/entries-import-map.json`
          )
          expect(result).toEqual(importMapContent)
        })
      })

      describe('addBaseUrl', () => {
        it('should add base url to window.__FEDERATED_CORE__.moduleBaseUrls', () => {
          const baseUrl = 'https://cdn.vodafone.co.uk/federated/scope/name'
          federatedRuntime.addBaseUrl('scope/name', baseUrl)
          expect(window.__FEDERATED_CORE__.moduleBaseUrls).toEqual({
            'scope/name': baseUrl,
          })
        })
      })

      describe('setModuleState', () => {
        it('should set module state', () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'name',
            type: 'journey-module',
          }

          federatedRuntime.registerModule(module)
          federatedRuntime.setModuleState(
            module,
            FederatedModuleStatuses.LOADED
          )
          const moduleKey = getModuleKey(module.scope, module.name)
          expect(federatedRuntime.modules.get(moduleKey)?.status).toEqual(
            FederatedModuleStatuses.LOADED
          )
        })

        it('should dispatch MODULE_STATE_CHANGED event', () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            bootstrap: jest.fn(),
          }

          federatedRuntime.registerModule(module)
          federatedRuntime.setModuleState(
            module,
            FederatedModuleStatuses.LOADED
          )

          const moduleKey = getModuleKey(module.scope, module.name)
          expect(federatedRuntime.modules.get(moduleKey)?.status).toEqual(
            FederatedModuleStatuses.LOADED
          )
          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            'federated-core:module:scope:module-1:state-changed': 2,
          })
        })
      })

      describe('setModuleRootComponent', () => {
        it('should set module root component', () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'name',
            type: 'journey-module',
          }

          federatedRuntime.registerModule(module)

          const RootComponent = () => <div>Root Component</div>

          federatedRuntime.setModuleRootComponent(module, RootComponent)

          const moduleKey = getModuleKey(module.scope, module.name)
          expect(
            federatedRuntime.modules.get(moduleKey)?.rootComponent
          ).toEqual(RootComponent)
        })
      })

      describe('getModuleRootComponent', () => {
        it('should get module root component', () => {
          const RootComponent = () => <div>Root Component</div>
          const module: FederatedModule = {
            scope: 'scope',
            name: 'name',
            type: 'journey-module',
            rootComponent: RootComponent,
          }

          federatedRuntime.registerModule(module)

          expect(federatedRuntime.getModuleRootComponent(module)).toEqual(
            RootComponent
          )
        })
      })

      describe('registerModule', () => {
        it('should register module', () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'name',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
          }

          federatedRuntime.registerModule(module)
          const moduleKey = getModuleKey(module.scope, module.name)
          expect(federatedRuntime.modules.get(moduleKey)?.status).toEqual(
            FederatedModuleStatuses.NOT_LOADED
          )
        })

        it('should dispatch correct events when adding a new module', () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
          }

          federatedRuntime.registerModule(module)
          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            'federated-core:module:scope:module-1:state-changed': 1,
          })
        })

        it('should display MODULE_ALREADY_REGISTERED error if module already registered', () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
          }

          federatedRuntime.registerModule(module)
          federatedRuntime.setModuleState(
            module,
            FederatedModuleStatuses.LOADED
          )
          federatedRuntime.registerModule(module)

          expect(dispatchedEventCount).toHaveProperty(
            'federated-core:module:scope:module-1:already-registered'
          )
        })

        it('should display MODULE_ALREADY_MOUNTED error if module already mounted', () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
          }

          federatedRuntime.registerModule(module)
          federatedRuntime.setModuleState(
            module,
            FederatedModuleStatuses.MOUNTED
          )
          federatedRuntime.registerModule(module)

          expect(dispatchedEventCount).toHaveProperty(
            'federated-core:module:scope:module-1:already-mounted'
          )
        })
      })

      describe('getModuleUrl', () => {
        it('should call fetchImportMapContent', async () => {
          const fetchImportMapContentSpy = jest.spyOn(
            federatedRuntime,
            'fetchImportMapContent'
          )
          const importMapContent = {
            imports: {
              'scope:name':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          await federatedRuntime.getModuleUrl({ scope: 'scope', name: 'name' })
          expect(fetchImportMapContentSpy).toHaveBeenCalled()
        })

        it('should return module url', async () => {
          const importMapContent = {
            imports: {
              name: 'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          const result = await federatedRuntime.getModuleUrl({
            scope: 'scope',
            name: 'name',
          })
          expect(result).toEqual(
            'https://cdn.vodafone.co.uk/federated/scope/name.js'
          )
        })
      })

      describe('getModulesByPath', () => {
        it('should return modules by path', () => {
          const module1: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            activeWhenPaths: ['/path-1', '/path-2'],
          }

          const module2: FederatedModule = {
            scope: 'scope',
            name: 'module-2',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            activeWhenPaths: ['/path-3', '/path-4'],
          }

          federatedRuntime.registerModule(module1)
          federatedRuntime.registerModule(module2)

          const modules = federatedRuntime.getModulesByPath('/path-1')
          expect(modules).toEqual([module1])
        })
      })

      describe('loadModule', () => {
        it('should load module', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          federatedRuntime.ensureSystemJs()

          const loadedModule = await federatedRuntime.loadModule(module)

          expect(loadedModule).toEqual(resolvedModule)
          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-load': 1,
            'federated-core:systemjs:loaded': 1,
            'federated-core:systemjs:module:loaded': 1,
            'federated-core:systemjs:module:loading': 1,
          })
        })

        it('should emit MODULE_ALREADY_LOADED error if module already loaded', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.LOADED,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          federatedRuntime.ensureSystemJs()

          await federatedRuntime.registerModule(module)
          await federatedRuntime.loadModule(module)

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:already-loaded': 1,
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            'federated-core:module:scope:module-1:state-changed': 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
          })
        })

        it('should emit MODULE_ALREADY_MOUNTED error if module already mounted', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.MOUNTED,
          }

          federatedRuntime.ensureSystemJs()

          await federatedRuntime.registerModule(module)
          await federatedRuntime.loadModule(module)

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:already-mounted': 1,
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            'federated-core:module:scope:module-1:state-changed': 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
          })
        })

        it('should add stylesheet to head if one defined in importmap', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
              'module-1.css':
                'https://cdn.vodafone.co.uk/federated/scope/module-1.css',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          federatedRuntime.ensureSystemJs()

          await federatedRuntime.registerModule(module)
          await federatedRuntime.loadModule(module)

          expect(global.document.head.innerHTML).toContain(
            '<link id="module-1.css" rel="stylesheet" href="https://cdn.vodafone.co.uk/federated/scope/module-1.css">'
          )
        })

        it('should use native modules if useNativeModules is true', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })

          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          jest
            .spyOn(federatedRuntime, 'getModuleUrl')
            .mockResolvedValue('./__mocks__/module-mock.js')

          federatedRuntime.useNativeModules = true
          await federatedRuntime.registerModule(module)
          await federatedRuntime.loadModule(module)

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-load': 1,
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            'federated-core:module:scope:module-1:state-changed': 2,
            [FederatedEvents.NATIVE_MODULE_LOADING]: 1,
            [FederatedEvents.NATIVE_MODULE_LOADED]: 1,
          })
        })

        it('should call registerModule if module is not registered or module status is not set', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          federatedRuntime.ensureSystemJs()

          // @ts-ignore
          global.System.import = jest.fn(() => Promise.resolve(module))

          const registerModuleSpy = jest.spyOn(
            federatedRuntime,
            'registerModule'
          )

          await federatedRuntime.loadModule(module)

          expect(registerModuleSpy).toHaveBeenCalledWith(module)
        })

        it('should emit MODULE_LOAD_ERROR if module load fails', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          federatedRuntime.ensureSystemJs()

          jest.spyOn(console, 'error').mockImplementation(jest.fn())
          // @ts-ignore
          global.System.import = jest
            .fn()
            .mockRejectedValue(new Error('Module load error'))

          await federatedRuntime.loadModule(module)

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-load': 1,
            'federated-core:module:scope:module-1:load:error': 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
            [FederatedEvents.SYSTEMJS_MODULE_LOADING]: 1,
          })
        })
      })

      describe('mountModule', () => {
        it('should call mount function of module if it exists', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.LOADED,
            mount: mountHandler,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          federatedRuntime.ensureSystemJs()

          // @ts-ignore
          global.System.import = jest.fn(() => Promise.resolve(module))

          await federatedRuntime.mountModule(module, {}, '#mount-point')

          expect(lifecycleMethodCallCount).toEqual({
            bootstrap: 0,
            mount: 1,
            unmount: 0,
            update: 0,
          })
        })
      })

      describe('unmountModule', () => {
        it('should call unmount function of module if it exists', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            mount: mountHandler,
            unmount: unmountHandler,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          federatedRuntime.ensureSystemJs()

          // @ts-ignore
          global.System.import = jest.fn(() => Promise.resolve(module))

          await federatedRuntime.registerModule(module)
          await federatedRuntime.mountModule(module, {}, '#mount-point')
          await federatedRuntime.unmountModule(module)

          expect(lifecycleMethodCallCount).toEqual({
            bootstrap: 0,
            mount: 1,
            unmount: 1,
            update: 0,
          })
        })
      })

      describe('validateProps', () => {
        it('should return true if props are valid', () => {
          const props = {
            a: 'a',
            b: 'b',
            c: 'c',
          }

          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            mount: mountHandler,
            unmount: unmountHandler,
            validateProps: () => true,
          }

          federatedRuntime.registerModule(module)

          expect(federatedRuntime.validateProps(module, props)).toBe(true)
        })

        it('should return false if props are invalid', () => {
          const props = {
            a: 'a',
            b: 'b',
            c: 'c',
          }

          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            mount: mountHandler,
            unmount: unmountHandler,
            validateProps: () => false,
          }

          federatedRuntime.registerModule(module)

          expect(federatedRuntime.validateProps(module, props)).toBe(false)
        })

        it('should return true is no validateProps function is defined', () => {
          const props = {
            a: 'a',
            b: 'b',
            c: 'c',
          }

          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            mount: mountHandler,
            unmount: unmountHandler,
          }

          federatedRuntime.registerModule(module)

          expect(federatedRuntime.validateProps(module, props)).toBe(true)
        })
      })

      describe('preFetchModules', () => {
        it('should call loadModule for each module in the preFetchModules array', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            mount: mountHandler,
          }

          const module2: FederatedModule = {
            scope: 'scope',
            name: 'module-2',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            mount: mountHandler,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          federatedRuntime.ensureSystemJs()

          await federatedRuntime.preFetchModules([module, module2])

          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_MODULES_PREFETCH_START]: 1,
            [FederatedEvents.RUNTIME_BEFORE_MODULE_PREFETCH]: 2,
            'federated-core:module:scope:module-1:before-load': 1,
            'federated-core:module:scope:module-2:before-load': 1,
            [FederatedEvents.RUNTIME_MODULE_PREFETCHED]: 2,
            [FederatedEvents.RUNTIME_MODULES_PREFETCHED]: 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
            [FederatedEvents.SYSTEMJS_MODULE_LOADED]: 2,
            [FederatedEvents.SYSTEMJS_MODULE_LOADING]: 2,
          })
        })
      })

      describe('navigateTo', () => {
        it('should call history.pushState with the correct params', () => {
          const pushStateSpy = jest.spyOn(history, 'pushState')
          federatedRuntime.navigateTo('/new-path')

          expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/new-path')
        })

        it('should emit ROUTE_ALREADY_ACTIVE if the route is already active', () => {
          // @ts-ignore
          global.window = Object.create(window)
          const url = '/path'
          Object.defineProperty(window, 'location', {
            value: {
              pathname: url,
            },
            writable: true,
          })

          federatedRuntime.navigateTo('/path')

          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.ROUTE_ALREADY_ACTIVE]: 1,
          })
        })
      })

      describe('reroute', () => {
        it('should call mount of module when activeWhenPaths matches the pathname', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.LOADED,
            mount: mountHandler,
            activeWhenPaths: ['/path'],
            exceptWhenPaths: [],
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          // @ts-ignore
          global.System.import = jest.fn(() => Promise.resolve(module))

          await federatedRuntime.registerModule(module)
          await federatedRuntime.reroute()

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            'federated-core:route:changed': 1,
            'federated-core:module:scope:module-1:already-loaded': 1,
            'federated-core:module:scope:module-1:before-mount': 1,
            'federated-core:module:scope:module-1:mounted': 1,
            'federated-core:module:scope:module-1:state-changed': 1,
          })

          expect(lifecycleMethodCallCount).toEqual({
            bootstrap: 0,
            mount: 1,
            unmount: 0,
            update: 0,
          })
        })

        it('should call unmount of module when activeWhenPaths does not match the pathname', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.LOADED,
            unmount: unmountHandler,
            activeWhenPaths: ['/invalid-path'],
            exceptWhenPaths: [],
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          // @ts-ignore
          global.System.import = jest.fn(() => Promise.resolve(module))

          jest.spyOn(federatedRuntime, 'loadModule').mockResolvedValue(module)

          await federatedRuntime.registerModule(module)
          await federatedRuntime.reroute()

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            [FederatedEvents.ROUTE_CHANGED]: 1,
            'federated-core:module:scope:module-1:before-unmount': 1,
            'federated-core:module:scope:module-1:unmounted': 1,
            'federated-core:module:scope:module-1:state-changed': 1,
          })

          expect(lifecycleMethodCallCount).toEqual({
            bootstrap: 0,
            mount: 0,
            unmount: 1,
            update: 0,
          })
        })

        it('should set module state to NOT_LOADED when activeWhenPaths does not match the pathname but no unmount function defined', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.LOADED,
            activeWhenPaths: ['/invalid-path'],
            exceptWhenPaths: [],
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          // @ts-ignore
          global.System.import = jest.fn(() => Promise.resolve(module))

          jest.spyOn(federatedRuntime, 'loadModule').mockResolvedValue(module)

          await federatedRuntime.registerModule(module)
          await federatedRuntime.reroute()

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            [FederatedEvents.ROUTE_CHANGED]: 1,
            'federated-core:module:scope:module-1:state-changed': 2,
          })

          expect(lifecycleMethodCallCount).toEqual({
            bootstrap: 0,
            mount: 0,
            unmount: 0,
            update: 0,
          })

          expect(
            federatedRuntime.modules.get('scope:module-1')?.status
          ).toEqual(FederatedModuleStatuses.NOT_LOADED)
        })

        it('should emit MODULE_MOUNT_ERROR when module mount fails', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.LOADED,
            mount: mountHandler,
            activeWhenPaths: ['/path'],
            exceptWhenPaths: [],
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          jest.spyOn(console, 'error').mockImplementation(jest.fn())

          jest.spyOn(module, 'mount').mockImplementationOnce(() => {
            throw new Error('mount error')
          })
          await federatedRuntime.registerModule(module)
          await federatedRuntime.reroute()

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:registered': 1,
            'federated-core:module:scope:module-1:already-loaded': 1,
            [FederatedEvents.ROUTE_CHANGED]: 1,
            'federated-core:module:scope:module-1:before-mount': 1,
            'federated-core:module:scope:module-1:mount:error': 1,
            'federated-core:module:scope:module-1:state-changed': 1,
          })
        })
      })

      describe('preFetchRoutes', () => {
        it('should pre-fetch routes', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            activeWhenPaths: ['/path'],
            exceptWhenPaths: [],
            mount: mountHandler,
          }

          const importMapContent = {
            imports: {
              'scope:module-1':
                'https://cdn.vodafone.co.uk/federated/scope/name.js',
            },
          }
          const fetchPromise = Promise.resolve({
            json: () => Promise.resolve(importMapContent),
          })
          // @ts-ignore
          global.fetch = jest.fn(() => fetchPromise)

          // @ts-ignore
          global.System.import = jest.fn(() => Promise.resolve(module))

          await federatedRuntime.registerModule(module)
          await federatedRuntime.preFetchRoutes(['/path'])

          expect(dispatchedEventCount).toEqual({
            'federated-core:module:scope:module-1:before-register': 1,
            'federated-core:module:scope:module-1:state-changed': 2,
            'federated-core:module:scope:module-1:registered': 1,
            'federated-core:runtime:routes:pre-fetch:start': 1,
            'federated-core:runtime:route:before-prefetch': 1,
            'federated-core:module:scope:module-1:before-load': 1,
            'federated-core:runtime:route:prefetched': 1,
            'federated-core:runtime:routes:pre-fetched': 1,
            'federated-core:systemjs:module:loading': 1,
            'federated-core:systemjs:module:loaded': 1,
          })
        })

        it('should emit RUNTIME_ROUTES_PREFETCH_ERROR when pre-fetch fails', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'module-1',
            type: 'journey-module',
            status: FederatedModuleStatuses.NOT_LOADED,
            activeWhenPaths: ['/path'],
            exceptWhenPaths: [],
            mount: mountHandler,
          }

          jest
            .spyOn(federatedRuntime, 'getModulesByPath')
            .mockImplementationOnce(() => {
              throw new Error('pre-fetch error')
            })

          federatedRuntime.services.event.register(
            FederatedEvents.RUNTIME_ROUTES_PREFETCH_ERROR,
            () => {
              expect(dispatchedEventCount).toEqual({
                'federated-core:module:scope:module-1:before-register': 1,
                'federated-core:module:scope:module-1:state-changed': 1,
                'federated-core:module:scope:module-1:registered': 1,
                'federated-core:runtime:routes:pre-fetch:start': 1,
                'federated-core:runtime:route:before-prefetch': 1,
                'federated-core:runtime:routes:prefetch:error': 1,
              })
            },
            module
          )

          jest.spyOn(console, 'error').mockImplementation(jest.fn())

          await federatedRuntime.registerModule(module)
          await federatedRuntime.preFetchRoutes(['/path'])
        })
      })

      describe('bootstrap', () => {
        it('should set bootstrapped to true', async () => {
          expect(federatedRuntime.bootstrapped).toBe(false)
          await federatedRuntime.bootstrap()
          expect(federatedRuntime.bootstrapped).toBe(true)
        })

        it('should call bootstrap on each module', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'name',
            type: 'journey-module',
            bootstrap: bootstrapHandler,
          }

          const module2: FederatedModule = {
            scope: 'scope',
            name: 'name',
            type: 'journey-module',
            bootstrap: bootstrapHandler,
          }

          federatedRuntime.modules = new Map([
            ['scope/name', module],
            ['scope/name2', module2],
          ])
          await federatedRuntime.bootstrap()
          expect(lifecycleMethodCallCount.bootstrap).toEqual(2)
        })

        it('should register PopStateEvent listener', async () => {
          const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
          await federatedRuntime.bootstrap()
          expect(addEventListenerSpy).toHaveBeenCalledWith(
            'popstate',
            expect.any(Function)
          )
        })

        it('should trigger popstate event on new popstate event', async () => {
          await federatedRuntime.bootstrap()
          const event = new PopStateEvent('popstate')
          originalDispatchEvent(event)
          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
            [FederatedEvents.RUNTIME_BOOTSTRAPPED]: 1,
            [FederatedEvents.POPSTATE_EVENT_FIRED]: 3,
            [FederatedEvents.ROUTE_CHANGED]: 3,
          })
        })

        it('should call ensureSystemJs method', async () => {
          const mockEnsureSystemJs = jest.fn()
          federatedRuntime.ensureSystemJs = mockEnsureSystemJs
          await federatedRuntime.bootstrap()
          expect(mockEnsureSystemJs).toHaveBeenCalled()
        })

        it('should call addImportMapOverridesUi method', async () => {
          const mockAddImportMapOverridesUi = jest.fn()
          federatedRuntime.addImportMapOverridesUi = mockAddImportMapOverridesUi
          await federatedRuntime.bootstrap()
          expect(mockAddImportMapOverridesUi).toHaveBeenCalled()
        })

        it('should emit correct default events', async () => {
          await federatedRuntime.bootstrap()
          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
            [FederatedEvents.RUNTIME_BOOTSTRAPPED]: 1,
          })
        })

        it('should emit correct events when using native modules', async () => {
          federatedRuntime.useNativeModules = true
          await federatedRuntime.bootstrap()
          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: 1,
            [FederatedEvents.RUNTIME_BOOTSTRAPPED]: 1,
          })
        })

        it('should emit correct events when using import map overrides', async () => {
          federatedRuntime.importMapOverridesEnabled = true
          await federatedRuntime.bootstrap()

          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
            [FederatedEvents.IMPORT_MAP_OVERRIDES_LOADED]: 1,
            [FederatedEvents.RUNTIME_BOOTSTRAPPED]: 1,
          })
        })

        it('should emit correct events for all modules when bootstrapping', async () => {
          const module1: FederatedModule = {
            scope: 'test-scope',
            name: 'test-module-1',
            type: 'journey-module',
            bootstrap: bootstrapHandler,
          }

          const module2: FederatedModule = {
            scope: 'test-scope',
            name: 'test-module-2',
            type: 'journey-module',
            bootstrap: bootstrapHandler,
          }

          await federatedRuntime.registerModule(module1)
          await federatedRuntime.registerModule(module2)
          await federatedRuntime.bootstrap()

          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: 1,
            [FederatedEvents.RUNTIME_BOOTSTRAPPED]: 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
            'federated-core:module:test-scope:test-module-1:before-bootstrap': 1,
            'federated-core:module:test-scope:test-module-1:before-register': 1,
            'federated-core:module:test-scope:test-module-1:bootstrapped': 1,
            'federated-core:module:test-scope:test-module-1:registered': 1,
            'federated-core:module:test-scope:test-module-1:state-changed': 1,
            'federated-core:module:test-scope:test-module-2:before-bootstrap': 1,
            'federated-core:module:test-scope:test-module-2:before-register': 1,
            'federated-core:module:test-scope:test-module-2:bootstrapped': 1,
            'federated-core:module:test-scope:test-module-2:registered': 1,
            'federated-core:module:test-scope:test-module-2:state-changed': 1,
          })

          expect(lifecycleMethodCallCount.bootstrap).toEqual(2)
        })

        it('should throw error if any module bootstrap fails', async () => {
          const module: FederatedModule = {
            scope: 'scope',
            name: 'test-module-1',
            type: 'journey-module',
            bootstrap: bootstrapHandler,
          }

          const module2: FederatedModule = {
            scope: 'scope',
            name: 'test-module-2',
            type: 'journey-module',
            bootstrap: () => {
              throw new Error('bootstrap error')
            },
          }

          federatedRuntime.modules = new Map([
            ['scope/name', module],
            ['scope/name2', module2],
          ])

          await federatedRuntime.bootstrap()

          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
            'federated-core:module:scope:test-module-1:before-bootstrap': 1,
            'federated-core:module:scope:test-module-1:bootstrapped': 1,
            'federated-core:module:scope:test-module-2:before-bootstrap': 1,
            'federated-core:module:scope:test-module-2:bootstrap:error': 1,
            [FederatedEvents.RUNTIME_BOOTSTRAPPED]: 1,
          })
        })
      })

      describe('start', () => {
        it('should set started to true', async () => {
          expect(federatedRuntime.started).toBe(false)
          await federatedRuntime.start()
          expect(federatedRuntime.started).toBe(true)
        })

        it('should call bootstrap method', async () => {
          const bootstrapSpy = jest.spyOn(federatedRuntime, 'bootstrap')
          await federatedRuntime.start()
          expect(bootstrapSpy).toHaveBeenCalled()
        })

        it('should call reroute method', async () => {
          const rerouteSpy = jest.spyOn(federatedRuntime, 'reroute')
          await federatedRuntime.start()
          expect(rerouteSpy).toHaveBeenCalled()
        })

        it('should emit correct events', async () => {
          await federatedRuntime.start()
          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_BEFORE_START]: 1,
            [FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP]: 1,
            [FederatedEvents.SYSTEMJS_LOADED]: 1,
            [FederatedEvents.RUNTIME_BOOTSTRAPPED]: 1,
            [FederatedEvents.ROUTE_CHANGED]: 1,
            [FederatedEvents.RUNTIME_STARTED]: 1,
          })
        })

        it('should emit RUNTIME_START_ERROR on error', async () => {
          const error = new Error('test error')
          const bootstrapSpy = jest.spyOn(federatedRuntime, 'bootstrap')
          bootstrapSpy.mockImplementation(() => {
            throw error
          })
          await federatedRuntime.start()
          expect(dispatchedEventCount).toEqual({
            [FederatedEvents.RUNTIME_BEFORE_START]: 1,
            [FederatedEvents.RUNTIME_START_ERROR]: 1,
          })
        })
      })
    })

    describe('getFederatedRuntime', () => {
      it('should return the same instance', () => {
        expect(getFederatedRuntime()).toBe(federatedRuntime)
      })

      it('should create new global window object if not present', () => {
        // @ts-ignore
        delete window.__FEDERATED_CORE__.federatedRuntime
        expect(window.__FEDERATED_CORE__.federatedRuntime).toBeUndefined()
        const runtime = getFederatedRuntime()
        expect(getFederatedRuntime()).not.toBe(federatedRuntime)
        expect(window.__FEDERATED_CORE__.federatedRuntime).toBe(runtime)
      })
    })
  })
})
