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
  logger: C.log,
}

pipe(
  RIO.of('Result of an action'),
  RIO.chainFirst(() => L.info('Some action was performed')),
)(env)()
/*
{
  message: 'Some action was performed',
  date: 2022-03-22T15:25:06.269Z,
  level: 'INFO'
}
*/
```

[fp-ts]: https://gcanti.github.io/fp-ts/
