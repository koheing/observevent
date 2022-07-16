import { Logger, Observer } from '../models'

export type Value<T, U extends boolean> = U extends true
  ? [newer: T, older: T]
  : T

export type ValueOrUpdator<T> = T | ((value: T) => T)

export type Subscriber<T, U extends boolean> = (value: Value<T, U>) => void

export type Unsubscriber = () => void

export type Tuple<T> = [T, ...Array<T>]

export type ObserveeOrNot<T> = T extends Observer<infer L, infer R>
  ? R extends true
    ? [newer: L, older: L]
    : L
  : never

export type Observees<T extends readonly unknown[]> = {
  [K in keyof T]: ObserveeOrNot<T[K]>
}

export type Options<T extends boolean = false> = {
  /**
   * Subscribe value to be tuple like `[newer, older]` if true
   * @default false
   */
  diff?: T
  /**
   * @type {Logger}
   */
  logger?: Logger
  /**
   * Output log if true
   * @default false
   */
  logging?: boolean
  /**
   * The value is subscribed from the time you call the subscribe function
   * @default true
   */
  immediate?: boolean
}
