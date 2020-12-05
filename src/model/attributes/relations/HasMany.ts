import { Schema as NormalizrSchema } from 'normalizr'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Model } from '../../Model'
import { Relation, Dictionary } from './Relation'

export class HasMany extends Relation {
  /**
   * Hardcoded type for introspection
   */
  readonly type: string = 'HasMany'

  /**
   * The foreign key of the parent model.
   */
  protected foreignKey: string

  /**
   * The local key of the parent model.
   */
  protected localKey: string

  /**
   * Create a new has-many relation instance.
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
    return schema.many(this.related)
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
        ? model.$setRelation(relation, dictionary[key])
        : model.$setRelation(relation, [])
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
}
