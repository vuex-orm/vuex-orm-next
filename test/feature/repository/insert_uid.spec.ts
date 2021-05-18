import { createStore, assertState, mockUid } from 'test/Helpers'
import { Model, Uid, Str } from '@/index'

describe('feature/repository/insert_uid', () => {
  class User extends Model {
    static entity = 'users'

    @Uid() id!: string | null
    @Str('') name!: string
  }

  it('generates a unique id for a `uid` attribute', () => {
    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).insert([{ name: 'John Doe' }, { name: 'Jane Doe' }])

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
        uid2: { id: 'uid2', name: 'Jane Doe' }
      }
    })
  })
})
