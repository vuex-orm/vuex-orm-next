import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/model/deletes_delete', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes a record', async () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })

    const user = store.$repo(User).find(1)!

    const result = user.$delete()

    expect(result).toBe(true)

    assertState(store, {
      users: {}
    })
  })
})
