import { describe, vi, it, expect } from 'vitest'
import { combine, subjectify } from '../../src'

describe('combine', () => {
  it('combinable', () => {
    const food = subjectify('apple')
    const count = subjectify<number | null>(1)

    const character = combine([food, count])
    const sFn = vi.fn()
    const unsubscribe = character.subscribe(sFn)
    count.notify(2)
    count.notify(null)

    unsubscribe()

    expect(sFn).toBeCalledTimes(3)
    expect(sFn).toBeCalledWith(['apple', 1], undefined)
    expect(sFn).toBeCalledWith(['apple', 2], ['apple', 1])
    expect(sFn).toBeCalledWith(['apple', null], ['apple', 2])
  })
})
