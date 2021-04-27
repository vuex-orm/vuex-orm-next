import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Num, Str, HasMany } from '@/index'

describe('feature/relations/has_many_save', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @HasMany(() => Post, 'userId')
    posts!: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Num(0) userId!: number
    @Str('') title!: string
  }

  it('saves a model to the store with "has many" relation', () => {
    const store = createStore()

    fillState(store, {
      users: {},
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      }
    })

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, userId: 1, title: 100 },
        { id: 2, userId: 1, title: 200 }
      ]
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: '100' },
        2: { id: 2, userId: 1, title: '200' }
      }
    })
  })

  it('generates missing foreign key', async () => {
    const store = createStore()

    await store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' }
      ]
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' }
      }
    })
  })

  it('can insert a record with missing relational key', async () => {
    const store = createStore()

    await store.$repo(User).save({
      id: 1,
      name: 'John Doe'
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {}
    })
  })
})
