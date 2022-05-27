import BrowserLogger from '../../../utils/browser-logger'
import { BrowserLogOptions, LogLevelOptions } from '../../../utils/browser-logger/browser-logger.types'

const loggers: Map<string, BrowserLogger> = new Map()

export const hasLogger = (loggerKey: string) => {
  return loggers.has(loggerKey)
}

export const getLogger = (service: string, logLevel: LogLevelOptions, options: BrowserLogOptions, forceRecreate: boolean = false) => {
  const loggerKey = `${service}-logger`
  if (hasLogger(loggerKey) && !forceRecreate) {
    return loggers.get(loggerKey)
  }

  const logger = new BrowserLogger(service, logLevel, options)

  loggers.set(loggerKey, logger)

  return logger
}

export const deleteLogger = (loggerKey: string) => {
  if (hasLogger(loggerKey)) {
    loggers.delete(loggerKey)
  }
}
