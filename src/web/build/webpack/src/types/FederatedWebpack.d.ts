import { SharedConfigOptions } from '@vf/federated-web-build-types'

export type FederatedWebpackOptions = {
  buildDir: string
  basePath: string
  tsConfigPath: string
  isDev: boolean
} & SharedConfigOptions
