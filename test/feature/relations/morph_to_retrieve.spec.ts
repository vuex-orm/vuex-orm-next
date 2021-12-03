import { createStore, fillState, assertModel } from 'test/Helpers'
import { Model, Attr, Num, Str, MorphTo } from '@/index'

describe('feature/relations/morph_to_retrieve', () => {
  class Image extends Model {
    static entity = 'images'

    @Num(0) id!: number
    @Str('') url!: string
    @Attr() imageableId!: number
    @Attr() imageableType!: string
    @MorphTo(() => [User, Post], 'imageableId', 'imageableType')
    imageable!: User | Post | null
  }

  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
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

    const userImage = store.$repo(Image).with('imageable').first()!
    const postImage = store
      .$repo(Image)
      .where('id', 2)
      .with('imageable')
      .first()!

    // Assert User Image
    expect(userImage).toBeInstanceOf(Image)
    expect(userImage.imageable).toBeInstanceOf(User)
    assertModel(userImage, {
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, name: 'John Doe' }
    })

    // Assert Post Image
    expect(postImage).toBeInstanceOf(Image)
    expect(postImage.imageable).toBeInstanceOf(Post)
    assertModel(postImage, {
      id: 2,
      url: '/post.jpg',
      imageableId: 1,
      imageableType: 'posts',
      imageable: { id: 1, title: 'Hello, world!' }
    })
  })

  it('can eager load morph to relation with constraints', () => {
    const store = createStore()

    fillState(store, MORPH_TO_ENTITIES)

    const limitOrderedImages = store
      .$repo(Image)
      .limit(2)
      .orderBy('id', 'desc')
      .with('imageable', (query) => {
        query.where('id', 2)
      })
      .get()!

    expect(limitOrderedImages.length).toBe(2)
    assertModel(limitOrderedImages[0], {
      id: 3,
      url: '/post2.jpg',
      imageableId: 2,
      imageableType: 'posts',
      imageable: { id: 2, title: 'Hello, world! Again!' }
    })
    assertModel(limitOrderedImages[1], {
      id: 2,
      url: '/post.jpg',
      imageableId: 1,
      imageableType: 'posts',
      imageable: null
    })
  })

  it('can eager load missing relation as `null`', () => {
    const store = createStore()
    fillState(store, {
      users: {},
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users'
        }
      }
    })

    const image = store.$repo(Image).with('imageable').first()!
    expect(image).toBeInstanceOf(Image)
    assertModel(image, {
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: null
    })
  })

  it('ignores the relation with the empty foreign key', () => {
    const store = createStore()
    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg'
        }
      }
    })

    const image = store.$repo(Image).with('imageable').first()!
    expect(image).toBeInstanceOf(Image)
    assertModel(image, {
      id: 1,
      url: '/profile.jpg',
      imageableId: null,
      imageableType: null,
      imageable: null
    })
  })
})
