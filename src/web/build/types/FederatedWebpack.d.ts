export type FederatedWebpackOptions = {
  buildDir: string
  basePath: string
  tsConfigPath: string
  isDev: boolean
  defineEnv: Record<string, string>
  enableCssModules: boolean
  enableTypeScript: boolean
  enableProgressBar: boolean
  enableJsxControllerStatements: boolean
  copyThemeAssets?: {
    ws2?: boolean
    ws10?: boolean
  }
  loaderConfig: {
    babel: {
      aliases: Record<string, string>
    }
    font: {
      publicPath: string
    }
    image: {
      limit?: number
      publicPath: string
    }
    sass: {
      resources: string[]
    }
  }
}
