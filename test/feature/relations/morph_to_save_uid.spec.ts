import { createStore, assertState, mockUid } from 'test/Helpers'
import { Model, Attr, Uid, Str, MorphTo } from '@/index'

describe('feature/relations/morph_to_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph to" relation with parent having "uid" field as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      @Uid() id!: number
      @Str('') url!: string
      @Attr() imageableId!: number
      @Attr() imageableType!: string
      @MorphTo('imageableId', 'imageableType')
      imageable!: User | null
    }

    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Str('') name!: string
    }

    mockUid(['uid1'])

    const store = createStore()

    // TODO: move this logic to helper
    store.$repo(Image)
    store.$repo(User)

    store.$repo(Image).save({
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: { 1: { id: 1, name: 'John Doe' } },
      images: {
        uid1: {
          id: 'uid1',
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users'
        }
      }
    })
  })

  it('inserts "morph to" relation with child having "uid" as the owner key', () => {
    class Image extends Model {
      static entity = 'images'

      @Uid() id!: string
      @Str('') url!: string
      @Attr() imageableId!: string
      @Attr() imageableType!: string
      @MorphTo('imageableId', 'imageableType')
      imageable!: User | null
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    // TODO: move this logic to helper
    store.$repo(Image)
    store.$repo(User)

    store.$repo(Image).save({
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { name: 'John Doe' }
    })

    assertState(store, {
      users: { uid2: { id: 'uid2', name: 'John Doe' } },
      images: {
        uid1: {
          id: 'uid1',
          url: '/profile.jpg',
          imageableId: 'uid2',
          imageableType: 'users'
        }
      }
    })
  })
})
