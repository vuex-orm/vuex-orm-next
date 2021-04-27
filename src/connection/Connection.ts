import Vue from 'vue'
import { Store } from 'vuex'
import { Element, Elements } from '../data/Data'
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
   * The connection name.
   */
  connection: string

  /**
   * The entity name.
   */
  model: M

  /**
   * Create a new connection instance.
   */
  constructor(store: Store<any>, model: M) {
    this.store = store
    this.connection = store.$database.connection
    this.model = model
  }

  /**
   * Commit a namespaced store mutation.
   */
  private commit(name: string, payload?: any): void {
    const type = `${this.connection}/${this.model.$entity()}/${name}`

    this.store.commit(type, payload)
  }

  /**
   * Get all existing records.
   */
  get(): Elements {
    return this.store.state[this.connection][this.model.$entity()].data
  }

  /**
   * Find a model by its index id.
   */
  find(id: string): Element | null {
    return this.get()[id] ?? null
  }

  /**
   * Commit `save` mutation to the store.
   */
  save(records: Elements): void {
    this.commit('save', (data: Elements) => {
      for (const id in records) {
        const record = records[id]
        const existing = data[id]

        // TODO: Refactor this with more efficient methods.
        existing
          ? Vue.set(
              data,
              id,
              this.model
                .$newInstance({ ...existing, ...record })
                .$getAttributes()
            )
          : Vue.set(data, id, this.model.$newInstance(record).$getAttributes())
      }
    })
  }

  /**
   * Commit `insert` mutation to the store.
   */
  insert(records: Elements): void {
    this.commit('insert', records)
  }

  /**
   * Commit `fresh` mutation to the store.
   */
  fresh(records: Elements): void {
    this.commit('fresh', records)
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
   * Commit `flush` mutation to the store.
   */
  flush(): void {
    this.commit('flush')
  }
}
