import { describe, vi, it, expect } from 'vitest'
import { diff, subjectify } from '../../src'

describe('diff', () => {
  it('diff target', () => {
    const food = subjectify('apple')

    const foodDiff = diff(food)
    const sFn = vi.fn()
    const unsubscribe = foodDiff.subscribe(sFn)
    
    food.notify('orange')
    unsubscribe()
    food.notify('peach')

    expect(sFn).toBeCalledTimes(2)
    expect(sFn).toBeCalledWith(['apple', undefined])
    expect(sFn).toBeCalledWith(['orange', 'apple'])
  })
})
