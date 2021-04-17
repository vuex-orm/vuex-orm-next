import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/inserts_replace', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('replaces a record in the store', async () => {
    const store = createStore()

    await store.$repo(User).replace({ id: 1, name: 'John Doe' })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })

  it('replaces multiple records in the store', async () => {
    const store = createStore()

    await store.$repo(User).replace([
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



  it('replaces existing records', async () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })

    await store.$repo(User).replace([
      { id: 3, name: 'Johnny Doe' },
      { id: 4, name: 'David Doe' }
    ])

    assertState(store, {
      users: {
        3: { id: 3, name: 'Johnny Doe' },
        4: { id: 4, name: 'David Doe' }
      }
    })
  })
})
