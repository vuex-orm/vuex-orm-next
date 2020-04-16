import { Store } from 'vuex'
import { Constructor } from '../types'
import { Element, Item, Collection, Collections } from '../data/Data'
import { Model } from '../model/Model'
import { Interpreter } from '../interpreter/Interpreter'
import { Query } from '../query/Query'
import {
  WherePrimaryClosure,
  WhereSecondaryClosure,
  OrderDirection
} from '../query/Options'

export interface CollectionPromises {
  indexes: string[]
  promises: Promise<Collection<Model>>[]
}

export class Repository<M extends Model> {
  /**
   * The store instance.
   */
  protected store: Store<any>

  /**
   * The model instance.
   */
  protected model: M

  /**
   * Create a new Repository instance.
   */
  constructor(store: Store<any>, model: Constructor<M>) {
    this.store = store

    this.model = new model().$setStore(store)
  }

  /**
   * Create a new Interpreter instance.
   */
  interpreter(): Interpreter<M> {
    return new Interpreter(this.store, this.model)
  }

  /**
   * Create a new Query instance.
   */
  query(): Query<M> {
    return new Query(this.store, this.model)
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
  orderBy(field: string, direction?: OrderDirection): Query<M> {
    return this.query().orderBy(field, direction)
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
   * Insert the given record to the store.
   */
  insert(records: Element | Element[]): Promise<Collections> {
    return this.query().insert(records)
  }

  /**
   * Update records in the store.
   */
  update(records: Element | Element[]): Promise<Collections> {
    return this.query().update(records)
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
  deleteAll(): Promise<Collection<M>> {
    return this.query().deleteAll()
  }
}
