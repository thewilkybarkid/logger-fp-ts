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
- [instances](#instances)
  - [EqLogEntry](#eqlogentry)
  - [ShowLogEntry](#showlogentry)
  - [debug](#debug)
  - [error](#error)
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
