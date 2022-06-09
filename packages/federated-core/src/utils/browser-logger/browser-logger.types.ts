import { LogsInitConfiguration as BrowserLogConfig } from '@datadog/browser-logs';

export type LoggerLevels = 'debug' | 'info' | 'warn' | 'error';
export type LogLevelOptions = 'off' | LoggerLevels;
export type LogFunction = (message: string, ...rest: unknown[]) => void;

export type BrowserLogOptions = {
  config?: BrowserLogConfig;
  filteredLogs?: string[];
};

export type LoggerInstance = {
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
};
