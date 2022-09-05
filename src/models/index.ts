import type { Subscriber, Unsubscriber, ValueOrUpdator } from '../types'

export interface Observer<T> {
  subscribe: (subscriber: Subscriber<T>) => Unsubscriber
}

export interface Subject<T> extends Observer<T> {
  readonly subscribed: boolean
  notify: (valueOrUpdator: ValueOrUpdator<T>) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Logger extends Record<string, any> {
  info: (value: { before: unknown; after: unknown }) => void
}
