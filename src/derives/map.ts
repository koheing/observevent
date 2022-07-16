import type { Observer } from '../models'
import type { Value, Subscriber, Unsubscriber } from '../types'

/**
 * Map subscribed value to something
 *
 * @example
 *   ```ts
 *   const numberSubject = subjectify(1)
 *   const stringSubject = map(subject, (it) => it.toString())
 *   const unsubcribe = stringSubject.subscribe(console.log)
 *
 *   numberSubject.notify((value) => value + 1)
 *   numberSubject.notify((value) => value + 1)
 *
 *   unsubcribe()
 *   ```
 *   ----
 *   outputs:
 *   "1"
 *   "2"
 *   "3"
 */
export function map<T, U extends boolean, V>(
  observerOrSubject: Observer<T, U>,
  mapper: (value: Value<T, U>) => V
): Observer<V, U> {
  return {
    subscribe(subscriber: Subscriber<V, U>): Unsubscriber {
      const unsubscriber = observerOrSubject.subscribe((it) =>
        subscriber(mapper(it) as Value<V, U>)
      )
      return unsubscriber
    },
    get diff(): boolean {
      return observerOrSubject.diff
    },
  }
}
