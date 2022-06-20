import { datadogLogs } from '@datadog/browser-logs'
import {
  LogLevelOptions,
  BrowserLogOptions,
  LoggerLevels,
} from './browser-logger.types'

import { BrowserLogger } from '.'

const componentName = 'test-component'
const logMessage = 'test-message'
const logContext = {
  test: 'test',
}
const loggerConfig: BrowserLogOptions['config'] = {
  clientToken: 'test-token',
}

const createLogger = (
  service: string,
  level: LogLevelOptions,
  loggerOptions: BrowserLogOptions = {}
) => {
  return new BrowserLogger(service, level, {
    config: {
      ...loggerConfig,
    },
    ...loggerOptions,
  })
}

const stringify = jest.spyOn(JSON, 'stringify')
const ddInitSpy = jest.spyOn(datadogLogs, 'init')
const ddSetLevelSpy = jest.spyOn(datadogLogs.logger, 'setLevel')
const ddLogSpy = jest.spyOn(datadogLogs.logger, 'log')

const callLoggerLevels = (logger: BrowserLogger) => {
  logger.debug(logMessage, componentName, logContext)
  logger.info(logMessage, componentName, logContext)
  logger.warn(logMessage, componentName, logContext)
  logger.error(logMessage, componentName, logContext)
}

const expectLogLevelCalledWith = (
  logLevel: LoggerLevels,
  notCalled = false
) => {
  let messageContext: object = {
    logContext: { componentName, ...logContext },
  }

  if (logLevel === 'error') {
    messageContext = {
      ...messageContext,
      error: {
        origin: 'logger',
      },
    }
  }

  if (notCalled) {
    expect(ddLogSpy).not.toHaveBeenCalledWith(
      `[browser] - ${logMessage}`,
      messageContext,
      logLevel
    )
  } else {
    expect(ddLogSpy).toHaveBeenCalledWith(
      `[browser] - ${logMessage}`,
      messageContext,
      logLevel
    )
  }
}

describe('browserLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const service = 'test-browser-service'
  const logLevel = 'debug'
  it('should init datadog and set service', () => {
    const logger = createLogger(service, logLevel)

    expect(ddInitSpy).toHaveBeenCalledWith({
      service,
      ...loggerConfig,
    })

    expect(ddSetLevelSpy).toHaveBeenCalledWith(logLevel)
    expect(logger.serviceName).toBe(service)
    expect(logger.loggerInstance).toBe(datadogLogs.logger)
  })

  it('should set logLevel', () => {
    const newLevel = 'info'
    const logger = createLogger(service, newLevel)
    expect(logger.level).toBe(newLevel)
    expect(ddSetLevelSpy).toHaveBeenCalledWith(newLevel)
  })

  it('should check to see if level is enabled', () => {
    const logger = createLogger(service, logLevel)
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

  describe('Debug', () => {
    it('should log correctly when debug level is enabled', () => {
      const logger = createLogger(service, logLevel)
      logger.level = 'debug'
      callLoggerLevels(logger)
      expectLogLevelCalledWith('debug')
      expectLogLevelCalledWith('info')
      expectLogLevelCalledWith('warn')
      expectLogLevelCalledWith('error')
    })

    it('should not log when debug is disabled', () => {
      const logger = createLogger(service, logLevel)
      logger.level = 'info'
      logger.debug(logMessage, componentName, logContext)
      expect(ddLogSpy).not.toHaveBeenCalled()
    })

    it('should not log when level is off', () => {
      const logger = createLogger(service, 'off')
      logger.debug(logMessage, componentName, logContext)
      expect(ddLogSpy).not.toHaveBeenCalled()
    })
  })

  describe('Info', () => {
    it('should log correctly when info level is enabled', () => {
      const logger = createLogger(service, logLevel)
      logger.level = 'info'
      callLoggerLevels(logger)
      expectLogLevelCalledWith('debug', true)
      expectLogLevelCalledWith('info')
      expectLogLevelCalledWith('warn')
      expectLogLevelCalledWith('error')
    })
  })

  describe('Warn', () => {
    it('should log correctly when warn level is enabled', () => {
      const logger = createLogger(service, logLevel)
      logger.level = 'warn'
      callLoggerLevels(logger)
      expectLogLevelCalledWith('debug', true)
      expectLogLevelCalledWith('info', true)
      expectLogLevelCalledWith('warn')
      expectLogLevelCalledWith('error')
    })
  })

  describe('Error', () => {
    it('should log correctly when error level is enabled', () => {
      const logger = createLogger(service, logLevel)
      logger.level = 'error'
      callLoggerLevels(logger)
      expectLogLevelCalledWith('debug', true)
      expectLogLevelCalledWith('info', true)
      expectLogLevelCalledWith('warn', true)
      expectLogLevelCalledWith('error')
    })
  })

  describe('stringify', () => {
    it('should stringify the log context', () => {
      const logger = createLogger(service, logLevel)
      const messageObject = {
        message: logMessage,
      }
      logger.debug(messageObject, componentName, logContext)
      expect(stringify).toHaveBeenCalledWith({
        data: messageObject,
      })

      const messageLogContext = {
        logContext: { componentName, ...logContext },
      }

      expect(ddLogSpy).toHaveBeenCalledWith(
        '[browser] - {"data":{"message":"test-message"}}',
        messageLogContext,
        logLevel
      )
    })
  })

  it('should filter out messages when options.filteredLogs is passed', () => {
    const unloadedLogMessage = 'unloaded log message'
    const logger = createLogger(service, logLevel, {
      filteredLogs: [unloadedLogMessage],
    })
    logger.level = 'info'
    logger.info(unloadedLogMessage, componentName, logContext)
    expect(ddLogSpy).not.toHaveBeenCalled()
  })

  it('should set component name to unknown when not passed', () => {
    const logger = createLogger(service, 'info')
    logger.level = 'info'
    logger.info(logMessage, undefined, logContext)
    expect(ddLogSpy).toHaveBeenCalledWith(
      '[browser] - test-message',
      {
        logContext: { componentName: 'unknown', ...logContext },
      },
      'info'
    )
  })

  it('should not set logContext object when not passed', () => {
    const logger = createLogger(service, 'info')
    logger.level = 'info'
    logger.info(logMessage, componentName)
    expect(ddLogSpy).toHaveBeenCalledWith(
      '[browser] - test-message',
      {
        logContext: { componentName },
      },
      'info'
    )
  })
})
