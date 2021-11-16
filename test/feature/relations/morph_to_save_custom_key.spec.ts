import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, MorphTo } from '@/index'

describe('feature/relations/morph_to_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  // TODO: Fix this broken test, for some reason the record and model are being confused

  it('inserts "morph to" relation with custom primary key', () => {
    class Image extends Model {
      static entity = 'images'

      @Attr() id!: number
      @Str('') url!: string
      @Attr() imageableId!: number
      @Attr() imageableType!: string
      @MorphTo('imageableId', 'imageableType')
      imageable!: User | null
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Attr() userId!: number
      @Str('') name!: string
    }

    const store = createStore()

    // TODO: move this logic to helper
    store.$repo(Image)
    store.$repo(User)

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { userId: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: { 1: { userId: 1, name: 'John Doe' } },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users'
        }
      }
    })
  })

  it('inserts "morph to" relation with custom local key', () => {
    class Image extends Model {
      static entity = 'images'

      @Attr() id!: number
      @Str('') url!: string
      @Attr() imageableId!: number
      @Attr() imageableType!: string
      @MorphTo('imageableId', 'imageableType', 'imageableId')
      imageable!: User | null
    }

    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Attr() imageableId!: number
      @Str('') name!: string
    }

    const store = createStore()

    // TODO: move this logic to helper
    store.$repo(Image)
    store.$repo(User)

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, imageableId: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: { 1: { id: 1, imageableId: 1, name: 'John Doe' } },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users'
        }
      }
    })
  })
})
