import { Model, Attr, Str, MorphOne } from '@/index'

// CLASSES
export class Image extends Model {
  static entity = 'images'

  @Attr() id!: number
  @Str('') url!: string
  @Attr() imageable_id!: number
  @Attr() imageable_type!: string
}

export class User extends Model {
  static entity = 'users'

  @Attr() id!: number
  @Str('') name!: string

  @MorphOne(() => Image, 'imageable_id', 'imageable_type')
  image!: Image | null
}

export class Post extends Model {
  static entity = 'posts'

  @Attr() id!: number
  @Str('') title!: string
  @MorphOne(() => Image, 'imageable_id', 'imageable_type')
  image!: Image | null
}

// DATA

export const USERS_ENTITIES = {
  1: { id: 1, name: 'John Doe' }
}

export const POSTS_ENTITIES = {
  1: { id: 1, title: 'Hello, world!' },
  2: { id: 2, title: 'Hello, world! Again!' }
}

export const IMAGES_ENTITIES = {
  1: {
    id: 1,
    url: '/profile.jpg',
    imageable_id: 1,
    imageable_type: 'users'
  },
  2: {
    id: 2,
    url: '/post.jpg',
    imageable_id: 1,
    imageable_type: 'posts'
  },
  3: {
    id: 3,
    url: '/post2.jpg',
    imageable_id: 2,
    imageable_type: 'posts'
  }
}

export const MORPH_ONE_ENTITIES = {
  users: USERS_ENTITIES,
  posts: POSTS_ENTITIES,
  images: IMAGES_ENTITIES
}
