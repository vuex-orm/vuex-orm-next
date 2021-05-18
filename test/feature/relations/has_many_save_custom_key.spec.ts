import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, HasMany } from '@/index'

describe('feature/relations/has_many_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Attr() userId!: string
      @Str('') name!: string

      @HasMany(() => Post, 'userId')
      posts!: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: number
      @Attr() userId!: number
      @Str('') title!: string
    }

    const store = createStore()

    store.$repo(User).save({
      userId: 1,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' }
      ]
    })

    assertState(store, {
      users: {
        1: { userId: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' }
      }
    })
  })

  it('inserts "has many" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Attr() userId!: number
      @Str('') name!: string

      @HasMany(() => Post, 'userId', 'userId')
      posts!: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') title!: string
    }

    const store = createStore()

    store.$repo(User).save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' }
      ]
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: 2, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 2, title: 'Title 01' },
        2: { id: 2, userId: 2, title: 'Title 02' }
      }
    })
  })
})
