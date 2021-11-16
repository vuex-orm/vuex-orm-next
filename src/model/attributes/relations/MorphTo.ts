import { Schema as NormalizrSchema } from 'normalizr'
import { assert } from '../../../support/Utils'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Database } from '../../../database/Database'
import { Model } from '../../Model'
import { NonEnumerable } from '../../decorators/NonEnumerable'
import { Relation, Dictionary } from './Relation'

export class MorphTo extends Relation {
  /**
   * The database instance.
   */
  @NonEnumerable
  protected _database!: Database

  /**
   * The field name that contains id of the parent model.
   */
  protected id: string

  /**
   * The field name that contains type of the parent model.
   */
  protected type: string

  /**
   * The associated key on the child model. TODO: potentially refactor
   */
  protected ownerKey: string

  /**
   * The field contains all related types
   */
  protected relatedTypes: string[]

  /**
   * Create a new morph-to relation instance.
   */
  constructor(parent: Model, id: string, type: string, ownerKey: string) {
    super(parent, parent)
    this.id = id
    this.type = type
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
        const type: string = parentValue[this.type]
        const model: Model = this.$getRelatedModel(type)
        const key: string = this.ownerKey || (model.$getKeyName() as string)
        parentValue[this.id] = _value[key as string]

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
   * HACK: Using the following method to query other entities for related data. The data is joined on a temporary key
   * `morphToRelated`.
   */
  addEagerConstraints(_query: Query, models: Collection): void {
    // Gather relations
    models.forEach((model) => {
      this.$addNewRelatedType(model[this.type])
    })

    // Set relation queries
    const relations = {} as Record<string, Query>
    this.relatedTypes.forEach((type) => {
      relations[type] = new Query(this.$database(), this.$getRelatedModel(type))
    })

    // Find & attach related data
    models.forEach((model) => {
      const type = model[this.type]
      const id = model[this.id]

      if (type && id) {
        model['morphToRelated'] = relations[type].find(id)
      }
    })
  }

  /**
   * Match the eagerly loaded results to their respective parents.
   */
  match(relation: string, models: Collection, _results: Collection): void {
    models.forEach((model) => {
      model['morphToRelated']
        ? model.$setRelation(relation, model['morphToRelated']) &&
          delete model['morphToRelated']
        : model.$setRelation(relation, null)
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(results: Collection): Dictionary {
    return this.mapToDictionary(results, (result) => {
      return [result[this.id], result]
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
    return this.type
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
