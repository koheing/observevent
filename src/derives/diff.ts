import type { Observer } from '../models'
import type { Value, Subscriber, Unsubscriber } from '../types'

/**
 * Change value to tuple of current and previous values.
 * @example
 *   ```ts
 *   const subject = subjectify(1)
 *   diff(subject).subscribe(console.log)
 *
 *   subject.notify((value) => value + 1)
 *   subject.notify((value) => value + 1)
 *   ```
 *   ----
 *   outputs:
 *   ["1",undefined]
 *   ["2","1"]
 *   ["3","2"]
 */
export function diff<T, U extends boolean = false>(
  observerOrSubject: Observer<T, U>
): Observer<Value<T, true>, U> {
  let older: Value<T, U>
  return {
    subscribe(subscriber: Subscriber<Value<T, true>, U>): Unsubscriber {
      const unsubscriber = observerOrSubject.subscribe((it) => {
        const value = [it, older] as Value<Value<T, true>, U>
        subscriber(value)
        older = it
      })
      return unsubscriber
    },
    get diff(): boolean {
      return observerOrSubject.diff
    },
  }
}
