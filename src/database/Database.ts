import { Store } from 'vuex'
import { schema as Normalizr } from 'normalizr'
import { Schema } from '../schema/Schema'
import { Model } from '../model/Model'
import { Relation } from '../model/attributes/relations/Relation'
import { State } from '../modules/State'
import { mutations, Mutations } from '../modules/Mutations'

export class Database {
  /**
   * The store instance.
   */
  store!: Store<any>

  /**
   * The name of Vuex Module namespace. Vuex ORM will create Vuex Modules from
   * the registered models, and modules, and define them under this namespace.
   */
  connection!: string

  /**
   * The list of registered models.
   */
  models: Record<string, Model> = {}

  /**
   * The schema definition for the registered models.
   */
  schemas: Record<string, Normalizr.Entity> = {}

  /**
   * Whether the database has already been installed to Vuex or not.
   * The model registration procedure depends on this flag.
   */
  started: boolean = false

  /**
   * Set the store.
   */
  setStore(store: Store<any>): this {
    this.store = store

    return this
  }

  /**
   * Set the connection.
   */
  setConnection(connection: string): this {
    this.connection = connection

    return this
  }

  /**
   * Initialize the database before a user can start using it.
   */
  start(): void {
    this.createRootModule()

    this.started = true
  }

  /**
   * Register the given model.
   */
  register<M extends Model>(model: M): void {
    if (!this.models[model.$entity]) {
      this.models[model.$entity] = model

      this.createModule(model)

      this.createSchema(model)

      this.registerRelatedModels(model)
    }
  }

  /**
   * Register all related models.
   */
  private registerRelatedModels<M extends Model>(model: M): void {
    for (const name in model.$fields) {
      const attr = model.$fields[name]

      if (attr instanceof Relation) {
        attr.getRelateds().forEach((m) => {
          this.register(m.$setStore(this.store))
        })
      }
    }
  }

  /**
   * Get a model by the specified entity name.
   */
  getModel<M extends Model>(name: string): M {
    return this.models[name] as M
  }

  /**
   * Get schema by the specified entity name.
   */
  getSchema(name: string): Normalizr.Entity {
    return this.schemas[name]
  }

  /**
   * Create root module.
   */
  private createRootModule(): void {
    this.store.registerModule(this.connection, {
      namespaced: true
    })
  }

  /**
   * Create sub module.
   */
  private createModule<M extends Model>(model: M): void {
    const preserveState = !!this.store.state[this.connection][model.$entity]

    this.store.registerModule([this.connection, model.$entity], {
      namespaced: true,
      state: this.createState(),
      mutations: this.createMutations()
    }, { preserveState })
  }

  /**
   * Create sub state.
   */
  private createState(): State {
    return {
      data: {}
    }
  }

  /**
   * Create sub mutations.
   */
  private createMutations(): Mutations<State> {
    return mutations
  }

  /**
   * Create schema from the given model.
   */
  private createSchema<M extends Model>(model: M): Normalizr.Entity {
    return this.schemas[model.$entity] = new Schema(model).one()
  }
}
