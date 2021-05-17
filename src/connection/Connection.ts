import { Store } from 'vuex'
import { isArray } from '../support/Utils'
import { Element, Elements } from '../data/Data'
import { Database } from '../database/Database'
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
  constructor(database: Database, model: M) {
    this.store = database.store
    this.connection = database.connection
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
    const newRecords = {} as Elements

    const data = this.get()

    for (const id in records) {
      const record = records[id]
      const existing = data[id]

      newRecords[id] = existing
        ? Object.assign({}, existing, this.model.$sanitize(record))
        : this.model.$sanitizeAndFill(record)
    }

    this.commit('save', newRecords)
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
   * Commit `destroy` mutation to the store.
   */
  destroy(id: string | number): string | null
  destroy(ids: (string | number)[]): string[]
  destroy(ids: string | number | (string | number)[]): string | string[] | null {
    return isArray(ids) ? this.destroyMany(ids) : this.destroyOne(ids)
  }

  /**
   * Destroy a record from the store.
   */
  protected destroyOne(id: string | number): string | null {
    id = String(id)

    const record = this.get()[id]

    if (!record) {
      return null
    }

    this.commit('destroy', [id])

    return id
  }

  /**
   * Destroy records from the store.
   */
  protected destroyMany(ids: (string | number)[]): string[] {
    const deleted = [] as string[]

    const data = this.get()

    ids.forEach((id) => {
      const record = data[id]

      if (record) {
        deleted.push(String(id))
      }
    })

    this.commit('destroy', deleted)

    return deleted
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
  flush(): string[] {
    const deleted = [] as string[]

    const data = this.get()

    for (const id in data) {
      deleted.push(id)
    }

    this.commit('flush')

    return deleted
  }
}
