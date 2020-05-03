import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@/index'

describe('unit/VuexORM', () => {
  Vue.use(Vuex)

  it('installs Vuex ORM to the store', () => {
    const store = new Vuex.Store({
      plugins: [VuexORM.install()]
    })

    const expected = {
      entities: {}
    }

    expect(store.state).toEqual(expected)
    expect(store.$database.started).toBe(true)
  })

  it('can customize the namespace', () => {
    const store = new Vuex.Store({
      plugins: [VuexORM.install({ namespace: 'database' })]
    })

    const expected = {
      database: {}
    }

    expect(store.state).toEqual(expected)
  })
})
