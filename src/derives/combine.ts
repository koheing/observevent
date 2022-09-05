import type { Observer } from '../models'
import { subjectify } from '../subjectify'
import type {
  Tuple,
  Observees,
  Options,
  Unsubscriber,
  Subscriber,
} from '../types'

/**
 * Combine subject or observer
 * @example
 * ```ts
 * const numberSubject = subjectify(1)
 * const srringSubject = subjectify("a")
 *
 * const combinedSubject = combine([numberSubject, srringSubject])
 * const unsubscribe = combinedSubject.subscribe(console.log)
 *
 * numberSubject.notify(2)
 * srringSubject.notify("b")
 *
 * unsubscribe()
 * ```
 * output:
 * [1,"a"]
 * [2,"a"]
 * [2,"b"]
 */
export function combine<
  T extends Tuple<Observer<unknown>>,
  U extends Observees<T>
>(observerOrSubjects: T, options: Options = {}) {
  const state = [] as unknown as U
  const store = subjectify<U>(state, options)
  const unsubscribers: Unsubscriber[] = []

  observerOrSubjects.forEach((it, index) => {
    unsubscribers.push(
      it.subscribe((value) => {
        state[index] = value
        store.notify([...state])
      })
    )
  })

  return {
    subscribe(subscriber: Subscriber<U>): Unsubscriber {
      store.subscribe(subscriber)
      return () => {
        unsubscribers.forEach((it) => it())
      }
    },
  } as Observer<U>
}
