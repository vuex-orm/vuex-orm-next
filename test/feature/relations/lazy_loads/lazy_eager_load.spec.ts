import { createStore, fillState, assertModels } from 'test/Helpers'
import { Model, Attr, Str, HasMany } from '@/index'

describe('feature/relations/lazy_loads/lazy_eager_load', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
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

  it('can lazy eager load relations', async () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' }
      }
    })

    const userRepo = store.$repo(User)

    const users = userRepo.all()

    assertModels(users, [{ id: 1, name: 'John Doe' }])

    userRepo.with('posts').load(users)

    assertModels(users, [
      {
        id: 1,
        name: 'John Doe',
        posts: [
          { id: 1, userId: 1, title: 'Title 01' },
          { id: 2, userId: 1, title: 'Title 02' }
        ]
      }
    ])
  })
})
