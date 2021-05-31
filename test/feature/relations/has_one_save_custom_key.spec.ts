import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, HasOne } from '@/index'

describe('feature/relations/has_one_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has one" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Attr() userId!: string
      @Str('') name!: string

      @HasOne(() => Phone, 'userId')
      phone!: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') number!: string
    }

    const store = createStore()

    store.$repo(User).save({
      userId: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912'
      }
    })

    assertState(store, {
      users: {
        1: { userId: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' }
      }
    })
  })

  it('inserts "has one" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') name!: string

      @HasOne(() => Phone, 'userId', 'userId')
      phone!: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') number!: string
    }

    const store = createStore()

    store.$repo(User).save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912'
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: 2, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 2, number: '123-4567-8912' }
      }
    })
  })
})
