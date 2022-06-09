export {}

declare global {
  type FederatedGlobalInfo = import('./FederatedCore.types').FederatedGlobalInfo
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
