import { Events } from '@/hookable/Events'

describe('unit/events/Events', () => {
  interface TEvents {
    test: [boolean]
    trial: [string]
  }

  it('can register event subscribers', () => {
    const events = new Events<TEvents>()

    const spy = jest.fn()

    events.on('test', spy)

    expect(events.subscribers).toHaveProperty('test')
    expect(events.subscribers.test).toHaveLength(1)
    expect(events.subscribers.test).toEqual([spy])
  })

  it('can ignore empty event names', () => {
    const events = new Events<TEvents>()

    ;[0, '', null, undefined].forEach((e) => {
      events.on(e as any, () => {})
    })

    expect(events.subscribers).toEqual({})
  })

  it('can ignore non-function handlers', () => {
    const events = new Events<TEvents>()

    ;[0, '', null, undefined].forEach((e) => {
      const cb = events.on('test', e as any)
      cb()
    })

    expect(events.subscribers).toEqual({})
  })

  it('can emit events', () => {
    const events = new Events<TEvents>()

    const spy = jest.fn()

    events.on('test', spy)
    events.emit('test', true)

    events.off('test', spy)
    events.emit('test', false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(true)
    expect(events.subscribers).toEqual({})
  })

  it('can noop when removing unknown subscribers', () => {
    const events = new Events<TEvents>()

    const spy1 = jest.fn()
    const spy2 = jest.fn()

    expect(events.subscribers.test).toBeUndefined()

    events.off('test', spy1)

    expect(events.subscribers.test).toBeUndefined()

    events.on('test', spy2)
    events.off('test', spy1)

    expect(events.subscribers.test).toEqual([spy2])
  })

  it('can unsubscribe itself', () => {
    const events = new Events<TEvents>()

    const spy = jest.fn()

    events.on('test', spy)
    const unsub = events.on('test', spy)

    expect(events.subscribers.test).toHaveLength(2)

    unsub()
    unsub()

    expect(events.subscribers.test).toHaveLength(1)
    expect(events.subscribers.test).toEqual([spy])
  })

  it('can flush event subscribers', () => {
    const events = new Events<TEvents>()

    const spy = jest.fn()

    events.on('test', spy)
    events.on('trial', spy)
    events.on('test', spy)

    expect(events.subscribers.test).toHaveLength(2)
    expect(events.subscribers.trial).toHaveLength(1)

    events.flush('test')

    expect(events.subscribers.test).toBeUndefined()
    expect(events.subscribers.trial).toHaveLength(1)
  })

  it('can subscribe one-time handlers', () => {
    const events = new Events<TEvents>()

    const spy1 = jest.fn()
    const spy2 = jest.fn()

    events.once('test', spy1)
    events.on('test', spy2)

    expect(events.subscribers.test).toHaveLength(2)

    events.emit('test', true)
    events.emit('test', false)

    expect(events.subscribers.test).toHaveLength(1)
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy1).toHaveBeenCalledWith(true)
    expect(spy2).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenLastCalledWith(false)
  })

  it('can unsubscribe itself within its own handler', () => {
    const events = new Events<TEvents>()

    const log = jest.spyOn(global.console, 'log').mockImplementation()
    const spy = jest.fn()

    const unsub = events.on('test', (bool) => {
      console.log(bool)
      unsub()
    })

    events.on('test', spy)
    events.once('test', spy)

    expect(events.subscribers.test).toHaveLength(3)

    events.emit('test', true)

    expect(events.subscribers.test).toHaveLength(1)
    expect(log).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith(true)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledWith(true)

    log.mockRestore()
  })
})
