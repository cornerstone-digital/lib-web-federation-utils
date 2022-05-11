import { BuildTypes, FederatedAppBuildConfig } from '@vf/federated-web-build-types'
import { resolve } from 'path'

type CreateFederatedAppOptions = Omit<FederatedAppBuildConfig<BuildTypes>, 'buildTool'>

const createFederatedApp = (
  buildTool: BuildTypes = 'webpack',
  options: CreateFederatedAppOptions,
): FederatedAppBuildConfig<typeof buildTool> => {
  return {
    buildTool,
    copyThemeAssets: {
      ws2: true,
      ws10: true,
    },
    enableCssModules: true,
    enableJsxControlStatements: true,
    enableProgressBar: true,
    enableTypeScript: true,
    loaderConfig: {
      font: {
        publicPath: options.publicPath || '/assets/fonts/',
      },
      image: {
        publicPath: options.publicPath || '/assets/images/',
      },
      ...options.loaderConfig,
    },
    tsConfigPath: resolve(__dirname, './tsconfig.json'),
    ...options,
  }
}

export default createFederatedApp
