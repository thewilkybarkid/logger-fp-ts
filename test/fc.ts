import * as fc from 'fast-check'
import * as _ from '../src'

export * from 'fast-check'

export const logLevel = (): fc.Arbitrary<_.LogLevel> => fc.constantFrom('DEBUG', 'INFO', 'WARN', 'ERROR')

export const logEntry = (level?: _.LogLevel): fc.Arbitrary<_.LogEntry> =>
  fc.record({
    date: fc.date(),
    message: fc.string(),
    level: level ? fc.constant(level) : logLevel(),
  })
