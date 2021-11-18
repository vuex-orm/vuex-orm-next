import { createStore, assertState } from 'test/Helpers'
import { Model, Str, Num, MorphOne, MorphTo } from '@/index'

describe('feature/relations/morph_one_to', () => {
  class Image extends Model {
    static entity = 'images'

    @Num(0) id!: number
    @Str('') url!: string
    @Num(0) imageableId!: number
    @Str('') imageableType!: string

    @MorphTo(() => [User], 'imageableId', 'imageableType')
    imageable!: User | null
  }

  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @MorphOne(() => Image, 'imageableId', 'imageableType')
    image!: Image | null
  }

  it('inserts a record to the store with "morph one" and "morph to" relations', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableId: 1,
        imageableType: 'users'
      }
    })

    store.$repo(Image).save({
      id: 2,
      url: '/profile2.jpg',
      imageableId: 2,
      imageableType: 'users',
      imageable: {
        id: 2,
        name: 'John Doe 2'
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'John Doe 2' }
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
          url: '/profile2.jpg',
          imageableId: 2,
          imageableType: 'users'
        }
      }
    })
  })
})
