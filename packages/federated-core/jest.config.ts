/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../jest.config').default

export default {
  ...baseConfig,
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.types.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.(ts|tsx)',
    '!src/**/index.(ts|tsx)',
  ],
  coverageDirectory: '../../.testresults/federated-core/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
