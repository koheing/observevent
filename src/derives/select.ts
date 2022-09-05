import { Observer } from '../models'
import { Subscriber, Unsubscriber } from '../types'

/**
 * Subscribe if condition is met.
 * @example
 *   ```ts
 *   const subject = subjectify(1)
 *   const unsubscribe = select(subject, (value) => value > 2)
 *     .subscribe(console.log)
 *
 *   subject.notify((value) => value + 1)
 *   subject.notify((value) => value + 1)
 *
 *   unsubscribe()
 *   ```
 * ----
 * outputs:
 * "3"
 */
export function select<T>(
  observerOrSubject: Observer<T>,
  selector: (newValue: T, oldValue: T) => boolean
): Observer<T> {
  let oldValue: T
  return {
    subscribe(subscriber: Subscriber<T>): Unsubscriber {
      const unsubscriber = observerOrSubject.subscribe((nV, oV) => {
        if (!selector(nV, oV)) return
        subscriber(nV, oldValue)
        oldValue = nV
      })
      return unsubscriber
    },
  }
}
