import { SharedConfigOptions } from './FederatedApps'

export type FederatedWebpackOptions = SharedConfigOptions & {
  buildDir: string
  basePath: string
  tsConfigPath: string
  isDev: boolean
}
