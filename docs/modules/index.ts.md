---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [LogEntry](#logentry)
  - [withShow](#withshow)
- [destructors](#destructors)
  - [match](#match)
- [instances](#instances)
  - [EqLogEntry](#eqlogentry)
  - [ShowLogEntry](#showlogentry)
  - [debug](#debug)
  - [error](#error)
  - [getColoredShow](#getcoloredshow)
  - [info](#info)
  - [warn](#warn)
- [model](#model)
  - [LogEntry (interface)](#logentry-interface)
  - [LogLevel (type alias)](#loglevel-type-alias)
  - [Logger (type alias)](#logger-type-alias)
  - [LoggerEnv (interface)](#loggerenv-interface)

---

# constructors

## LogEntry

**Signature**

```ts
export declare const LogEntry: (message: string, date: Date, level: LogLevel) => LogEntry
```

Added in v0.1.0

## withShow

**Signature**

```ts
export declare const withShow: (show: Show<LogEntry>) => (fa: LoggerIO<string>) => Logger
```

**Example**

```ts
import * as C from 'fp-ts/Console'
import { pipe } from 'fp-ts/function'
import * as L from 'logger-fp-ts'

const logger = pipe(C.log, L.withShow(L.ShowLogEntry))
```

Added in v0.1.2

# destructors

## match

**Signature**

```ts
export declare const match: <R>(patterns: {
  readonly DEBUG: (entry: LogEntry) => R
  readonly INFO: (entry: LogEntry) => R
  readonly WARN: (entry: LogEntry) => R
  readonly ERROR: (entry: LogEntry) => R
}) => (entry: LogEntry) => R
```

Added in v0.1.2

# instances

## EqLogEntry

**Signature**

```ts
export declare const EqLogEntry: E.Eq<LogEntry>
```

Added in v0.1.2

## ShowLogEntry

**Signature**

```ts
export declare const ShowLogEntry: S.Show<LogEntry>
```

Added in v0.1.2

## debug

**Signature**

```ts
export declare const debug: (message: string) => ReaderIO<LoggerEnv, void>
```

Added in v0.1.0

## error

**Signature**

```ts
export declare const error: (message: string) => ReaderIO<LoggerEnv, void>
```

Added in v0.1.0

## getColoredShow

Colorizes log entries based on the level.

**Signature**

```ts
export declare const getColoredShow: (show: Show<LogEntry>) => Show<LogEntry>
```

Added in v0.1.2

## info

**Signature**

```ts
export declare const info: (message: string) => ReaderIO<LoggerEnv, void>
```

Added in v0.1.0

## warn

**Signature**

```ts
export declare const warn: (message: string) => ReaderIO<LoggerEnv, void>
```

Added in v0.1.0

# model

## LogEntry (interface)

**Signature**

```ts
export interface LogEntry {
  readonly message: string
  readonly date: Date
  readonly level: LogLevel
}
```

Added in v0.1.0

## LogLevel (type alias)

**Signature**

```ts
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
```

Added in v0.1.0

## Logger (type alias)

**Signature**

```ts
export type Logger = LoggerIO<LogEntry>
```

Added in v0.1.0

## LoggerEnv (interface)

**Signature**

```ts
export interface LoggerEnv extends ClockEnv {
  logger: Logger
}
```

Added in v0.1.0
