/**
 * @since 0.1.0
 */
import chalk from 'chalk'
import { ClockEnv, now } from 'clock-ts'
import * as RIO from 'fp-ts-contrib/ReaderIO'
import * as d from 'fp-ts/Date'
import * as E from 'fp-ts/Eq'
import * as Json from 'fp-ts/Json'
import * as S from 'fp-ts/Show'
import { apply, flow, pipe } from 'fp-ts/function'
import * as s from 'fp-ts/string'
import * as L from 'logging-ts/lib/IO'
import safeStringify from 'safe-stable-stringify'

import Eq = E.Eq
import JsonRecord = Json.JsonRecord
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
  readonly payload: JsonRecord
}

/**
 * @category model
 * @since 0.1.0
 */
export interface LoggerEnv extends ClockEnv {
  readonly logger: Logger
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.1.0
 */
export const LogEntry = (message: string, date: Date, level: LogLevel, payload: JsonRecord): LogEntry => ({
  message,
  date,
  level,
  payload,
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

const logEntryForDate: (message: string, level: LogLevel, payload: JsonRecord) => (date: Date) => LogEntry =
  (message, level, payload) => date => ({
    message,
    date,
    level,
    payload,
  })

const logAtLevel: (level: LogLevel) => (message: string) => (payload: JsonRecord) => ReaderIO<LoggerEnv, void> =
  level => message => payload =>
    pipe(now, RIO.map(logEntryForDate(message, level, payload)), RIO.chain(log))

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 0.1.2
 */
export const ShowLogEntry: Show<LogEntry> = {
  show: ({ message, date, level, payload }) =>
    `${date.toISOString()} | ${level} | ${message}${
      Object.keys(payload).length > 0 ? ` | ${safeStringify(payload)}` : ''
    }`,
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
  payload: pipe(s.Eq, E.contramap(safeStringify)),
})

/**
 * Log a 'DEBUG' message with a payload.
 *
 * @category instances
 * @since 0.2.0
 */
export const debugP: (message: string) => (payload: JsonRecord) => ReaderIO<LoggerEnv, void> = logAtLevel('DEBUG')

/**
 * Log a 'DEBUG' message.
 *
 * @category instances
 * @since 0.1.0
 */
export const debug: (message: string) => ReaderIO<LoggerEnv, void> = flow(debugP, apply({}))

/**
 * Log an 'INFO' message with a payload.
 *
 * @category instances
 * @since 0.2.0
 */
export const infoP: (message: string) => (payload: JsonRecord) => ReaderIO<LoggerEnv, void> = logAtLevel('INFO')

/**
 * Log an 'INFO' message.
 *
 * @category instances
 * @since 0.1.0
 */
export const info: (message: string) => ReaderIO<LoggerEnv, void> = flow(infoP, apply({}))

/**
 * Log a 'WARN' message with a payload.
 *
 * @category instances
 * @since 0.2.0
 */
export const warnP: (message: string) => (payload: JsonRecord) => ReaderIO<LoggerEnv, void> = logAtLevel('WARN')

/**
 * Log a 'WARN' message.
 *
 * @category instances
 * @since 0.1.0
 */
export const warn: (message: string) => ReaderIO<LoggerEnv, void> = flow(warnP, apply({}))

/**
 * Log an 'ERROR' message with a payload.
 *
 * @category instances
 * @since 0.2.0
 */
export const errorP: (message: string) => (payload: JsonRecord) => ReaderIO<LoggerEnv, void> = logAtLevel('ERROR')

/**
 * Log an 'ERROR' message.
 *
 * @category instances
 * @since 0.1.0
 */
export const error: (message: string) => ReaderIO<LoggerEnv, void> = flow(errorP, apply({}))
