import * as fc from 'fast-check'
import * as _ from '../src'

export * from 'fast-check'

export const logLevel = (): fc.Arbitrary<_.LogLevel> => fc.constantFrom('DEBUG', 'INFO', 'WARN', 'ERROR')
