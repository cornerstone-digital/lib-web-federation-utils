export type FederatedWebpackOptions = {
  entryFile: string
  htmlFile: string
  buildDir: string
  basePath: string
  isDev: boolean
  webpackConfig: import('webpack').Configuration
  defineEnv: Record<string, string>
}
