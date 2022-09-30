import React from 'react'
import ReactDOM from 'react-dom'
import { screen } from '@testing-library/react'

import createFederatedReact from './createFederatedReact'
import { AbstractFederatedRuntime, FederatedRuntime } from '@vf/federated-core'
import { CreateFederatedReactOptions } from './createFederatedReact.types'

const TestComponent = () => <div>Test</div>

const domElementId = 'test-dom-element'
let defaultOptions: CreateFederatedReactOptions<unknown>

let dispatchedEventCount: Record<string, number> = {}
const originalDispatchEvent = window.dispatchEvent

const addDomElementToBody = () => {
  const domElement = document.createElement('div')
  domElement.id = domElementId
  document.body.appendChild(domElement)
}

let federatedRuntime: AbstractFederatedRuntime

describe('createFederatedReact', () => {
  beforeEach(() => {
    window.dispatchEvent = jest.fn().mockImplementation((event: Event) => {
      dispatchedEventCount[event.type] = dispatchedEventCount[event.type]
        ? dispatchedEventCount[event.type] + 1
        : 1

      originalDispatchEvent(event)
    })

    // Empty document.body
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }

    federatedRuntime = new FederatedRuntime() as AbstractFederatedRuntime

    addDomElementToBody()

    defaultOptions = {
      React,
      ReactDOM,
      federatedRuntime,
      enableSystemJs: true,
      config: {
        type: 'journey-module',
        name: 'app-module',
        rootComponent: TestComponent,
        domElementId,
      },
    }
  })

  afterEach(() => {
    dispatchedEventCount = {}
    window.dispatchEvent = originalDispatchEvent
    const mountedApp = document.getElementById(domElementId)
    if (mountedApp) {
      ReactDOM.unmountComponentAtNode(mountedApp)
    }

    const domElement = document.getElementById(domElementId)
    if (domElement) {
      domElement.remove()
    }

    jest.restoreAllMocks()
  })

  it('is a function', () => {
    expect(typeof createFederatedReact).toBe('function')
  })

  describe('should error if', () => {
    it('missing config', () => {
      expect(() => {
        createFederatedReact({
          ...defaultOptions,
          // @ts-ignore
          config: undefined,
        })
      }).toThrowError('Missing config')
    })

    it('missing React', () => {
      expect(() => {
        createFederatedReact({
          ...defaultOptions,
          // @ts-ignore
          React: undefined,
        })
      }).toThrowError('Missing React')
    })

    it('missing ReactDOM', () => {
      expect(() => {
        createFederatedReact({
          ...defaultOptions,
          // @ts-ignore
          ReactDOM: undefined,
        })
      }).toThrowError('Missing ReactDOM')
    })

    it('missing name', () => {
      expect(() => {
        createFederatedReact({
          ...defaultOptions,
          config: {
            ...defaultOptions.config,
            // @ts-ignore
            name: undefined,
          },
        })
      }).toThrowError('Missing name')
    })

    it('missing rootComponent', () => {
      expect(() => {
        createFederatedReact({
          ...defaultOptions,
          config: {
            ...defaultOptions.config,
            // @ts-ignore
            rootComponent: undefined,
          },
        })
      }).toThrowError('Missing rootComponent')
    })
  })

  describe('when called', () => {
    it('should return a mount function', () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      expect(typeof moduleInstance.mount).toBe('function')
    })

    it('should return a unmount function', () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      expect(typeof moduleInstance.unmount).toBe('function')
    })

    it('should return a bootstrap function', () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      expect(typeof moduleInstance.bootstrap).toBe('function')
    })

    it('should use default domElementId if not provided', () => {
      const moduleInstance = createFederatedReact({
        ...defaultOptions,
        config: {
          ...defaultOptions.config,
          domElementId: undefined,
        },
      })
      expect(moduleInstance.domElementId).toBe(`${defaultOptions.config.name}`)
    })
  })

  describe('bootstrap', () => {
    it('should return a promise', () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      expect(moduleInstance.bootstrap()).toBeInstanceOf(Promise)
    })

    it('should fire correct events', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await moduleInstance.bootstrap()

      expect(dispatchedEventCount).toEqual({
        'federated-core:module:app-module:before-bootstrap': 1,
        'federated-core:module:app-module:bootstrapped': 1,
        'federated-core:module:app-module:state-changed': 2,
      })
    })

    it('should fire correct events when bootstrap fails', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)

      jest
        .spyOn(federatedRuntime, 'setModuleState')
        .mockImplementationOnce(() => {
          throw new Error('Bootstrap failed')
        })

      await moduleInstance.bootstrap()

      expect(dispatchedEventCount).toEqual({
        'federated-core:module:app-module:registered': 1,
        'federated-core:module:app-module:before-bootstrap': 1,
        'federated-core:module:app-module:before-register': 1,
        'federated-core:module:app-module:bootstrap:error': 1,
        'federated-core:module:app-module:state-changed': 1,
      })
    })
  })

  describe('mount', () => {
    it('should return a promise', () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      expect(moduleInstance.mount()).toBeInstanceOf(Promise)
    })

    it('should fire correct events', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)

      await moduleInstance.mount({}, domElementId)

      expect(dispatchedEventCount).toEqual({
        'federated-core:module:app-module:before-bootstrap': 1,
        'federated-core:module:app-module:before-mount': 1,
        'federated-core:module:app-module:bootstrapped': 1,
        'federated-core:module:app-module:before-register': 1,
        'federated-core:module:app-module:registered': 1,
        'federated-core:module:app-module:mounted': 1,
        'federated-core:module:app-module:validate-props': 1,
        'federated-core:module:app-module:state-changed': 5,
      })
    })

    it('should call hydrate if renderType is hydrate', async () => {
      const options: CreateFederatedReactOptions<unknown> = {
        ...defaultOptions,
        renderType: 'hydrate',
        config: {
          ...defaultOptions.config,
        },
      }

      const reactDomHydrateSpy = jest.spyOn(ReactDOM, 'hydrate')
      const moduleInstance = createFederatedReact(options)
      await moduleInstance.mount({}, domElementId)

      expect(reactDomHydrateSpy).toHaveBeenCalled()
    })

    it('should call to get renderType if renderType is a function', async () => {
      const options: CreateFederatedReactOptions<unknown> = {
        ...defaultOptions,
        renderType: () => 'render',
        config: {
          ...defaultOptions.config,
        },
      }

      const reactDomRenderSpy = jest.spyOn(ReactDOM, 'render')
      const moduleInstance = createFederatedReact(options)
      await moduleInstance.mount({}, domElementId)

      expect(reactDomRenderSpy).toHaveBeenCalled()
    })

    it('should throw MODULE_MOUNT_ERROR if incorrect mountId is not passed', async () => {
      const incorrectDomElementId = 'incorrect-dom-element-id'
      const moduleInstance = createFederatedReact(defaultOptions)
      await moduleInstance.mount({}, incorrectDomElementId)

      expect(
        dispatchedEventCount['federated-core:module:app-module:mount:error']
      ).toBe(1)
    })

    it('should throw MODULE_MOUNT_ERROR if mounting module fails', async () => {
      const moduleInstance = createFederatedReact({
        ...defaultOptions,
        config: {
          ...defaultOptions.config,
          // @ts-ignore
          rootComponent: new Error('Error loading module component'),
        },
      })
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)

      expect(
        dispatchedEventCount['federated-core:module:app-module:mount:error']
      ).toBe(1)
    })

    it('should throw MODULE_MOUNT_ERROR if mounting fails', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)

      jest.spyOn(console, 'error').mockImplementation(() => undefined)
      jest.spyOn(ReactDOM, 'render').mockImplementation(() => {
        throw new Error('Error mounting module component')
      })

      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)

      expect(
        dispatchedEventCount['federated-core:module:app-module:mount:error']
      ).toBe(1)
    })

    it('should use config.domElementId if mountId is not passed', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)

      await moduleInstance.mount({}, undefined)

      expect(moduleInstance.domElementId).toBe(
        defaultOptions.config.domElementId
      )
    })

    it('should use defaultMountId if mountId is not passed and not in config', async () => {
      const moduleInstance = createFederatedReact({
        ...defaultOptions,
        config: {
          ...defaultOptions.config,
          domElementId: undefined,
        },
      })
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, undefined)

      expect(moduleInstance.domElementId).toBe(`${moduleInstance.name}`)
    })

    it('should use default props if no props are passed', async () => {
      const validatePropsSpy = jest.spyOn(federatedRuntime, 'validateProps')
      const moduleInstance = createFederatedReact({
        ...defaultOptions,
        config: {
          ...defaultOptions.config,
          defaultProps: {
            prop1: 'prop1',
          },
        },
      })
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount(undefined, domElementId)

      expect(validatePropsSpy).toHaveBeenCalledWith(
        {
          name: moduleInstance.name,
        },
        {
          prop1: 'prop1',
        }
      )
    })

    it('should call validateProps if passed via config', async () => {
      const propValidator = jest.fn()
      const moduleInstance = createFederatedReact({
        ...defaultOptions,
        config: {
          ...defaultOptions.config,
          propValidationFunction: propValidator,
        },
      })

      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)

      expect(propValidator).toHaveBeenCalled()
    })
  })

  describe('unmount', () => {
    it('should return a promise', () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      expect(moduleInstance.unmount()).toBeInstanceOf(Promise)
    })

    it('should fire correct events', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)
      await moduleInstance.unmount()

      expect(dispatchedEventCount).toEqual({
        'federated-core:module:app-module:before-register': 1,
        'federated-core:module:app-module:registered': 1,
        'federated-core:module:app-module:before-bootstrap': 1,
        'federated-core:module:app-module:bootstrapped': 1,
        'federated-core:module:app-module:before-mount': 1,
        'federated-core:module:app-module:mounted': 1,
        'federated-core:module:app-module:unmounted': 1,
        'federated-core:module:app-module:validate-props': 1,
        'federated-core:module:app-module:state-changed': 7,
      })
    })

    it('should umount the module', async () => {
      const unmountSpy = jest.spyOn(ReactDOM, 'unmountComponentAtNode')
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)
      await moduleInstance.unmount()

      expect(unmountSpy).toHaveBeenCalled()
    })

    it('should throw MODULE_UNMOUNT_ERROR if unmounting fails', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)

      jest.spyOn(console, 'error').mockImplementation(() => undefined)

      jest
        .spyOn(ReactDOM, 'unmountComponentAtNode')
        .mockImplementationOnce(() => {
          throw new Error('Error unmounting module component')
        })

      await moduleInstance.unmount()

      expect(
        dispatchedEventCount['federated-core:module:app-module:unmount:error']
      ).toBe(1)
    })

    it('should use default domElementId if not passed', async () => {
      const moduleInstance = createFederatedReact({
        ...defaultOptions,
        config: {
          ...defaultOptions.config,
          domElementId: undefined,
        },
      })
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, undefined)
      await moduleInstance.unmount()

      expect(moduleInstance.domElementId).toBe(`${moduleInstance.name}`)
    })
  })

  describe('update', () => {
    it('should return a promise', () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      expect(moduleInstance.update()).toBeInstanceOf(Promise)
    })

    it('should umount and mount the module', async () => {
      const unmountSpy = jest.spyOn(ReactDOM, 'unmountComponentAtNode')
      const mountSpy = jest.spyOn(ReactDOM, 'render')

      const moduleInstance = createFederatedReact(defaultOptions)

      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)
      await moduleInstance.update()

      expect(unmountSpy).toHaveBeenCalled()
      expect(mountSpy).toHaveBeenCalled()
    })

    it('should fire correct events', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)
      await moduleInstance.update()

      expect(dispatchedEventCount).toEqual({
        'federated-core:module:app-module:before-bootstrap': 2,
        'federated-core:module:app-module:before-mount': 2,
        'federated-core:module:app-module:before-register': 1,
        'federated-core:module:app-module:before-update': 1,
        'federated-core:module:app-module:bootstrapped': 2,
        'federated-core:module:app-module:mounted': 2,
        'federated-core:module:app-module:registered': 1,
        'federated-core:module:app-module:state-changed': 12,
        'federated-core:module:app-module:unmounted': 1,
        'federated-core:module:app-module:updated': 1,
        'federated-core:module:app-module:validate-props': 2,
      })
    })

    it('should throw MODULE_UNMOUNT_ERROR if unmounting fails', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)

      jest.spyOn(console, 'error').mockImplementation(() => undefined)

      jest
        .spyOn(ReactDOM, 'unmountComponentAtNode')
        .mockImplementationOnce(() => {
          throw new Error('Error unmounting module component')
        })

      await moduleInstance.update()

      expect(
        dispatchedEventCount['federated-core:module:app-module:unmount:error']
      ).toBe(1)
    })

    it('should throw MODULE_MOUNT_ERROR if unmounting fails', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)
      await moduleInstance.mount({}, domElementId)

      jest.spyOn(console, 'error').mockImplementation(() => undefined)

      jest.spyOn(ReactDOM, 'render').mockImplementationOnce(() => {
        throw new Error('Error mounting module component')
      })

      await moduleInstance.update()

      expect(
        dispatchedEventCount['federated-core:module:app-module:mount:error']
      ).toBe(1)
    })

    it('should catch error and throw', async () => {
      const moduleInstance = createFederatedReact(defaultOptions)
      await federatedRuntime.registerModule(moduleInstance)

      jest.spyOn(federatedRuntime.modules, 'get').mockImplementationOnce(() => {
        throw new Error('Error getting module')
      })

      await moduleInstance.update()

      expect(
        dispatchedEventCount['federated-core:module:app-module:update:error']
      ).toBe(1)
    })
  })
})
