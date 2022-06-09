import { BrowserLogger } from '../../../utils/browser-logger'
import {
  BrowserLogOptions,
  LogLevelOptions,
} from '../../../utils/browser-logger/browser-logger.types'
import { LoggerServiceType } from './logger.service.types'

export const loggers: Map<string, BrowserLogger> = new Map()

const hasLogger = (loggerKey: string) => {
  return loggers.has(loggerKey)
}

const getLogger = (
  service: string,
  logLevel: LogLevelOptions,
  options: BrowserLogOptions,
  forceRecreate = false
): BrowserLogger | undefined => {
  const loggerKey = `${service}-logger`
  if (hasLogger(loggerKey) && !forceRecreate) {
    return loggers.get(loggerKey)
  }

  const logger = new BrowserLogger(service, logLevel, options)

  loggers.set(loggerKey, logger)

  return logger
}

const deleteLogger = (loggerKey: string) => {
  if (hasLogger(loggerKey)) {
    loggers.delete(loggerKey)
  }
}

const loggerService: LoggerServiceType = {
  hasLogger,
  getLogger,
  deleteLogger,
}

export default loggerService
