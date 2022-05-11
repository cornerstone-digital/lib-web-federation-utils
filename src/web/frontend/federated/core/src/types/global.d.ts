export {}

declare global {
  type FederatedGlobalInfo = import('./FederatedCore').FederatedGlobalInfo
  interface Window {
    __FEDERATED_CORE__: FederatedGlobalInfo
  }

  namespace NodeJS {
    interface Window {
      __FEDERATED_CORE__: FederatedGlobalInfo
    }
  }
}
