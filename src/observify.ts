import { subjectify } from './subjectify'
import type { Observer } from './models'
import type { Subscriber, Unsubscriber, Options, ValueOrUpdator } from './types'

export type Trigger<T> = (
  trigger: (valueOrUpdator: ValueOrUpdator<T>) => void
) => Unsubscriber | void

/**
 * Observe value changes.
 * When the return value of the trigger is a function,
 * the function will be executed when there are no more subscribers.
 * @example
 *   ```ts
 *   const emitter = new EventEmitter()
 *   const observer = observify('', (trigger) => {
 *     emitter.emit('food', trigger)
 *     return () => emitter.removeAllListener('food')
 *   })
 *
 *   const unsubscribe = observe.subscribe(console.log)
 *   emitter.emit('food', 'apple')
 *
 *   unsubscribe() // `() => emitter.removeAllListener('food')` called
 *   ```
 *   ----
 *   outputs:
 *   ""
 *   "apple"
 */
export function observify<T>(
  init: T,
  trigger: Trigger<T>,
  options: Options = {}
) {
  const subject = subjectify(init, options)
  const customUnsubscriber = trigger(subject.notify)

  return {
    subscribe(subscriber: Subscriber<T>): Unsubscriber {
      const unsubscriber = subject.subscribe(subscriber)

      return () => {
        unsubscriber()
        if (!subject.subscribed && typeof customUnsubscriber === 'function') {
          customUnsubscriber()
        }
      }
    },
  } as Observer<T>
}
