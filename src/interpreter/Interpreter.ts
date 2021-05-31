import { normalize, schema as Normalizr } from 'normalizr'
import { isArray } from '../support/Utils'
import { Element, NormalizedData } from '../data/Data'
import { Model } from '../model/Model'
import { Database } from '@/database/Database'

export class Interpreter {
  /**
   * The database instance.
   */
  database: Database

  /**
   * The model object.
   */
  model: Model

  /**
   * Create a new Interpreter instance.
   */
  constructor(database: Database, model: Model) {
    this.database = database
    this.model = model
  }

  /**
   * Perform interpretation for the given data.
   */
  process(data: Element): [Element, NormalizedData]
  process(data: Element[]): [Element[], NormalizedData]
  process(data: Element | Element[]): [Element | Element[], NormalizedData] {
    const normalizedData = this.normalize(data)

    return [data, normalizedData]
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
