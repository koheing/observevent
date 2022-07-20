import { Observer } from '../models'
import { Value, Subscriber, Unsubscriber } from '../types'

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
export function select<T, U extends boolean = false>(
  observerOrSubject: Observer<T, U>,
  selector: (value: Value<T, U>) => boolean
): Observer<T, U> {
  let older: Value<T, U>
  return {
    subscribe(subscriber: Subscriber<T, U>): Unsubscriber {
      const unsubscriber = observerOrSubject.subscribe((it) => {
        if (!selector(it)) return
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
