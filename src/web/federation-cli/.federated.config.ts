import type { FederatedCliConfig } from '@vf/federated-web-cli/src/types'
import { FederatedApp } from '@vf/federated-web-build-types'
const { resolve } = require('path')

type FederatedApps = {
  TestComponent: FederatedApp<'webpack'>
}

// Comment
const federatedApps: FederatedApps = {
  TestComponent: {
    name: 'Availability Checker',
    description: 'Check if a broadband deal is available in your area',
    port: 8001,
    buildTool: 'webpack',
    tsConfigPath: resolve(__dirname, '../../src/web/federation-cli/tsconfig.json'),
    defineEnv: {},
    enableTypeScript: true,
    enableCssModules: true,
    enableProgressBar: true,
    enableJsxControlStatements: true,
    copyThemeAssets: {
      ws2: true,
      ws10: true,
      copyPaths: [],
    },
    loaderConfig: {
      babel: {
        aliases: {},
      },
      font: {
        publicPath: './fonts/',
      },
      image: {
        limit: 1024 * 1024,
        publicPath: './images/',
      },
      sass: {
        resources: [],
      },
    },
  },
}

const config: FederatedCliConfig = {
  publicPath: '/test/public/path',
  buildFolder: resolve(process.cwd(), 'build'),
  tsconfigPath: resolve(process.cwd(), './tsconfig.json'),
  federatedApps,
}

module.exports = config
