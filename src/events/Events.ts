/**
 * Event subscriber args.
 */
export type EventArgs<T> = T extends any[] ? T : never

/**
 * Event subscriber handler.
 */
export type EventListener<T, K extends keyof T> = (
  ...args: EventArgs<T[K]>
) => void

/**
 * Event subscriber registry.
 */
export type EventRegistry<T> = {
  [K in keyof T]?: EventListener<T, K>[]
}

/**
 * Events class for subscribing to and emitting of events.
 * @public
 */
export class Events<T> {
  /**
   * The registry for event listeners.
   */
  subscribers: EventRegistry<T> = Object.create(null)

  /**
   * Register a handler for a specific event.
   * @returns a function that, when called, will unregister the handler.
   */
  on<K extends keyof T>(name: K, fn: EventListener<T, K>): () => void {
    if (!name || typeof fn !== 'function') {
      return () => {}
    }

    ;(this.subscribers[name] = this.subscribers[name]! || []).push(fn)

    return () => {
      if (fn) {
        this.off(name, fn)
        ;(fn as any) = null
      }
    }
  }

  /**
   * Register a self-removing handler for a specific event.
   * @returns a function that, when called, will self-execute and unregister the handler.
   */
  once<K extends keyof T>(
    name: K,
    fn: EventListener<T, K>
  ): EventListener<T, K> {
    const callback = (...args: EventArgs<T[K]>) => {
      this.off(name, callback)

      return fn(...args)
    }

    this.on(name, callback)

    return callback
  }

  /**
   * Unregister a handler for a specific event.
   */
  off<K extends keyof T>(name: K, fn: EventListener<T, K>): void {
    const subs = this.subscribers[name]

    if (!subs) {
      return
    }

    const i = subs.indexOf(fn)

    i > -1 && subs.splice(i, 1)

    !subs.length && delete this.subscribers[name]
  }

  /**
   * Remove all handlers for a specific event.
   */
  flush<K extends keyof T>(name: K): void {
    name && this.subscribers[name] && delete this.subscribers[name]
  }

  /**
   * Call all handlers for a specific event with the specified args(?).
   */
  emit<K extends keyof T>(name: K, ...args: EventArgs<T[K]>) {
    const subs = this.subscribers[name]

    if (!subs) {
      return
    }

    subs.slice().forEach((fn) => fn(...args))
  }
}
