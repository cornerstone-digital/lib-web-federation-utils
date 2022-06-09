import {
  BrowserLogger,
  BrowserLogOptions,
  LogLevelOptions,
} from '../../../utils/browser-logger'

export type LoggerServiceType = {
  hasLogger(loggerKey: string): boolean
  getLogger(
    service: string,
    logLevel: LogLevelOptions,
    options: BrowserLogOptions,
    forceRecreate?: boolean
  ): BrowserLogger | undefined
  deleteLogger(loggerKey: string): void
}
