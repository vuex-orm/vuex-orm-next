import { Model } from '../../../Model'
import { PropertyDecorator } from '../../Contracts'

/**
 * Create a morph-one attribute property decorator.
 */
export function MorphOne(
  related: () => typeof Model,
  foreignKey: string,
  localKey?: string
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.morphOne(related(), foreignKey, localKey)
    )
  }
}
