import type { Observer } from '../models'
import type { Subscriber, Unsubscriber } from '../types'

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
export function map<T, V>(
  observerOrSubject: Observer<T>,
  mapper: (newValue: T, oldValue: T) => V
): Observer<V> {
  let oldValue: V
  return {
    subscribe(subscriber: Subscriber<V>): Unsubscriber {
      const unsubscriber = observerOrSubject.subscribe((nV, oV) => {
        const newValue = mapper(nV, oV)
        subscriber(newValue, oldValue)
        oldValue = newValue
      })
      return unsubscriber
    },
  }
}
