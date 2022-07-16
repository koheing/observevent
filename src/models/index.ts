import type { Subscriber, Unsubscriber, ValueOrUpdator } from '../types'

export interface Observer<T, U extends boolean> {
  subscribe: (subscriber: Subscriber<T, U>) => Unsubscriber
  readonly diff: boolean
}

export interface Subject<T, U extends boolean> extends Observer<T, U> {
  readonly subscribed: boolean
  notify: (valueOrUpdator: ValueOrUpdator<T>) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Logger extends Record<string, any> {
  info: (value: { before: unknown; after: unknown }) => void
}
