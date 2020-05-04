export type EventArgs<T> = T extends any[] ? T : never

export type EventListener<T, K extends keyof T> = (
  ...args: EventArgs<T[K]>
) => void

export type EventRegistry<T> = {
  [K in keyof T]?: EventListener<T, K>[]
}

/**
 * Events class for listening to and emitting of events.
 * @public
 */
export class Events<T> {
  /**
   * The registry for listeners.
   */
  listeners: EventRegistry<T>

  /**
   * Creates an Events instance.
   */
  constructor() {
    this.listeners = Object.create(null)
  }

  /**
   * Register a handler for a specific event.
   * @returns a function that, when called, will unregister the handler.
   */
  on<K extends keyof T>(type: K, callback: EventListener<T, K>): () => void {
    if (!type || typeof callback !== 'function') {
      return () => {}
    }

    ;(this.listeners[type] = this.listeners[type]! || []).push(callback)

    return () => {
      if (callback) {
        this.off(type, callback)
        ;(callback as any) = null
      }
    }
  }

  /**
   * Register a self-removing handler for a specific event.
   * @returns a function that, when called, will self-execute and unregister the handler.
   */
  once<K extends keyof T>(
    type: K,
    callback: EventListener<T, K>
  ): EventListener<T, K> {
    const fn = (...args: EventArgs<T[K]>) => {
      this.off(type, fn)

      return callback(...args)
    }

    this.on(type, fn)

    return fn
  }

  /**
   * Unregister a handler for a specific event.
   */
  off<K extends keyof T>(type: K, callback: EventListener<T, K>): void {
    const list = this.listeners[type]

    if (!list) {
      return
    }

    const i = list.indexOf(callback)

    i > -1 && list.splice(i, 1)

    !list.length && delete this.listeners[type]
  }

  /**
   * Remove all handlers for a specific event.
   */
  flush<K extends keyof T>(type: K): void {
    type && this.listeners[type] && delete this.listeners[type]
  }
}
