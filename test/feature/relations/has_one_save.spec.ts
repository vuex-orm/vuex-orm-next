import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, HasOne } from '@/index'

describe('feature/relations/has_one_save', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasOne(() => Phone, 'userId')
    phone!: Phone | null
  }

  class Phone extends Model {
    static entity = 'phones'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') number!: string
  }

  it('inserts a record to the store with "has one" relation', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        userId: 1,
        number: '123-4567-8912'
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' }
      }
    })
  })

  it('generates missing foreign key', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912'
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' }
      }
    })
  })

  it('can insert a record with missing relational key', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe'
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {}
    })
  })

  it('can insert a record with relational key set to `null`', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      phone: null
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {}
    })
  })
})
