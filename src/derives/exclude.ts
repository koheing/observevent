import type { Observer } from '../models'
import type { Value, Subscriber, Unsubscriber } from '../types'

/**
 * Do not subscribe if condition is met.
 * @example
 *   ```ts
 *   const subject = subjectify(1)
 *   exclude(subject, (value) => value > 2)
 *     .subscribe(console.log)
 *
 *   subject.notify((value) => value + 1)
 *   subject.notify((value) => value + 1)
 *   ```
 *   ----
 *   outputs:
 *   "1"
 *   "2"
 */
export function exclude<T, U extends boolean = false>(
  observerOrSubject: Observer<T, U>,
  selector: (value: Value<T, U>) => boolean
): Observer<T, U> {
  let older: T
  return {
    subscribe(subscriber: Subscriber<T, U>): Unsubscriber {
      const unsubscriber = observerOrSubject.subscribe((it) => {
        if (selector(it)) return
        const value = observerOrSubject.diff
          ? ([it[0], older] as Value<T, U>)
          : it
        subscriber(value)
        older = it[0]
      })
      return unsubscriber
    },
    get diff(): boolean {
      return observerOrSubject.diff
    },
  }
}
