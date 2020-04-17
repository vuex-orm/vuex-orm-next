import { Store } from 'vuex'
import { Element, Elements } from '../data/Data'

export interface ConnectionNamespace {
  connection: string
  entity: string
}

export class Connection {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The connection name.
   */
  connection: string

  /**
   * The entity name.
   */
  entity: string

  /**
   * Create a new connection instance.
   */
  constructor(store: Store<any>, entity: string) {
    this.store = store
    this.connection = store.$database.connection
    this.entity = entity
  }

  /**
   * Commit a namespaced store mutation.
   */
  private commit(name: string, payload?: any): void {
    this.store.commit(`${this.connection}/${this.entity}/${name}`, payload)
  }

  /**
   * Get all existing records.
   */
  get(): Elements {
    return this.store.state[this.connection][this.entity].data
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Element | null {
    return this.get()[id] ?? null
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: (string | number)[]): Element[] {
    const data = this.get()

    return ids.map((id) => data[id])
  }

  /**
   * Commit `insert` mutation to the store.
   */
  insert(records: Elements): void {
    this.commit('insert', records)
  }

  /**
   * Commit `update` mutation to the store.
   */
  update(records: Elements): void {
    this.commit('update', records)
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
}
