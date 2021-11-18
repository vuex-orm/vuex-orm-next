import { Schema as NormalizrSchema } from 'normalizr'
import { assert } from '../../../support/Utils'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Database } from '../../../database/Database'
import { Model } from '../../Model'
import { NonEnumerable } from '../../decorators/NonEnumerable'
import { Relation } from './Relation'
import { schema as Normalizr } from 'normalizr'

export class MorphTo extends Relation {
  /**
   * The database instance.
   */
  @NonEnumerable
  private _database!: Database

  /**
   * The field contains all related models.
   */
  private _relatedModels: Model[]

  /**
   * The field contains all the related schemas.
   */
  private _relatedSchemas: Record<string, Normalizr.Entity> = {}

  /**
   * The field contains all related types.
   */
  private _relatedTypes: Record<string, Model> = {}

  /**
   * The field contains all related queries.
   */
  private _relatedQueries: Record<string, Query> = {}

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
    _relatedModels: Model[],
    morphId: string,
    morphType: string,
    ownerKey: string
  ) {
    super(parent, parent)
    this._relatedModels = _relatedModels
    this.morphId = morphId
    this.morphType = morphType
    this.ownerKey = ownerKey
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds(): Model[] {
    return this._relatedModels
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.union(this._relatedSchemas, (_value, parentValue, _key) => {
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
    })
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
        related = this._relatedQueries[type].find(id)
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

    return this._relatedTypes[type].$newInstance(element)
  }

  /**
   * Set the database instance.
   */
  setDatabase(database: Database): this {
    this._database = database

    // Init related models
    if (Object.keys(this._relatedSchemas).length < 1) {
      this.$initRelated()
    }

    return this
  }

  /**
   * Get the type field name.
   */
  getType(): string {
    return this.morphType
  }

  /**
   * Get the database instance.
   */
  private $database(): Database {
    assert(this._database !== undefined, [
      'A Vuex Store instance is not injected into the inverse polymorphic relation instance.'
    ])

    return this._database
  }

  /**
   * Init new related model.
   */
  private $initNewRelated(model: Model): void {
    if (model) {
      const type = model.$entity()
      const schema = this.$database().schemas[type]

      this._relatedTypes[type] = model
      this._relatedQueries[type] = new Query(this.$database(), model)
      if (schema) {
        this._relatedSchemas[type] = schema
      }
    }
  }

  /**
   * Check if related model is new
   */
   private $isNewRelated(type: string): boolean {
    return !Object.keys(this._relatedSchemas).includes(type)
  }

  /**
   * Add related model if new.
   */
   private $addNewRelated(model: Model): void {
    if (model) {
      if (!this._relatedModels.includes(model)) {
        this._relatedModels.push(model)
      }
      this.$initNewRelated(model)
    }
  }

  /**
   * Initialize related models.
   */
   private $initRelated(): void {
    this._relatedModels.forEach((model) => {
      this.$initNewRelated(model)
    })
  }

  /**
   * Get related model using a provided type.
   */
   private $getRelatedModel(type: string): Model {
    return this.$database().getModel(type)
  }
}
