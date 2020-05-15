import { Schema as NormalizrSchema } from 'normalizr'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Model } from '../../Model'
import { Relation, Dictionary } from './Relation'

export class HasOne extends Relation {
  /**
   * The foreign key of the parent model.
   */
  protected foreignKey: string

  /**
   * The local key of the parent model.
   */
  protected localKey: string

  /**
   * Create a new has-one relation instance.
   */
  constructor(
    parent: Model,
    related: Model,
    foreignKey: string,
    localKey: string
  ) {
    super(parent, related)
    this.foreignKey = foreignKey
    this.localKey = localKey
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds(): Model[] {
    return [this.related]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.one(this.related)
  }

  /**
   * Attach the relational key to the given relation.
   */
  attach(record: Element, child: Element): void {
    child[this.foreignKey] = record[this.localKey]
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query: Query, models: Collection): void {
    query.whereIn(this.foreignKey as any, this.getKeys(models, this.localKey))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation: string, models: Collection, results: Collection): void {
    const dictionary = this.buildDictionary(results)

    models.forEach((model) => {
      const key = model[this.localKey]

      dictionary[key]
        ? model.$setRelation(relation, dictionary[key][0])
        : model.$setRelation(relation, null)
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(results: Collection): Dictionary {
    return this.mapToDictionary(results, (result) => {
      return [result[this.foreignKey], result]
    })
  }

  /**
   * Make the value for the attribute.
   */
  make(_value: any): null {
    return null
  }
}
