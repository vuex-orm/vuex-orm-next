import { PropertyDecorator } from '../../Contracts'

/**
 * Create a morph-to attribute property decorator.
 */
export function MorphTo(
  id: string,
  type: string,
  localKey?: string
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => self.morphTo(id, type, localKey))
  }
}
