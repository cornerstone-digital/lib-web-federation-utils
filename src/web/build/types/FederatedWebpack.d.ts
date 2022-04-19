export type FederatedWebpackOptions = {
  federatedModuleDir: string
  buildDir: string
  basePath: string
  isDev: boolean
  webpackConfig: import('webpack').Configuration
  defineEnv: Record<string, string>
}
