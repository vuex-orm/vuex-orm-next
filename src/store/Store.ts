import { Store, Plugin } from 'vuex'
import { Database } from '../database/Database'
import { Repository } from '../repository/Repository'
import { plugins, components } from '../plugin/Plugin'

export interface InstallOptions {
  namespace?: string
}

type FilledInstallOptions = Required<InstallOptions>

/**
 * Install Vuex ORM to the store.
 */
export function install(options?: InstallOptions): Plugin<any> {
  return (store) => {
    mixin(store, createOptions(options))
  }
}

/**
 * Create options by merging the given user-provided options.
 */
function createOptions(options: InstallOptions = {}): FilledInstallOptions {
  return {
    namespace: options.namespace ?? 'entities'
  }
}

/**
 * Mixin Vuex ORM feature to the store.
 */
function mixin(store: Store<any>, options: FilledInstallOptions): void {
  createDatabase(store, options)

  installPlugins(store)

  mixinRepoFunction(store)

  startDatabase(store)
}

/**
 * Create a new database and connect to the store.
 */
function createDatabase(
  store: Store<any>,
  options: FilledInstallOptions
): void {
  const database = new Database()
    .setStore(store)
    .setConnection(options.namespace)

  store.$database = database
  if (!store.$databases) store.$databases = {}
  store.$databases[database.connection] = database
}

/**
 * Execute registered plugins.
 */
function installPlugins(store: Store<any>): void {
  plugins.forEach((plugin) => {
    const { func, options } = plugin

    func.install(store, components, options)
  })
}

/**
 * Start the database.
 */
function startDatabase(store: Store<any>): void {
  store.$database.start()
}

/**
 * Mixin repo function to the store.
 */
function mixinRepoFunction(store: Store<any>): void {
  store.$repo = function (modelOrRepository: any, connection?: string): any {
    let database: Database
    if (connection) {
      if (!(connection in store.$databases)) {
        database = new Database().setStore(store).setConnection(connection)
        store.$databases[connection] = database
        database.start()
      } else {
        database = store.$databases[connection]
      }
    } else {
      database = store.$database
    }
    const repository = modelOrRepository._isRepository
      ? new modelOrRepository(this).initialize()
      : new Repository(database).initialize(modelOrRepository)

    try {
      database.register(repository.getModel())
    } catch (e) {
    } finally {
      return repository
    }
  }
}
