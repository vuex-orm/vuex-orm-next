import { Store } from 'vuex'
import { isNullish, isArray, assert } from '../support/Utils'
import { Element, Item, Collection } from '../data/Data'
import { NonEnumerable } from './decorators/NonEnumerable'
import { Attribute } from './attributes/Attribute'
import { Attr } from './attributes/types/Attr'
import { String as Str } from './attributes/types/String'
import { Number as Num } from './attributes/types/Number'
import { Boolean as Bool } from './attributes/types/Boolean'
import { Uid } from './attributes/types/Uid'
import { Relation } from './attributes/relations/Relation'
import { HasOne } from './attributes/relations/HasOne'
import { BelongsTo } from './attributes/relations/BelongsTo'
import { HasMany } from './attributes/relations/HasMany'

export type ModelFields = Record<string, Attribute>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Attribute>

export interface ModelOptions {
  fill?: boolean
  relations?: boolean
}

export class Model {
  /**
   * The name of the model.
   */
  static entity: string

  /**
   * The primary key for the model.
   */
  static primaryKey: string | string[] = 'id'

  /**
   * The schema for the model. It contains the result of the `fields`
   * method or the attributes defined by decorators.
   */
  protected static schemas: ModelSchemas = {}

  /**
   * The registry for the model. It contains predefined model schema generated
   * by the property decorators and gets evaluated, and stored, on the `schema`
   * property when registering models to the database.
   */
  protected static registries: ModelRegistries = {}

  /**
   * The array of booted models.
   */
  protected static booted: Record<string, boolean> = {}

  /**
   * The store instance.
   */
  @NonEnumerable
  protected _store!: Store<any>

  /**
   * Create a new model instance.
   */
  constructor(attributes?: Element, options: ModelOptions = {}) {
    this.$boot()

    const fill = options.fill ?? true

    fill && this.$fill(attributes, options)
  }

  /**
   * Create a new model fields definition.
   */
  static fields(): ModelFields {
    return {}
  }

  /**
   * Build the schema by evaluating fields and registry.
   */
  protected static initializeSchema(): void {
    this.schemas[this.entity] = {}

    const registry = {
      ...this.fields(),
      ...this.registries[this.entity]
    }

    for (const key in registry) {
      const attribute = registry[key]

      this.schemas[this.entity][key] =
        typeof attribute === 'function' ? attribute() : attribute
    }
  }

  /**
   * Set the attribute to the registry.
   */
  static setRegistry(key: string, attribute: () => Attribute): typeof Model {
    if (!this.registries[this.entity]) {
      this.registries[this.entity] = {}
    }

    this.registries[this.entity][key] = attribute

    return this
  }

  /**
   * Clear the list of booted models so they can be re-booted.
   */
  static clearBootedModels(): void {
    this.booted = {}
    this.schemas = {}
  }

  /**
   * Clear registries.
   */
  static clearRegistries(): void {
    this.registries = {}
  }

  /**
   * Create a new model instance without field values being populated.
   *
   * This method is mainly fo the internal use when registering models to the
   * database. Since all pre-registered models are for referencing its model
   * setting during the various process, but the fields are not required.
   *
   * Use this method when you want create a new model instance for:
   * - Registering model to a component (eg. Repository, Query, etc.)
   * - Registering model to attributes (String, Has Many, etc.)
   */
  static newRawInstance<M extends typeof Model>(this: M): InstanceType<M> {
    return new this(undefined, { fill: false }) as InstanceType<M>
  }

  /**
   * Create a new Attr attribute instance.
   */
  static attr(value: any): Attr {
    return new Attr(this.newRawInstance(), value)
  }

  /**
   * Create a new String attribute instance.
   */
  static string(value: string | null): Str {
    return new Str(this.newRawInstance(), value)
  }

  /**
   * Create a new Number attribute instance.
   */
  static number(value: number | null): Num {
    return new Num(this.newRawInstance(), value)
  }

  /**
   * Create a new Boolean attribute instance.
   */
  static boolean(value: boolean | null): Bool {
    return new Bool(this.newRawInstance(), value)
  }

  /**
   * Create a new Uid attribute instance.
   */
  static uid(): Uid {
    return new Uid(this.newRawInstance())
  }

  /**
   * Create a new HasOne relation instance.
   */
  static hasOne(
    related: typeof Model,
    foreignKey: string,
    localKey?: string
  ): HasOne {
    const model = this.newRawInstance()

    localKey = localKey ?? model.$getLocalKey()

    return new HasOne(model, related.newRawInstance(), foreignKey, localKey)
  }

  /**
   * Create a new BelongsTo relation instance.
   */
  static belongsTo(
    related: typeof Model,
    foreignKey: string,
    ownerKey?: string
  ): BelongsTo {
    const instance = related.newRawInstance()

    ownerKey = ownerKey ?? instance.$getLocalKey()

    return new BelongsTo(this.newRawInstance(), instance, foreignKey, ownerKey)
  }

  /**
   * Create a new HasMany relation instance.
   */
  static hasMany(
    related: typeof Model,
    foreignKey: string,
    localKey?: string
  ): HasMany {
    const model = this.newRawInstance()

    localKey = localKey ?? model.$getLocalKey()

    return new HasMany(model, related.newRawInstance(), foreignKey, localKey)
  }

  /**
   * Get the constructor for this model.
   */
  get $self(): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get the store instance.
   */
  get $store(): Store<any> {
    assert(this._store !== undefined, [
      'A Vuex Store instance is not injected into the model instance.',
      'You might be trying to instantiate the model directly. Please use',
      '`repository.make` method to create a new model instance.'
    ])

    return this._store
  }

  /**
   * Get the entity for this model.
   */
  get $entity(): string {
    return this.$self.entity
  }

  /**
   * Get the primary key for this model.
   */
  get $primaryKey(): string | string[] {
    return this.$self.primaryKey
  }

  /**
   * Set the store instance.
   */
  $setStore(store: Store<any>): this {
    this._store = store

    return this
  }

  /**
   * Create a new instance of this model. This method provides a convenient way
   * to re-generate a fresh instance of this model. It's particularly useful
   * during hydration through Query operations.
   */
  $newInstance(attributes?: Element, options?: ModelOptions): this {
    const model = new this.$self(attributes, options) as this

    model.$setStore(this.$store)

    return model
  }

  /**
   * Get the model fields for this model.
   */
  get $fields(): ModelFields {
    return this.$self.schemas[this.$entity]
  }

  /**
   * Bootstrap this model.
   */
  protected $boot(): void {
    if (!this.$self.booted[this.$entity]) {
      this.$self.booted[this.$entity] = true

      this.$initializeSchema()
    }
  }

  /**
   * Build the schema by evaluating fields and registry.
   */
  protected $initializeSchema(): void {
    this.$self.initializeSchema()
  }

  /**
   * Fill this model by the given attributes. Missing fields will be populated
   * by the attributes default value.
   */
  $fill(attributes: Element = {}, options: ModelOptions = {}): this {
    const fillRelation = options.relations ?? true

    for (const key in this.$fields) {
      const attr = this.$fields[key]
      const value = attributes[key]

      if (attr instanceof Relation && !fillRelation) {
        continue
      }

      this.$fillField(key, attr, value)
    }

    return this
  }

  /**
   * Fill the given attribute with a given value specified by the given key.
   */
  protected $fillField(key: string, attr: Attribute, value: any): void {
    if (value !== undefined) {
      this[key] = attr.make(value)
      return
    }

    if (this[key] !== undefined) {
      this[key] = this[key]
      return
    }

    this[key] = attr.make()
  }

  /**
   * Get the primary key field name.
   */
  $getKeyName(): string | string[] {
    return this.$primaryKey
  }

  /**
   * Get primary key value for the model. If the model has the composite key,
   * it will return an array of ids.
   */
  $getKey(record?: Element): string | number | (string | number)[] | null {
    record = record ?? this

    if (this.$hasCompositeKey()) {
      return this.$getCompositeKey(record)
    }

    const id = record[this.$getKeyName() as string]

    return isNullish(id) ? null : id
  }

  /**
   * Check whether the model has composite key.
   */
  $hasCompositeKey(): boolean {
    return isArray(this.$getKeyName())
  }

  /**
   * Get the composite key values for the given model as an array of ids.
   */
  protected $getCompositeKey(record: Element): (string | number)[] | null {
    let ids = [] as (string | number)[] | null

    ;(this.$getKeyName() as string[]).every((key) => {
      const id = record[key]

      if (isNullish(id)) {
        ids = null
        return false
      }

      ;(ids as (string | number)[]).push(id)
      return true
    })

    return ids === null ? null : ids
  }

  /**
   * Get the index id of this model or for a given record.
   */
  $getIndexId(record?: Element): string | null {
    const target = record ?? this

    const id = this.$getKey(target)

    return id === null ? null : this.$stringifyId(id)
  }

  /**
   * Stringify the given id.
   */
  protected $stringifyId(id: string | number | (string | number)[]): string {
    return isArray(id) ? JSON.stringify(id) : String(id)
  }

  /**
   * Get the local key name for the model.
   */
  $getLocalKey(): string {
    // If the model has a composite key, we can't use it as a local key for the
    // relation. The user must provide the key name explicitly, so we'll throw
    // an error here.
    assert(!this.$hasCompositeKey(), [
      'Please provide the local key for the relationship. The model with the',
      "composite key can't infer its local key."
    ])

    return this.$getKeyName() as string
  }

  /**
   * Get the relation instance for the given relation name.
   */
  $getRelation(name: string): Relation {
    const relation = this.$fields[name]

    assert(relation instanceof Relation, [
      `Relationship [${name}] on model [${this.$entity}] not found.`
    ])

    return relation
  }

  /**
   * Set the given relationship on the model.
   */
  $setRelation(relation: string, model: Model | Model[] | null): this {
    this[relation] = model

    return this
  }

  /**
   * Get the serialized model attributes.
   */
  $getAttributes(): Element {
    return this.$toJson(this, { relations: false })
  }

  /**
   * Serialize this model, or the given model, as POJO.
   */
  $toJson(model?: Model, options: ModelOptions = {}): Element {
    model = model ?? this

    const withRelation = options.relations ?? true

    const record: Element = {}

    for (const key in model.$fields) {
      const attr = this.$fields[key]
      const value = model[key]

      if (!(attr instanceof Relation)) {
        record[key] = this.serializeValue(value)
        continue
      }

      if (withRelation) {
        record[key] = this.serializeRelation(value)
      }
    }

    return record
  }

  /**
   * Serialize the given value.
   */
  protected serializeValue(value: any): any {
    if (value === null) {
      return null
    }

    if (isArray(value)) {
      return this.serializeArray(value)
    }

    if (typeof value === 'object') {
      return this.serializeObject(value)
    }

    return value
  }

  /**
   * Serialize the given array to JSON.
   */
  protected serializeArray(value: any[]): any[] {
    return value.map((v) => this.serializeValue(v))
  }

  /**
   * Serialize the given object to JSON.
   */
  protected serializeObject(value: object): object {
    const obj = {}

    for (const key in value) {
      obj[key] = this.serializeValue(value[key])
    }

    return obj
  }

  /**
   * Serialize the given relation to JSON.
   */
  protected serializeRelation(relation: Item): Element | null
  protected serializeRelation(relation: Collection): Element[]
  protected serializeRelation(relation: any): any {
    if (relation === null) {
      return null
    }

    return isArray(relation)
      ? relation.map((model) => model.$toJson())
      : relation.$toJson()
  }
}
