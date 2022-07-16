import { describe, vi, it, expect } from 'vitest'
import { combineMap, subjectify } from '../../src'

describe('conbineMap', () => {
  it('combine-mappable', () => {
    const food = subjectify('apple')
    const kind = subjectify('pie')

    const character = combineMap([food, kind], (it) => ({ food: it[0], kind: it[1] }))
    const sFn = vi.fn()
    const unsubscribe = character.subscribe(sFn)
    food.notify(`meat`)
    unsubscribe()
    food.notify('apple')

    expect(sFn).toBeCalledTimes(2)
    expect(sFn).toBeCalledWith({ food: 'apple', kind: 'pie' })
    expect(sFn).toBeCalledWith({ food: 'meat', kind: `pie` })
  })
})
