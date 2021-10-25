import { createStore, assertState, mockUid } from 'test/Helpers'
import { Model, Attr, Uid, Str, MorphOne } from '@/index'

describe('feature/relations/morph_one_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph one" relation with parent having "uid" field as the primary key', () => {
    class Image extends Model {
      static entity = 'images'
    
      @Attr() id!: number
      @Str('') url!: string
      @Attr() imageable_id!: number
      @Attr() imageable_type!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string
    
      @MorphOne(() => Image, 'imageable_id', 'imageable_type')
      image!: Image | null
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageable_type: 'users'
      }
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' }
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageable_id: 'uid1',
          imageable_type: 'users'
        },
      }
    })
  })

it('inserts "morph one" relation with child having "uid" as the foreign key', () => {
    class Image extends Model {
      static entity = 'images'
    
      @Uid() id!: string
      @Str('') url!: string
      @Uid() imageable_id!: string
      @Attr() imageable_type!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @MorphOne(() => Image, 'imageable_id', 'imageable_type')
      image!: Image | null
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      image: {
        url: '/profile.jpg',
      }
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' }
      },
      images: {
        uid2: { id: 'uid2', url: '/profile.jpg', imageable_id: 'uid1', imageable_type: 'users' }
      }
    })
  })

  it('inserts "morph one" relation with child having "uid" as foreign key being primary key', () => {
    class Image extends Model {
      static entity = 'images'
      static primaryKey = ['imageable_id', 'imageable_type']
    
      @Str('') url!: string
      @Uid() imageable_id!: number
      @Attr() imageable_type!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @MorphOne(() => Image, 'imageable_id', 'imageable_type')
      image!: Image | null
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      image: {
        url: '/profile.jpg',
      }
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' }
      },
      images: {
        '[\"uid1\",\"users\"]': { url: '/profile.jpg', imageable_id: 'uid1', imageable_type: 'users' }
      }
    })
  })
})
