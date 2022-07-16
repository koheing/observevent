import type { Subject } from './models'
import type { Subscriber, Value, Options } from './types'

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
export function subjectify<T, U extends boolean = false>(
  init: T,
  options: Options<U> = {}
) {
  const state = withHook({
    value: init,
  })
  const diff = options.diff ?? (false as U)
  const logger = options.logger ?? console
  const logging = options.logging ?? false
  const immediate = options.immediate ?? true
  let subscribers: Subscriber<T, U>[] = []
  function notifyAll<V extends Value<T, U>>(value: V): void {
    subscribers.forEach((it) => it(value))
  }

  function withHook(state: State<T>): State<T> {
    return new Proxy(state, {
      set: (target, key: keyof typeof state, value: T) => {
        const v = (diff ? [value, target[key]] : value) as Value<T, U>
        notifyAll(v)
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
    get diff(): boolean {
      return options.diff ?? false
    },
    /**
     * Update subject
     */
    notify,
    subscribe(subscriber: Subscriber<T, U>) {
      const v = (diff ? [state.value, undefined] : state.value) as Value<T, U>
      immediate && subscriber(v)
      subscribers.push(subscriber)

      return () => {
        subscribers = subscribers.filter((it) => it !== subscriber)
      }
    },
  } as unknown as U extends true ? Subject<T, true> : Subject<T, false>
}
