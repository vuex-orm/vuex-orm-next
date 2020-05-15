import { PropertyDecorator } from '../../Contracts'

/**
 * Create a Uid attribute property decorator.
 */
export function Uid(): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () => target.$self.uid())
  }
}
