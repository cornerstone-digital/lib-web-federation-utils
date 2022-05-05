import { Configuration } from 'webpack'
import { UserConfig } from 'vite'

export type BuildTypes = 'webpack' | 'vite' | unknown
type CopyPath = { from: string; to: string }
type CopyThemeAssets = {
  ws2?: boolean
  ws10?: boolean
  copyPaths?: CopyPath[]
}
type LoaderConfig = {
  babel: {
    aliases: Record<string, string>
  }
  font: {
    publicPath: string
  }
  image: {
    publicPath: string
    limit: number
  }
  sass: {
    resources: string[]
  }
}

export type SharedConfigOptions = {
  defineEnv: Record<string, string>
  enableCssModules: boolean
  enableTypeScript: boolean
  enableProgressBar: boolean
  enableJsxControlStatements: boolean
  copyThemeAssets?: CopyThemeAssets
  loaderConfig: LoaderConfig
  tsConfigPath: string
}

export type FederatedApp<BuildType extends BuildTypes> = SharedConfigOptions & {
  name: string
  description: string
  port: number
  buildTool: BuildType
  compilerConfig?: BuildType extends 'webpack' ? Configuration : UserConfig | unknown
}
