export default {
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.types.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.(ts|tsx)',
    '!src/**/index.(ts|tsx)',
  ],
  maxWorkers: '50%',
  modulePaths: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['dist'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
