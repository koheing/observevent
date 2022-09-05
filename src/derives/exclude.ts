import type { Observer } from '../models'
import type { Subscriber, Unsubscriber } from '../types'

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
export function exclude<T>(
  observerOrSubject: Observer<T>,
  selector: (newValue: T, oldValue: T) => boolean
): Observer<T> {
  let oldValue: T
  return {
    subscribe(subscriber: Subscriber<T>): Unsubscriber {
      const unsubscriber = observerOrSubject.subscribe((nV, oV) => {
        if (selector(nV, oV)) return
        subscriber(nV, oldValue)
        oldValue = nV
      })
      return unsubscriber
    },
  }
}
