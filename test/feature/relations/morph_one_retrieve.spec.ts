import { createStore, fillState, assertModel } from 'test/Helpers'
import { Model, Attr, Str, MorphOne } from '@/index'

describe('feature/relations/morph_one_retrieve', () => {
  class Image extends Model {
    static entity = 'images'
  
    @Attr() id!: number
    @Str('') url!: string
    @Attr() imageable_id!: number
    @Attr() imageable_type!: string
  }
  
  class User extends Model {
    static entity = 'users'
  
    @Attr() id!: number
    @Str('') name!: string
  
    @MorphOne(() => Image, 'imageable_id', 'imageable_type')
    image!: Image | null
  }
  
  class Post extends Model {
    static entity = 'posts'
  
    @Attr() id!: number
    @Str('') title!: string
    @MorphOne(() => Image, 'imageable_id', 'imageable_type')
    image!: Image | null
  }

  const MORPH_ONE_ENTITIES = {
    users: { 1: { id: 1, name: 'John Doe' } },
    posts: {
      1: { id: 1, title: 'Hello, world!' },
      2: { id: 2, title: 'Hello, world! Again!' }
    },
    images:{
      1: {
        id: 1,
        url: '/profile.jpg',
        imageable_id: 1,
        imageable_type: 'users'
      },
      2: {
        id: 2,
        url: '/post.jpg',
        imageable_id: 1,
        imageable_type: 'posts'
      },
      3: {
        id: 3,
        url: '/post2.jpg',
        imageable_id: 2,
        imageable_type: 'posts'
      }
    }
  }

  describe('when there are images', () => {
    const store = createStore()

    fillState(store, MORPH_ONE_ENTITIES)

    it('can eager load morph one relation for user', () => {
      const user = store.$repo(User).with('image').first()!

      expect(user).toBeInstanceOf(User)
      expect(user.image).toBeInstanceOf(Image)
      assertModel(user, {
        id: 1,
        name: 'John Doe',
        image: {
          id: 1,
          url: '/profile.jpg',
          imageable_id: 1,
          imageable_type: 'users'
        }
      })
    })

    it('can eager load morph one relation for post', () => {
      const post = store.$repo(Post).with('image').first()!

      expect(post).toBeInstanceOf(Post)
      expect(post.image).toBeInstanceOf(Image)
      assertModel(post, {
        id: 1,
        title: 'Hello, world!',
        image: {
          id: 2,
          url: '/post.jpg',
          imageable_id: 1,
          imageable_type: 'posts'
        }
      })
    })
  })

  describe('when there are no images', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {},
      images: {}
    })

    it('can eager load missing relation as `null`', () => {
      const user = store.$repo(User).with('image').first()!

      expect(user).toBeInstanceOf(User)
      assertModel(user, {
        id: 1,
        name: 'John Doe',
        image: null
      })
    })
  })
})
