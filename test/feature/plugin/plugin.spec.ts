import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VuexORM, { Database, Model, VuexORMPlugin } from '@/index'

Vue.use(Vuex)

describe('feature/plugin/plugin', () => {
  it('can add extra feature to the store', async () => {
    const plugin: VuexORMPlugin = {
      install(store) {
        ;(store as any).custom = 1
      }
    }

    VuexORM.use(plugin)

    const database = new Database()

    const store = new Store({
      plugins: [VuexORM.install(database)]
    })

    expect((store as any).custom).toBe(1)
  })

  it('can add extra feature to the database instance', async () => {
    const plugin: VuexORMPlugin = {
      install(_store, database) {
        ;(database as any).custom = 1
      }
    }

    VuexORM.use(plugin)

    const database = new Database()

    new Store({
      plugins: [VuexORM.install(database)]
    })

    expect((database as any).custom).toBe(1)
  })

  it('can add extra feature to the components', async () => {
    const plugin: VuexORMPlugin = {
      install(_store, _database, components) {
        ;(components.Model as any).custom = 1
      }
    }

    VuexORM.use(plugin)

    const database = new Database()

    new Store({
      plugins: [VuexORM.install(database)]
    })

    expect((Model as any).custom).toBe(1)
  })

  it('can take options', async () => {
    const plugin: VuexORMPlugin = {
      install(store, _database, _components, options) {
        ;(store as any).custom = options
      }
    }

    VuexORM.use(plugin, 1)

    const database = new Database()

    new Store({
      plugins: [VuexORM.install(database)]
    })

    expect((Model as any).custom).toBe(1)
  })
})
