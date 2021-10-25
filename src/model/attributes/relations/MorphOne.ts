import { Schema as NormalizrSchema } from 'normalizr'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Model } from '../../Model'
import { Relation, Dictionary } from './Relation'

export class MorphOne extends Relation {
  /**
   * The field name that contains id of the parent model.
   */
  protected id: string

  /**
   * The field name that contains type of the parent model.
   */
  protected type: string

  /**
   * The local key of the parent model.
   */
  protected localKey: string

  /**
   * Create a new morph-one relation instance.
   */
  constructor(
    parent: Model,
    related: Model,
    id: string,
    type: string,
    localKey: string
  ) {
    super(parent, related)
    this.id = id
    this.type = type
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
    return schema.one(this.related, this.parent)
  }

  /**
   * Attach the relational key to the given relation.
   */
  attach(record: Element, child: Element): void {
    child[this.id] = record[this.localKey]
    child[this.type] = this.parent.$entity()
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query: Query, models: Collection): void {
    query.where(this.type as any, this.parent.$entity())
    query.whereIn(this.id as any, this.getKeys(models, this.localKey))
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
   * Build model dictionary keyed by the relation's relational key.
   */
  protected buildDictionary(results: Collection): Dictionary {
    return this.mapToDictionary(results, (result) => {
      return [result[this.id], result]
    })
  }

  /**
   * Make a related model.
   */
  make(element?: Element): Model | null {
    return element ? this.related.$newInstance(element) : null
  }
}
