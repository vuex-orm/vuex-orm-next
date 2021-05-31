import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/insert', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('inserts a record to the store', () => {
    const store = createStore()

    store.$repo(User).insert({ id: 1, name: 'John Doe' })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })

  it('inserts records to the store', () => {
    const store = createStore()

    store.$repo(User).insert([
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

  it('does nothing if the given data is an empty array', () => {
    const store = createStore()

    store.$repo(User).insert([])
    assertState(store, { users: {} })
  })
})
