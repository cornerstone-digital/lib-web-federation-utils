import type { FederatedGlobalInfo } from './FederatedCore.types'

export {}

declare global {
  interface Window {
    __FEDERATED_CORE__: FederatedGlobalInfo
    System: {
      import: (module: string) => Promise<unknown>
    }
    VFUK?: {
      [key: string]: unknown
    }
  }

  namespace NodeJS {
    interface Window {
      __FEDERATED_CORE__: FederatedGlobalInfo
    }
  }
}
