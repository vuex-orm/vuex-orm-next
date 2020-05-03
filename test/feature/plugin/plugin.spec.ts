import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VuexORM, { Model, VuexORMPlugin } from '@/index'

Vue.use(Vuex)

describe('feature/plugin/plugin', () => {
  it('can add extra feature to the store', async () => {
    const plugin: VuexORMPlugin = {
      install(store) {
        ;(store as any).custom = 1
      }
    }

    VuexORM.use(plugin)

    const store = new Store({
      plugins: [VuexORM.install()]
    })

    expect((store as any).custom).toBe(1)
  })

  it('can add extra feature to the components', async () => {
    const plugin: VuexORMPlugin = {
      install(_store, components) {
        ;(components.Model as any).custom = 1
      }
    }

    VuexORM.use(plugin)

    new Store({
      plugins: [VuexORM.install()]
    })

    expect((Model as any).custom).toBe(1)
  })

  it('can take options', async () => {
    const plugin: VuexORMPlugin = {
      install(store, _components, options) {
        ;(store as any).custom = options
      }
    }

    VuexORM.use(plugin, 1)

    new Store({
      plugins: [VuexORM.install()]
    })

    expect((Model as any).custom).toBe(1)
  })
})
