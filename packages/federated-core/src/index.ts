import { environmentUtils } from './utils'
import { FederatedRuntime } from './runtime'

export * from './utils'
export * from './runtime'
export * from './types'

if (environmentUtils.isBrowser() && !window.__FEDERATED_CORE__) {
  // eslint-disable-next-line no-console
  window.__FEDERATED_CORE__ = {
    moduleBaseUrls: {},
    federatedRuntime: new FederatedRuntime(),
  }
}
