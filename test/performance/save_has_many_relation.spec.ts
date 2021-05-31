import { createStore } from 'test/Helpers'
import { Model, Num, Str, HasMany } from '@/index'

describe('performance/save_has_many_relation', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @HasMany(() => Post, 'userId')
    posts!: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Num(0) userId!: number
    @Str('') title!: string
  }

  it('saves data with has many relation within decent time', () => {
    const store = createStore()

    const users = []

    for (let i = 1; i <= 10000; i++) {
      users.push({
        id: i,
        name: `Username ${i}`,
        posts: [{ id: i, title: `Title ${i}` }]
      })
    }

    console.time('time')
    store.$repo(User).save(users)
    console.timeEnd('time')
  })
})
