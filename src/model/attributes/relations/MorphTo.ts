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
   * The local key of the parent model.
   */
  protected localKey: string

  /**
   * Create a new morph-to relation instance.
   */
  constructor(parent: Model, id: string, type: string, localKey: string) {
    super(parent, parent)
    this.id = id
    this.type = type
    this.localKey = localKey
  }

  /**
   * Get all related models for the relationship. TODO
   */
  getRelateds(): Model[] {
    return [this.parent]
  }

  /**
   * Define the normalizr schema for the relation. TODO
   */
  define(schema: Schema): NormalizrSchema {
    //console.log('define, database', this._database);
    //console.log('type', this.type)
    //console.log('define, schema', schema)
    const s = schema.union(
      this._database.schemas,
      (_value, parentValue, _key) => {
        console.log('_value', _value)
        console.log('parentValue', parentValue)
        console.log('_key', _key)
        console.log('parentValue[this.type]', parentValue[this.type])
        // HACK: Assign missing parent id since the child model is not related back and `attach` will not be called
        parentValue[this.id] = _value[this.localKey]
        return parentValue[this.type]
      }
    )

    //console.log('define returned schema', s)
    return s

    //return schema.union((_value, parentValue) => parentValue[this.type])
  }

  /**
   * Attach the relational key to the given record. Since morph to
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach(record: Element, child: Element): void {
    console.log('record', record)
    console.log('child', child)
    child[this.id] = record[this.localKey]
  }

  /**
   * HACK: Using the following method to query other entities for related data. The data is joined on a temporary key
   * `morphToRelated`.
   */
  addEagerConstraints(query: Query, models: Collection): void {
    //console.log('addEagerConstraints query', query)
    //console.log('addEagerConstraints models', models)
    const database = query.database
    //console.log('types', types)

    // Gather relations
    const relatedTypes = {}
    models.forEach((model) => {
      const type = model[this.type]
      const key = model[this.localKey]

      if (!relatedTypes[type]) {
        relatedTypes[type] = [key]
      } else if (!relatedTypes[type].includes(key)) {
        relatedTypes[type].push(key)
      }
    })
    // console.log('relatedTypes', relatedTypes)

    // Set relations
    const relations = {}
    Object.keys(relatedTypes).forEach((type) => {
      relations[type] = new Query(database, database.getModel(type))
    })
    // console.log('relations', relations)

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
  match(relation: string, models: Collection /*, results: Collection*/): void {
    /*const dictionary = this.buildDictionary(results)
    console.log('match dictionary', dictionary)*/

    models.forEach((model) => {
      model['morphToRelated']
        ? model.$setRelation(relation, model['morphToRelated']) &&
          delete model['morphToRelated']
        : model.$setRelation(relation, null)
    })
    // console.log('match models updated', models)
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
   * Make a related model. TODO
   */
  make(element?: Element): Model | null {
    console.log('element', element)
    //return element ? this.child.$newInstance(element) : null
    return null
  }

  /**
   * Get the database instance.
   */
  $database(): Database {
    assert(this._database !== undefined, [
      'A Vuex Store instance is not injected into the inverse polymorphic model instance.',
      'You might be trying to instantiate the model directly. Please use',
      '`repository.make` method to create a new inverse polymorphic model instance.'
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
}
