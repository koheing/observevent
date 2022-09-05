import { expect, describe, it, vi } from 'vitest'
import { observify } from '../src'
import EventEmitter from 'events'

describe('observify', () => {
  it('observable', () => {
    const emitter = new EventEmitter()

    const observer = observify(1, (trigger) => {
      emitter.on('value', trigger)
    })

    const sFn1 = vi.fn()
    const unsubscribe = observer.subscribe(sFn1)
    emitter.emit('value', 2)

    unsubscribe()
    emitter.emit('value', 2)

    expect(sFn1).toBeCalledTimes(2)
    expect(sFn1).toBeCalledWith(1, undefined)
    expect(sFn1).toBeCalledWith(2, 1)
  })

  it('unsubscriber called on no subscribers', () => {
    const emitter = new EventEmitter()
    const listener = vi.spyOn(emitter, 'removeAllListeners')

    const observer = observify(1, (trigger) => {
      emitter.on('value', trigger)
      return () => emitter.removeAllListeners('value')
    })

    const sFn1 = vi.fn()
    const sFn2 = vi.fn()
    const unsubscribe1 = observer.subscribe(sFn1)
    const unsubscribe2 = observer.subscribe(sFn2)
    emitter.emit('value', 2)
    unsubscribe1()

    emitter.emit('value', 3)
    unsubscribe2()

    expect(listener).toBeCalledTimes(1)

    expect(sFn1).toBeCalledTimes(2)
    expect(sFn1).toBeCalledWith(1, undefined)
    expect(sFn1).toBeCalledWith(2, 1)

    expect(sFn2).toBeCalledTimes(3)
    expect(sFn2).toBeCalledWith(1, undefined)
    expect(sFn2).toBeCalledWith(2, 1)
    expect(sFn2).toBeCalledWith(3, 2)
  })
})
