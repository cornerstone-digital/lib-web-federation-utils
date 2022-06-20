import { FederatedGlobalInfo } from '@vf/federated-core'

export {}

declare global {
  interface Window {
    __FEDERATED_CORE__: FederatedGlobalInfo
    System: {
      import: (module: string) => Promise<unknown>
    }
  }

  namespace NodeJS {
    interface Window {
      __FEDERATED_CORE__: FederatedGlobalInfo
    }
  }
}
