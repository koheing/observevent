import { describe, vi, it, expect } from 'vitest'
import { map, subjectify } from '../../src'

describe('map', () => {
  it('mappable', () => {
    const food = subjectify('apple')

    const pie = map(food, (it) => `${it} pie`)
    const sFn = vi.fn()
    const unsubscribe = pie.subscribe(sFn)
    
    food.notify('peach')
    unsubscribe()
    food.notify('berry')

    expect(sFn).toBeCalledTimes(2)
    expect(sFn).toBeCalledWith('apple pie', undefined)
    expect(sFn).toBeCalledWith('peach pie', 'apple pie')
  })
})
