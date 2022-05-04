export type FederatedWebpackOptions = {
  buildDir: string
  basePath: string
  isDev: boolean
  defineEnv: Record<string, string>
  enableCssModules: boolean
  enableTypeScript: boolean
  enableProgressBar: boolean
  copyThemeAssets?: {
    ws2?: boolean
    ws10?: boolean
  }
}
