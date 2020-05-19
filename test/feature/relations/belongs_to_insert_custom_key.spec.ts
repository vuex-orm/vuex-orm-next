import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, BelongsTo } from '@/index'

describe('feature/relations/belongs_to_insert_custome_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "belongs to" relation with custom primary key', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Attr() userId!: number
      @Str('') name!: string
    }

    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: string
      @Attr() userId!: number | null
      @Str('') title!: string

      @BelongsTo(() => User, 'userId')
      author!: User | null
    }

    const store = createStore()

    await store.$repo(Post).insert({
      id: 1,
      title: 'Title 01',
      author: { userId: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: {
        1: { userId: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      }
    })
  })

  it('inserts "belongs to" relation with custom owner key', async () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Attr() userId!: number
      @Str('') name!: string
    }

    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: string
      @Attr() userId!: number | null
      @Str('') title!: string

      @BelongsTo(() => User, 'userId', 'userId')
      author!: User | null
    }

    const store = createStore()

    await store.$repo(Post).insert({
      id: 1,
      title: 'Title 01',
      author: { id: 1, userId: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      }
    })
  })
})
