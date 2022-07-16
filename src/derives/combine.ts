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
  T extends Tuple<Observer<unknown, boolean>>,
  U extends Observees<T>,
  V extends boolean = false
>(observerOrSubjects: T, options: Options<V> = {}) {
  const state = [] as unknown as U
  state.length = observerOrSubjects.length
  const store = subjectify<U, V>(state, options)
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
    subscribe(subscriber: Subscriber<U, V>): Unsubscriber {
      store.subscribe(subscriber as Subscriber<U, boolean>)
      return () => {
        unsubscribers.forEach((it) => it())
      }
    },
    get diff(): boolean {
      return options.diff ?? false
    },
  } as unknown as V extends true ? Observer<U, true> : Observer<U, false>
}
