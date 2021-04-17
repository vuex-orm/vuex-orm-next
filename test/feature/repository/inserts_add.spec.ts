import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/inserts_add', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('inserts a record to the store', async () => {
    const store = createStore()

    await store.$repo(User).add({ id: 1, name: 'John Doe' })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })

  it('inserts multiple records to the store', async () => {
    const store = createStore()

    await store.$repo(User).add([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })
})
