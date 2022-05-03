export type FederatedWebpackOptions = {
  buildDir: string
  basePath: string
  isDev: boolean
  webpackConfig: import('webpack').Configuration
  defineEnv: Record<string, string>
  enableCssModules: boolean
  enableTypeScript: boolean
  enableProgressBar: boolean
}
