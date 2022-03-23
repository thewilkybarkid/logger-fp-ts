import { FixedClock } from 'clock-ts'
import * as I from 'fp-ts/IO'
import * as _ from '../src'
import * as fc from './fc'

describe('logger-fp-ts', () => {
  describe('constructors', () => {
    test('LogEntry', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), fc.logLevel(), (message, date, level) => {
          expect(_.LogEntry(message, date, level)).toStrictEqual({
            message,
            date,
            level,
          })
        }),
      )
    })
  })

  describe('instances', () => {
    test('ShowLogEntry', () => {
      fc.assert(
        fc.property(fc.logEntry(), logEntry => {
          expect(_.ShowLogEntry.show(logEntry)).toStrictEqual(
            `${logEntry.date.toISOString()} | ${logEntry.level} | ${logEntry.message}`,
          )
        }),
      )
    })

    describe('EqLogEntry', () => {
      test('with the same data', () => {
        fc.assert(
          fc.property(fc.logEntry(), logEntry => {
            expect(_.EqLogEntry.equals(logEntry, logEntry)).toStrictEqual(true)
          }),
        )
      })

      test('with different data', () => {
        fc.assert(
          fc.property(fc.logEntry(), fc.logEntry(), (x, y) => {
            expect(_.EqLogEntry.equals(x, y)).toStrictEqual(false)
          }),
        )
      })
    })

    test('debug', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), (message, date) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.debug(message)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'DEBUG' }])
        }),
      )
    })

    test('info', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), (message, date) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.info(message)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'INFO' }])
        }),
      )
    })

    test('warn', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), (message, date) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.warn(message)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'WARN' }])
        }),
      )
    })

    test('error', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), (message, date) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.error(message)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'ERROR' }])
        }),
      )
    })
  })
})
