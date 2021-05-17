import { normalize, schema as Normalizr } from 'normalizr'
import { isArray, isEmpty } from '../support/Utils'
import { Element, NormalizedData } from '../data/Data'
import { Model } from '../model/Model'
import { Database } from '@/database/Database'

export class Interpreter<M extends Model> {
  /**
   * The database instance.
   */
  database: Database

  /**
   * The model object.
   */
  model: M

  /**
   * Create a new Interpreter instance.
   */
  constructor(database: Database, model: M) {
    this.database = database
    this.model = model
  }

  /**
   * Perform interpretation for the given data and return normalized schema.
   */
  processRecord(data: Element[]): [Element[], NormalizedData]
  processRecord(data: Element): [Element, NormalizedData]
  processRecord(
    data: Element | Element[]
  ): [Element | Element[], NormalizedData] {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema()

    const normalizedData = normalize(data, schema).entities as NormalizedData

    return [data, normalizedData]
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
    return this.database.getSchema(this.model.$entity())
  }
}
