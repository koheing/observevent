import { describe, vi, it, expect } from 'vitest'
import { select, subjectify } from '../../src'

describe('select', () => {
  it('select target', () => {
    const food = subjectify('apple')
    function isAppleOrOrange(food: string) {
      return ['apple', 'orange'].includes(food)
    }

    const appleOrOrange = select(food, isAppleOrOrange)
    const sFn = vi.fn()
    const unsubscribe = appleOrOrange.subscribe(sFn)
    
    food.notify('orange')
    food.notify('peach')
    food.notify('berry')
    unsubscribe()
    food.notify('apple')

    expect(sFn).toBeCalledTimes(2)
    expect(sFn).toBeCalledWith('apple', undefined)
    expect(sFn).toBeCalledWith('orange', 'apple')
  })

  it('select target with diff', () => {
    const food = subjectify('apple')
    function isAppleOrOrange(newValue: string) {
      return ['apple', 'orange'].includes(newValue)
    }

    const appleOrOrange = select(food, isAppleOrOrange)
    const sFn = vi.fn()
    const unsubscribe = appleOrOrange.subscribe(sFn)
    
    food.notify('orange')
    food.notify('peach')
    food.notify('berry')
    unsubscribe()
    food.notify('apple')

    expect(sFn).toBeCalledTimes(2)
    expect(sFn).toBeCalledWith('apple', undefined)
    expect(sFn).toBeCalledWith('orange', 'apple')
  })
})
