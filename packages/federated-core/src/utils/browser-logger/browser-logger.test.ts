jest.mock('@datadog/browser-logs', () => ({
  init: jest.fn(),
  logger: {},
  datadogLogs: {
    init: jest.fn(),
    logger: {
      setLevel: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    },
  },
}))
import { datadogLogs } from '@datadog/browser-logs'
import { LogLevelOptions, BrowserLogOptions } from './browser-logger.types'

import { BrowserLogger } from '.'

const createLogger = (
  service: string,
  level: LogLevelOptions,
  config: BrowserLogOptions = {
    config: {
      clientToken: 'test-token',
    },
  }
) => {
  return new BrowserLogger(service, level, config)
}
const stringify = jest.spyOn(JSON, 'stringify')

describe('browserLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const service = 'test-browser-service'
  const logLevel = 'debug'
  it('should init datadog and set service', () => {
    const logger = createLogger(service, logLevel, {
      config: { clientToken: 'test' },
    })
    expect(datadogLogs.init).toHaveBeenCalledWith({
      service,
      clientToken: 'test',
    })
    expect(datadogLogs.logger.setLevel).toHaveBeenCalledWith(logLevel)
    expect(logger.serviceName).toBe(service)
    expect(logger.loggerInstance).toBe(datadogLogs.logger)
  })

  it('should set logLevel', () => {
    const newLevel = 'info'
    const logger = createLogger(service, newLevel, {
      config: { clientToken: 'test' },
    })
    expect(logger.level).toBe(newLevel)
    expect(datadogLogs.logger.setLevel).toHaveBeenCalledWith(newLevel)
  })

  it('should check to see if level is enabled', () => {
    const logger = createLogger(service, logLevel, {
      config: { clientToken: 'test' },
    })
    expect(logger.isLevelEnabled('debug')).toBeTruthy()
    expect(logger.isLevelEnabled('info')).toBeTruthy()
    expect(logger.isLevelEnabled('warn')).toBeTruthy()
    expect(logger.isLevelEnabled('error')).toBeTruthy()

    logger.level = 'info'
    expect(logger.isLevelEnabled('debug')).toBeFalsy()

    logger.level = 'warn'
    expect(logger.isLevelEnabled('debug')).toBeFalsy()
    expect(logger.isLevelEnabled('info')).toBeFalsy()
  })

  it('should log', () => {
    const logger = createLogger(service, logLevel, {
      config: { clientToken: 'test' },
    })
    logger.debug('test debug')
    logger.info('test info')
    logger.warn('test warn')
    logger.error('test error')
    expect(datadogLogs.logger.debug).toHaveBeenCalledWith(
      '[browser] - test debug',
      {
        logContext: { componentName: '' },
      }
    )
    expect(datadogLogs.logger.info).toHaveBeenCalledWith(
      '[browser] - test info',
      {
        logContext: { componentName: '' },
      }
    )
    expect(datadogLogs.logger.warn).toHaveBeenCalledWith(
      '[browser] - test warn',
      {
        logContext: { componentName: '' },
      }
    )
    expect(datadogLogs.logger.error).toHaveBeenCalledWith(
      '[browser] - test error',
      {
        logContext: { componentName: '' },
      }
    )

    logger.info({ message: 'test log info' }, 'test-component', {
      test: 'test',
    })
    expect(datadogLogs.logger.info).nthCalledWith(
      2,
      '[browser] - {"data":{"message":"test log info"}}',
      {
        logContext: { componentName: 'test-component', test: 'test' },
      }
    )

    expect(stringify).toBeCalled()
  })

  it('should return nothing when logger is set to off', () => {
    const logLevel = 'off'
    const logger = createLogger(service, logLevel, {
      config: { clientToken: 'test' },
    })
    logger.info('test')
    expect(logger.level).toBe(logLevel)
    expect(datadogLogs.logger.setLevel).toHaveBeenCalledWith(logLevel)
    expect(datadogLogs.logger.info).not.toHaveBeenCalled()
  })

  it('should return nothing when the log has a filtered message', () => {
    const filteredLogs = ['not-a-valid-message']
    const logger = createLogger(service, logLevel, {
      config: { clientToken: 'test' },
      filteredLogs,
    })
    logger.info('not-a-valid-message')
    expect(datadogLogs.logger.info).not.toHaveBeenCalled()
    logger.info('test')
    expect(datadogLogs.logger.info).toBeCalledTimes(1)
  })
})
