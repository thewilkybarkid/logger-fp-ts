/**
 * @since 0.1.0
 */
import * as L from 'logging-ts/lib/IO'

import LoggerIO = L.LoggerIO

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
export type Logger = LoggerIO<LogEntry>

/**
 * @category model
 * @since 0.1.0
 */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

/**
 * @category model
 * @since 0.1.0
 */
export interface LogEntry {
  readonly message: string
  readonly date: Date
  readonly level: LogLevel
}
