import { Store } from 'vuex'
import {
  isArray,
  isFunction,
  isEmpty,
  orderBy,
  groupBy
} from '../support/Utils'
import {
  Element,
  Elements,
  NormalizedData,
  Item,
  Collection,
  Collections
} from '../data/Data'
import { Relation } from '../model/attributes/relations/Relation'
import { Model } from '../model/Model'
import { Interpreter } from '../interpreter/Interpreter'
import { Connection } from '../connection/Connection'
import {
  Where,
  WherePrimaryClosure,
  WhereSecondaryClosure,
  Order,
  OrderBy,
  OrderDirection,
  EagerLoad,
  EagerLoadConstraint,
  PersistMethod
} from './Options'

export interface CollectionPromises {
  indexes: string[]
  promises: Promise<Collection<Model>>[]
}

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
   * The interpreter instance.
   */
  protected interpreter: Interpreter<M>

  /**
   * The connection instance.
   */
  protected connection: Connection

  /**
   * The where constraints for the query.
   */
  protected wheres: Where<M, any>[] = []

  /**
   * The orderings for the query.
   */
  protected orders: Order<M>[] = []

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

    this.interpreter = new Interpreter(store, model)
    this.connection = new Connection(store, model.$entity)
  }

  /**
   * Create a new query instance for the given model.
   */
  protected newQuery(model: string): Query<Model> {
    return new Query(this.store, this.store.$database.getModel(model))
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
  whereId(ids: string | number | (string | number)[]): this {
    return this.where(this.model.$getKeyName() as any, ids)
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
  orderBy(field: OrderBy<M>, direction: OrderDirection = 'asc'): Query<M> {
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
   * Get all models from the store. The difference with the `get` is that this
   * method will not process any query chain. It'll always retrieve all models.
   */
  all(): Collection<M> {
    const records = this.connection.get()

    const collection = [] as Collection<M>

    for (const id in records) {
      collection.push(this.hydrate(records[id]))
    }

    return collection
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
    return this.limit(1).get()[0] ?? null
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Item<M>
  find(ids: (string | number)[]): Collection<M>
  find(ids: any): any {
    return isArray(ids) ? this.findIn(ids) : this.whereId(ids).first()
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: (string | number)[]): Collection<M> {
    return this.whereId(ids).get()
  }

  /**
   * Get models by given index ids.
   */
  protected pick(id: string): Item<M>
  protected pick(ids: string[]): Collection<M>
  protected pick(ids: any): any {
    if (isArray(ids)) {
      return this.pickIn(ids)
    }

    const record = this.connection.find(ids)

    return record ? this.hydrate(record) : null
  }

  /**
   * Get models by given index ids.
   */
  protected pickIn(ids: string[]): Collection<M> {
    return this.hydrate(this.connection.findIn(ids))
  }

  /**
   * Retrieve models by processing all filters set to the query chain.
   */
  select(): Collection<M> {
    let models = this.all()

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
  async insert(records: Element | Element[]): Promise<Collections> {
    return this.persist('insert', records)
  }

  /**
   * Insert the given record to the store.
   */
  async add<E extends Element>(records: E[]): Promise<Collection<M>>
  async add<E extends Element>(record: E): Promise<M>
  async add(records: any): Promise<any> {
    const models = this.hydrate(records)

    this.connection.insert(this.compile(models))

    return models
  }

  /**
   * Insert the given records to the store by replacing any existing records.
   */
  fresh(records: Element | Element[]): Promise<Collections> {
    return this.persist('fresh', records)
  }

  /**
   * Insert the given records to the store by replacing any existing records.
   */
  async replace<E extends Element>(records: E[]): Promise<Collection<M>>
  async replace<E extends Element>(record: E): Promise<M>
  async replace(records: any): Promise<any> {
    const models = this.hydrate(records)

    this.connection.fresh(this.compile(models))

    return models
  }

  /**
   * Update the given record to the store.
   */
  async update(records: Element | Element[]): Promise<Collections> {
    return this.persist('update', records)
  }

  /**
   * Update records in the store by using the primary key of the given records.
   */
  async merge(records: Element[]): Promise<Collection<M>>
  async merge(record: Element): Promise<Item<M>>
  async merge(records: any): Promise<any> {
    const models = this.getMergedModels(records)

    if (models === null) {
      return null
    }

    this.connection.update(this.compile(models))

    return models
  }

  /**
   * Get models by merging the given records. This method will use the primary
   * key in the records to fetch models and merge it with the record.
   */
  protected getMergedModels(records: Element[]): Collection<M>
  protected getMergedModels(record: Element): Item<M>
  protected getMergedModels(records: any): any {
    const recordsArray = isArray(records) ? records : [records]

    return recordsArray.reduce<Collection<M>>((collection, record) => {
      const model = this.pick(this.model.$getIndexId(record)!)

      model && collection.push(model.$fill(record))

      return collection
    }, [])
  }

  /**
   * Update records in the store.
   */
  async revise(record: Element): Promise<Collection<M>> {
    const models = this.get().map((model) => model.$fill(record))

    this.connection.update(this.compile(models))

    return models
  }

  /**
   * Persist records to the store by the given method.
   */
  protected persist(
    method: PersistMethod,
    records: Element | Element[]
  ): Promise<Collections> {
    const normalizedData = this.interpret(records)

    const { indexes, promises } = this.createCollectionPromises(
      method,
      normalizedData
    )

    return this.resolveCollectionPromises(indexes, promises)
  }

  /**
   * Persist normalized records with the given method.
   */
  protected persistRecords(
    method: PersistMethod,
    records: Elements
  ): Promise<Collection<M>> {
    const mappedRecords = this.mapNormalizedData(records)

    switch (method) {
      case 'insert':
        return this.add(mappedRecords)
      case 'fresh':
        return this.replace(mappedRecords)
      case 'update':
        return this.merge(mappedRecords)
      default:
        throw new Error(`[Vuex ORM] Invalid persist method: \`${method}\``)
    }
  }

  /**
   * Convert normalized data into an array of records.
   */
  protected mapNormalizedData(records: Elements): Element[] {
    const items = [] as Element[]

    for (const id in records) {
      items.push(records[id])
    }

    return items
  }

  /**
   * Interpret the given record.
   */
  protected interpret(records: Element | Element[]): NormalizedData {
    return this.interpreter.process(records)
  }

  /**
   * Create collection promises for the given normalized data.
   */
  protected createCollectionPromises(
    method: PersistMethod,
    data: NormalizedData
  ): CollectionPromises {
    const indexes: string[] = []
    const promises: Promise<Collection<any>>[] = []

    for (const entity in data) {
      const records = data[entity]
      const query = this.newQuery(entity)

      indexes.push(entity)
      promises.push(query.persistRecords(method, records))
    }

    return { indexes, promises }
  }

  /**
   * Resolve all collection promises and create a new collections object.
   */
  protected async resolveCollectionPromises(
    indexes: string[],
    promises: Promise<Collection<any>>[]
  ): Promise<Collections> {
    return (await Promise.all(promises)).reduce<Collections>(
      (collections, collection, index) => {
        collections[indexes[index]] = collection
        return collections
      },
      {}
    )
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
  async destroyMany(ids: (string | number)[]): Promise<Collection<M>> {
    return this.whereId(ids).delete()
  }

  /**
   * Delete records that match the query chain.
   */
  async delete(): Promise<Collection<M>> {
    const models = this.get()

    this.connection.delete(this.getIndexIdsFromCollection(models))

    return models
  }

  /**
   * Delete all records in the store.
   */
  async flush(): Promise<Collection<M>> {
    const models = this.all()

    this.connection.flush()

    return models
  }

  /**
   * Get an array of ids from the given collection.
   */
  protected getIndexIdsFromCollection(models: Collection<M>): string[] {
    return models.map((model) => model.$getIndexId()!)
  }

  /**
   * Instantiate new models with the given record.
   */
  protected hydrate(records: Element[]): Collection<M>
  protected hydrate(record: Element): M
  protected hydrate(records: any): any {
    return isArray(records)
      ? records.map((record) => this.hydrate(record))
      : this.model.$newInstance(records, { relations: false })
  }

  /**
   * Convert given models into an indexed object that is ready to be saved to
   * the store.
   */
  protected compile(models: M | Collection<M>): Elements {
    const modelArray = isArray(models) ? models : [models]

    return modelArray.reduce<Elements>((records, model) => {
      records[model.$getIndexId()!] = model.$getAttributes()
      return records
    }, {})
  }
}
