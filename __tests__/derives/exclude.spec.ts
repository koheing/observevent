import { describe, vi, it, expect } from 'vitest'
import { exclude, subjectify } from '../../src'

describe('exclude', () => {
  it('exclude target', () => {
    const food = subjectify('apple')
    function isAppleOrOrange(food: string) {
      return ['apple', 'orange'].includes(food)
    }

    const appleOrOrange = exclude(food, isAppleOrOrange)
    const sFn = vi.fn()
    const unsubscribe = appleOrOrange.subscribe(sFn)
    
    food.notify('orange')
    food.notify('peach')
    food.notify('berry')
    unsubscribe()
    food.notify('apple')

    expect(sFn).toBeCalledTimes(2)
    expect(sFn).toBeCalledWith('peach', undefined)
    expect(sFn).toBeCalledWith('berry', 'peach')
  })

  it('exclude target with diff', () => {
    const food = subjectify('apple')
    function isAppleOrOrange(newValue: string) {
      return ['apple', 'orange'].includes(newValue)
    }

    const appleOrOrange = exclude(food, isAppleOrOrange)
    const sFn = vi.fn()
    const unsubscribe = appleOrOrange.subscribe(sFn)
    
    food.notify('orange')
    food.notify('peach')
    food.notify('berry')
    unsubscribe()
    food.notify('apple')

    expect(sFn).toBeCalledTimes(2)
    expect(sFn).toBeCalledWith('peach', undefined)
    expect(sFn).toBeCalledWith('berry', 'peach')
  })
})
