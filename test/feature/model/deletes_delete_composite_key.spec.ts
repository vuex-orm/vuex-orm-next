import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/model/deletes_delete_composite_key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['idA', 'idB']

    @Attr() idA!: any
    @Attr() idB!: any
    @Str('') name!: string
  }

  it('deletes a record', async () => {
    const store = createStore()

    fillState(store, {
      users: {
        '[1,2]': { idA: 1, idB: 2, name: 'John Doe' }
      }
    })

    const user = store.$repo(User).where('idA', 1).where('idB', 2).first()!

    const result = user.$delete()

    expect(result).toBe(true)

    assertState(store, {
      users: {}
    })
  })
})
