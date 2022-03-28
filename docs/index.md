---
title: Home
nav_order: 1
---

A logger for use with [fp-ts].

# Example

```ts
import { SystemClock } from 'clock-ts'
import * as RIO from 'fp-ts-contrib/ReaderIO'
import * as C from 'fp-ts/Console'
import { pipe } from 'fp-ts/function'
import * as L from 'logger-fp-ts'

const env: L.LoggerEnv = {
  clock: SystemClock,
  logger: pipe(C.log, L.withShow(L.ShowLogEntry)),
}

pipe(
  RIO.of({ result: 'Result of an action' }),
  RIO.chainFirst(() => L.info('Some action was performed')),
  RIO.chainFirst(L.debugP("And here's the details")),
)(env)()
/*
2022-03-28T14:07:57.250Z | INFO | Some action was performed
2022-03-28T14:07:57.254Z | DEBUG | And here's the details | {"result":"Result of an action"}
*/
```

[fp-ts]: https://gcanti.github.io/fp-ts/
