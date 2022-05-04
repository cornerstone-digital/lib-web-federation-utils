import { Configuration } from 'webpack'
import { UserConfig } from 'vite'
type BuildTypes = 'webpack' | 'vite' | unknown

export type FederatedApp<BuildType extends BuildTypes> = {
  name: string
  description: string
  port: number
  defineEnv: Record<string, any>
  buildTool: BuildType
  compilerConfig?: BuildType extends 'webpack' ? Configuration : UserConfig
  enableCssModules: boolean
  enableTypescript: boolean
  enableProgressBar: boolean
  copyThemeAssets?: {
    ws2?: boolean
    ws10?: boolean
  }
}

export type FederatedCliConfig = {
  publicPath: string
  buildFolder: string
  tsconfigPath: string
  federatedApps: {
    [key: string]: FederatedApp<unknown>
  }
}
