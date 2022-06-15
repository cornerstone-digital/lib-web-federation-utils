export default {
  ...require('../../jest.config').default,
  coverageDirectory: '../../.testresults/federated-core/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
