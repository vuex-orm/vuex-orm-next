import { assertModel, createStore, fillState } from 'test/Helpers'
import { Model, Attr, Str, BelongsTo, HasOne } from '@/index'

describe('feature/relations/eager_loads_recursive', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasOne(() => Phone, 'userId')
    phone!: Phone
  }

  class Phone extends Model {
    static entity = 'phones'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') number!: string

    @BelongsTo(() => User, 'userId')
    user!: User
  }

  it('eager loads all relations recursively', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' }
      }
    })

    const user = store.$repo(User).withAllRecursive().first()!

    expect(user.phone.user).toBeInstanceOf(User)
    expect(user.phone.user.phone).toBeInstanceOf(Phone)
    expect(user.phone.user.phone.user).toBeInstanceOf(User)
    assertModel(user.phone.user.phone.user, {
      id: 1,
      name: 'John Doe'
    })
  })

  it('eager loads all relations with a given recursion limit', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' }
      }
    })

    const user = store.$repo(User).withAllRecursive(1).first()!

    expect(user.phone.user).toBeInstanceOf(User)
    assertModel(user.phone.user, {
      id: 1,
      name: 'John Doe'
    })
  })
})
