import { createStore, assertModel } from 'test/Helpers'
import { Model, Attr, Str, Repository } from '@/index'

describe('unit/repository/Repository', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('John Doe') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: any
    @Str('Title 001') title!: string
  }

  it('creates a new model instance', () => {
    const store = createStore()

    const user = store.$repo(User).make()

    expect(user).toBeInstanceOf(User)
    expect(user.$database()).toBe(store.$database)
    assertModel(user, { id: null, name: 'John Doe' })
  })

  it('creates a new model instance in a new database', () => {
    const store = createStore()

    const connection = 'test_namespace'
    const user = store.$repo(User, connection).make()

    expect(user).toBeInstanceOf(User)
    expect(user.$database()).toBe(store.$databases[connection])
    expect(user.$database().started).toBe(true)
    assertModel(user, { id: null, name: 'John Doe' })
  })

  it('creates a new model instance with default values', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      name: 'Jane Doe'
    })

    expect(user).toBeInstanceOf(User)
    expect(user.$database()).toBe(store.$database)
    assertModel(user, { id: 1, name: 'Jane Doe' })
  })

  it('can create a new repository from the model', () => {
    const store = createStore()

    const userRepo = store.$repo(User)

    const postRepo = userRepo.repo(Post)

    expect(postRepo.getModel()).toBeInstanceOf(Post)
  })

  it('can create a new repository from the custom repository', () => {
    class PostRepository extends Repository<Post> {
      use = Post
    }

    const store = createStore()

    const userRepo = store.$repo(User)

    const postRepo = userRepo.repo(PostRepository)

    expect(postRepo.getModel()).toBeInstanceOf(Post)
  })
})
