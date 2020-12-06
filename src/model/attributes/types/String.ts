import { Model } from '../../Model'
import { Type } from './Type'

export class String extends Type {
  /**
   * Hardcoded type for introspection
   */
  readonly type: string = 'String'

  /**
   * Create a new String attribute instance.
   */
  constructor(model: Model, value: string | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): string | null {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'string') {
      return value
    }

    if (value === null && this.isNullable) {
      return value
    }

    return value + ''
  }
}
