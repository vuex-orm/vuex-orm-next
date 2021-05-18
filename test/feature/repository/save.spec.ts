import {
  createStore,
  fillState,
  assertState,
  assertInstanceOf,
  assertModel,
  assertModels
} from 'test/Helpers'
import { Model, Str, Num } from '@/index'

describe('feature/repository/save', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('does nothing when passing in an empty array', () => {
    const store = createStore()

    store.$repo(User).save([])

    assertState(store, {
      users: {}
    })
  })

  it('saves a model to the store', () => {
    const store = createStore()

    store.$repo(User).save({ id: 1, name: 'John Doe', age: 30 })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 30 }
      }
    })
  })

  it('saves multiple models to the store', () => {
    const store = createStore()

    store.$repo(User).save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 20 }
    ])

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 20 }
      }
    })
  })

  it('updates existing model if it exists', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 30 }
      }
    })

    store.$repo(User).save({ id: 1, age: 20 })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 20 }
      }
    })
  })

  it('updates existing model if it exists when saving multiple model', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 30 }
      }
    })

    store.$repo(User).save([
      { id: 1, age: 20 },
      { id: 2, name: 'Jane Doe', age: 10 }
    ])

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 20 },
        2: { id: 2, name: 'Jane Doe', age: 10 }
      }
    })
  })

  it('returns a model', () => {
    const store = createStore()

    const user = store.$repo(User).save({ id: 1, name: 'John Doe', age: 30 })

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: 1, name: 'John Doe', age: 30 })
  })

  it('returns multiple models when saving multiple records', () => {
    const store = createStore()

    const users = store.$repo(User).save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 20 }
    ])

    assertInstanceOf(users, User)
    assertModels(users, [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 20 }
    ])
  })
})
