import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, BelongsTo, HasMany } from '@/index'

describe('feature/relations/nested/nested_relations', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasMany(() => Follower, 'userId')
    followers!: Follower[]
  }

  class Follower extends Model {
    static entity = 'followers'

    @Attr() id!: number
    @Attr() userId!: number
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number | null
    @Str('') title!: string

    @BelongsTo(() => User, 'userId')
    author!: User | null
  }

  it('inserts a nested relations with missing foreign key', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: {
        id: 1,
        name: 'John Doe',
        followers: [{ id: 1 }, { id: 2 }]
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      followers: {
        1: { id: 1, userId: 1 },
        2: { id: 2, userId: 1 }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      }
    })
  })
})
