import { environmentUtils } from './utils'
import { FederatedRuntime } from './runtime'

export * from './utils'
export * from './runtime'
export * from './types'
export * from './helpers'

if (environmentUtils.isBrowser() && !window.__FEDERATED_CORE__) {
  // eslint-disable-next-line no-console
  window.__FEDERATED_CORE__ = {
    federatedRuntime: new FederatedRuntime(),
  }
}
