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
  RIO.of('Result of an action'),
  RIO.chainFirst(() => L.info('Some action was performed')),
)(env)()
/*
2022-03-23T13:53:03.694Z | INFO | Some action was performed
*/
```

[fp-ts]: https://gcanti.github.io/fp-ts/
