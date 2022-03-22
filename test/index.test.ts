import * as _ from '../src'
import * as fc from './fc'

describe('logger-ts', () => {
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
})
