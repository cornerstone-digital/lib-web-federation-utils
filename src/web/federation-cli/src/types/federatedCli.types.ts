import { Configuration } from 'webpack'
import { UserConfig } from 'vite'
type BuildTypes = 'webpack' | 'vite' | unknown

export type FederatedApp<BuildType extends BuildTypes> = {
  name: string
  description: string
  entryFile: string
  htmlFile: string
  port: number
  defineEnv: Record<string, any>
  buildTool: BuildType
  compilerConfig: BuildType extends 'webpack' ? Configuration : UserConfig
}

export type FederatedCliConfig = {
  publicPath: string
  buildFolder: string
  federatedApps: {
    [key: string]: FederatedApp<unknown>
  }
}
