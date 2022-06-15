import { FederatedModuleStatuses } from '@vf/federated-core'
import '@testing-library/jest-dom'

// @ts-ignore
window.System = {
  import: jest.fn(() => {
    return Promise.resolve({
      status: FederatedModuleStatuses.NOT_LOADED,
    })
  }),
}
