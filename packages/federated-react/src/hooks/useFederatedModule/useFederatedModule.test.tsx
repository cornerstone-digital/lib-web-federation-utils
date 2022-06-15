import React from 'react'
import { FederatedModule, FederatedRuntime } from '@vf/federated-core'

import useFederatedModule from './useFederatedModule'
import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react'
// import { waitFor } from '@testing-library/react'
// import { act, renderHook } from '@testing-library/react-hooks'

describe('useFederatedModule', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    window.__FEDERATED_CORE__ = {
      moduleBaseUrls: {},
      federatedRuntime: new FederatedRuntime(),
    }
  })

  it('is a function', () => {
    expect(typeof useFederatedModule).toBe('function')
  })

  it('should resolve the module', async () => {
    type LazyProps = {
      name: string
    }

    const LazyModule: FederatedModule = {
      scope: 'broadband',
      name: 'test-module',
      type: 'app-module',
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

    const { result } = renderHook(() =>
      useFederatedModule({ scope: 'broadband', name: 'test-module' })
    )

    await waitFor(() => {
      expect(result.current).toBe(LazyModule)
    })
  })

  it('should log an error if the module fails to load', async () => {
    const error = new Error('Module failed to load')
    jest
      .spyOn(window.__FEDERATED_CORE__.federatedRuntime, 'loadModule')
      .mockImplementationOnce(() => {
        return Promise.reject(error)
      })
    const consoleErrorSpy = jest.spyOn(console, 'error')

    const { result } = renderHook(() =>
      useFederatedModule({ scope: 'broadband', name: 'test-module' })
    )

    await waitFor(() => {
      expect(result.current).toBe(null)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })
  })
})
