import { createStore, assertModel } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('unit/repository/Repository', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('John Doe') name!: string
  }

  it('creates a new model instance', () => {
    const store = createStore([User])

    const user = store.$repo(User).make()

    expect(user).toBeInstanceOf(User)
    expect(user.$store).toBe(store)
    assertModel(user, { id: null, name: 'John Doe' })
  })

  it('creates a new model instance with default values', () => {
    const store = createStore([User])

    const user = store.$repo(User).make({
      id: 1,
      name: 'Jane Doe'
    })

    expect(user).toBeInstanceOf(User)
    expect(user.$store).toBe(store)
    assertModel(user, { id: 1, name: 'Jane Doe' })
  })
})
