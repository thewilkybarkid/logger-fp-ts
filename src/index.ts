/**
 * @since 0.1.0
 */
import chalk from 'chalk'
import { ClockEnv, now } from 'clock-ts'
import * as RIO from 'fp-ts-contrib/ReaderIO'
import * as d from 'fp-ts/Date'
import * as E from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'
import { flow, pipe } from 'fp-ts/function'
import * as s from 'fp-ts/string'
import * as L from 'logging-ts/lib/IO'

import Eq = E.Eq
import LoggerIO = L.LoggerIO
import ReaderIO = RIO.ReaderIO
import Show = S.Show

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

/**
 * @example
 * import * as C from 'fp-ts/Console'
 * import { pipe } from 'fp-ts/function'
 * import * as L from 'logger-fp-ts'
 *
 * const logger = pipe(C.log, L.withShow(L.ShowLogEntry))
 *
 * @category constructors
 * @since 0.1.2
 */
export const withShow: (show: Show<LogEntry>) => (fa: LoggerIO<string>) => Logger = (show: Show<LogEntry>) =>
  L.contramap(show.show)

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @category destructors
 * @since 0.1.2
 */
export const match =
  <R>(patterns: {
    readonly [K in LogLevel]: (entry: LogEntry) => R
  }) =>
  (entry: LogEntry) => {
    return patterns[entry.level](entry)
  }

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
 * @since 0.1.2
 */
export const ShowLogEntry: Show<LogEntry> = {
  show: ({ message, date, level }) => `${date.toISOString()} | ${level} | ${message}`,
}

/**
 * Colorizes log entries based on the level.
 *
 * @category instances
 * @since 0.1.2
 */
export const getColoredShow: (show: Show<LogEntry>) => Show<LogEntry> = ({ show }) => ({
  show: match({
    DEBUG: flow(show, chalk.cyan),
    INFO: flow(show, chalk.magenta),
    WARN: flow(show, chalk.yellow),
    ERROR: flow(show, chalk.red),
  }),
})

/**
 * @category instances
 * @since 0.1.2
 */
export const EqLogEntry: Eq<LogEntry> = E.struct({
  message: s.Eq,
  date: d.Eq,
  level: s.Eq,
})

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
