import { createStore, fillState, assertModel } from 'test/Helpers'
import {
  User,
  Post,
  Image,
  MORPH_ONE_ENTITIES
} from 'test/feature/fixtures/relations/morph_one'

/*
  Potential Improvements
   - DRY test cases
*/
describe('feature/relations/morph_one_retrieve', () => {
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
