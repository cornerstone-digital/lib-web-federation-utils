/* eslint-disable */
/* @ts-ignore */
import defaultConfig from '../../jest.config'

export default {
  ...defaultConfig,
  coverageDirectory: '../../.testresults/federated-core/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
