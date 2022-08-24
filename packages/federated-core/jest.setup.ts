import { initFederatedRuntime } from './src/runtime'

// @ts-ignore
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  window.__FEDERATED_CORE__ = {
    federatedRuntime: initFederatedRuntime(),
  }
  window.System = {
    import: jest.fn(),
  }
}
