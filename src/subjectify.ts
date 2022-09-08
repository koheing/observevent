import type { Subject } from './models'
import type { Subscriber, Options } from './types'

type State<T> = { value: T }

/**
 * @example
 *   ```ts
 *   const subject = subjectify(1)
 *   const unsubscribe = subject.subscribe(console.log)
 *
 *   subject.notify(2)
 *   subject.notify((value) => value + 1)
 *
 *   unsubscribe()
 *   ```
 *   ----
 *   outputs:
 *   "1"
 *   "2"
 *   "3"
 */
export function subjectify<T>(init: T, options: Options = {}): Subject<T> {
  const state = withHook({
    value: init,
  })
  const logger = options.logger ?? console
  const logging = options.logging ?? false
  const immediate = options.immediate ?? true
  let subscribers: Subscriber<T>[] = []
  function notifyAll(newValue: T, oldValue: T): void {
    subscribers.forEach((it) => it(newValue, oldValue))
  }

  function withHook(state: State<T>): State<T> {
    return new Proxy(state, {
      set: (target, key: keyof typeof state, value: T) => {
        notifyAll(value, target[key])
        logging && logger.info({ before: target[key], after: value })
        target[key] = value
        return true
      },
    })
  }

  function notify<V extends T>(value: V): void
  function notify<V extends T>(updator: (value: V) => V): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function notify(valueOrUpdator: any) {
    const value =
      typeof valueOrUpdator === 'function'
        ? valueOrUpdator(state.value)
        : valueOrUpdator
    state.value = value
  }

  return {
    get subscribed(): boolean {
      return subscribers.length > 0
    },
    /**
     * Update subject
     */
    notify,
    subscribe(subscriber: Subscriber<T>) {
      immediate && subscriber(state.value, undefined)
      subscribers.push(subscriber)

      return () => {
        subscribers = subscribers.filter((it) => it !== subscriber)
      }
    },
  }
}
