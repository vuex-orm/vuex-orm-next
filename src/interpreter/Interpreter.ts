import { normalize, schema as Normalizr } from 'normalizr'
import { Store } from 'vuex'
import { isArray, isEmpty } from '../support/Utils'
import { Element, NormalizedData } from '../data/Data'
import { Model } from '../model/Model'

export class Interpreter<M extends Model> {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The model object.
   */
  model: M

  /**
   * Create a new Interpreter instance.
   */
  constructor(store: Store<any>, model: M) {
    this.store = store
    this.model = model
  }

  /**
   * Perform interpretation for the given data and return normalized schema.
   */
  processRecord(data: Element | Element[]) {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema()

    return normalize(data, schema)
  }

  /**
   * Perform interpretation for the given data.
   */
  process(data: Element | Element[]): NormalizedData {
    return isEmpty(data) ? {} : this.normalize(data)
  }

  /**
   * Normalize the given data.
   */
  private normalize(data: Element | Element[]): NormalizedData {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema()

    return normalize(data, schema).entities as NormalizedData
  }

  /**
   * Get the schema from the database.
   */
  private getSchema(): Normalizr.Entity {
    return this.store.$database.getSchema(this.model.$entity())
  }
}
