import { createStore, fillState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/deletes_destroy_composite_key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['idA', 'idB']

    @Attr() idA!: any
    @Attr() idB!: any
    @Str('') name!: string
  }

  it('throws if the model has composite key', async () => {
    expect.assertions(1)

    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    try {
      await store.$repo(User).destroy(2)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
})
