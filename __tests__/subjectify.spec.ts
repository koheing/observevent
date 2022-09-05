import { expect, describe, it, vi } from 'vitest'
import { subjectify } from '../src'

describe('subjectify', () => {
  it('subscribable', () => {
    const subject = subjectify(1)

    const sFn1 = vi.fn()
    const sFn2 = vi.fn()
    const unsubscribe1 = subject.subscribe(sFn1)
    const unsubscribe2 = subject.subscribe(sFn2)

    expect(subject.subscribed).toBeTruthy()

    subject.notify((it) => it + 1)

    unsubscribe1()

    subject.notify(3)

    unsubscribe2()

    expect(sFn1).toBeCalledTimes(2)
    expect(sFn1).toBeCalledWith(1, undefined)
    expect(sFn1).toBeCalledWith(2, 1)

    expect(sFn2).toBeCalledTimes(3)
    expect(sFn2).toBeCalledWith(1, undefined)
    expect(sFn2).toBeCalledWith(2, 1)
    expect(sFn2).toBeCalledWith(3, 2)

    expect(subject.subscribed).toBeFalsy()
  })

  it('loggingable', () => {
    const logger = {
      info: vi.fn(),
    }
    const subject = subjectify(1, { logging: true, logger })

    const sFn1 = vi.fn()
    const unsubscribe = subject.subscribe(sFn1)

    subject.notify((it) => it + 1)
    subject.notify(3)

    unsubscribe()

    expect(logger.info).toBeCalledTimes(2)
    expect(logger.info).toBeCalledWith({ before: 1, after: 2 })
    expect(logger.info).toBeCalledWith({ before: 2, after: 3 })
  })

  it('immediatable', () => {
    const subject = subjectify(1, { immediate: false })

    subject.notify((it) => it + 1)
    const sFn1 = vi.fn()
    const unsubscribe = subject.subscribe(sFn1)
    subject.notify(3)

    unsubscribe()

    expect(sFn1).toBeCalledTimes(1)
    expect(sFn1).toBeCalledWith(3, 2)
  })
})
