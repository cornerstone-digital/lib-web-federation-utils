import { FederatedModuleStatuses } from './src/types'

// @ts-ignore
window.System = {
  import: jest.fn(() => {
    return Promise.resolve({
      status: FederatedModuleStatuses.NOT_LOADED,
    })
  }),
}
