import { createStore } from 'test/Helpers'
import {
  Model,
  Attr,
  HasOne,
  BelongsTo,
  HasMany,
  HasManyBy,
  MorphTo,
  MorphOne
} from '@/index'

describe('unit/model/Model_Relations', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Attr() countryId!: number
    @Attr() nameIds!: number[]

    @HasOne(() => Phone, 'userId')
    phone!: Phone | null

    @BelongsTo(() => Country, 'countryId')
    country!: Country | null

    @HasMany(() => Post, 'userId')
    posts!: Post[]

    @HasManyBy(() => Name, 'nameIds')
    names!: Name[]

    @MorphOne(() => Image, 'imageableId', 'imageableType')
    image!: Image | null
  }

  class Phone extends Model {
    static entity = 'phones'

    @Attr() id!: number
    @Attr() userId!: number
  }

  class Country extends Model {
    static entity = 'countries'

    @Attr() id!: number
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number
  }

  class Image extends Model {
    static entity = 'images'

    @Attr() id!: number
    @Attr() imageableId!: number
    @Attr() imageableType!: string

    @MorphTo('imageableId', 'imageableType')
    imageable!: User | null
  }

  class Name extends Model {
    static entity = 'names'

    @Attr() id!: number
  }

  class Image extends Model {
    static entity = 'images'

    @Attr() id!: number
    @Attr() imageableId!: number
    @Attr() imageableType!: string
  }

  it('fills "has one" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      phone: {
        id: 2
      }
    })

    expect(user.phone).toBeInstanceOf(Phone)
    expect(user.phone!.id).toBe(2)
  })

  it('fills "belongs to" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      country: {
        id: 2
      }
    })

    expect(user.country).toBeInstanceOf(Country)
    expect(user.country!.id).toBe(2)
  })

  it('fills "has many" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      posts: [{ id: 2 }, { id: 3 }]
    })

    expect(user.posts[0]).toBeInstanceOf(Post)
    expect(user.posts[1]).toBeInstanceOf(Post)
    expect(user.posts[0].id).toBe(2)
    expect(user.posts[1].id).toBe(3)
  })

  it('fills "has many by" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      names: [{ id: 2 }, { id: 3 }]
    })

    expect(user.names[0]).toBeInstanceOf(Name)
    expect(user.names[1]).toBeInstanceOf(Name)
    expect(user.names[0].id).toBe(2)
    expect(user.names[1].id).toBe(3)
  })

  it('fills "morph to" relation', () => {
    const store = createStore()

    // TODO: move this logic to helper
    store.$repo(Image)
    store.$repo(User)

    const image = store.$repo(Image).make({
      id: 1,
      imageableId: 2,
      imageableType: 'users',
      imageable: {
        id: 2
      }
    })

    expect(image.imageable!).toBeInstanceOf(User)
    expect(image.imageable!.id).toBe(2)
  })

  it('fills "morph one" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      image: {
        id: 2,
        imageableId: 1,
        imageableType: 'users'
      }
    })

    expect(user.image!).toBeInstanceOf(Image)
    expect(user.image!.id).toBe(2)
  })
})
