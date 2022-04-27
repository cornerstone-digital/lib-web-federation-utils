import type { FederatedApp, FederatedCliConfig } from '@vf/federated-web-cli/src/types'
const { resolve } = require('path')

type TestFederatedApps = {
  TestComponent: FederatedApp<'webpack'>
}

const federatedApps: TestFederatedApps = {
  TestComponent: {
    name: 'Availability Checker',
    description: 'Check if a broadband deal is available in your area',
    entryFile: resolve(process.cwd(), './src/federated-components/TestComponent/index.tsx'),
    port: 8001,
    buildTool: 'webpack',
    htmlFile: resolve(process.cwd(), './src/federated-components/TestComponent/index.html'),
    defineEnv: {},
    compilerConfig: {},
  },
}

const config: FederatedCliConfig = {
  publicPath: '/test/public/path',
  buildFolder: resolve(process.cwd(), 'build'),
  federatedApps,
}

module.exports = config
