import { createStore, assertState } from 'test/Helpers'
import { Model, Num, Str, MorphTo } from '@/index'

describe('feature/relations/morph_to_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph to" relation with custom primary key', () => {
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

      static primaryKey = 'userId'

      @Num(0) userId!: number
      @Str('') name!: string
    }

    const store = createStore()

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

      @Num(0) id!: number
      @Str('') url!: string
      @Num(0) imageableId!: number
      @Str('') imageableType!: string
      @MorphTo(() => [User], 'imageableId', 'imageableType', 'imageableId')
      imageable!: User | null
    }

    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Num(0) imageableId!: number
      @Str('') name!: string
    }

    const store = createStore()

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
