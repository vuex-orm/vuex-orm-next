import { Schema as NormalizrSchema } from 'normalizr'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Model } from '../../Model'
import { Relation } from './Relation'

export class BelongsTo extends Relation {
  /**
   * The child model instance of the relation.
   */
  protected child: Model

  /**
   * The foreign key of the parent model.
   */
  protected foreignKey: string

  /**
   * The associated key on the parent model.
   */
  protected ownerKey: string

  /**
   * Create a new belongs-to relation instance.
   */
  constructor(
    parent: Model,
    child: Model,
    foreignKey: string,
    ownerKey: string
  ) {
    super(parent, child)
    this.foreignKey = foreignKey
    this.ownerKey = ownerKey

    // In the underlying base relation class, this property is referred to as
    // the "parent" as most relations are not inversed. But, since this
    // one is, we will create a "child" property for improved readability.
    this.child = child
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds(): Model[] {
    return [this.child]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.one(this.child, this.parent)
  }

  /**
   * Attach the relational key to the given relation.
   */
  attach(record: Element, child: Element): void {
    record[this.foreignKey] = child[this.ownerKey]
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query: Query, models: Collection): void {
    query.whereIn(this.ownerKey, this.getEagerModelKeys(models))
  }

  /**
   * Gather the keys from a collection of related models.
   */
  protected getEagerModelKeys(models: Collection): (string | number)[] {
    return models.reduce<(string | number)[]>((keys, model) => {
      if (model[this.foreignKey] !== null) {
        keys.push(model[this.foreignKey])
      }

      return keys
    }, [])
  }

  /**
   * Match the eagerly loaded results to their respective parents.
   */
  match(relation: string, models: Collection, results: Collection): void {
    const dictionary = results.reduce<Record<string, Model>>((dic, result) => {
      dic[result[this.ownerKey]] = result

      return dic
    }, {})

    models.forEach((model) => {
      dictionary[model[this.foreignKey]]
        ? model.$setRelation(relation, dictionary[model[this.foreignKey]])
        : model.$setRelation(relation, null)
    })
  }

  /**
   * Make a related model.
   */
  make(element?: Element): Model | null {
    return element ? this.child.$newInstance(element) : null
  }
}
