import { Store } from 'vuex'
import { isArray } from '../support/Utils'
import { Element, Elements, Collection } from '../data/Data'
import { Model } from '../model/Model'

export interface ConnectionNamespace {
  connection: string
  entity: string
}

export class Connection<M extends Model> {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The model object.
   */
  model: M

  /**
   * Create a new connection instance.
   */
  constructor(store: Store<any>, model: M) {
    this.store = store
    this.model = model
  }

  /**
   * Get namespace for the module.
   */
  private getNamespace(): ConnectionNamespace {
    const connection = this.store.$database.connection
    const entity = this.model.$entity

    return { connection, entity }
  }

  /**
   * Get the state object from the store.
   */
  private getData(): Elements {
    const { connection, entity } = this.getNamespace()

    return this.store.state[connection][entity].data
  }

  /**
   * Commit a namespaced store mutation.
   */
  private commit(name: string, payload?: any): void {
    const { connection, entity } = this.getNamespace()

    this.store.commit(`${connection}/${entity}/${name}`, payload)
  }

  /**
   * Get all existing records.
   */
  get(): Elements {
    return this.getData()
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Element | null {
    return this.getData()[id] ?? null
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: (string | number)[]): Element[] {
    const data = this.getData()

    return ids.map((id) => data[id])
  }

  /**
   * Commit `insert` mutation to the store.
   */
  insert(models: M | Collection<M>): void {
    this.commit('insert', this.mapModels(models))
  }

  /**
   * Commit `update` mutation to the store.
   */
  update(models: M | Collection<M>): void {
    this.commit('update', this.mapModels(models))
  }

  /**
   * Commit `delete` mutation to the store.
   */
  delete(ids: string[]): void {
    this.commit('delete', ids)
  }

  /**
   * Commit `deleteAll` mutation to the store.
   */
  deleteAll(): void {
    this.commit('deleteAll')
  }

  /**
   * Convert the given array of records into a dictionary of records keyed by
   * it's primary key.
   */
  private mapModels(models: M | Collection<M>): Elements {
    const modelArray = isArray(models) ? models : [models]

    return modelArray.reduce<Elements>((records, model) => {
      records[model.$getIndexId()] = model.$getAttributes()
      return records
    }, {})
  }
}
