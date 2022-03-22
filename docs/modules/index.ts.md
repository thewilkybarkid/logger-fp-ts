---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [model](#model)
  - [LogEntry (interface)](#logentry-interface)
  - [LogLevel (type alias)](#loglevel-type-alias)
  - [Logger (type alias)](#logger-type-alias)

---

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
