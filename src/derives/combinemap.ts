import type { Observer } from '../models'
import type { Observees, Options, Tuple } from '../types'
import { combine } from './combine'
import { map } from './map'

/**
 * Combine and map
 * @example
 * ```ts
 * const numberSubject = subjectify(1)
 * const srringSubject = subjectify("a")
 *
 * const combinedSubject = combineMap([numberSubject, srringSubject], (it) => it.toString())
 * const unsubscribe = combinedSubject.subscribe(console.log)
 *
 * numberSubject.notify(2)
 * srringSubject.notify("b")
 * ```
 * ----
 * outputs:
 * "1,a"
 * "2,a""
 * "2,b"
 */
export function combineMap<
  T extends Tuple<Observer<unknown>>,
  U extends Observees<T>,
  V
>(
  observerOrSubjects: T,
  mapper: (newValue: U, oldValue: U) => V,
  options: Options = {}
): Observer<V> {
  const c = combine(observerOrSubjects, options)
  return map(c, mapper)
}
