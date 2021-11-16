import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, BelongsTo } from '@/index'

describe('feature/relations/belongs_to_save', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number | null
    @Str('') title!: string

    @BelongsTo(() => User, 'userId')
    author!: User | null
  }

  it('inserts a record to the store with "belongs to" relation', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      }
    })
  })

  it('generates missing foreign key', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      }
    })
  })

  it('can insert a record with missing relational key', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01'
    })

    assertState(store, {
      users: {},
      posts: {
        1: { id: 1, userId: null, title: 'Title 01' }
      }
    })
  })

  it('can insert a record with relational key set to `null`', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
      author: null
    })

    assertState(store, {
      users: {},
      posts: {
        1: { id: 1, userId: null, title: 'Title 01' }
      }
    })
  })
})
