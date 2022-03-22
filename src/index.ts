/**
 * @since 0.1.0
 */
import { ClockEnv, now } from 'clock-ts'
import * as RIO from 'fp-ts-contrib/ReaderIO'
import { pipe } from 'fp-ts/function'
import * as L from 'logging-ts/lib/IO'

import LoggerIO = L.LoggerIO
import ReaderIO = RIO.ReaderIO

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

/**
 * @category model
 * @since 0.1.0
 */
export interface LoggerEnv extends ClockEnv {
  logger: Logger
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.1.0
 */
export const LogEntry = (message: string, date: Date, level: LogLevel): LogEntry => ({
  message,
  date,
  level,
})

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

const log: (entry: LogEntry) => ReaderIO<LoggerEnv, void> =
  entry =>
  ({ logger }) =>
    logger(entry)

const logEntryForDate: (message: string, level: LogLevel) => (date: Date) => LogEntry = (message, level) => date => ({
  message,
  date,
  level,
})

const logAtLevel: (level: LogLevel) => (message: string) => ReaderIO<LoggerEnv, void> = level => message =>
  pipe(now, RIO.map(logEntryForDate(message, level)), RIO.chain(log))

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 0.1.0
 */
export const debug: (message: string) => ReaderIO<LoggerEnv, void> = logAtLevel('DEBUG')

/**
 * @category instances
 * @since 0.1.0
 */
export const info: (message: string) => ReaderIO<LoggerEnv, void> = logAtLevel('INFO')

/**
 * @category instances
 * @since 0.1.0
 */
export const warn: (message: string) => ReaderIO<LoggerEnv, void> = logAtLevel('WARN')

/**
 * @category instances
 * @since 0.1.0
 */
export const error: (message: string) => ReaderIO<LoggerEnv, void> = logAtLevel('ERROR')
