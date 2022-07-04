import { getFederatedRuntime } from './src/runtime'

// @ts-ignore
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  window.__FEDERATED_CORE__ = {
    federatedRuntime: getFederatedRuntime(),
    moduleBaseUrls: {},
  }
  window.System = {
    import: jest.fn(),
  }
}
