import { Store } from 'vuex'
import { Constructor } from '../types'
import { assert } from '../support/Utils'
import { Element, Item, Collection, Collections } from '../data/Data'
import { Model } from '../model/Model'
import { ModelConstructor } from '../model/ModelConstructor'
import { Query } from '../query/Query'
import {
  WherePrimaryClosure,
  WhereSecondaryClosure,
  OrderDirection,
  OrderBy
} from '../query/Options'

export class Repository<M extends Model = Model> {
  /**
   * A special flag to indicate if this is the repository class or not. It's
   * used when retrieving repository instance from `store.$repo()` method to
   * determine whether the passed in class is either a repository or a model.
   */
  static _isRepository: boolean = true

  /**
   * The store instance.
   */
  protected store: Store<any>

  /**
   * The model instance.
   */
  protected model!: M

  /**
   * The model object to be used for the custom repository.
   */
  use?: typeof Model

  /**
   * Create a new Repository instance.
   */
  constructor(store: Store<any>) {
    this.store = store
  }

  /**
   * Initialize the repository by setting the model instance.
   */
  initialize(model?: ModelConstructor<M>): this {
    // If there's a model passed in, just use that and return immediately.
    if (model) {
      this.model = model.newRawInstance().$setStore(this.store)

      return this
    }

    // If no model was passed to the initializer, that means the user has
    // passed repository to the `store.$repo` method instead of a model.
    // In this case, we'll check if the user has set model to the `use`
    // property and instantiate that.
    if (this.use) {
      this.model = (this.use.newRawInstance() as M).$setStore(this.store)

      return this
    }

    // Else just return for now. If the user tries to call methods that require
    // a model, the error will be thrown at that time.
    return this
  }

  /**
   * Get the model instance. If the model is not registered to the repository,
   * it will throw an error. It happens when users use a custom repository
   * without setting `use` property.
   */
  getModel(): M {
    assert(!!this.model, [
      'The model is not registered. Please define the model to be used at',
      '`use` property of the repository class.'
    ])

    return this.model
  }

  /**
   * Create a new repository with the given model.
   */
  repo<M extends Model>(model: Constructor<M>): Repository<M>
  repo<R extends Repository<any>>(repository: Constructor<R>): R
  repo(modelOrRepository: any): any {
    return this.store.$repo(modelOrRepository)
  }

  /**
   * Create a new Query instance.
   */
  query(): Query<M> {
    return new Query(this.store, this.getModel())
  }

  /**
   * Add a basic where clause to the query.
   */
  where<T extends keyof M>(
    field: WherePrimaryClosure<M> | T,
    value?: WhereSecondaryClosure<M, T> | M[T] | M[T][]
  ): Query<M> {
    return this.query().where(field, value)
  }

  /**
   * Add an "or where" clause to the query.
   */
  orWhere<T extends keyof M>(
    field: WherePrimaryClosure<M> | T,
    value?: WhereSecondaryClosure<M, T> | M[T] | M[T][]
  ): Query<M> {
    return this.query().orWhere(field, value)
  }

  /**
   * Add an "order by" clause to the query.
   */
  orderBy(field: OrderBy<M>, direction?: OrderDirection): Query<M> {
    return this.query().orderBy(field, direction)
  }

  /**
   * Set the "limit" value of the query.
   */
  limit(value: number): Query<M> {
    return this.query().limit(value)
  }

  /**
   * Set the "offset" value of the query.
   */
  offset(value: number): Query<M> {
    return this.query().offset(value)
  }

  /**
   * Set the relationships that should be eager loaded.
   */
  with(name: string): Query<M> {
    return this.query().with(name)
  }

  /**
   * Get all models from the store.
   */
  all(): Collection<M> {
    return this.query().get()
  }

  /**
   * Find the model with the given id.
   */
  find(id: string | number): Item<M>
  find(ids: (string | number)[]): Collection<M>
  find(ids: any): Item<any> {
    return this.query().find(ids)
  }

  /**
   * Create a new model instance. This method will not save the model to the
   * store. It's pretty much the alternative to `new Model()`, but it injects
   * the store instance to support model instance methods in SSR environment.
   */
  make(attributes?: Element): M {
    return this.getModel().$newInstance(attributes, {
      relations: false
    })
  }

  /**
   * Insert the given record to the store.
   */
  insert(records: Element | Element[]): Promise<Collections> {
    return this.query().insert(records)
  }

  /**
   * Insert the given records to the store by replacing any existing records.
   */
  fresh(records: Element | Element[]): Promise<Collections> {
    return this.query().fresh(records)
  }

  /**
   * Update records in the store.
   */
  update(records: Element | Element[]): Promise<Collections> {
    return this.query().update(records)
  }

  /**
   * Update records in the store without normalization.
   */
  merge(records: Element[]): Promise<Collection<M>>
  merge(record: Element): Promise<Item<M>>
  merge(records: any): Promise<any> {
    return this.query().merge(records)
  }

  /**
   * Destroy the models for the given id.
   */
  destroy(id: string | number): Promise<Item<M>>
  destroy(ids: (string | number)[]): Promise<Collection<M>>
  destroy(ids: any): Promise<any> {
    return this.query().destroy(ids)
  }

  /**
   * Delete all records in the store.
   */
  flush(): Promise<Collection<M>> {
    return this.query().flush()
  }
}
