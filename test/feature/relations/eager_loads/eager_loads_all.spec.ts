import {
  assertInstanceOf,
  assertModel,
  createStore,
  fillState
} from 'test/Helpers'
import { Model, Attr, Str, HasMany, BelongsTo } from '@/index'

describe('feature/relations/eager_loads_all', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') title!: string

    @BelongsTo(() => User, 'userId')
    author!: User | null

    @HasMany(() => Comment, 'postId')
    comments!: Comment[]
  }

  class Comment extends Model {
    static entity = 'comments'

    @Attr() id!: number
    @Attr() postId!: number
    @Str('') content!: string
  }

  it('eager loads all top level relations', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      },
      comments: {
        1: { id: 1, postId: 1, content: 'Content 01' }
      }
    })

    const post = store.$repo(Post).withAll().first()!

    expect(post.author).toBeInstanceOf(User)
    assertInstanceOf(post.comments, Comment)
    assertModel(post, {
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
      comments: [{ id: 1, postId: 1, content: 'Content 01' }]
    })
  })
})
