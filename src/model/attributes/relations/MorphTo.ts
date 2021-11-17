import { Schema as NormalizrSchema } from 'normalizr'
import { assert } from '../../../support/Utils'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Database } from '../../../database/Database'
import { Model } from '../../Model'
import { NonEnumerable } from '../../decorators/NonEnumerable'
import { Relation } from './Relation'

export class MorphTo extends Relation {
  /**
   * The database instance.
   */
  @NonEnumerable
  protected _database!: Database

  /**
   * The field contains all related types.
   */
  protected relatedTypes: string[]

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
    morphId: string,
    morphType: string,
    ownerKey: string
  ) {
    super(parent, parent)
    this.morphId = morphId
    this.morphType = morphType
    this.ownerKey = ownerKey
    this.relatedTypes = []
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds(): Model[] {
    return this.relatedTypes.map((type) => this.$getRelatedModel(type))
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.union(
      this.$database().schemas,
      (_value, parentValue, _key) => {
        // HACK: Assign missing parent id since the child model is not related back and `attach` will not be called
        const type: string = parentValue[this.morphType]
        const model: Model = this.$getRelatedModel(type)
        const key: string = this.ownerKey || (model.$getKeyName() as string)
        parentValue[this.morphId] = _value[key as string]

        this.$addNewRelatedType(type)

        return type
      }
    )
  }

  /**
   * Attach the relational key to the given record. Since morph to
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach(_record: Element, _child: Element): void {
    return
  }

  /**
   * Since we do not know the child model ahead of time, we cannot add any eager constraints.
   */
  addEagerConstraints(_query: Query, _models: Collection): void {
    return
  }

  /**
   * Match the eagerly loaded results to their respective parents.
   */
  match(relation: string, models: Collection, _results: Collection): void {
    // Gather relations
    models.forEach((model) => {
      this.$addNewRelatedType(model[this.morphType])
    })

    // Set relation queries
    const relations = {} as Record<string, Query>
    this.relatedTypes.forEach((type) => {
      relations[type] = new Query(this.$database(), this.$getRelatedModel(type))
    })

    // Find & attach related data
    models.forEach((model) => {
      let related
      const type = model[this.morphType]
      const id = model[this.morphId]

      if (type && id) {
        related = relations[type].find(id)
      }

      related
        ? model.$setRelation(relation, related)
        : model.$setRelation(relation, null)
    })
  }

  /**
   * Make a related model.
   */
  make(element?: Element, type?: string): Model | null {
    if (!element || !type) {
      return null
    }

    return this.$getRelatedModel(type).$newInstance(element)
  }

  /**
   * Get the database instance.
   */
  $database(): Database {
    assert(this._database !== undefined, [
      'A Vuex Store instance is not injected into the inverse polymorphic relation instance.'
    ])

    return this._database
  }

  /**
   * Set the database instance.
   */
  $setDatabase(database: Database): this {
    this._database = database

    return this
  }

  /**
   * Get the type field name.
   */
  $getType(): string {
    return this.morphType
  }

  /**
   * Get related model using a provided type.
   */
  protected $getRelatedModel(type: string): Model {
    return this.$database().getModel(type)
  }

  /**
   * Push related type if new.
   */
  protected $addNewRelatedType(type: string): void {
    if (type && !this.relatedTypes.includes(type)) {
      this.relatedTypes.push(type)
    }
  }
}
