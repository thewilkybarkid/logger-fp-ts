import * as fc from 'fast-check'
import { Json, JsonRecord } from 'fp-ts/Json'
import { Refinement } from 'fp-ts/Refinement'
import * as _ from '../src'

export * from 'fast-check'

export const json = (): fc.Arbitrary<Json> => fc.jsonValue() as fc.Arbitrary<Json>

export const jsonRecord = (): fc.Arbitrary<JsonRecord> => json().filter(isJsonRecord)

export const logLevel = (): fc.Arbitrary<_.LogLevel> => fc.constantFrom('DEBUG', 'INFO', 'WARN', 'ERROR')

export const logEntry = ({
  level,
  payload,
}: { level?: _.LogLevel; payload?: JsonRecord } = {}): fc.Arbitrary<_.LogEntry> =>
  fc.record({
    date: fc.date(),
    message: fc.string(),
    level: level ? fc.constant(level) : logLevel(),
    payload: payload ? fc.constant(payload) : jsonRecord(),
  })

const isJsonRecord: Refinement<Json, JsonRecord> = (u: Json): u is JsonRecord =>
  u !== null && typeof u === 'object' && !Array.isArray(u)
