import { datadogLogs, StatusType } from '@datadog/browser-logs'
import { LogsInitConfiguration as BrowserLogConfig } from '@datadog/browser-logs'

import {
  BrowserLogOptions,
  LoggerInstance,
  LoggerLevels,
  LogLevelOptions,
} from './browser-logger.types'

class BrowserLogger {
  private logLevels: { [key in LogLevelOptions]: number } = {
    debug: 4,
    error: 1,
    info: 3,
    off: 0,
    warn: 2,
  }

  protected instance: LoggerInstance

  protected logLevel: LogLevelOptions = 'info'

  protected service = 'federated-core'

  protected options: BrowserLogOptions

  protected namespace: 'browser' = 'browser'

  constructor(
    service: string,
    logLevel: LogLevelOptions,
    options: BrowserLogOptions
  ) {
    datadogLogs.init({ ...options.config, service } as BrowserLogConfig)
    datadogLogs.logger.setLevel(logLevel as StatusType)
    this.options = options
    this.service = service
    this.logLevel = logLevel
    this.instance = datadogLogs.logger as LoggerInstance
  }

  protected log(
    level: LoggerLevels,
    message: string | object,
    componentName = '',
    logContext: object = {}
  ) {
    if (this.logLevel === 'off') return
    if (this.options.filteredLogs?.includes(message as string)) return

    const isObject = typeof message === 'object'
    const messageToLog = isObject ? JSON.stringify({ data: message }) : message

    if (this.isLevelEnabled(level)) {
      this.instance[level](`[${this.namespace}] - ${messageToLog}`, {
        logContext: { componentName, ...logContext },
      })
    }
  }

  isLevelEnabled(level: LoggerLevels): boolean {
    return this.logLevels[this.logLevel] >= this.logLevels[level]
  }

  debug(
    message: string | object,
    componentName?: string,
    logContext?: object | undefined
  ): void {
    this.log('debug', message, componentName, logContext)
  }

  error(
    message: string | object,
    componentName?: string,
    logContext?: object | undefined
  ): void {
    this.log('error', message, componentName, logContext)
  }

  info(
    message: string | object,
    componentName?: string,
    logContext?: object | undefined
  ): void {
    this.log('info', message, componentName, logContext)
  }

  warn(
    message: string | object,
    componentName?: string,
    logContext?: object | undefined
  ): void {
    this.log('warn', message, componentName, logContext)
  }

  get level(): LogLevelOptions {
    return this.logLevel
  }

  set level(level: LogLevelOptions) {
    this.logLevel = level
  }

  get serviceName(): string {
    return this.service
  }

  get loggerInstance(): LoggerInstance {
    return this.instance
  }
}

export default BrowserLogger
