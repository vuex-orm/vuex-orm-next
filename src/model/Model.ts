import { Store } from 'vuex'
import { isArray } from '../support/Utils'
import { Element, Item, Collection } from '../data/Data'
import { Attribute } from './attributes/Attribute'
import { Attr } from './attributes/types/Attr'
import { String as Str } from './attributes/types/String'
import { Number as Num } from './attributes/types/Number'
import { Boolean as Bool } from './attributes/types/Boolean'
import { Relation } from './attributes/relations/Relation'
import { HasOne } from './attributes/relations/HasOne'
import { BelongsTo } from './attributes/relations/BelongsTo'
import { HasMany } from './attributes/relations/HasMany'

export type ModelFields = Record<string, Attribute>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Attribute>

export interface ModelOptions {
  relations?: boolean
}

export class Model {
  /**
   * The store instance.
   */
  protected _store!: Store<any>

  /**
   * The name of the model.
   */
  static entity: string

  /**
   * The primary key for the model.
   */
  static primaryKey: string = 'id'

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
   * Create a new model instance.
   */
  constructor(attributes?: Element, options?: ModelOptions) {
    this.$boot()

    this.$fill(attributes, options)
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
   * Create a new Attr attribute instance.
   */
  static attr(value: any): Attr {
    return new Attr(new this(), value)
  }

  /**
   * Create a new String attribute instance.
   */
  static string(value: string | null): Str {
    return new Str(new this(), value)
  }

  /**
   * Create a new Number attribute instance.
   */
  static number(value: number | null): Num {
    return new Num(new this(), value)
  }

  /**
   * Create a new Boolean attribute instance.
   */
  static boolean(value: boolean | null): Bool {
    return new Bool(new this(), value)
  }

  /**
   * Create a new HasOne relation instance.
   */
  static hasOne(
    related: typeof Model,
    foreignKey: string,
    localKey?: string
  ): HasOne {
    const model = new this()

    localKey = localKey ?? model.$getLocalKey()

    return new HasOne(model, new related(), foreignKey, localKey)
  }

  /**
   * Create a new BelongsTo relation instance.
   */
  static belongsTo(
    related: typeof Model,
    foreignKey: string,
    ownerKey?: string
  ): BelongsTo {
    const instance = new related()

    ownerKey = ownerKey ?? instance.$getLocalKey()

    return new BelongsTo(new this(), instance, foreignKey, ownerKey)
  }

  /**
   * Create a new HasMany relation instance.
   */
  static hasMany(
    related: typeof Model,
    foreignKey: string,
    localKey?: string
  ): HasMany {
    const model = new this()

    localKey = localKey ?? model.$getLocalKey()

    return new HasMany(model, new related(), foreignKey, localKey)
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
  get $primaryKey(): string {
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
  $getPrimaryKey(): string {
    return this.$primaryKey
  }

  /**
   * Get the index id of this model or for a given record.
   */
  $getIndexId(record?: Element): string {
    const target = record ?? this

    return String(target[this.$primaryKey])
  }

  /**
   * Get the local key for this model.
   */
  $getLocalKey(): string {
    return this.$primaryKey
  }

  /**
   * Check if this model has any relations defined by the schema.
   */
  $hasRelation(): boolean {
    let result = false

    for (const key in this.$fields) {
      if (this.$fields[key] instanceof Relation) {
        result = true
      }
    }

    return result
  }

  /**
   * Get the relation instance for the given relation name.
   */
  $getRelation(name: string): Relation {
    const relation = this.$fields[name]

    if (!(relation instanceof Relation)) {
      throw new Error(
        `[Vuex ORM] Relationship [${name}] on model [${this.$entity}] not found.`
      )
    }

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
  protected serializeValue(v: any): any {
    if (v === null) {
      return null
    }

    if (isArray(v)) {
      return this.serializeArray(v)
    }

    if (typeof v === 'object') {
      return this.serializeObject(v)
    }

    return v
  }

  /**
   * Serialize the given array to JSON.
   */
  protected serializeArray(a: any[]): any[] {
    return a.map((v) => this.serializeValue(v))
  }

  /**
   * Serialize the given object to JSON.
   */
  protected serializeObject(o: object): object {
    const obj = {}

    for (const key in o) {
      obj[key] = this.serializeValue(o[key])
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
