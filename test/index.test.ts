import { FixedClock } from 'clock-ts'
import * as I from 'fp-ts/IO'
import safeStringify from 'safe-stable-stringify'
import sortObject from 'sortobject'
import * as _ from '../src'
import * as fc from './fc'

describe('logger-fp-ts', () => {
  describe('constructors', () => {
    test('LogEntry', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), fc.logLevel(), fc.jsonRecord(), (message, date, level, payload) => {
          expect(_.LogEntry(message, date, level, payload)).toStrictEqual({
            message,
            date,
            level,
            payload,
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
    describe('ShowLogEntry', () => {
      test('with a payload', () => {
        fc.assert(
          fc.property(
            fc.logEntry().filter(logEntry => Object.keys(logEntry.payload).length > 0),
            logEntry => {
              expect(_.ShowLogEntry.show(logEntry)).toStrictEqual(
                `${logEntry.date.toISOString()} | ${logEntry.level} | ${logEntry.message} | ${safeStringify(
                  logEntry.payload,
                )}`,
              )
            },
          ),
        )
      })

      test('without a payload', () => {
        fc.assert(
          fc.property(fc.logEntry({ payload: {} }), logEntry => {
            expect(_.ShowLogEntry.show(logEntry)).toStrictEqual(
              `${logEntry.date.toISOString()} | ${logEntry.level} | ${logEntry.message}`,
            )
          }),
        )
      })
    })

    describe('getColoredShow', () => {
      test('with a DEBUG', () => {
        fc.assert(
          fc.property(fc.logEntry({ level: 'DEBUG' }), logEntry => {
            const show = _.getColoredShow({ show: logEntry => logEntry.date.toISOString() })

            expect(show.show(logEntry)).toStrictEqual(`\x1b[36m${logEntry.date.toISOString()}\x1b[39m`)
          }),
        )
      })

      test('with an INFO', () => {
        fc.assert(
          fc.property(fc.logEntry({ level: 'INFO' }), logEntry => {
            const show = _.getColoredShow({ show: logEntry => logEntry.date.toISOString() })

            expect(show.show(logEntry)).toStrictEqual(`\x1b[35m${logEntry.date.toISOString()}\x1b[39m`)
          }),
        )
      })

      test('with a WARN', () => {
        fc.assert(
          fc.property(fc.logEntry({ level: 'WARN' }), logEntry => {
            const show = _.getColoredShow({ show: logEntry => logEntry.date.toISOString() })

            expect(show.show(logEntry)).toStrictEqual(`\x1b[33m${logEntry.date.toISOString()}\x1b[39m`)
          }),
        )
      })

      test('with an ERROR', () => {
        fc.assert(
          fc.property(fc.logEntry({ level: 'ERROR' }), logEntry => {
            const show = _.getColoredShow({ show: logEntry => logEntry.date.toISOString() })

            expect(show.show(logEntry)).toStrictEqual(`\x1b[31m${logEntry.date.toISOString()}\x1b[39m`)
          }),
        )
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

      test('with payload in a different order', () => {
        fc.assert(
          fc.property(fc.logEntry(), x => {
            const y = { ...x, payload: sortObject(x.payload) }

            expect(_.EqLogEntry.equals(x, y)).toStrictEqual(true)
          }),
        )
      })
    })

    test('debugP', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), fc.jsonRecord(), (message, date, payload) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.debugP(message)(payload)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'DEBUG', payload }])
        }),
      )
    })

    test('debug', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), (message, date) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.debug(message)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'DEBUG', payload: {} }])
        }),
      )
    })

    test('infoP', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), fc.jsonRecord(), (message, date, payload) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.infoP(message)(payload)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'INFO', payload }])
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

          expect(logs).toStrictEqual([{ message, date, level: 'INFO', payload: {} }])
        }),
      )
    })

    test('warnP', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), fc.jsonRecord(), (message, date, payload) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.warnP(message)(payload)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'WARN', payload }])
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

          expect(logs).toStrictEqual([{ message, date, level: 'WARN', payload: {} }])
        }),
      )
    })

    test('errorP', () => {
      fc.assert(
        fc.property(fc.string(), fc.date(), fc.jsonRecord(), (message, date, payload) => {
          const logs: Array<_.LogEntry> = []
          const logger: _.Logger = message => I.of(logs.push(message))
          const clock = FixedClock(date)

          _.errorP(message)(payload)({ clock, logger })()

          expect(logs).toStrictEqual([{ message, date, level: 'ERROR', payload }])
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

          expect(logs).toStrictEqual([{ message, date, level: 'ERROR', payload: {} }])
        }),
      )
    })
  })
})
