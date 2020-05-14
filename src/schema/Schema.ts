import { schema as Normalizr, Schema as NormalizrSchema } from 'normalizr'
import { isNullish, assert } from '../support/Utils'
import { Uid } from '../model/attributes/types/Uid'
import { Relation } from '../model/attributes/relations/Relation'
import { Model } from '../model/Model'

export class Schema {
  /**
   * The list of generated schemas.
   */
  private schemas: Record<string, Normalizr.Entity> = {}

  /**
   * The model instance.
   */
  private model: Model

  /**
   * Create a new Schema instance.
   */
  constructor(model: Model) {
    this.model = model
  }

  /**
   * Create a single schema.
   */
  one(model?: Model): Normalizr.Entity {
    model = model || this.model

    if (this.schemas[model.$entity]) {
      return this.schemas[model.$entity]
    }

    const schema = this.newEntity(model, this.model)

    this.schemas[model.$entity] = schema

    const definition = this.definition(model)

    schema.define(definition)

    return schema
  }

  /**
   * Create an array schema for the given model.
   */
  many(model: Model): Normalizr.Array {
    return new Normalizr.Array(this.one(model))
  }

  /**
   * Create a new normalizr entity.
   */
  private newEntity(model: Model, parent: Model): Normalizr.Entity {
    const entity = model.$entity
    const idAttribute = this.idAttribute(model, parent)

    return new Normalizr.Entity(entity, {}, { idAttribute })
  }

  /**
   * The id attribute option for the normalizr entity.
   *
   * During the process, it will generate any missing primary keys defined as
   * the uid field because it's required to generate the index id. If the
   * primary key is missing, and the primary key is not defined as the uid
   * field, it will throw an error.
   *
   * Note that we only want to generate uids for the primary key because the
   * primary key is required to generate the index id, but other fields
   * are not.
   *
   * It's especially important when we want to "update" records. When updating
   * records, we want to keep the missing field as-is. Otherwise, it will get
   * overridden by the newly generated uid value.
   *
   * For the primary key, well, if there's no primary key, we don't know what
   * record to update anyway. If users passed records with missing uid primary
   * keys to the "update" method, it would fail because the uid value will
   * never exist in the store.
   *
   * While it would be nice to throw an error in such a case instead of
   * silently failing the update, we don't have a way to detect whether users
   * are trying to "update" records or "inserting" new records at this stage.
   * Maybe we will come up with something in the future.
   */
  private idAttribute(
    model: Model,
    parent: Model
  ): Normalizr.StrategyFunction<string> {
    // We'll first check if the model contains any uid fields. If so, we have
    // to generate the uids during the normalization process, so we'll keep
    // that check result here. This way, we can use this result while
    // processing each record, instead of looping through the model fields
    // each time.
    const uidFields = this.getUidPrimaryKeyPairs(model)

    return (record, parentRecord, key) => {
      // If the `key` is not `null`, that means this record is a nested
      // relationship of the parent model. In this case, we'll attach any
      // missing foreign keys to the record first.
      if (key !== null) {
        ;(parent.$fields[key] as Relation).attach(parentRecord, record)
      }

      // Next, we'll generate any missing primary key fields defined as
      // uid field.
      for (const key in uidFields) {
        if (isNullish(record[key])) {
          record[key] = uidFields[key].make(record[key])
        }
      }

      // Finally, we'll check if the model has a valid index id. If not, that
      // means users have passed in the record without a primary key, and the
      // primary key field is not defined as uid field. In this case, we'll
      // throw an error. Otherwise, everything is fine, so let's return the
      // index id.
      const indexId = model.$getIndexId(record)

      assert(!isNullish(indexId), [
        'The record is missing the primary key. If you want to persist record',
        'without the primary key, please defined the primary key field as',
        '`uid` field.'
      ])

      return indexId
    }
  }

  /**
   * Get all primary keys defined as an uid attribute for the given model.
   */
  private getUidPrimaryKeyPairs(model: Model): Record<string, Uid> {
    const attributes = {} as Record<string, Uid>

    const key = model.$getKeyName()
    const attr = model.$fields[key]

    if (attr instanceof Uid) {
      attributes[key] = attr
    }

    return attributes
  }

  /**
   * Create a definition for the given model.
   */
  private definition(model: Model): NormalizrSchema {
    const definition: NormalizrSchema = {}

    for (const key in model.$fields) {
      const field = model.$fields[key]

      if (field instanceof Relation) {
        definition[key] = field.define(this)
      }
    }

    return definition
  }
}
