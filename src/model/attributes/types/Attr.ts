import { Type } from './Type'

export class Attr extends Type {
  /**
   * Hardcoded type for introspection
   */
  readonly type: string = 'Attr'

  /**
   * Make the value for the attribute.
   */
  make(value: any): any {
    return value === undefined ? this.value : value
  }
}
