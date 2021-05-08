import { createStore, assertState, mockUid } from 'test/Helpers'
import { Model, Str, Num, Bool, Uid, Attr } from '@/index'

describe('feature/repository/inserts_new', () => {
  it('inserts with a models default values', async () => {
    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('John Doe') name!: string
      @Num(21) age!: number
      @Bool(true) active!: boolean
    }

    mockUid(['uid1'])

    const store = createStore()

    await store.$repo(User).new()

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe', age: 21, active: true }
      }
    })
  })

  it('throws if a primary key is not capable of being generated', async () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: string
      @Str('John Doe') name!: string
    }

    const store = createStore()

    await expect(() => store.$repo(User).new()).rejects.toThrow()
  })
})
