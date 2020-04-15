import { Store } from 'vuex'
import {
  isArray,
  isFunction,
  isEmpty,
  orderBy,
  groupBy
} from '../support/Utils'
import { Element, Item, Collection } from '../data/Data'
import { Relation } from '../model/attributes/relations/Relation'
import { Model } from '../model/Model'
import { Connection } from '../connection/Connection'
import {
  Where,
  WherePrimaryClosure,
  WhereSecondaryClosure,
  Order,
  OrderDirection,
  EagerLoad,
  EagerLoadConstraint
} from './Options'

export class Query<M extends Model = Model> {
  /**
   * The store instance.
   */
  protected store: Store<any>

  /**
   * The model object.
   */
  protected model: M

  /**
   * The connection instance.
   */
  protected connection: Connection<M>

  /**
   * The where constraints for the query.
   */
  protected wheres: Where<M, any>[] = []

  /**
   * The orderings for the query.
   */
  protected orders: Order[] = []

  /**
   * The maximum number of records to return.
   */
  protected take: number | null = null

  /**
   * The number of records to skip.
   */
  protected skip: number = 0

  /**
   * The relationships that should be eager loaded.
   */
  protected eagerLoad: EagerLoad = {}

  /**
   * Create a new query instance.
   */
  constructor(store: Store<any>, model: M) {
    this.store = store
    this.model = model

    this.connection = new Connection(store, model)
  }

  /**
   * Create a new query instance from the given relation.
   */
  protected newQueryForRelation(relation: Relation): Query<Model> {
    return new Query(this.store, relation.getRelated().$setStore(this.store))
  }

  /**
   * Add a basic where clause to the query.
   */
  where<T extends keyof M>(
    field: WherePrimaryClosure<M> | T,
    value?: WhereSecondaryClosure<M, T> | M[T] | M[T][]
  ): this {
    this.wheres.push({ field, value, boolean: 'and' })

    return this
  }

  /**
   * Add a "where in" clause to the query.
   */
  whereIn<T extends keyof M>(field: T, values: M[T][]): this {
    this.wheres.push({ field, value: values, boolean: 'and' })

    return this
  }

  /**
   * Add a where clause on the primary key to the query.
   */
  whereId<T extends keyof M>(ids: M[T] | M[T][]): this {
    return this.where(this.model.$getPrimaryKey() as T, ids)
  }

  /**
   * Add an "or where" clause to the query.
   */
  orWhere<T extends keyof M>(
    field: WherePrimaryClosure<M> | T,
    value?: WhereSecondaryClosure<M, T> | M[T] | M[T][]
  ): this {
    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Add an "order by" clause to the query.
   */
  orderBy(field: string, direction: OrderDirection = 'asc'): Query<M> {
    this.orders.push({ field, direction })

    return this
  }

  /**
   * Set the "take" value of the query.
   */
  limit(value: number): this {
    this.take = value

    return this
  }

  /**
   * Set the "offset" value of the query.
   */
  offset(value: number): this {
    this.skip = value

    return this
  }

  /**
   * Set the relationships that should be eager loaded.
   */
  with(name: string): Query<M> {
    this.eagerLoad[name] = () => {}

    return this
  }

  /**
   * Retrieve models by processing whole query chain.
   */
  get(): Collection<M> {
    const models = this.select()

    if (!isEmpty(models)) {
      this.eagerLoadRelations(models)
    }

    return models
  }

  /**
   * Execute the query and get the first result.
   */
  first(): Item<M> {
    return this.limit(1).get()[0]
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Item<M>
  find(ids: (string | number)[]): Collection<M>
  find(ids: any): any {
    if (isArray(ids)) {
      return this.findIn(ids)
    }

    const record = this.findRaw(ids)

    return record ? this.hydrate(record) : null
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: (string | number)[]): Collection<M> {
    return this.hydrateMany(this.findInRaw(ids))
  }

  /**
   * Find a record by its primary key.
   */
  findRaw(id: string | number): Element | null {
    return this.connection.find(id)
  }

  /**
   * Find multiple records by their primary keys.
   */
  findInRaw(ids: (string | number)[]): Element[] {
    return this.connection.findIn(ids)
  }

  /**
   * Get all models from the state. The difference with the `get` is that this
   * method will not process any query chain. It'll always retrieve all models.
   */
  getModels(): Collection<M> {
    const records = this.connection.get()

    const collection = [] as Collection<M>

    for (const id in records) {
      collection.push(this.hydrate(records[id]))
    }

    return collection
  }

  /**
   * Retrieve models by processing all filters set to the query chain.
   */
  select(): Collection<M> {
    let models = this.getModels()

    models = this.filterWhere(models)
    models = this.filterOrder(models)
    models = this.filterLimit(models)

    return models
  }

  /**
   * Filter the given collection by the registered where clause.
   */
  protected filterWhere(models: Collection<M>): Collection<M> {
    if (isEmpty(this.wheres)) {
      return models
    }

    const comparator = this.getWhereComparator()

    return models.filter((model) => comparator(model))
  }

  /**
   * Get comparator for the where clause.
   */
  protected getWhereComparator(): (model: M) => boolean {
    const { and, or } = groupBy(this.wheres, (where) => where.boolean)

    return (model) => {
      const results: boolean[] = []

      and && results.push(and.every((w) => this.whereComparator(model, w)))
      or && results.push(or.some((w) => this.whereComparator(model, w)))

      return results.indexOf(true) !== -1
    }
  }

  /**
   * The function to compare where clause to the given model.
   */
  protected whereComparator(model: M, where: Where<M, any>): boolean {
    if (isFunction(where.field)) {
      return where.field(model)
    }

    if (isArray(where.value)) {
      return where.value.includes(model[where.field])
    }

    if (isFunction(where.value)) {
      return where.value(model[where.field])
    }

    return model[where.field] === where.value
  }

  /**
   * Filter the given collection by the registered order conditions.
   */
  protected filterOrder(models: Collection<M>): Collection<M> {
    if (this.orders.length === 0) {
      return models
    }

    const fields = this.orders.map((order) => order.field)
    const directions = this.orders.map((order) => order.direction)

    return orderBy(models, fields, directions)
  }

  /**
   * Filter the given collection by the registered limit and offset values.
   */
  protected filterLimit(models: Collection<M>): Collection<M> {
    return this.take !== null
      ? models.slice(this.skip, this.skip + this.take)
      : models.slice(this.skip)
  }

  /**
   * Eager load the relationships for the models.
   */
  protected eagerLoadRelations(models: Collection<M>): void {
    for (const name in this.eagerLoad) {
      this.eagerLoadRelation(models, name, this.eagerLoad[name])
    }
  }

  /**
   * Eagerly load the relationship on a set of models.
   */
  protected eagerLoadRelation(
    models: Collection<M>,
    name: string,
    constraints: EagerLoadConstraint
  ): void {
    // First we will "back up" the existing where conditions on the query so we can
    // add our eager constraints. Then we will merge the wheres that were on the
    // query back to it in order that any where conditions might be specified.
    const relation = this.getRelation(name)

    const query = this.newQueryForRelation(relation)

    relation.addEagerConstraints(query, models)

    constraints(query)

    // Once we have the results, we just match those back up to their parent models
    // using the relationship instance. Then we just return the finished arrays
    // of models which have been eagerly hydrated and are readied for return.
    relation.match(name, models, relation.getEager(query))
  }

  /**
   * Get the relation instance for the given relation name.
   */
  protected getRelation(name: string): Relation {
    return this.model.$getRelation(name)
  }

  /**
   * Insert the given record to the store.
   */
  async insert(records: Element[]): Promise<Collection<M>> {
    const models = this.hydrateMany(records)

    this.connection.insert(this.dehydrate(models))

    return models
  }

  /**
   * Update records in the store by using the primary key of the given records.
   */
  async merge(records: Element[]): Promise<Collection<M>> {
    const models = this.getMergedModels(records)

    this.connection.update(this.dehydrate(models))

    return models
  }

  /**
   * Get models by merging the records. This method will use the primary key
   * in the records to fetch models and merge the given record to the model.
   */
  protected getMergedModels(records: Element[]): Collection<M> {
    return records.reduce<Collection<M>>((collection, record) => {
      const model = this.find(this.model.$getIndexId(record))

      model && collection.push(this.mergeModelWithElement(model, record))

      return collection
    }, [])
  }

  /**
   * Update records in the store.
   */
  async update(record: Element): Promise<Collection<M>> {
    const models = this.mergeModelsWithElement(this.get(), record)

    this.connection.update(this.dehydrate(models))

    return models
  }

  /**
   * Destroy the models for the given id.
   */
  async destroy(id: string | number): Promise<Item<M>>
  async destroy(ids: (string | number)[]): Promise<Collection<M>>
  async destroy(ids: any): Promise<any> {
    if (isArray(ids)) {
      return this.destroyMany(ids)
    }

    return (await this.whereId(ids).delete())[0] ?? null
  }

  /**
   * Destroy the models for the given id.
   */
  async destroyMany<T extends keyof M>(ids: M[T][]): Promise<Collection<M>> {
    return this.whereId(ids).delete()
  }

  /**
   * Delete records that match the query chain.
   */
  async delete(): Promise<Collection<M>> {
    const models = this.get()

    this.connection.delete(this.getIdsFromCollection(models))

    return models
  }

  /**
   * Delete all records in the store.
   */
  async deleteAll(): Promise<Collection<M>> {
    const models = this.getModels()

    this.connection.deleteAll()

    return models
  }

  /**
   * Get an array of ids from the given collection.
   */
  protected getIdsFromCollection(models: Collection<M>): string[] {
    return models.map((model) => model.$getIndexId())
  }

  /**
   * Instantiate new models with the given record.
   */
  protected hydrate(record: Element): M {
    return this.model.$newInstance(record, { relations: false })
  }

  /**
   * Instantiate new models with the given collection of records.
   */
  protected hydrateMany(records: Element[]): Collection<M> {
    return records.map((record) => this.hydrate(record))
  }

  /**
   * Convert all models into the plain record.
   */
  protected dehydrate(models: Collection<M>): Element[] {
    return models.map((model) => model.$getAttributes())
  }

  /**
   * Merge the model with the given record.
   */
  protected mergeModelWithElement(model: M, record: Element): M {
    return model.$fill(record)
  }

  /**
   * Merge models with the given record.
   */
  protected mergeModelsWithElement(
    models: Collection<M>,
    record: Element
  ): Collection<M> {
    return models.map((model) => model.$fill(record))
  }
}
