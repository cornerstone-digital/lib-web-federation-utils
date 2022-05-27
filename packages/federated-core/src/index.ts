import { isBrowser } from './utils/environment'

export * from './utils'
export * from './types'
export { FederatedRuntime, getFederatedRuntime } from './runtime'

if (isBrowser && !window.__FEDERATED_CORE__) {
  window.__FEDERATED_CORE__ = {
    moduleBaseUrls: {},
  }
}
