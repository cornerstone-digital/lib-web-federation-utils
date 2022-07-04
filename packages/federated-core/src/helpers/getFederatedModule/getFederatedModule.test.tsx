import { FederatedModule, FederatedRuntime } from '../..'

import getFederatedModule from './getFederatedModule'

describe('getFederatedModule', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    window.__FEDERATED_CORE__ = {
      moduleBaseUrls: {},
      federatedRuntime: new FederatedRuntime(),
    }
  })

  it('is a function', () => {
    expect(typeof getFederatedModule).toBe('function')
  })

  it('should resolve the module', async () => {
    const LazyModule: FederatedModule = {
      scope: 'broadband',
      name: 'test-module',
      type: 'journey-module',
      mount: jest.fn(),
      unmount: jest.fn(),
      update: jest.fn(),
    }

    window.__FEDERATED_CORE__.federatedRuntime.registerModule(LazyModule)

    jest
      .spyOn(window.__FEDERATED_CORE__.federatedRuntime, 'loadModule')
      .mockImplementationOnce(() => {
        return Promise.resolve(LazyModule)
      })

    const module = await getFederatedModule({
      scope: 'broadband',
      name: 'test-module',
    })

    expect(module).toBe(LazyModule)
  })

  it('should log an error if the module fails to load', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
    const error = new Error('Module failed to load')

    jest
      .spyOn(window.__FEDERATED_CORE__.federatedRuntime, 'loadModule')
      .mockImplementationOnce(() => {
        return Promise.reject(error)
      })

    const module = await getFederatedModule({
      scope: 'broadband',
      name: 'test-module',
    })

    expect(module).toBe(undefined)
    expect(consoleErrorSpy).toHaveBeenCalledWith(error)
  })
})
