import { createStore, assertState } from 'test/Helpers'
import { Model, Num, Str, MorphTo } from '@/index'

describe('feature/relations/morph_to_save', () => {
  class Image extends Model {
    static entity = 'images'

    @Num(0) id!: number
    @Str('') url!: string
    @Num(0) imageableId!: number
    @Str('') imageableType!: string
    @MorphTo(() => [User], 'imageableId', 'imageableType')
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

  it('inserts a record to the store with "morph to" relation', () => {
    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: { 1: { id: 1, name: 'John Doe' } },
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

  it('generates missing foreign key', () => {
    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { id: 1, name: 'John Doe' }
    })

    assertState(store, {
      users: { 1: { id: 1, name: 'John Doe' } },
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

  it('can insert a record with missing relational key', () => {
    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg'
    })

    assertState(store, {
      users: {},
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 0,
          imageableType: ''
        }
      }
    })
  })

  it('can insert a record with relational key set to `null`', () => {
    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageable: null
    })

    assertState(store, {
      users: {},
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 0,
          imageableType: ''
        }
      }
    })
  })
})
