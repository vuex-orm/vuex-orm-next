import { createStore, fillState, assertModel } from 'test/Helpers'
import { Model, Attr, Str, BelongsTo } from '@/index'

describe('feature/relations/eager_loads', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number | null
    @Attr() imageId!: number | null
    @Str('') title!: string

    @BelongsTo(() => User, 'userId')
    author!: User | null
    @BelongsTo(() => Image, 'imageId')
    image!: Image | null
  }

  class Image extends Model {
    static entity = 'images'

    @Attr() id!: number
    @Attr() artistId!: number | null
    @Str('') content!: string

    @BelongsTo(() => Artist, 'artistId')
    artist!: Artist | null
  }

  class Artist extends Model {
    static entity = 'artists'

    @Attr() id!: number
    @Str('') name!: string
  }

  it('can eager load all top level relations', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, imageId: 1, title: 'Title 01' }
      },
      images: {
        1: { id: 1, content: 'I am Base64', artistId: 1 }
      },
      artists: {
        1: { id: 1, name: 'Picasso' }
      }
    })

    const post = store.$repo(Post).withAll().first()!

    expect(post).toBeInstanceOf(Post)
    expect(post.author).toBeInstanceOf(User)
    expect(post.image).toBeInstanceOf(Image)
    expect(post.image!.artist).toBe(null)
    assertModel(post, {
      id: 1,
      userId: 1,
      imageId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
      image: { id: 1, artistId: 1, content: 'I am Base64', artist: null },
    })
  })

  it('can eager load all belongs to relations recursively', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, imageId: 1, title: 'Title 01' }
      },
      images: {
        1: { id: 1, content: 'I am Base64', artistId: 1 }
      },
      artists: {
        1: { id: 1, name: 'Picasso' }
      }
    })

    const post = store.$repo(Post).withAllRecursive().first()!

    expect(post).toBeInstanceOf(Post)
    expect(post.author).toBeInstanceOf(User)
    expect(post.image).toBeInstanceOf(Image)
    expect(post.image!.artist).toBeInstanceOf(Artist)
    assertModel(post, {
      id: 1,
      userId: 1,
      imageId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
      image: { id: 1, artistId: 1, content: 'I am Base64', artist: { id: 1, name: 'Picasso' } },
    })
  })
})
