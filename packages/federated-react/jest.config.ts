/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../jest.config').default

export default {
  ...baseConfig,
  displayName: '@vfuk/federated-react',
  coverageDirectory: '../../.testresults/federated-react/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
