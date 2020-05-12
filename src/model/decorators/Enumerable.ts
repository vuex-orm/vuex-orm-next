/**
 * Toggle an object property's enumerable configuration.
 */
export function Enumerable(value = true) {
  return <T>(target: T, prop: string) => {
    let descriptor = Object.getOwnPropertyDescriptor(target, prop) || {}

    if (descriptor.enumerable !== value) {
      descriptor.enumerable = value
      descriptor.writable = true

      Object.defineProperty(target, prop, descriptor)
    }
  }
}
