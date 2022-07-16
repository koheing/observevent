import type { Observer } from '../models'
import type { Observees, Options, Tuple, Value } from '../types'
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
  T extends Tuple<Observer<unknown, boolean>>,
  U extends Observees<T>,
  V,
  W extends boolean = false
>(
  observerOrSubjects: T,
  mapper: (values: Value<U, W>) => V,
  options: Options<W> = {}
): Observer<V, W> {
  const c = combine(observerOrSubjects, options) as Observer<U, W>
  return map<U, W, V>(c, mapper)
}
