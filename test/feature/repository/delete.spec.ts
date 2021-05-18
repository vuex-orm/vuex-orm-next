import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/delete', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes a record specified by the where clause', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    store.$repo(User).where('name', 'Jane Doe').delete()

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })
  })

  it('can delete multiple records specified by the where clause', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    store
      .$repo(User)
      .where('name', 'Jane Doe')
      .orWhere('name', 'Johnny Doe')
      .delete()

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })
})
