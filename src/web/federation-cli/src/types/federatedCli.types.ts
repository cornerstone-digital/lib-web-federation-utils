import { BuildTypes, FederatedApp } from '@vf/federated-web-build-types'

export type FederatedCliConfig = {
  publicPath: string
  buildFolder: string
  tsconfigPath: string
  federatedApps: {
    [key: string]: FederatedApp<BuildTypes>
  }
}
