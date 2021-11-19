import { Schema as NormalizrSchema } from 'normalizr'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Model } from '../../Model'
import { Relation } from './Relation'

export class MorphTo extends Relation {
  /**
   * The related models.
   */
  protected relatedModels: Model[]

  /**
   * The related model dictionary.
   */
  protected relatedTypes: Record<string, Model>

  /**
   * The field name that contains id of the parent model.
   */
  protected morphId: string

  /**
   * The field name that contains type of the parent model.
   */
  protected morphType: string

  /**
   * The associated key of the child model.
   */
  protected ownerKey: string

  /**
   * Create a new morph-to relation instance.
   */
  constructor(
    parent: Model,
    relatedModels: Model[],
    morphId: string,
    morphType: string,
    ownerKey: string
  ) {
    super(parent, parent)

    this.relatedModels = relatedModels
    this.relatedTypes = this.createRelatedTypes(relatedModels)

    this.morphId = morphId
    this.morphType = morphType
    this.ownerKey = ownerKey
  }

  protected createRelatedTypes(models: Model[]): Record<string, Model> {
    const types = {} as Record<string, Model>

    models.forEach((model) => {
      types[model.$entity()] = model
    })

    return types
  }

  /**
   * Get the type field name.
   */
  getType(): string {
    return this.morphType
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds(): Model[] {
    return this.relatedModels
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.union(this.relatedModels, (value, parent, _key) => {
      // Assign missing parent id since the child model is not related back
      // and `attach` will not be called.
      const type = parent[this.morphType]
      const model = this.relatedTypes[type]
      const key = this.ownerKey || (model.$getKeyName() as string)

      parent[this.morphId] = value[key]

      return type
    })
  }

  /**
   * Attach the relational key to the given record. Since morph-to relationship
   * doesn't have any foreign key, it would do nothing.
   */
  attach(_record: Element, _child: Element): void {
    return
  }

  /**
   * Since we do not know the child model ahead of time, we cannot add any
   * eager constraints.
   */
  addEagerConstraints(_query: Query, _models: Collection): void {
    return
  }

  /**
   * Execute the eager loading query.
   */
  getEager(_query: Query): Collection {
    return []
  }

  /**
   * Find and attach related children to their respective parents.
   */
  match(
    relation: string,
    models: Collection,
    _results: Collection,
    query: Query
  ): void {
    models.forEach((model) => {
      const type = model[this.morphType]
      const id = model[this.morphId]

      const related =
        type !== null && id !== null ? query.newQueryWithConstraints(type).find(id) : null

      model.$setRelation(relation, related)
    })
  }

  /**
   * Make a related model.
   */
  make(element?: Element, type?: string): Model | null {
    if (!element || !type) {
      return null
    }

    return this.relatedTypes[type].$newInstance(element)
  }
}
