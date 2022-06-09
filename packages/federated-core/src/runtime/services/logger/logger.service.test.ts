jest.mock('@datadog/browser-logs', () => ({
  init: jest.fn(),
  logger: {},
  datadogLogs: {
    init: jest.fn(),
    logger: {
      setLevel: jest.fn(),
    },
  },
}))

import { BrowserLogger } from '../../../utils/browser-logger'

import logger from './logger.service'

describe('logger.service', () => {
  const service = 'test-service'
  const logLevel = 'debug'
  const loggerKey = 'test-service-logger'
  it('should create a logger', () => {
    const options = {}
    const logservice = logger.getLogger(service, logLevel, options, true)
    expect(logservice).toBeDefined()
    expect(logservice?.serviceName).toBe('test-service')
  })

  it('should delete a logger', () => {
    logger.getLogger(service, logLevel, {
      config: {
        clientToken: 'test-token',
      },
    })
    expect(logger.hasLogger(loggerKey)).toBeTruthy()
    logger.deleteLogger(loggerKey)
    expect(logger.hasLogger(loggerKey)).toBeFalsy()
  })

  it('should return instance of browserLogger', () => {
    const options = {
      config: {
        clientToken: 'test-token',
      },
    }
    const logservice = logger.getLogger(service, logLevel, options)
    expect(logservice).toBeInstanceOf(BrowserLogger)
  })
})
