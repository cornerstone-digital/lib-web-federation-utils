// filename: global.d.ts
export type FederatedGlobalEnvironment = {
  appBasePaths: Record<string, string>
}

declare global {
  namespace NodeJS {
    interface Window {
      Federated: FederatedGlobalEnvironment
    }
  }

  interface Window {
    Federated: FederatedGlobalEnvironment
  }
}
