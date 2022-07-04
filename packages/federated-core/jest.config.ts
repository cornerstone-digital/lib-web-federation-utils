/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../jest.config').default

export default {
  ...baseConfig,
  coverageDirectory: '../../.testresults/federated-core/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
