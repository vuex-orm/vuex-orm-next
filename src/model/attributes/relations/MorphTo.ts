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
   * The field contains all related models.
   */
  protected relatedModels: Model[]

  /**
   * The field contains all related types.
   */
  protected relatedTypes: Record<string, Model>

  /**
   * The field contains all related types.
   */
  protected relatedQueries: Record<string, Query>

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
    this.morphId = morphId
    this.morphType = morphType
    this.ownerKey = ownerKey
    this.relatedTypes = {}
    this.relatedQueries = {}
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
    return schema.union(
      this.$database().schemas,
      (_value, parentValue, _key) => {
        // HACK: Assign missing parent id since the child model is not related back and `attach` will not be called
        const type: string = parentValue[this.morphType]
        const model: Model = this.$getRelatedModel(type)
        const key: string = this.ownerKey || (model.$getKeyName() as string)
        parentValue[this.morphId] = _value[key as string]

        // Add new related model
        if (this.$isNewRelated(type)) {
          this.$addNewRelated(model)
        }

        return type
      }
    )
  }

  /**
   * Attach the relational key to the given record. Since morph-to
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
   * Find and attach related children to their respective parents.
   */
  match(relation: string, models: Collection, _results: Collection): void {
    models.forEach((model) => {
      let related
      const type = model[this.morphType]
      const id = model[this.morphId]

      // Add new related model
      if (this.$isNewRelated(type)) {
        this.$addNewRelated(this.$getRelatedModel(type))
      }

      if (type && id) {
        related = this.relatedQueries[type].find(id)
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

    return this.relatedTypes[type].$newInstance(element)
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

    // Init related models
    if (Object.keys(this.relatedTypes).length < 1) {
      this.$initRelated()
    }

    return this
  }

  /**
   * Get the type field name.
   */
  $getType(): string {
    return this.morphType
  }

  /**
   * Init new related model.
   */
  protected $initNewRelated(model: Model): void {
    if (model) {
      const type = model.$entity()
      this.relatedTypes[type] = model
      this.relatedQueries[type] = new Query(this.$database(), model)
    }
  }

  /**
   * Check if related model is new
   */
  protected $isNewRelated(type: string): boolean {
    return !Object.keys(this.relatedTypes).includes(type)
  }

  /**
   * Add related model if new.
   */
  protected $addNewRelated(model: Model): void {
    if (model) {
      this.relatedModels.push(model)
      this.$initNewRelated(model)
    }
  }

  /**
   * Initialize related models.
   */
  protected $initRelated(): void {
    this.relatedModels.forEach((model) => {
      this.$initNewRelated(model)
    })
  }

  /**
   * Get related model using a provided type.
   */
  protected $getRelatedModel(type: string): Model {
    return this.$database().getModel(type)
  }
}
