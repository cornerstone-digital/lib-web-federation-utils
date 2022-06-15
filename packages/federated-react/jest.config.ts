export default {
  ...require('../../jest.config').default,
  displayName: '@vfuk/federated-react',
  coverageDirectory: '../../.testresults/federated-react/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
