import { createStore, assertState, mockUid } from 'test/Helpers'
import { Model, Str, Num, Bool, Uid, Attr } from '@/index'

describe('feature/repository/new', () => {
  it('inserts with a models default values', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('John Doe') name!: string
      @Num(21) age!: number
      @Bool(true) active!: boolean
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(User).new()

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe', age: 21, active: true }
      }
    })
  })

  it('throws if a primary key is not capable of being generated', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('John Doe') name!: string
    }

    const store = createStore()

    expect(() => store.$repo(User).new()).toThrow()
  })
})
