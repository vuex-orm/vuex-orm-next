import { createStore, fillState, assertModel } from 'test/Helpers'
import { Model, Attr, Str, MorphTo } from '@/index'

describe('feature/relations/morph_to_retrieve_with_constraints', () => {
  class Image extends Model {
    static entity = 'images'

    @Attr() id!: number
    @Str('') url!: string
    @Attr() imageableId!: number
    @Attr() imageableType!: string
    @MorphTo(() => [User, Post], 'imageableId', 'imageableType')
    imageable!: User | Post | null
  }

  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Str('') title!: string
  }

  const MORPH_TO_ENTITIES = {
    users: { 1: { id: 1, name: 'John Doe' } },
    posts: {
      1: { id: 1, title: 'Hello, world!' },
      2: { id: 2, title: 'Hello, world! Again!' }
    },
    images: {
      1: {
        id: 1,
        url: '/profile.jpg',
        imageableId: 1,
        imageableType: 'users'
      },
      2: {
        id: 2,
        url: '/post.jpg',
        imageableId: 1,
        imageableType: 'posts'
      },
      3: {
        id: 3,
        url: '/post2.jpg',
        imageableId: 2,
        imageableType: 'posts'
      }
    }
  }

  it('can eager load morph to relation', () => {
    const store = createStore()

    fillState(store, MORPH_TO_ENTITIES)

    const limitOrderedImages = store
      .$repo(Image)
      .limit(2)
      .orderBy('id', 'desc')
      .with('imageable')
      .get()!

    // Assert User Image
    expect(limitOrderedImages[0]).toBeInstanceOf(Image)
    expect(limitOrderedImages[0].imageable).toBeInstanceOf(Post)
    assertModel(limitOrderedImages[0], {
      id: 3,
      url: '/post2.jpg',
      imageableId: 2,
      imageableType: 'posts',
      imageable: { id: 2, title: 'Hello, world! Again!' }
    })

    // Assert Post Image
    expect(limitOrderedImages[1]).toBeInstanceOf(Image)
    expect(limitOrderedImages[1].imageable).toBeInstanceOf(Post)
    assertModel(limitOrderedImages[1], {
      id: 2,
      url: '/post.jpg',
      imageableId: 1,
      imageableType: 'posts',
      imageable: { id: 1, title: 'Hello, world!' }
    })
  })
})
