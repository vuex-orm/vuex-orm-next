import { createStore, fillState } from 'test/Helpers'
import { Model, Attr, BelongsTo, HasMany } from '@/index'

describe('feature/relations/nested/nested_revive', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number

    @HasMany(() => Post, 'userId')
    posts!: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number | null

    @BelongsTo(() => User, 'userId')
    author!: User | null

    @HasMany(() => Comment, 'postId')
    comments!: Comment[]
  }

  class Comment extends Model {
    static entity = 'comments'

    @Attr() id!: number
    @Attr() postId!: number
    @Attr() userId!: number

    @BelongsTo(() => User, 'userId')
    author!: User | null
  }

  it('can revive a complex nested schema', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
        4: { id: 4 }
      },
      posts: {
        1: { id: 1, userId: 2 },
        2: { id: 2, userId: 2 },
        3: { id: 3, userId: 1 },
        4: { id: 4, userId: 1 }
      },
      comments: {
        1: { id: 1, postId: 4, userId: 4 },
        2: { id: 2, postId: 1, userId: 2 },
        3: { id: 3, postId: 2, userId: 3 },
        4: { id: 4, postId: 4, userId: 3 },
        5: { id: 5, postId: 2, userId: 1 }
      }
    })

    const schema = {
      result: ['2', '1'],
      entities: {
        users: {
          1: { id: 1, posts: ['4', '3'] },
          2: { id: 2, posts: ['1', '2'] },
          3: { id: 3 },
          4: { id: 4 }
        },
        posts: {
          1: { id: 1, userId: 2, comments: ['2'] },
          2: { id: 2, userId: 2, comments: ['3', '5'] },
          3: { id: 3, userId: 1, comments: [] },
          4: { id: 4, userId: 1, comments: ['4', '1'] }
        },
        comments: {
          1: { id: 1, postId: 4, userId: 4, author: '4' },
          2: { id: 2, postId: 1, userId: 2, author: '2' },
          3: { id: 3, postId: 2, userId: 3, author: '3' },
          4: { id: 4, postId: 4, userId: 3, author: '3' },
          5: { id: 5, postId: 2, userId: 1, author: '1' }
        }
      }
    }

    const users = store.$repo(User).revive(schema)
console.log(users)
    expect(users.length).toBe(2)
    expect(users[0].posts.length).toBe(2)
    expect(users[1].posts.length).toBe(2)
  })
})
