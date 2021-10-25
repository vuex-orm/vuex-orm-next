import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, MorphOne } from '@/index'

describe('feature/relations/morph_one_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph one" relation with custom primary key', () => {
    class Image extends Model {
      static entity = 'images'
    
      @Attr() id!: number
      @Str('') url!: string
      @Attr() imageable_id!: number
      @Attr() imageable_type!: string
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Attr() userId!: string
      @Str('') name!: string
    
      @MorphOne(() => Image, 'imageable_id', 'imageable_type')
      image!: Image | null
    }

    const store = createStore()

    store.$repo(User).save({
      userId: 1,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageable_type: 'users'
      }
    })

    assertState(store, {
      users: {
        1: { userId: 1, name: 'John Doe' }
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageable_id: 1,
          imageable_type: 'users'
        },
      }
    })
  })

  it('inserts "morph one" relation with custom local key', () => {
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
      @Attr() userId!: string
      @Str('') name!: string

      @MorphOne(() => Image, 'imageable_id', 'imageable_type', 'userId')
      image!: Image | null
    }

    const store = createStore()

    store.$repo(User).save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageable_type: 'users'
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: 2, name: 'John Doe' }
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageable_id: 2,
          imageable_type: 'users'
        },
      }
    })
  })
})
