import { Logger, Observer } from '../models'

export type ValueOrUpdator<T> = T | ((value: T) => T)

export type Subscriber<T> = (newValue: T, oldValue: T) => void

export type Unsubscriber = () => void

export type Tuple<T> = [T, ...Array<T>]

export type ObserveeOrNot<T> = T extends Observer<infer L> ? L : never

export type Observees<T extends readonly unknown[]> = {
  [K in keyof T]: ObserveeOrNot<T[K]>
}

export type Options = {
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
