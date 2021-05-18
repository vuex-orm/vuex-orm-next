import {
  createStore,
  fillState,
  assertState,
  assertInstanceOf
} from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/flush', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes all records in the store', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const users = store.$repo(User).flush()

    assertState(store, {
      users: {}
    })

    assertInstanceOf(users, User)
  })
})
