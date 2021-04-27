import { createStore, fillState } from 'test/Helpers'
import { Model, Num, Str } from '@/index'

describe('feature/repository/retrieves_revive', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string
  }

  it('retrieves a model from the store by the given schema', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const schema = {
      __id: 2
    }

    const user = store.$repo(User).revive(schema)!

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(2)
  })

  it('returns null if result can not be found when passing object schema', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    // Test missing id in the store.
    expect(store.$repo(User).revive({ __id: 4 })).toBe(null)

    // Test missing id in the schema.
    expect(store.$repo(User).revive({})).toBe(null)
  })

  it('retrieves multiple models from the store by the given schema', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const schema = [{ __id: 3 }, { __id: 1 }]

    const users = store.$repo(User).revive(schema)

    expect(users.length).toBe(2)
    expect(users[0].id).toBe(3)
    expect(users[1].id).toBe(1)
  })
})
