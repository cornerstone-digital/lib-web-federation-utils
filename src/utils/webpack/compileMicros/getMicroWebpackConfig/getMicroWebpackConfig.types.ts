import { Configuration, RuleSetRule } from 'webpack'

type Settings = {
  hash?: number
  versions?: number
  buildTime?: number
  isDev?: boolean
}

type MicroWebpackConfigOptions = {
  mfeBasePath: string
  microComponentsDir: string
  buildDir: string
  settings: Settings
  rules: RuleSetRule[]
  defineEnvVars: object
}


export type GetMicroWebpackConfigFunc = (componentName: string, options: MicroWebpackConfigOptions) => Configuration