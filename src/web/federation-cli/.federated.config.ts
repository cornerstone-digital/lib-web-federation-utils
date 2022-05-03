import type { FederatedApp, FederatedCliConfig } from '@vf/federated-web-cli/src/types'
const { resolve } = require('path')

type FederatedApps = {
  TestComponent: FederatedApp<'webpack'>
}

const federatedApps: FederatedApps = {
  TestComponent: {
    name: 'Availability Checker',
    description: 'Check if a broadband deal is available in your area',
    entryFile: resolve(process.cwd(), './src/federated-components/TestComponent/index.tsx'),
    port: 8001,
    buildTool: 'webpack',
    htmlFile: resolve(process.cwd(), './src/federated-components/TestComponent/index.html'),
    defineEnv: {},
    enableTypescript: true,
    enableCssModules: true,
    enableProgressBar: true,
  },
}

const config: FederatedCliConfig = {
  publicPath: '/test/public/path',
  buildFolder: resolve(process.cwd(), 'build'),
  tsconfigPath: resolve(process.cwd(), './tsconfig.json'),
  federatedApps,
}

module.exports = config
