import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str, Num } from '@/index'

describe('feature/repository/updates_update_composite_key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['idA', 'idB']

    @Attr() idA!: any
    @Attr() idB!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('update records with composite key', async () => {
    const store = createStore()

    fillState(store, {
      users: {
        '[1,2]': { idA: 1, idB: 2, name: 'John Doe', age: 40 },
        '[2,1]': { idA: 2, idB: 1, name: 'Jane Doe', age: 30 }
      }
    })

    await store.$repo(User).update({ idA: 2, idB: 1, age: 50 })

    assertState(store, {
      users: {
        '[1,2]': { idA: 1, idB: 2, name: 'John Doe', age: 40 },
        '[2,1]': { idA: 2, idB: 1, name: 'Jane Doe', age: 50 }
      }
    })
  })

  it('throws if the one of the composite key is missing', async () => {
    expect.assertions(1)

    const store = createStore()

    fillState(store, {
      users: {
        '[1,2]': { idA: 1, idB: 2, name: 'John Doe', age: 40 },
        '[2,1]': { idA: 2, idB: 1, name: 'Jane Doe', age: 30 }
      }
    })

    try {
      await store.$repo(User).update({ idA: 2, age: 50 })
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
})
