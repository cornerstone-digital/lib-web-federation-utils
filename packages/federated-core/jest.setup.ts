import { FederatedModuleStatuses } from './src'

// @ts-ignore
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  window.System = {
    import: jest.fn(() => {
      return Promise.resolve({
        status: FederatedModuleStatuses.NOT_LOADED,
      })
    }),
  }
}
