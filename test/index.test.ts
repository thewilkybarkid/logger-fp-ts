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

    test('withShow', () => {
      fc.assert(
        fc.property(fc.logEntry(), logEntry => {
          const logs: Array<string> = []
          const logger = (message: string) => I.of(logs.push(message))
          const show = jest.fn(() => '')

          _.withShow({ show })(logger)(logEntry)()

          expect(logs).toHaveLength(1)
          expect(show).toHaveBeenCalledWith(logEntry)
        }),
      )
    })
  })

  describe('destructors', () => {
    test('match', () => {
      fc.assert(
        fc.property(fc.logEntry(), logEntry => {
          const f = _.match({
            DEBUG: logEntry => logEntry.level,
            INFO: logEntry => logEntry.level,
            WARN: logEntry => logEntry.level,
            ERROR: logEntry => logEntry.level,
          })

          expect(f(logEntry)).toBe(logEntry.level)
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

    describe('getColoredShow', () => {
      test('with a DEBUG', () => {
        fc.assert(
          fc.property(fc.logEntry('DEBUG'), logEntry => {
            const show = _.getColoredShow({ show: logEntry => logEntry.date.toISOString() })

            expect(show.show(logEntry)).toStrictEqual(`\x1b[36m${logEntry.date.toISOString()}\x1b[39m`)
          }),
        )
      })

      test('with an INFO', () => {
        fc.assert(
          fc.property(fc.logEntry('INFO'), logEntry => {
            const show = _.getColoredShow({ show: logEntry => logEntry.date.toISOString() })

            expect(show.show(logEntry)).toStrictEqual(`\x1b[35m${logEntry.date.toISOString()}\x1b[39m`)
          }),
        )
      })

      test('with a WARN', () => {
        fc.assert(
          fc.property(fc.logEntry('WARN'), logEntry => {
            const show = _.getColoredShow({ show: logEntry => logEntry.date.toISOString() })

            expect(show.show(logEntry)).toStrictEqual(`\x1b[33m${logEntry.date.toISOString()}\x1b[39m`)
          }),
        )
      })

      test('with an ERROR', () => {
        fc.assert(
          fc.property(fc.logEntry('ERROR'), logEntry => {
            const show = _.getColoredShow({ show: logEntry => logEntry.date.toISOString() })

            expect(show.show(logEntry)).toStrictEqual(`\x1b[31m${logEntry.date.toISOString()}\x1b[39m`)
          }),
        )
      })

      let forceColor: string | undefined

      beforeAll(() => {
        forceColor = process.env.FORCE_COLOR
        process.env.FORCE_COLOR = 'true'
      })

      afterAll(() => {
        process.env.FORCE_COLOR = forceColor
      })
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
